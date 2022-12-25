var express = require("express");
var router = express.Router();

const validation = require("../validation/validation");
const blogpostController = require("../controllers/blogpostController");
const commentsController = require("../controllers/commentController");

router.get(
  "/blogposts",
  validation.blogpost_get_list,
  blogpostController.editor_blogposts_get_list,
);
router.get(
  "/blogposts/:id",
  validation.blogpost_get_single,
  blogpostController.editor_blogpost_get_single,
);
router.post(
  "/blogposts",
  validation.blogpost_post_insert,
  blogpostController.editor_blogpost_insert_post,
);
router.put(
  "/blogposts/:id",
  validation.blogpost_post_insert,
  blogpostController.editor_blogpost_edit_put,
);
router.delete(
  "/blogposts/:id",
  validation.blogpost_get_single,
  blogpostController.editor_blogpost_remove_delete,
);

module.exports = router;
