const { param, query, validationResult } = require("express-validator");
const Blogpost = require("../models/blogpost");
const User = require("../models/user");

/**
 * GET ALL BLOGPOSTS
 */

exports.blogposts_get_list = async (req, res) => {
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
    const blogposts = await Blogpost.find(query).limit(limitRecords).skip(skip);
    res.json(blogposts);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
/**
 * GET Single BLOGPOST
 */
exports.blogpost_get_single = async (req, res) => {
  try {
    const blogpostFound = await Blogpost.findById(req.params.id);
    res.json(blogpostFound);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
/**
 * POST Single Blogpost
 */
// exports.blogpost_insert_post = async (req, res) => {
//   const BlogpostToinsert = new Blogpost({
//     title: req.body.title,
//     text: req.body.text,
//     published: req.body.published,
//     user: req.body._id,
//   });
//   try {
//     const blogpostFound = await Blogpost.findById(req.params.id);
//     res.json(blogpostFound);
//   } catch (error) {
//     res.status(400).json({ message: error });
//   }
// };

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
