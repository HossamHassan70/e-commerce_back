const pool = require("../db/pool");

const createOrder = async (
  userid,
  //
  items,
  order_status,
  total_amount,
  shipping_fee
) => {
  const result = await pool.query(
    `INSERT INTO orders (userid, order_status, total_amount, shipping_fee)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userid, order_status, total_amount, shipping_fee]
  );

  //ADD ITEMS TO ORDER ITEMS TABLE
  const orderId = result.rows[0].orderid;

  for (const item of items) {
    await pool.query(
      `INSERT INTO order_items (orderid, productid, quantity, subtotal)
       VALUES ($1, $2, $3, $4)`,
      [orderId, item.productid, item.quantity, item.subtotal]
    );
  }

  return result.rows[0];
};

const getAllOrders = async () => {
  const result = await pool.query(`SELECT * FROM orders ORDER BY orderid DESC`);
  return result.rows;
};

const getOrderById = async (orderid) => {
  const result = await pool.query(
    `SELECT i.productid, i.subtotal, p.img FROM order_items i INNER JOIN product p
    ON p.productid = i.productid
    WHERE i.orderid = $1`,
    [orderid]
  );
  return result.rows;
};

// const getOrderById = async (orderid) => {
//   const result = await pool.query(`SELECT * FROM orders WHERE orderid = $1`, [
//     orderid,
//   ]);
//   return result.rows[0];
// };

const getOrdersByUserId = async (userid) => {
  const result = await pool.query(
    `SELECT * FROM orders WHERE userid = $1 ORDER BY created_at DESC`,
    [userid]
  );
  return result.rows;
};

const updateOrder = async (orderid, data) => {
  const { order_status, total_amount, shipping_fee } = data;
  const result = await pool.query(
    `UPDATE orders 
     SET order_status = COALESCE($1, order_status),
         total_amount = COALESCE($2, total_amount),
         shipping_fee = COALESCE($3, shipping_fee),
         updated_at = CURRENT_TIMESTAMP
     WHERE orderid = $4
     RETURNING *`,
    [order_status, total_amount, shipping_fee, orderid]
  );
  return result.rows[0];
};

const changeOrderStatus = async (orderid, newStatus) => {
  const validStatuses = ["pending", "completed", "canceled"];
  if (!validStatuses.includes(newStatus)) {
    throw new Error("Invalid order status");
  }

  const result = await pool.query(
    `UPDATE orders 
     SET order_status = $1, updated_at = CURRENT_TIMESTAMP 
     WHERE orderid = $2
     RETURNING *`,
    [newStatus, orderid]
  );
  return result.rows[0];
};

const deleteOrder = async (orderid) => {
  const result = await pool.query(
    `DELETE FROM orders WHERE orderid = $1 RETURNING *`,
    [orderid]
  );
  return result.rows[0];
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrder,
  changeOrderStatus,
  deleteOrder,
};
