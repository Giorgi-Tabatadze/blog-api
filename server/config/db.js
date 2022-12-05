const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {
  useNewURLParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", function () {
  console.log("Connected to Database");
});

module.exports = db;
