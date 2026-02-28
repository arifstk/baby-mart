// server/routes/brandRoutes.js
import express from "express";
import {
  getBrands,
  createBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(protect, admin, upload.single("image"), createBrand);

router
  .route("/:id")
  .get(getBrandById)
  .put(protect, admin, upload.single("image"), updateBrand)
  .delete(protect, admin, deleteBrand);

export default router;
