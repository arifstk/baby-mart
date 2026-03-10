// productRoutes.js
import express from "express";
import upload, { admin, protect } from "../middleware/authMiddleWare.js";
import { createProduct, getProducts } from "../controllers/productController.js";

const router = express.Router();

// create Products
router.route("/")
.get(protect, getProducts)
.post(protect, admin, upload.single("image"), createProduct);

// get Products
// update Products

export default router;

// create productController.js 
