// server/controllers/productController.js

import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";

/*
 Helper: upload buffer to Cloudinary
*/
const uploadToCloudinary = async (fileBuffer, mimetype) => {
  const base64 = `data:${mimetype};base64,${fileBuffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder: "baby-mart/products",
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};

/*
 Create Product
*/
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    categoryId,
    brandId,
    discountPercentage,
    stock,
  } = req.body;

  const productExists = await Product.findOne({ name });

  if (productExists) {
    res.status(400);
    throw new Error("Product already exists");
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

  const product = await Product.create({
    name,
    description,
    price,
    category: categoryId,
    brand: brandId,
    discountPercentage: discountPercentage || 0,
    stock: stock || 0,
    image: imageUrl,
    imagePublicId,
  });

  res.status(201).json(product);
});

/*
 Get Products (pagination + sorting)
*/
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

/*
 Get Single Product
*/
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

/*
 Update Product
*/
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

  let imageUrl = product.image;
  let imagePublicId = product.imagePublicId;

  if (req.file) {
    // delete old image
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      req.file.mimetype,
    );

    imageUrl = uploaded.url;
    imagePublicId = uploaded.public_id;
  }

  product.name = name;
  product.description = description;
  product.price = price;
  product.category = categoryId;
  product.brand = brandId;
  product.discountPercentage = discountPercentage || 0;
  product.stock = stock || 0;
  product.image = imageUrl;
  product.imagePublicId = imagePublicId;

  const updatedProduct = await product.save();

  res.json(updatedProduct);
});

/*
 Delete Product
*/
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.imagePublicId) {
    await cloudinary.uploader.destroy(product.imagePublicId);
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
  updateProduct,
  deleteProduct,
};

