const { param, body, query, validationResult } = require("express-validator");

/**
 * BLOGPOST validation
 */
exports.blogpost_get_list = [
  query("limit", "LIMIT query must be a number")
    .optional()
    .isNumeric()
    .escape(),
  query("page", "PAGE query must be a number").optional().isNumeric().escape(),
  query("q").escape(),
];
exports.blogpost_get_single = [
  param("id", "blogpost ID is required in parameters").escape(),
];

/**
 * COMMENT validation
 */
exports.comment_get_list = [
  param("id", "blogpost ID is required in parameters")
    .isLength({ min: 1 })
    .escape(),
];

exports.comment_post_insert = [
  param("id", "blogpost ID is required in parameters")
    .isLength({ min: 1 })
    .escape(),
  body("authorName", "authorName must be between 1 and 100 characters")
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  body("text", "text must be between 1 and 300 characters")
    .isLength({ min: 1, max: 300 })
    .escape(),
];
