// brandRoutes.js

import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createBrand,
  deleteBrand,
  getBrandById,
  getBrands,
  updateBrand,
} from "../controllers/brandController.js";

const router = express.Router();

// home route
router.route("/").get(getBrands).post(protect, admin, createBrand);

// :id route
router
  .route("/:id")
  .get(getBrandById)
  .put(protect, admin, updateBrand)
  .delete(protect, admin, deleteBrand);

export default router;
