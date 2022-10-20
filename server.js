const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routers/userRouter");
const messageRouter = require("./routers/messageRouter");

dotenv.config();

const dbSetup = require("./database");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

// routes handlers
app.use("/api/messenger", userRouter);
app.use("/api/messenger", messageRouter);

const PORT = process.env.PORT || 8800;

dbSetup();

app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});
