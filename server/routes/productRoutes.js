// productRoutes.js
import express from "express";
import { admin, protect } from "../middleware/authMiddleWare.js";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// create Products
router.route("/")
.get(protect, getProducts)
.post(protect, admin, upload.single("image"), createProduct);

router
  .route("/:id")
  .get(protect, getProductById)
  .put(protect, admin, upload.single("image"), updateProduct)
  .delete(protect, admin, deleteProduct);

// get Products
// update Products

export default router;

// create productController.js 
