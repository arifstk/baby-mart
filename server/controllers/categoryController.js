// category controller

import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import cloudinary from "../config/cloudinary.js";

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
  const { name, image, categoryType } = req.body;
  // validate input
  if (!name || typeof name !== "string") {
    res.status(400);
    throw new Error("Category name is required and must be a string");
  }
  // validate category type
  const validCategoryTypes = ["Featured", "Hot Categories", "Top Categories"];
  if (!categoryType || !validCategoryTypes.includes(categoryType)) {
    res.status(400);
    throw new Error(
      `Category type is required and must be one of: ${validCategoryTypes.join(", ")}`,
    );
  }

  // check if category already exists
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error("Category already exists");
  }

  // image upload
  let imageUrl = "";
  if (image) {
    const result = await cloudinary.uploader.upload(image, {
      folder: "baby-mart/categories",
    });
    imageUrl = result.secure_url;
  }

  // create category
  const category = await Category.create({
    name,
    image: imageUrl,
    categoryType,
  });
  if (category) {
    res.status(201).json(category);
  } else {
    res.status(400);
    throw new Error("Invalid category data");
  }
});
// @desc    Get all categories
// Get all categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json(categories);
});
// @route   GET /api/categories

export { createCategory, getCategories };
