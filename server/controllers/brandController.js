// brandController.js
import asyncHandler from "express-async-handler";
import Brand from "../models/brandModel.js";

// getBrands
const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  res.json(brands);
});

// CreateBrand
const createBrand = asyncHandler(async (req, res) => {
  const { name, image } = req.body;

  const brandExists = await Brand.findOne({ name });
  if (brandExists) {
    req.statusCode(400);
    throw new Error("Brand already exists, try another name");
  }
  let imageUrl = "";
  if (image) {
    const result = await cloudinary.uploader.upload(image, {
      folder: "baby-mart/brands",
    });
    imageUrl = result.secure_url;
  }

  const brand = await Brand.create({
    name,
    image: imageUrl || undefined,
  });
  if (brand) {
    res.status(201).json(brand);
  } else {
    res.status(400);
    throw new Error("Invalid brand data");
  }
});

// getBrandById
const getBrandById = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (brand) {
    res.json(brand);
  } else {
    res.status(404);
    throw new Error("Brand not found");
  }
});

// updateBrand
const updateBrand = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  const brand = await Brand.findById(req.params.id);
  if (brand) {
    brand.name = name || brand.name;

    if (image !== undefined) {
      if (image) {
        const result = await cloudinary.uploader.upload(image, {
          folder: "baby-mart/brands",
        });
        brand.image = result.secure_url;
      } else {
        brand.image = undefined;
      }
    }

    const updateBrand = await brand.save();
    res.json(updateBrand);
  } else {
    res.status(404);
    throw new Error("Brand not found");
  }
});

// deleteBrand
const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (brand) {
    await brand.deleteOne();
    res.status(200).json({ message: "Brand removed" });
  } else {
    res.status(404);
    throw new Error("Brand not found");
  }
});

export { getBrands, createBrand, getBrandById, updateBrand, deleteBrand };
