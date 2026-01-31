import express from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/profile", protect, getUserProfile);

export default router;
