const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategory,
} = require("../controllers/vpsCategoryControllers");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");

router.route("/").post(createCategory).get(getCategory);

module.exports = router;
