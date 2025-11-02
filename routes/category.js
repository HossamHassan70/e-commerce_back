const express = require('express');
const pool = require('../db');
const router = express.Router();

// ➕ Add a new category
router.post('/addCategory', async (req, res) => {
  try {
    const { name } = req.body;

    const result = await pool.query(
      'INSERT INTO category (name) VALUES ($1) RETURNING *',
      [name]
    );

    res.json({ message: 'Category added successfully.', category: result.rows[0] });
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🔍 Get all categories
router.get('/allCategories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM category ORDER BY categoryid ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✏️ Update category name
router.put('/updateCategory/:categoryid', async (req, res) => {
  try {
    const { categoryid } = req.params;
    const { name } = req.body;

    const result = await pool.query(
      'UPDATE category SET name = $1 WHERE categoryid = $2 RETURNING *',
      [name, categoryid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.json({ message: 'Category updated successfully.', category: result.rows[0] });
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ❌ Delete category
router.delete('/deleteCategory/:categoryid', async (req, res) => {
  try {
    const { categoryid } = req.params;

    const result = await pool.query(
      'DELETE FROM category WHERE categoryid = $1 RETURNING *',
      [categoryid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.json({ message: 'Category deleted successfully.' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
