const express = require("express");
const {
  createNewOrder,
  getOrders,
  getUserOrders,
  updateOrderById,
  changeStatus,
  deleteOrderById,
  getOrderItems,
  getSellerOrders,
} = require("../controllers/orderController");
const { protect, allowedTo } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createNewOrder);
router.get("/", protect, getOrders);
router.get("/seller/orders", protect, allowedTo("seller"), getSellerOrders);
router.get("/myorders", protect, getUserOrders);
// router.put("/:id", protect, updateOrderById);
router.put("/status/:id", protect, changeStatus);
router.delete("/:id", protect, deleteOrderById);
router.get(
  "/myorders/:id",
  protect,
  allowedTo("buyer", "admin"),
  getOrderItems
);

module.exports = router;
