// userRoute.js

// import express from "express";
// import { getUsers } from "../controllers/userController.js";

// const router = express.Router()

// router.route("/").get(getUsers);

// export default router;

import express from "express";
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleWare.js";
import multer from "multer";

const router = express.Router();

// multer config
const upload = multer({ dest: "uploads/" });

router
  .route("/")
  .get(protect, admin, getUsers)
  .post(protect, admin, upload.single("avatar"), createUser);

router.route("/:id").delete(protect, admin, deleteUser);

router
  .route("/:id")
  .put(protect, admin, upload.single("avatar"), updateUser)
  .delete(protect, admin, deleteUser);

export default router;
