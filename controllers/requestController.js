const db = require("../db/pool");
const asyncHandler = require("express-async-handler");

// @desc    Post seller req
// @route   GET  /api/requests
// @access  Buyer
exports.sendSellerReq = asyncHandler(async (req, res) => {
  const userid = req.user.userid;
  const { role, brand_name, payload } = req.body;
  if (!role) {
    res.status(400).json({ message: "Role is required" });
  }

  const checkUserRole = await db.query(
    `SELECT role FROM users WHERE userid = $1`,
    [userid]
  );

  if (checkUserRole.rows[0]?.role === "seller") {
    res
      .status(400)
      .json({ message: "Request Is Invalid, User Already A Seller" });
  }

  const { rows } = await db.query(
    `INSERT INTO role_change_requests(userid, role, brand_name, payload) VALUES ($1, $2, $3, $4) RETURNING *`,
    [userid, role, brand_name, payload]
  );

  const userResult = await db.query(
    `UPDATE users SET phone_number= $2 WHERE userid = $1 RETURNING *`,
    [userid, phone_number]
  );
  return res.status(201).json(rows[0]);
});

// @desc    Get requests
// @route   GET  /api/requests
// @access  Admin
exports.getSellerReq = asyncHandler(async (req, res) => {
  if (req.user.role != "admin") {
    res.status(401).json({ message: "User is Not Authorized For this Action" });
  }
  const requests = await db.query(
    `SELECT r.role, r.brand_name, r.role, r.payload, u.first_name, u.last_name, u.email, u.phone_number
        FROM role_change_requests r INNER JOIN users u ON r.userid = u.userid `
  );
  return res.status(201).json(requests.rows);
});

// @desc    Accept Or Reject Buyer Req
// @route   POST  /api/requests/:id
// @access  Admin
exports.processDecision = asyncHandler(async (req, res) => {
  if (req.user.role != "admin") {
    res.status(401).json({ message: "User is Not Authorized For this Action" });
  }
  // const reqId = req.params.id;
  const { role, userid } = req.body;
  if (!role) {
    return res.status(400).json({ message: "Role is required" });
  }

  if (role === "seller") {
    await db.query(`UPDATE users SET role = 'seller' WHERE userid = $1`, [
      userid,
    ]);
    return res.status(200).json({ message: "User upgraded to Seller" });
  }

  if (role === "Buyer") {
    await db.query(`UPDATE users SET role = "buyer" WHERE userid = $1`, [
      userid,
    ]);
    return res.status(200).json({ message: "User demoted to Buyer" });
  }
});
