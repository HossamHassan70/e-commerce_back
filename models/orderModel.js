const pool = require("../db/pool");

const createOrder = async (
  userid,
  order_status,
  total_amount,
  shipping_fee
) => {
  const result = await pool.query(
    `INSERT INTO orders (userid, order_status, total_amount, shipping_fee)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userid, order_status || "paid", total_amount, shipping_fee]
  );
  return result.rows[0];
};

const getAllOrders = async () => {
  const result = await pool.query(`SELECT * FROM orders ORDER BY orderid DESC`);
  return result.rows;
};

const getOrderById = async (id) => {
  const result = await pool.query(`SELECT * FROM orders WHERE orderid = $1`, [
    id,
  ]);
  return result.rows[0];
};

const updateOrder = async (id, fields) => {
  const { order_status, total_amount, shipping_fee } = fields;
  const result = await pool.query(
    `UPDATE orders
     SET order_status = COALESCE($1, order_status),
         total_amount = COALESCE($2, total_amount),
         shipping_fee = COALESCE($3, shipping_fee)
     WHERE orderid = $4
     RETURNING *`,
    [order_status, total_amount, shipping_fee, id]
  );
  return result.rows[0];
};

const deleteOrder = async (id) => {
  const result = await pool.query(
    `DELETE FROM orders WHERE orderid = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
