// server/controllers/categoryController.js

import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import cloudinary from "../config/cloudinary.js";

/*
  Helper: upload buffer to Cloudinary (same pattern as productController)
*/
const uploadToCloudinary = async (fileBuffer, mimetype) => {
  try {
    const base64 = `data:${mimetype};base64,${fileBuffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "baby-mart/categories",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Image upload failed");
  }
};

const VALID_CATEGORY_TYPES = ["Featured", "Hot-Categories", "Top-Categories"];

/*
  Create Category
*/
// const createCategory = asyncHandler(async (req, res) => {
//   const { name, categoryType } = req.body;

//   if (!name || typeof name !== "string") {
//     res.status(400);
//     throw new Error("Category name is required and must be a string");
//   }

//   if (!categoryType || !VALID_CATEGORY_TYPES.includes(categoryType)) {
//     res.status(400);
//     throw new Error(
//       `Category type must be one of: ${VALID_CATEGORY_TYPES.join(", ")}`,
//     );
//   }

//   const categoryExists = await Category.findOne({ name });
//   if (categoryExists) {
//     res.status(400);
//     throw new Error("Category already exists");
//   }

//   let imageUrl = "";
//   let imagePublicId = "";

//   if (req.file) {
//     const uploaded = await uploadToCloudinary(
//       req.file.buffer,
//       req.file.mimetype,
//     );
//     imageUrl = uploaded.url;
//     imagePublicId = uploaded.public_id;
//   }

//   const category = await Category.create({
//     name,
//     image: imageUrl,
//     imagePublicId,
//     categoryType,
//   });

//   if (category) {
//     res.status(201).json(category);
//   } else {
//     res.status(400);
//     throw new Error("Invalid category data");
//   }
// });

const createCategory = asyncHandler(async (req, res) => {
  const { name, categoryType } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  if (!VALID_CATEGORY_TYPES.includes(categoryType)) {
    res.status(400);
    throw new Error("Invalid category type");
  }

  const categoryExists = await Category.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
  });

  if (categoryExists) {
    res.status(400);
    throw new Error("Category already exists");
  }

  let imageUrl = "";
  let imagePublicId = "";

  if (req.file) {
    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      req.file.mimetype,
    );

    imageUrl = uploaded.url;
    imagePublicId = uploaded.public_id;
  }

  const category = await Category.create({
    name,
    categoryType,
    image: imageUrl,
    imagePublicId,
  });

  res.status(201).json(category);
});

/*
  Get All Categories (pagination + sorting)
*/
const getCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 20;
  const sortOrder = req.query.sortOrder || "asc";

  if (page < 1 || perPage < 1) {
    res.status(400);
    throw new Error("Page and perPage must be positive integers");
  }

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

/*
  Get Single Category
*/
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

/*
  Update Category
*/
// const updateCategory = asyncHandler(async (req, res) => {
//   const category = await Category.findById(req.params.id);

//   if (!category) {
//     res.status(404);
//     throw new Error("Category not found");
//   }

//   const { name, categoryType } = req.body;

//   if (categoryType && !VALID_CATEGORY_TYPES.includes(categoryType)) {
//     res.status(400);
//     throw new Error(
//       `Invalid category type. Must be one of: ${VALID_CATEGORY_TYPES.join(", ")}`,
//     );
//   }

//   let imageUrl = category.image;
//   let imagePublicId = category.imagePublicId;

//   if (req.file) {
//     // Delete old image from Cloudinary if exists
//     if (category.imagePublicId) {
//       await cloudinary.uploader.destroy(category.imagePublicId);
//     }

//     const uploaded = await uploadToCloudinary(
//       req.file.buffer,
//       req.file.mimetype,
//     );
//     imageUrl = uploaded.url;
//     imagePublicId = uploaded.public_id;
//   }

//   category.name = name || category.name;
//   category.categoryType = categoryType || category.categoryType;
//   category.image = imageUrl;
//   category.imagePublicId = imagePublicId;

//   const updatedCategory = await category.save();
//   res.json(updatedCategory);
// });

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const { name, categoryType } = req.body;

  if (categoryType && !VALID_CATEGORY_TYPES.includes(categoryType)) {
    res.status(400);
    throw new Error("Invalid category type");
  }

  // check duplicate name
  if (name && name !== category.name) {
    const exists = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (exists) {
      res.status(400);
      throw new Error("Category name already exists");
    }
  }

  let imageUrl = category.image;
  let imagePublicId = category.imagePublicId;

  if (req.file) {
    if (category.imagePublicId) {
      await cloudinary.uploader.destroy(category.imagePublicId);
    }

    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      req.file.mimetype,
    );

    imageUrl = uploaded.url;
    imagePublicId = uploaded.public_id;
  }

  category.name = name || category.name;
  category.categoryType = categoryType || category.categoryType;
  category.image = imageUrl;
  category.imagePublicId = imagePublicId;

  const updatedCategory = await category.save();

  res.json(updatedCategory);
});

/*
  Delete Category
*/
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Delete image from Cloudinary if exists
  if (category.imagePublicId) {
    await cloudinary.uploader.destroy(category.imagePublicId);
  }

  await category.deleteOne();
  res.json({ message: "Category deleted successfully" });
});

export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
