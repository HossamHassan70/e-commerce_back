const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authController = require("../middleware/authMiddleware");

// --------------------
// SELLER-PROTECTED ROUTES
// --------------------
router.get(
  "/sellerProducts",
  authController.protect,
  authController.allowedTo("seller"),
  productController.getSellerProducts
);

router.post(
  "/",
  authController.protect,
  authController.allowedTo("seller"),
  productController.createNewProduct
);

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.allowedTo("seller"),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.allowedTo("seller", "admin"),
    productController.deleteProduct
  );

// --------------------
// PUBLIC ROUTES
// --------------------
router.get(
  "/dashboard/products",
  authController.protect,
  authController.allowedTo("admin"),
  productController.getProductsForAdmin
);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProduct);

module.exports = router;
