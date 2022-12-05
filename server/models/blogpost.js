const mongoose = require("mongoose");

const blogpostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdTime: {
    type: Date,
    default: Date.now(),
  },
  pinnedTime: {
    type: Date,
    default: 0,
  },
  published: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

blogpostSchema.index({ "$**": "text" });

module.exports = mongoose.model("Blogpost", blogpostSchema);
