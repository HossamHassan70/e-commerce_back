const asyncHandler = require("express-async-handler");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrder,
  changeOrderStatus,
  deleteOrder,
} = require("../models/orderModel");

const createNewOrder = asyncHandler(async (req, res) => {
  const { total_amount, shipping_fee, items } = req.body;

  if (!total_amount) {
    return res.status(400).json({ message: "Total amount is required" });
  }

  const order = await createOrder(
    req.user.userid,
    items,
    "pending",
    total_amount,
    shipping_fee || 0
  );

  return res.status(201).json({ message: "Order created successfully", order });
});

const getOrders = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied: only admin can view all orders" });
  }

  const orders = await getAllOrders();
  return res.status(200).json(orders);
});

// GET ORDER ITEMS
const getOrderItems = asyncHandler(async (req, res) => {
  const orderid = req.params.id;
  const items = await getOrderById(orderid);

  if (!items) {
    return res.status(404).json({ message: "Order not found" });
  }

  return res.status(200).json({ items });
});

// GET USER ORDERS
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await getOrdersByUserId(req.user.userid);

  if (!orders.length) {
    return res.status(200).json({ message: "No orders found for this user" });
  }

  return res.status(200).json(orders);
});

// CHANGE ORDER STATUS
const changeStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  const updated = await changeOrderStatus(req.params.id, status);

  if (!updated) {
    return res.status(404).json({ message: "Order not found" });
  }

  return res.status(200).json({ message: "Order status updated", updated });
});

// DELETE ORDER
const deleteOrderById = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied: only admin can delete orders" });
  }

  const deleted = await deleteOrder(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: "Order not found" });
  }

  return res.status(200).json({ message: "Order deleted successfully" });
});

module.exports = {
  createNewOrder,
  getOrders,
  getUserOrders,
  changeStatus,
  deleteOrderById,
  getOrderItems,
};
