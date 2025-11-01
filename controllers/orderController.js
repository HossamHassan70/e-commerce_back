const asyncHandler = require("express-async-handler");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../models/orderModel");

const createNewOrder = asyncHandler(async (req, res) => {
  const { total_amount, shipping_fee } = req.body;

  if (!total_amount) {
    res.status(400);
    throw new Error("Total amount is required");
  }

  const order = await createOrder(
    req.user.userid,
    "paid",
    total_amount,
    shipping_fee || 0
  );
  res.status(201).json({ message: "Order created successfully", order });
});

const getOrders = asyncHandler(async (req, res) => {
  if (req.user.role == "buyer") {
    res.status(403);
    throw new Error(
      "Access denied: only admin and sellers can view all orders"
    );
  }

  const orders = await getAllOrders();
  res.status(200).json(orders);
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await getOrderById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (req.user.role == "buyer" && order.userid !== req.user.userid) {
    res.status(403);
    throw new Error("Access denied: cannot view this order");
  }

  res.status(200).json(order);
});

const updateOrderById = asyncHandler(async (req, res) => {
  if (req.user.role !== "seller") {
    res.status(403);
    throw new Error("Access denied: only sellers can update orders");
  }

  const updated = await updateOrder(req.params.id, req.body);
  if (!updated) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.status(200).json({ message: "Order updated successfully", updated });
});

const deleteOrderById = asyncHandler(async (req, res) => {
  if (req.user.role !== "seller") {
    res.status(403);
    throw new Error("Access denied: only sellers can delete orders");
  }

  const deleted = await deleteOrder(req.params.id);
  if (!deleted) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.status(200).json({ message: "Order deleted successfully" });
});

module.exports = {
  createNewOrder,
  getOrders,
  getOrder,
  updateOrderById,
  deleteOrderById,
};
