var express = require("express");
var router = express.Router();
const blogRouter = require("./blog");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json("Please visit /api for api ");
});

/**
 * API ROUTER HANDLER
 */
router.use("/api", blogRouter);

module.exports = router;
