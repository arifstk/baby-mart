// productController.js

import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
// import cloudinary from "../config/cloudinary.js";

// Create product
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    categoryId,
    brandId,
    // image,
    discountPercentage,
    stock,
  } = req.body;

  // check if product with same name exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    res.status(400);
    throw new Error("Product already exists");
  };

  const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

  // upload image to cloudinary
  const product = await Product.create({
    name,
    description,
    price,
    category: categoryId,
    brand: brandId,
    discountPercentage: discountPercentage || 0,
    stock: stock || 0,
    image: "",
  });
  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

// Get all products
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
  const skip = (page - 1) * perPage;

  const total = await Product.countDocuments();

  const products = await Product.find()
    .populate("category", "name image categoryType")
    .populate("brand", "name image")
    .sort({ createdAt: sortOrder })
    .skip(skip)
    .limit(perPage);

  res.status(200).json({
    products,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  });
});

export { createProduct, getProducts };
