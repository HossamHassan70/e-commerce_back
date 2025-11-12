const pool = require("../db/pool");

const upsertEmailCode = async (userid, code, expired_at) => {
  const query = `
    INSERT INTO emails (userid, code, expired_at)
    VALUES ($1, $2, $3)
    ON CONFLICT (userid) DO UPDATE 
    SET code = $2, expired_at = $3, created_at = NOW()
    RETURNING *;
  `;
  const result = await pool.query(query, [userid, code, expired_at]);
  return result.rows[0];
};

const getEmailCodeByUserId = async (userid) => {
  const query = `SELECT * FROM emails WHERE userid = $1`;
  const result = await pool.query(query, [userid]);
  return result.rows[0];
};

const deleteEmailCode = async (userid) => {
  const query = `DELETE FROM emails WHERE userid = $1`;
  await pool.query(query, [userid]);
};

module.exports = { upsertEmailCode, getEmailCodeByUserId, deleteEmailCode };
