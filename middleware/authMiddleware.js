// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const result = await pool.query(
        `SELECT userid, first_name, last_name, email, phone_number, role, created_at
         FROM users WHERE userid = $1`,
        [decoded.userid]
      );

      if (result.rows.length === 0) {
        res.status(401);
        throw new Error("User not found");
      }

      req.user = result.rows[0];
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});

const allowedTo = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error("User is Not Authorized for this Service");
    }
    next();
  });
};

module.exports = { protect, allowedTo };
