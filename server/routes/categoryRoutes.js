// category routes

import express from "express";
import { admin, protect } from "../middleware/authMiddleWare.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();

router.route("/").get(getCategories).post(protect, admin, upload.single("image"), createCategory);

router
  .route("/:id")
  .get(protect, getCategoryById)
  .put(protect, admin, upload.single("image"), updateCategory)
  .delete(protect, admin, deleteCategory);

export default router;
