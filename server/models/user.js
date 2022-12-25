const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateReg: { type: Date, default: Date.now() },
  refreshToken: [{ type: String }],
});

module.exports = mongoose.model("User", userSchema);
