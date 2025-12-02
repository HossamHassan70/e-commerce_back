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
   const { total_amount, shipping_fee, items, btnVal } = req.body;

   if (!total_amount) {
     res.status(400).json({ msg: "Total amount is required" });
   }

   const order = await createOrder(
     req.user.userid,
     items,
     total_amount,
     shipping_fee || 0,
     btnVal
   );

  res.status(201).json({ message: "Order created successfully", order });
});

const getOrders = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Access denied: only admin can view all orders");
  }

  const orders = await getAllOrders();
  res.status(200).json(orders);
});

//GET ORDERS' ITEMS
const getOrderItems = asyncHandler(async (req, res) => {
  const orderid = req.params.id;
  const items = await getOrderById(orderid);
  return res.status(200).json({ items });
});

// const getOrder = asyncHandler(async (req, res) => {
//   const order = await getOrderById(req.params.id);

//   if (!order) {
//     res.status(404);
//     throw new Error("Order not found");
//   }

//   if (req.user.role === "buyer" && order.userid !== req.user.userid) {
//     res.status(403);
//     throw new Error("Access denied: cannot view this order");
//   }

//   res.status(200).json(order);
// });

const getUserOrders = asyncHandler(async (req, res) => {
  // if (req.user.role !== "buyer") {
  //   res.status(403);
  //   throw new Error("Access denied: only buyers can view their orders");
  // }

  const orders = await getOrdersByUserId(req.user.userid);

  if (!orders.length) {
    return res.status(200).json({ message: "No orders found for this user" });
  }

  res.status(200).json(orders);
});

// const updateOrderById = asyncHandler(async (req, res) => {
//   if (req.user.role !== "admin") {
//     res.status(403);
//     throw new Error("Access denied: only admin can update orders");
//   }

//   const updated = await updateOrder(req.params.id, req.body);
//   if (!updated) {
//     res.status(404);
//     throw new Error("Order not found");
//   }

//   res.status(200).json({ message: "Order updated successfully", updated });
// });

const changeStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // if (req.user.role !== "admin") {
  //   res.status(403);
  //   throw new Error("Access denied: only admin can change order status");
  // }

  if (!status) {
    res.status(400);
    throw new Error("Status is required");
  }

  const updated = await changeOrderStatus(req.params.id, status);

  if (!updated) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.status(200).json({ message: "Order status updated", updated });
});

const deleteOrderById = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Access denied: only admin can delete orders");
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
  // getOrder,
  getUserOrders,
  // updateOrderById,
  changeStatus,
  deleteOrderById,
  getOrderItems,
};
