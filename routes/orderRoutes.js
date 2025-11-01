const express = require("express");
const {
  createNewOrder,
  getOrders,
  getOrder,
  updateOrderById,
  deleteOrderById,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createNewOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrder);
router.put("/:id", protect, updateOrderById);
router.delete("/:id", protect, deleteOrderById);

module.exports = router;
