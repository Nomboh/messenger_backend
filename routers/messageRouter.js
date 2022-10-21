const router = require("express").Router();

const {
  getFriends,
  messageUploadDb,
  messageGet,
  ImageMessageSend,
} = require("../controllers/messageController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/get-friends", authMiddleware, getFriends);

router.post("/send-message", authMiddleware, messageUploadDb);

router.get("/get-message/:id", authMiddleware, messageGet);

router.post("/send-message-image", authMiddleware, ImageMessageSend);

module.exports = router;
