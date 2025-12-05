const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  verifyEmail,
  resendVerificationCode,
  getAll,
} = require("../controllers/userController");
const { protect, allowedTo } = require("../middleware/authMiddleware");
const contactController = require("../controllers/contactUsController");
// /**
//  * @swagger
//  * /api/users/register:
//  *   post:
//  *     summary: Register a new user
//  *     tags: [Users]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               first_name:
//  *                 type: string
//  *               last_name:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: User registered successfully
//  */
router.put(
  "/:userid",
  protect,
  allowedTo("admin"),
  userController.updateUserById
);

router.delete(
  "/:userid",
  protect,
  allowedTo("admin"),
  userController.deleteUserById
);

router.post("/register", registerUser);
// /**
//  * @swagger
//  */
router.post("/login", loginUser);
router.get("/profile", getUserProfile);
router.post("/verify", verifyEmail);
router.post("/resend", resendVerificationCode);

// ADD CONTACT ROUTE HERE
router.post("/contact", contactController.sendMessage);

router.use(protect);
router.use(allowedTo("admin"));
router.get("/contact", contactController.getMsg);
router.get("/view-users", getAll);

module.exports = router;
