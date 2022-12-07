const Comment = require("../models/comment");
const Blogpost = require("../models/blogpost");
const { validationResult } = require("express-validator");

/**
 * GET List of Comment for Blogpost
 */

exports.comment_get_list = async (req, res) => {
  let { limit = 10, page = 1 } = req.query;

  const limitRecords = parseInt(limit);
  const skip = (page - 1) * limit;

  try {
    const comments = await Comment.find({ blogPost: req.params.id })
      .limit(limitRecords)
      .skip(skip);
    res.json(comments);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
/**
 * POST Insert Single comment
 */

exports.comment_post_insert = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors });
  } else {
    const blogpostExists = await Blogpost.exists({ _id: req.params.id });
    if (!blogpostExists) {
      res
        .status(400)
        .json({ message: "Invalid Blogpost ID provided in Parameters" });
    } else {
      try {
        const newComment = new Comment({
          authorName: req.body.authorName,
          text: req.body.text,
          blogPost: req.params.id,
        });
        const insertedComment = await newComment.save();
        res.json(insertedComment);
      } catch (error) {
        res.status(400).json({ message: error });
      }
    }
  }
};

// async function insertComments() {
//   try {
//     const commentToInsert = new Comment({
//       authorName: "Nick",
//       text: "Well This is a nice post, I reallly liked to read it and would like to read more",
//       blogPost: "638df8125a5b8b9f6d2e9361",
//     });
//     await commentToInsert.save();
//   } catch (error) {
//     console.log(error);
//   }
// }
// insertComments();
