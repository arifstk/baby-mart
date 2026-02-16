// userController.js
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

export { getUsers };

// Create user (ADMIN)
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // check existing user
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // if user not exist (create new user)
  const user = await User.create({
    name,
    email,
    password,
    role,
    avatar: req.file ? req.file.path : "",
  });

  // res.status(201).json(user);
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      addresses: user.addresses,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Delete user (ADMIN)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");

    // Delete user's cart
    // await Cart.deleteOne({userId: user._id});

    // Delete user's orders (if any exist)
    // await OverconstrainedError.deleteMany({userId:user._id});

    // Delete the user
  }

  await user.deleteOne();

  res.status(200).json({
    message: "User deleted successfully",
    userId: req.params.id,
  });
});

// Update User (ADMIN) 

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

  if (req.file) {
    user.avatar = `/uploads/${req.file.filename}`;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    avatar: updatedUser.avatar,
  });
});
