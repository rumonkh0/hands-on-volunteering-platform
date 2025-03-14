const express = require("express");
const {
  getCategories,createCategory
} = require("../controllers/category");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.get("/", getCategories);
router.post("/", protect, createCategory);

module.exports = router;