const mongoose = require("mongoose");

const dbSetup = () => {
    const cs = process.env.MONGO_CS;

mongoose
  .connect(cs, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.log(error);
  });

}



  module.exports = dbSetup;