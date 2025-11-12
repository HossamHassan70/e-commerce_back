const express = require("express");
// const pool = require("../db");
const pool = require("../db/pool");
const authController = require("../middleware/authMiddleware");
const router = express.Router();

// ADD PERMISSIONS
router.use(authController.protect);
router.use(authController.allowedTo("admin"));

// ➕ Add a new category
router.post("/", async (req, res) => {
  try {
    const { name, image } = req.body;

    const result = await pool.query(
      "INSERT INTO category (name, image) VALUES ($1) RETURNING *",
      [name, image]
    );

    res.status(200).json({
      message: "Category added successfully.",
      category: result.rows[0],
    });
  } catch (err) {
    console.error("Error adding category:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔍 Get all categories
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM category ORDER BY categoryid ASC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✏️ Update category name
router.put("/:categoryid", async (req, res) => {
  try {
    const { categoryid } = req.params;
    const { name, image } = req.body;

    const result = await pool.query(
      "UPDATE category SET name = $1 AND image = $2 WHERE categoryid = $3 RETURNING *",
      [name, image, categoryid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({
      message: "Category updated successfully.",
      category: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ❌ Delete category
router.delete("/:categoryid", async (req, res) => {
  try {
    const { categoryid } = req.params;

    const result = await pool.query(
      "DELETE FROM category WHERE categoryid = $1 RETURNING *",
      [categoryid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({ message: "Category deleted successfully." });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
