const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/userController");
const { protect, allowedTo } = require("../middleware/authMiddleware");
const contactController = require("../controllers/contactUsController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

// ADD CONTACT ROUTE HERE
router.post("/contact", contactController.sendMessage);

router.use(protect);
router.use(allowedTo("admin"));
router.get("/contact", contactController.getMsg);

module.exports = router;
