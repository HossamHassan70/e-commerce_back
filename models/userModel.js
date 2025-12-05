const { assign } = require("nodemailer/lib/shared");
const pool = require("../db/pool");

const createUser = async (
  first_name,
  last_name,
  email,
  hashedPassword,
  phone_number,
  role
) => {
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password, phone_number, role, isVerified)
     VALUES ($1, $2, $3, $4, $5, $6, false)
     RETURNING userid, first_name, last_name, email, password, phone_number, role, isVerified`,
    [
      first_name,
      last_name,
      email,
      hashedPassword,
      phone_number,
      role || "buyer",
    ]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT userid, first_name, last_name, email, password, phone_number, role, isverified FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

const verifyUserEmail = async (userid) => {
  const result = await pool.query(
    "UPDATE users SET isVerified = true WHERE userid = $1 RETURNING *",
    [userid]
  );
  return result.rows[0];
};

const getAllUsers = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

const deleteUnverifiedExpiredUsers = async () => {
  const result = await pool.query(
    `DELETE FROM users
     WHERE isVerified = false
     AND userid IN (
       SELECT userid FROM emails
       WHERE expired_at < NOW() - INTERVAL '1 hour'
     )
     RETURNING userid, email`
  );
  return result.rows;
};
const updateUser = async (
  first_name,
  last_name,
  email,
  phone_number,
  role,
  userid
) => {
  const result = await pool.query(
    `UPDATE users
       SET first_name = $1,
           last_name = $2,
           email = $3,
           phone_number = $4,
           role = $5
       WHERE userid = $6
       RETURNING userid, first_name, last_name, email, phone_number, role, created_at`,
    [first_name, last_name, email, phone_number, role, userid]
  );
  return result.rows;
};

const deleteUser = async (userid) => {
  const result = await pool.query(
    `DELETE FROM users WHERE userid = $1 RETURNING userid`,
    [userid]
  );
  return result;
};
module.exports = {
  createUser,
  findUserByEmail,
  verifyUserEmail,
  getAllUsers,
  deleteUnverifiedExpiredUsers,
  updateUser,
  deleteUser,
};
