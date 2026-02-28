// server/controllers/userController.js
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

/* ----------------------------------------
   Helper: Upload buffer to Cloudinary
----------------------------------------- */
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "baby-mart/avatars",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      )
      .end(buffer);
  });
};

/* ----------------------------------------
   Get all users (ADMIN)
----------------------------------------- */
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

/* ----------------------------------------
   Create user (ADMIN)
----------------------------------------- */
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check existing user
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  let avatar = "";

  // Upload avatar if exists
  if (req.file?.buffer) {
    try {
      const result = await uploadToCloudinary(req.file.buffer);
      avatar = result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      res.status(500);
      throw new Error("Avatar upload failed");
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    avatar,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    addresses: user.addresses,
  });
});

/* ----------------------------------------
   Delete user (ADMIN)
----------------------------------------- */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();

  res.status(200).json({
    message: "User deleted successfully",
    userId: req.params.id,
  });
});

/* ----------------------------------------
   Update user (ADMIN)
----------------------------------------- */
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Email conflict check
  if (req.body.email && req.body.email !== user.email) {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      res.status(400);
      throw new Error("Email already in use");
    }
  }

  user.name = req.body.name ?? user.name;
  user.email = req.body.email ?? user.email;
  user.role = req.body.role ?? user.role;
  user.addresses = req.body.addresses ?? user.addresses;

  // Upload new avatar if provided
  if (req.file?.buffer) {
    try {
      const result = await uploadToCloudinary(req.file.buffer);
      user.avatar = result.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      res.status(500);
      throw new Error("Failed to upload avatar");
    }
  }
 
  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    avatar: updatedUser.avatar,
    addresses: updatedUser.addresses,
  });
});
