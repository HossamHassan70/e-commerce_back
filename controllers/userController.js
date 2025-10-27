const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");

const generateToken = (userid) => {
  return jwt.sign({ userid }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password, phone_number, role } =
    req.body;

  if (!first_name || !last_name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await createUser(
    first_name,
    last_name,
    email,
    hashedPassword,
    phone_number,
    role
  );

  res.status(201).json({
    message: "User registered successfully",
    user: {
      userid: newUser.userid,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      phone_number: newUser.phone_number,
      role: newUser.role,
      token: generateToken(newUser.userid),
    },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  res.json({
    message: "Login successful",
    user: {
      userid: user.userid,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      token: generateToken(user.userid),
    },
  });
});

const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not authorized");
  }

  res.json({
    message: "User profile retrieved successfully",
    user: req.user,
  });
});
module.exports = { registerUser, loginUser, getUserProfile };
