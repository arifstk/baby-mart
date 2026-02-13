// userController.js
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

export { getUsers };


// CREATE user (ADMIN)
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // check existing user
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    avatar: req.file ? req.file.path : "",
  });

  res.status(201).json(user);
});
