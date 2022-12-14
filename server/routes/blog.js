var express = require("express");
var router = express.Router();

const editorRouter = require("./editor");
const validation = require("../middleware/validation");
const blogpostController = require("../controllers/blogpostController");
const commentsController = require("../controllers/commentController");
const authController = require("../controllers/authController");

const verifyJwt = require("../middleware/verifyJwt");

/** EDITOR ROUTE */

router.use("/editor", verifyJwt, editorRouter);

/** AUTH ROUTES */

router.post("/login", authController.handleLogin);
router.post("/register", authController.handleNewUser);
router.get("/refresh", authController.handleRefreshToken);
router.get("/logout", authController.handleLogout);

/* POSTS ROUTES. */
router.get(
  "/blogposts",
  validation.blogpost_get_list,
  blogpostController.blogposts_get_list,
);
router.get(
  "/blogposts/:id",
  validation.blogpost_get_single,
  blogpostController.blogpost_get_single,
);

router.get(
  "/blogposts/:id/comments",
  validation.comment_get_list,
  commentsController.comment_get_list,
);
router.post(
  "/blogposts/:id/comments",
  validation.comment_post_insert,
  commentsController.comment_post_insert,
);

module.exports = router;
