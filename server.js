const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const dbSetup = require("./database");
const app = express();

dbSetup();

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log("server is running on port " + PORT);
});
