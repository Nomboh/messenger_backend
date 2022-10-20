const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    image: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
