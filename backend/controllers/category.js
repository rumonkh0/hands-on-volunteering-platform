const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Category = require("../models/Category");

// @desc      Get all categories
// @desc      GET /api/v1/categories
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().select("name");
  res.status(200).json({ success: true, data: categories });
});

// @desc      Create categories
// @desc      POST /api/v1/categories
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Category name is required" });
  }

  const category = await Category.create({ name });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
  });
});
