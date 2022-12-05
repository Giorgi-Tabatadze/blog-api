const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateReg: { type: Date, default: Date.now() },
  editor: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);