const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  verifyUserEmail,
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

  const code = generateVerificationCode();
  const expired_at = new Date(Date.now() + 60 * 60 * 1000);

  await upsertEmailCode(newUser.userid, code, expired_at);
  await sendVerificationEmail(newUser.email, newUser.first_name, code);

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
// ====================== VERIFY EMAIL ======================
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400);
    throw new Error("Email and code are required");
  }

  const user = await findUserByEmail(email);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("User already verified");
  }

  const emailRecord = await getEmailCodeByUserId(user.userid);
  if (!emailRecord) {
    res.status(400);
    throw new Error("Verification record not found");
  }

  if (emailRecord.code !== code) {
    res.status(400);
    throw new Error("Invalid code");
  }

  if (new Date(emailRecord.expired_at) < new Date()) {
    res.status(400);
    throw new Error("Code has expired");
  }

  await verifyUserEmail(user.userid);
  await deleteEmailCode(user.userid);

  res.status(200).json({ message: "Email verified successfully" });
});

// ====================== RESEND EMAIL ======================
const resendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("User already verified");
  }

  const code = generateVerificationCode();
  const expired_at = new Date(Date.now() + 10 * 60 * 1000);

  await upsertEmailCode(user.userid, code, expired_at);
  await sendVerificationEmail(user.email, user.first_name, code);

  res.status(200).json({ message: "Verification code resent successfully" });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // IF USER DOES NOT WRITE (email/password) IN INPUT FIELDS
  if (!email || !password) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  // IF USER DOES EXIST
  const user = await findUserByEmail(email);
  if (!user) {
    res.status(400);
    throw new Error("User Does not Exist, Please Signup");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid email or password");
  }
  if (!user.isVerified) {
    res.status(400);
    throw new Error("User Does not Verified");
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
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  resendVerificationCode,
  verifyEmail,
};
