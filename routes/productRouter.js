const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Visitor/Buyer/Seller
router.route("/").get(productController.getAllProducts);
router.route("/:id").get(productController.getProduct);

// Seller
// router.use(authController.allowedTo("seller"));

// two Middlewares Required (Authenticate, verifyIfSeller)
router.post("/", productController.createNewProduct);
router
  .route("/:id")
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
