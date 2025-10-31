const express = require("express");
const router = express.Router();
const favlistController = require("../controllers/favlistController");
const authController = require("../middleware/authMiddleware");

// Buyer/Seller
router.use(authController.protect);
router.use(authController.allowedTo("buyer", "seller"));
router
  .route("/")
  .get(favlistController.getList)
  .post(favlistController.addToList)
  .delete(favlistController.emptyList);

router.delete("/remove", favlistController.removeFromList);
module.exports = router;
