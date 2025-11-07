const express = require("express");
const {
  createNewOrder,
  getOrders,
  getUserOrders,
  updateOrderById,
  changeStatus,
  deleteOrderById,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createNewOrder);
router.get("/", protect, getOrders);
router.get("/myorders", protect, getUserOrders);
// router.put("/:id", protect, updateOrderById);
router.put("/status/:id", protect, changeStatus);
router.delete("/:id", protect, deleteOrderById);

module.exports = router;
