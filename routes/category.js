const express = require("express");
const pool = require("../db/pool");
const authController = require("../middleware/authMiddleware");
const router = express.Router();

// Protect all routes except GET
router.use(authController.protect);

// ➕ Add new category (admin only)
router.post("/", authController.allowedTo("admin"), async (req, res) => {
  try {
    const { name, img } = req.body;

    const result = await pool.query(
      "INSERT INTO category (name, img) VALUES ($1, $2::text[]) RETURNING *",
      [name, img]
    );

    res.status(200).json({
      message: "Category added successfully.",
      category: result.rows[0],
    });
  } catch (err) {
    console.error("Error adding category:", err.message);
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

// 🔍 Get category by ID
router.get("/:categoryid", async (req, res) => {
  try {
    const { categoryid } = req.params;

    const result = await pool.query(
      "SELECT * FROM category WHERE categoryid = $1",
      [categoryid]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✏️ Update category (admin only)
router.patch(
  "/:categoryid",
  authController.allowedTo("admin"),
  async (req, res) => {
    try {
      const { categoryid } = req.params;
      const { name, img } = req.body;

      const updates = [];
      const values = [];
      let index = 1;

      if (name !== undefined) {
        updates.push(`name = $${index}`);
        values.push(name);
        index++;
      }

      if (img !== undefined) {
        updates.push(`img = $${index}`);
        values.push(img);
        index++;
      }

      if (updates.length === 0) {
        return res.status(400).json({ message: "No fields to update." });
      }

      const query = `
      UPDATE category
      SET ${updates.join(", ")}
      WHERE categoryid = $${index}
      RETURNING *
    `;
      values.push(categoryid);

      const result = await pool.query(query, values);

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
  }
);

// ❌ Delete category
router.delete(
  "/:categoryid",
  authController.allowedTo("admin"),
  async (req, res) => {
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
  }
);

module.exports = router;
