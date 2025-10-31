const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authController = require("../middleware/authMiddleware");

// Buyer/Seller
router.use(authController.protect);
router.use(authController.allowedTo("buyer", "seller"));
router
  .route("/")
  .get(cartController.getCart)
  .post(cartController.addToCart)
  .delete(cartController.decreaseProductQnt);

router.delete("/remove", cartController.removeFromCart);

module.exports = router;
