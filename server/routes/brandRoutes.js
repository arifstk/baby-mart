// brandRoutes.js

import express from "express";
import {
  createBrand,
  deleteBrand,
  getBrandById,
  getBrands,
  updateBrand,
} from "../controllers/brandController.js";
import { admin, protect } from "../middleware/authMiddleWare.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// home route
router
.route("/")
.get(getBrands)
// .post(protect, admin, createBrand);
.post(protect, admin, upload.single("image"), createBrand);

// Debugging logs
console.log({
  admin: typeof admin,
  upload: typeof upload,
  uploadSingle: typeof upload.single,
  createBrand: typeof createBrand,
});

// :id route
router
  .route("/:id")
  .get(getBrandById)
  .put(protect, admin, updateBrand)
  .delete(protect, admin, deleteBrand);

export default router;
