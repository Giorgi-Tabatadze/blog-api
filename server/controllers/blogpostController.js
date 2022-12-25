const { param, query, validationResult } = require("express-validator");
const Blogpost = require("../models/blogpost");
const Comment = require("../models/comment");
const User = require("../models/user");

/**
 * GET ALL BLOGPOSTS
 */

exports.blogposts_get_list = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors });
  }
  let { limit = 10, page = 1, q } = req.query;

  const limitRecords = parseInt(limit);
  const skip = (page - 1) * limit;

  let query = {};
  if (q) {
    query = { $text: { $search: q } };
  }

  try {
    const blogposts = await Blogpost.find({ query, published: true })
      .limit(limitRecords)
      .skip(skip);
    res.json(blogposts);
  } catch (error) {
    return next(error);
  }
};

/**
 * GET Single BLOGPOST
 */
exports.blogpost_get_single = async (req, res, next) => {
  try {
    const blogpostFound = await Blogpost.findById(req.params.id);
    if (!blogpostFound.published) {
      res.sendStatus(401);
    }
    res.json(blogpostFound);
  } catch (error) {
    return next(error);
  }
};

/****************************** EDITORS API*************************************/

exports.editor_blogposts_get_list = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors });
  }
  let { limit = 10, page = 1, q } = req.query;

  const limitRecords = parseInt(limit);
  const skip = (page - 1) * limit;

  let query = {};
  if (q) {
    query = { $text: { $search: q } };
  }

  try {
    const blogposts = await Blogpost.find({ query })
      .limit(limitRecords)
      .skip(skip);
    res.json(blogposts);
  } catch (error) {
    return next(error);
  }
};
/**
 * GET Single BLOGPOST
 */
exports.editor_blogpost_get_single = async (req, res, next) => {
  try {
    const blogpostFound = await Blogpost.findById(req.params.id);
    res.json(blogpostFound);
  } catch (error) {
    return next(error);
  }
};

/**
 * POST Single Blogpost
 */
exports.editor_blogpost_insert_post = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors });
  }
  const user = await User.findOne({ username: req.user });
  const BlogpostToInsert = new Blogpost({
    title: req.body.title,
    text: req.body.text,
    published: req.body.published,
    user: user._id,
  });
  try {
    const result = await BlogpostToInsert.save();
    res.json(result);
  } catch (error) {
    return next(error);
  }
};
exports.editor_blogpost_edit_put = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors });
  }
  const blogPostId = req.params.id;
  const updateBlogpostInfo = {
    title: req.body.title,
    text: req.body.text,
    published: req.body.published,
  };
  try {
    const result = await Blogpost.findOneAndUpdate(
      { _id: blogPostId },
      updateBlogpostInfo,
      { new: true },
    );
    res.json(result);
  } catch (error) {
    return next(error);
  }
};
exports.editor_blogpost_remove_delete = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors });
  }
  const blogPostId = req.params.id;
  try {
    const blogPostToDelete = await Blogpost.deleteOne({ _id: blogPostId });
    await Comment.deleteMany({ blogPost: blogPostId });
    res.json(blogPostToDelete);
  } catch (error) {
    return next(error);
  }
};

// async function insertBlogposts() {
//   try {
//     const testUSer = await User.findById("638df726ef4a84e87b3545de");
//     const BlogpostToinsert = new Blogpost({
//       title: "Lorem Im",
//       text: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
//       comments: [],
//       published: true,
//       user: testUSer._id,
//     });
//     await BlogpostToinsert.save();
//   } catch (error) {
//     console.log(error);
//   }
// }
// insertBlogposts();
