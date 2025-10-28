const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authController = require("../middleware/authMiddleware");

// Visitor/Buyer/Seller
router.route("/").get(productController.getAllProducts);
router.route("/:id").get(productController.getProduct);

// Seller
// router.use(authController.allowedTo("seller"));

router.use(authController.protect);
router.post("/", productController.createNewProduct);
router
  .route("/:id")
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
