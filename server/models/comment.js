const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  authorName: { type: String, required: true, maxLength: 100 },
  text: { type: String, required: true, maxLength: 300 },
  dateCreated: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Comment", commentSchema);
