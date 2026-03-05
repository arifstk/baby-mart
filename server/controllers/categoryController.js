// category controller

import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import cloudinary from "../config/cloudinary.js";

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
// Get all categories
const getCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 20;
  const sortOrder = req.query.sortOrder || "asc";
  // validation  page & perPage
  if (page < 1 || perPage < 1) {
    res.status(400);
    throw new Error("Page and perPage must be positive integers");
  }
  // validate sortOrder
  if (!["asc", "desc"].includes(sortOrder)) {
    res.status(400);
    throw new Error("sortOrder must be either 'asc' or 'desc'");
  }
  const skip = (page - 1) * perPage;
  const total = await Category.countDocuments();
  const sortValue = sortOrder === "asc" ? 1 : -1;
  const categories = await Category.find({})
    .skip(skip)
    .limit(perPage)
    .sort({ name: sortValue });

  const totalPages = Math.ceil(total / perPage);
  res.json({ categories, total, page, perPage, totalPages });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// update category
const updateCategory = asyncHandler(async (req, res) => {
  const { name, image, categoryType } = req.body;
  // validate category type
  const validCategoryTypes = ["Featured", "Hot Categories", "Top Categories"];
  if (categoryType && !validCategoryTypes.includes(categoryType)) {
    res.status(400);
    throw new Error("Invalid Category Type");
  }
  const category = await Category.findById(req.params.id);
  if (category) {
    category.name = name || category.name;
    category.categoryType = categoryType || category.categoryType;
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "baby-mart/categories",
      });
      category.image = result.secure_url;
    } else {
      category.image = undefined;
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// delete category
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    await category.deleteOne();
    res.json({ message: "Category removed" });
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
