const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name! "],
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please provide us a valid email"],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    // passwordConfirm: {
    //   type: String,
    //   required: [true, "Please confirm your password"],
    //   select: false,
    //   validate: {
    //     validator: function (el) {
    //       return el === this.password;
    //     },
    //   },
    // },
    accessToken: {
      type: String,
      default: () => crypto.randomBytes(128).toString("hex"),
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
