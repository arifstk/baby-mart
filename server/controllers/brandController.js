// // brandController.js
// import asyncHandler from "express-async-handler";
// import Brand from "../models/brandModel.js";
// import cloudinary from "../config/cloudinary.js";

// // getBrands
// const getBrands = asyncHandler(async (req, res) => {
//   const brands = await Brand.find();
//   res.json(brands);
// });

// // CreateBrand
// const createBrand = asyncHandler(async (req, res) => {
//   const { name, image } = req.body;

//   const brandExists = await Brand.findOne({ name });
//   if (brandExists) {
//     req.statusCode(400);
//     throw new Error("Brand already exists, try another name");
//   }
//   let imageUrl = "";
//   if (image) {
//     const result = await cloudinary.uploader.upload(image, {
//       folder: "baby-mart/brands",
//     });
//     imageUrl = result.secure_url;
//   }

//   const brand = await Brand.create({
//     name,
//     image: imageUrl || undefined,
//   });
//   if (brand) {
//     res.status(201).json(brand);
//   } else {
//     res.status(400);
//     throw new Error("Invalid brand data");
//   }
// });

// // getBrandById
// const getBrandById = asyncHandler(async (req, res) => {
//   const brand = await Brand.findById(req.params.id);
//   if (brand) {
//     res.json(brand);
//   } else {
//     res.status(404);
//     throw new Error("Brand not found");
//   }
// });

// // updateBrand
// const updateBrand = asyncHandler(async (req, res) => {
//   const { name, image } = req.body;
//   const brand = await Brand.findById(req.params.id);
//   if (brand) {
//     brand.name = name || brand.name;

//     if (image !== undefined) {
//       if (image) {
//         const result = await cloudinary.uploader.upload(image, {
//           folder: "baby-mart/brands",
//         });
//         brand.image = result.secure_url;
//       } else {
//         brand.image = undefined;
//       }
//     }

//     const updateBrand = await brand.save();
//     res.json(updateBrand);
//   } else {
//     res.status(404);
//     throw new Error("Brand not found");
//   }
// });

// // deleteBrand
// const deleteBrand = asyncHandler(async (req, res) => {
//   const brand = await Brand.findById(req.params.id);

//   if (brand) {
//     await brand.deleteOne();
//     res.status(200).json({ message: "Brand removed" });
//   } else {
//     res.status(404);
//     throw new Error("Brand not found");
//   }
// });

// export { getBrands, createBrand, getBrandById, updateBrand, deleteBrand };

import asyncHandler from "express-async-handler";
import Brand from "../models/brandModel.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  res.json(brands);
});

// @desc    Create brand
// @route   POST /api/brands
// @access  Admin
const createBrand = asyncHandler(async (req, res) => {
  const name = req.body?.name;

  if (!name) {
    res.status(400);
    throw new Error("Brand name is required");
  }

  const brandExists = await Brand.findOne({ name });
  if (brandExists) {
    res.status(400);
    throw new Error("Brand already exists, try another name");
  }

  // ✅ IMAGE UPLOAD CASE
  if (req.file) {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "baby-mart/brands" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          res.status(500);
          throw new Error("Image upload failed");
        }

        const brand = await Brand.create({
          name,
          image: {
            public_id: result.public_id,
            url: result.secure_url,
          },
        });

        return res.status(201).json(brand);
      },
    );

    uploadStream.end(req.file.buffer);
    return; // 🔴 REQUIRED — stop function execution
  }

  // ✅ NO IMAGE CASE
  const brand = await Brand.create({ name });
  res.status(201).json(brand);
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

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Admin
const updateBrand = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    res.status(404);
    throw new Error("Brand not found");
  }

  brand.name = name || brand.name;

  if (image !== undefined) {
    // if (image) {
    //   const result = await cloudinary.uploader.upload(image, {
    //     folder: "baby-mart/brands",
    //   });
    //   brand.image = result.secure_url;
    // } else {
    //   brand.image = undefined;
    // }

    if (image) {
      try {
        const result = await cloudinary.uploader.upload(image, {
          folder: "baby-mart/brands",
        });
        imageUrl = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(400).json({
          message: "Image upload failed",
        });
      }
    }
  }

  const updatedBrand = await brand.save();
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
  res.status(200).json({ message: "Brand removed" });
});

export { getBrands, createBrand, getBrandById, updateBrand, deleteBrand };
