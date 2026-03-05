// category routes

import express from "express";
import { admin, protect } from "../middleware/authMiddleWare.js";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/categoryController.js";
const router = express.Router();

router.route("/")
.get(getCategories)
.post(protect, admin, createCategory);

router.route("/:id")
.get(protect, getCategoryById)
.put(protect, admin, updateCategory)
.delete(protect, admin, deleteCategory);

export default router;

