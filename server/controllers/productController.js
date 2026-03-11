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
  }

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
    image: imagePath,
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

// getProductById
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name image")
    .populate("brand", "name image");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

// Update product
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const {
    name,
    description,
    price,
    categoryId,
    brandId,
    discountPercentage,
    stock,
  } = req.body;

  const imagePath = req.file ? `/uploads/${req.file.filename}` : product.image;

  product.name = name;
  product.description = description;
  product.price = price;
  product.category = categoryId;
  product.brand = brandId;
  product.discountPercentage = discountPercentage || 0;
  product.stock = stock || 0;
  product.image = imagePath;

  const updatedProduct = await product.save();

  res.json(updatedProduct);
});

// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();

  res.json({
    message: "Product deleted successfully",
  });
});

export {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
};
