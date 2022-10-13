const express = require("express");
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();
const app = express();

const httpServer = http.createServer(app);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});
