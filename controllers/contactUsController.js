const db = require("../db/pool");
const asyncHandler = require("express-async-handler");

exports.sendMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, company, subject, message } = req.body;
  if (!name || !email || !phone || !company || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: "Name, email, and message are required.",
    });
  }

  const msg = await db.query(
    `INSERT INTO contact_messages (name, email, phone, company, subject, message) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, email, phone, company, subject, message]
  );

  res.status(200).json({
    success: true,
    message: "Message received. We'll get back to you soon.",
    msg: msg.rows[0],
  });
});

exports.getMsg = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(401).json({
      message: "User is not authorized for this service.",
    });
  }
  const msgs = await db.query(
    `SELECT * FROM contact_messages ORDER BY created_at DESC`
  );
  res.status(200).json({
    success: true,
    msgs: msgs.rows,
  });
});
