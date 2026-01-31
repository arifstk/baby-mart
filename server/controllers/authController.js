// control Reg & login
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// User register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
    addresses: [],
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      addresses: user.addresses,
      // Token (JWT)
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data.");
  }
  // const bodyProps = req.body;
  // res.send("Register is working");
  // console.log(bodyProps);
});

// User login
const loginUser = asyncHandler(async (req, res) => {
  // res.send("login is working!!!");
  const { email, password } = req.body;
  // console.log("Login attempt:", { email });

  const user = await User.findOne({ email });

  if (user && user.matchPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      addresses: user.addresses || [],
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password.");
  }
});

// const loginUser = (req, res) => {
//   const {email, password} = await req.body
// };

// Get User Profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      addresses: user.addresses || [],
    });
  } else {
    console.error("User not found for this ID", req?.user?._id);
    res.status(404);
    throw new Error("User not found");
  }
});

// Logout User

export { loginUser, registerUser, getUserProfile };
