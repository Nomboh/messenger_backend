const formidable = require("formidable");
const messageModel = require("../model/messageModel");
const User = require("../model/userModel");
const fs = require("fs");

module.exports.getFriends = async (req, res) => {
  const myId = req.myId;
  try {
    const friendGet = await User.find({});

    const filteredFriends = friendGet.filter((f) => f.id !== myId);
    res.status(200).json({ success: true, friends: filteredFriends });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Sever Error",
      },
    });
  }
};

module.exports.messageUploadDb = async (req, res) => {
  const senderId = req.myId;

  const { senderName, recieverId, message } = req.body;

  try {
    const insertedMessage = await messageModel.create({
      senderId,
      senderName,
      recieverId,
      message: {
        text: message,
        image: "",
      },
    });

    res.status(201).json({
      success: true,
      message: insertedMessage,
    });
  } catch {
    res.status(500).json({
      error: {
        errorMessage: "Internal Sever Error",
      },
    });
  }
};

module.exports.messageGet = async (req, res) => {
  const myId = req.myId;
  const recieverId = req.params.id;

  try {
    let getAllMessages = await messageModel.find({});
    getAllMessages = getAllMessages.filter(
      (m) =>
        (m.senderId === myId && m.recieverId === recieverId) ||
        (m.recieverId === myId && m.senderId === recieverId)
    );

    res.status(200).json({
      success: true,
      message: getAllMessages,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Server error",
      },
    });
  }
};

module.exports.ImageMessageSend = (req, res) => {
  const form = formidable();
  form.parse(req, (err, fields, files) => {
    const { senderName, recieverId, imageName } = fields;

    const senderId = req.myId;

    const newPath = __dirname + `../../../frontend/public/images/${imageName}`;
    files.image.originalFilename = imageName;

    try {
      fs.copyFile(files.image.filepath, newPath, async (err) => {
        if (err) {
          res.status(500).json({
            error: {
              errorMessage: "Image upload fail",
            },
          });
        } else {
          const insertMessage = await messageModel.create({
            senderId: senderId,
            senderName: senderName,
            recieverId: recieverId,
            message: {
              text: "",
              image: files.image.originalFilename,
            },
          });
          res.status(201).json({
            success: true,
            message: insertMessage,
          });
        }
      });
    } catch {
      res.status(500).json({
        error: {
          errorMessage: "Internal Sever Error",
        },
      });
    }
  });
};
