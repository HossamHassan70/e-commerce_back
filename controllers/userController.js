const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  verifyUserEmail,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../models/userModel");
const {
  upsertEmailCode,
  getEmailCodeByUserId,
  deleteEmailCode,
} = require("../models/emailModel");
const { generateVerificationCode } = require("../utils/codeGenerator");
const { sendVerificationEmail } = require("../utils/emailSender");

const generateToken = (userid) => {
  return jwt.sign({ userid }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password, phone_number, role } =
    req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
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

  const code = generateVerificationCode();
  const expired_at = new Date(Date.now() + 60 * 60 * 1000);

  await upsertEmailCode(newUser.userid, code, expired_at);
  await sendVerificationEmail(newUser.email, newUser.first_name, code);

  return res.status(201).json({
    message:
      "User registered successfully. Please check your email to verify your account.",
    user: {
      userid: newUser.userid,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      phone_number: newUser.phone_number,
      role: newUser.role,
    },
  });
});

// ====================== VERIFY EMAIL ======================
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Email and code are required" });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isverified) {
    return res.status(400).json({ message: "User already verified" });
  }

  const emailRecord = await getEmailCodeByUserId(user.userid);
  if (!emailRecord) {
    return res.status(400).json({ message: "Verification record not found" });
  }

  if (emailRecord.code !== code) {
    return res.status(400).json({ message: "Invalid code" });
  }

  if (new Date(emailRecord.expired_at) < new Date()) {
    return res.status(400).json({ message: "Code has expired" });
  }

  await verifyUserEmail(user.userid);
  await deleteEmailCode(user.userid);

  return res.status(200).json({
    message: "Email verified successfully",
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

// ====================== RESEND EMAIL ======================
const resendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isverified) {
    return res.status(400).json({ message: "User already verified" });
  }

  const code = generateVerificationCode();
  const expired_at = new Date(Date.now() + 10 * 60 * 1000);

  await upsertEmailCode(user.userid, code, expired_at);
  await sendVerificationEmail(user.email, user.first_name, code);

  return res.status(200).json({
    message: "Verification code resent successfully",
    userid: user.userid,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone_number: user.phone_number,
    role: user.role,
    token: generateToken(user.userid),
  });
});

// ====================== LOGIN ======================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res
      .status(400)
      .json({ message: "User Does not Exist, Please Signup" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  if (!user.isverified) {
    return res.status(400).json({ message: "User Does not Verified" });
  }

  return res.json({
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

// ====================== PROFILE ======================
const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authorized" });
  }

  return res.json({
    message: "User profile retrieved successfully",
    user: req.user,
  });
});

// ====================== GET ALL USERS (ADMIN) ======================
const getAll = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "User is not authorized" });
  }

  const users = await getAllUsers();
  return res.json({ users });
});

const updateUserById = asyncHandler(async (req, res) => {
  const userid = req.params.userid;
  const { first_name, last_name, email, phone_number, role } = req.body;

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "You cannot update another user" });
  }
  const result = await updateUser(
    first_name,
    last_name,
    email,
    phone_number,
    role,
    userid
  );
  if (result.length === 0) {
    return res.status(404).json({ message: "User not found." });
  }

  res.status(200).json({
    message: "User updated successfully.",
    user: result[0],
  });
});
const deleteUserById = asyncHandler(async (req, res) => {
  const userid = req.params.userid;

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "You cannot update another user" });
  }
  const result = await deleteUser(userid);

  // if (result.rows.length === 0) {
  //   return res.status(404).json({ message: "User not found." });
  // }

  res.status(200).json({ message: "User deleted successfully." });
});

module.exports = {
  updateUserById,
  deleteUserById,
  registerUser,
  loginUser,
  getUserProfile,
  resendVerificationCode,
  verifyEmail,
  getAll,
};
