const formidable = require("formidable");
const validator = require("validator");
const User = require("../model/userModel");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.userRegister = (req, res) => {
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    const { userName, email, password, confirmPassword } = fields;

    const error = [];

    if (!userName) {
      error.push("Please provide your user name");
    }
    if (!email) {
      error.push("Please provide your Email");
    }
    if (email && !validator.isEmail(email)) {
      error.push("Please provide your Valid Email");
    }
    if (!password) {
      error.push("Please provide your Password");
    }
    if (!confirmPassword) {
      error.push("Please provide your confirm Password");
    }
    if (password && confirmPassword && password !== confirmPassword) {
      error.push("Your Password and Confirm Password not same");
    }
    if (password && password.length < 6) {
      error.push("Please provide password mush be 6 charecter");
    }
    if (Object.keys(files).length === 0) {
      error.push("Please provide user image");
    }
    if (error.length > 0) {
      res.status(400).json({
        error: {
          errorMessage: error,
        },
      });
    } else {
      const originalImage = files.image.originalFilename;

      const randomNumber = Math.floor(Math.random() * 9999999);

      const newImagename = randomNumber + "_" + originalImage;

      files.image.originalFilename = newImagename;

      const newPath =
        __dirname +
        `../../../frontend/public/images/${files.image.originalFilename}`;

      try {
        const checkUser = await User.findOne({ email });
        if (checkUser) {
          res.status(404).json({
            error: {
              errorMessage: ["A user already exist with that email "],
            },
          });
        } else {
          fs.copyFile(files.image.filepath, newPath, async err => {
            if (!err) {
              const createdUser = await User.create({
                userName,
                email,
                password: await bcrypt.hash(password, 12),
                image: files.image.originalFilename,
              });

              const token = jwt.sign(
                {
                  id: createdUser._id,
                  email: createdUser.email,
                  userName: createdUser.userName,
                  image: createdUser.image,
                  registerTime: createdUser.createdAt,
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: process.env.JWT_EXPIRE,
                }
              );

              const option = {
                expires: new Date(
                  Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                ),
              };

              res.status(201).cookie("authCookie", token, option).json({
                successMessage: "User registration completed succesfully",
                token,
              });
            } else {
              res.status(500).json({
                error: {
                  errorMessage: ["Internal Server Error"],
                },
              });
            }
          });
        }
      } catch (error) {
        res.status(500).json({
          error: {
            errorMessage: ["Internal Server Error"],
          },
        });
      }
    }
  }); // end Formidable
};

module.exports.userLogin = async (req, res) => {
  const error = [];

  const { email, password } = req.body;

  if (!email) {
    error.push("Please provide your email address");
  }

  if (!password) {
    error.push("Please provide your password");
  }

  if (email && !validator.isEmail(email)) {
    error.push("Please provide a vaild email address");
  }

  if (error.length > 0) {
    res.status(400).json({
      error: {
        errorMessage: error,
      },
    });
  } else {
    try {
      const checkUser = await User.findOne({ email }).select("+password");
      if (checkUser) {
        const matchPassword = await bcrypt.compare(
          password,
          checkUser.password
        );
        if (matchPassword) {
          const token = jwt.sign(
            {
              id: checkUser._id,
              email: checkUser.email,
              userName: checkUser.userName,
              image: checkUser.email,
              registerTime: checkUser.createdAt,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRE,
            }
          );

          const options = {
            expires: new Date(
              Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
          };

          res.status(200).cookie("authCookie", token, options).json({
            successMessage: "You successfully loged In",
            token,
          });
        } else {
          res.status(400).json({
            error: {
              errorMessage: ["Your email or password  is invalid"],
            },
          });
        }
      } else {
        res.status(400).json({
          error: {
            errorMessage: ["Your email not found"],
          },
        });
      }
    } catch {
      res.status(400).json({
        error: {
          errorMessage: ["internal server error"],
        },
      });
    }
  }
};
