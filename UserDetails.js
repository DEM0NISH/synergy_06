const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Name is required"],
      unique: true, // Remove this if null values are allowed
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  {
    collection: "UserDetails",
  }
);

module.exports = mongoose.model("UserInfo", userDetailsSchema);