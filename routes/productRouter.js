const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authController = require("../middleware/authMiddleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --------------------
// SELLER-PROTECTED ROUTES
// --------------------
router.get(
  "/sellerProducts",
  authController.protect,
  authController.allowedTo("seller"),
  productController.getSellerProducts
);

router.get(
  "/dashboard/products",
  authController.protect,
  authController.allowedTo("admin"),
  productController.getProductsForAdmin
);

router.post(
  "/",
  authController.protect,
  authController.allowedTo("seller"),
  upload.fields([{ name: "image", maxCount: 5 }]),
  productController.createNewProduct
);

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.allowedTo("seller"),
    upload.fields([{ name: "image", maxCount: 5 }]),
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
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProduct);

module.exports = router;
