const express = require("express");
// const pool = require("../db");
const pool = require("../db/pool");
const authController = require("../middleware/authMiddleware");
const router = express.Router();

// ADD PERMISSIONS
router.use(authController.protect);
router.use(authController.allowedTo("buyer", "seller"));

// ➕ Add address
router.post("/", async (req, res) => {
  const userid = req.user.userid;
  try {
    const {
      // userid,
      country,
      city,
      street,
      building_num,
      apt_num,
      postal_code,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO address (userid, country, city, street, building_num, apt_num, postal_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userid, country, city, street, building_num, apt_num, postal_code]
    );

    res.json({
      message: "Address added successfully.",
      address: result.rows[0],
    });
  } catch (err) {
    console.error("Error adding address:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔍 Get all addresses for a user
router.get("/", async (req, res) => {
  try {
    const userid = req.user.userid;
    const result = await pool.query("SELECT * FROM address WHERE userid = $1", [
      userid,
    ]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No address found for this user." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching address:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✏️ Update address
router.put("/:addressid", async (req, res) => {
  const userid = req.user.userid;
  try {
    const { addressid } = req.params;
    const { country, city, street, building_num, apt_num, postal_code } =
      req.body;

    const result = await pool.query(
      `UPDATE address
       SET country = $1, city = $2, street = $3, building_num = $4, apt_num = $5, postal_code = $6
       WHERE addressid = $7 AND userid = $8
       RETURNING *`,
      [
        country,
        city,
        street,
        building_num,
        apt_num,
        postal_code,
        addressid,
        userid,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Address not found." });
    }

    res.json({
      message: "Address updated successfully.",
      address: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating address:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ❌ Delete address
router.delete("/:addressid", async (req, res) => {
  const userid = req.user.userid;
  try {
    const { addressid } = req.params;
    const result = await pool.query(
      "DELETE FROM address WHERE addressid = $1 AND userid = $2 RETURNING *",
      [addressid, userid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Address not found." });
    }

    res.json({ message: "Address deleted successfully." });
  } catch (err) {
    console.error("Error deleting address:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router; // ✅ بدل "export default"
