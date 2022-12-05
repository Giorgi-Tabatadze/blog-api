var express = require("express");
var router = express.Router();
const blogpostController = require("../controllers/blogpostController");

/* POSTS ROUTES. */
router.get("/blogposts", blogpostController.blogposts_get_list);
router.get("/blogposts/:id", blogpostController.blogpost_get);

module.exports = router;
