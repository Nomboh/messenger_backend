const router = require("express").Router();

const {
  getFriends,
  messageUploadDb,
  messageGet,
} = require("../controllers/messageController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/get-friends", authMiddleware, getFriends);

router.post("/send-message", authMiddleware, messageUploadDb);

router.get("/get-message/:id", authMiddleware, messageGet);

module.exports = router;
