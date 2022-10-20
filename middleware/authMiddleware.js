const jwt = require("jsonwebtoken");

module.exports.authMiddleware = async (req, res, next) => {
  const { authCookie } = req.cookies;
  if (authCookie) {
    const deCodeToken = await jwt.verify(authCookie, process.env.JWT_SECRET);
    req.myId = deCodeToken.id;
    next();
  } else {
    res.status(400).json({
      error: {
        errorMessage: ["Please Login First"],
      },
    });
  }
};
