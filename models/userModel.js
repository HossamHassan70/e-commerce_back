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
     RETURNING userid, first_name, last_name, email, phone_number, role, created_at`,
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
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return result.rows[0];
};

const verifyUserEmail = async (userid) => {
  const result = await pool.query(
    "UPDATE users SET isverified = true WHERE userid = $1 RETURNING *",
    [userid]
  );
  return result.rows[0];
};

module.exports = { createUser, findUserByEmail, verifyUserEmail };
