
// server/controllers/brandController.js
import asyncHandler from "express-async-handler";
import Brand from "../models/brandModel.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  res.json({brands});
});

// @desc    Create brand
// @route   POST /api/brands
// @access  Admin
const createBrand = asyncHandler(async (req, res) => {
  console.log("=== CREATE BRAND DEBUG ===");
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  console.log("Request headers:", req.headers["content-type"]);

  const { name } = req.body;

  if (!name) {
    console.log("❌ Name is missing");
    res.status(400);
    throw new Error("Brand name is required");
  }

  // Check if brand exists
  const brandExists = await Brand.findOne({ name });
  if (brandExists) {
    console.log("❌ Brand already exists:", name);
    res.status(400);
    throw new Error("Brand already exists");
  }

  let imageUrl = "";

  // Handle image upload if file exists
  if (req.file) {
    console.log("✅ File received:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer ? "Buffer exists" : "No buffer",
    });

    try {
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "baby-mart/brands",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              console.error("❌ Cloudinary upload error:", error);
              reject(error);
            } else {
              console.log("✅ Cloudinary upload success:", result.secure_url);
              resolve(result);
            }
          },
        );

        uploadStream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      res.status(500);
      throw new Error("Image upload failed: " + error.message);
    }
  } else {
    console.log("ℹ️ No image file received");
  }

  // Create brand
  console.log("Creating brand with:", { name, imageUrl });
  const brand = await Brand.create({
    name,
    image: imageUrl,
  });

  console.log("✅ Brand created:", brand);
  res.status(201).json(brand);
});

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Admin
const updateBrand = asyncHandler(async (req, res) => {
  console.log("=== UPDATE BRAND DEBUG ===");
  console.log("Brand ID:", req.params.id);
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);

  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    res.status(404);
    throw new Error("Brand not found");
  }

  // Update name if provided
  if (req.body.name) {
    brand.name = req.body.name;
  }

  // Update image if provided
  if (req.file) {
    console.log("✅ File received for update:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    try {
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "baby-mart/brands",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              console.error("❌ Cloudinary upload error:", error);
              reject(error);
            } else {
              console.log("✅ Cloudinary upload success:", result.secure_url);
              resolve(result);
            }
          },
        );

        uploadStream.end(req.file.buffer);
      });

      brand.image = result.secure_url;
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      res.status(500);
      throw new Error("Image upload failed");
    }
  }

  const updatedBrand = await brand.save();
  console.log("✅ Brand updated:", updatedBrand);
  res.json(updatedBrand);
});

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Admin
const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    res.status(404);
    throw new Error("Brand not found");
  }

  await brand.deleteOne();
  res.json({ message: "Brand removed" });
});

// @desc    Get brand by ID
// @route   GET /api/brands/:id
// @access  Public
const getBrandById = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    res.status(404);
    throw new Error("Brand not found");
  }

  res.json(brand);
});

export { getBrands, createBrand, getBrandById, updateBrand, deleteBrand };
