const express = require('express');
const pool = require('../db');
const router = express.Router();

// ➕ Add address
router.post('/addAddress', async (req, res) => {
  try {
    const { userid, country, city, street, building_num, apt_num, postal_code } = req.body;

    const result = await pool.query(
      `INSERT INTO address (userid, country, city, street, building_num, apt_num, postal_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userid, country, city, street, building_num, apt_num, postal_code]
    );

    res.json({ message: 'Address added successfully.', address: result.rows[0] });
  } catch (err) {
    console.error('Error adding address:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🔍 Get all addresses for a user
router.get('/userAddress/:userid', async (req, res) => {
  try {
    const { userid } = req.params;
    const result = await pool.query('SELECT * FROM address WHERE userid = $1', [userid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No address found for this user.' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching address:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✏️ Update address
router.put('/updateAddress/:addressid', async (req, res) => {
  try {
    const { addressid } = req.params;
    const { country, city, street, building_num, apt_num, postal_code } = req.body;

    const result = await pool.query(
      `UPDATE address
       SET country = $1, city = $2, street = $3, building_num = $4, apt_num = $5, postal_code = $6
       WHERE addressid = $7
       RETURNING *`,
      [country, city, street, building_num, apt_num, postal_code, addressid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Address not found.' });
    }

    res.json({ message: 'Address updated successfully.', address: result.rows[0] });
  } catch (err) {
    console.error('Error updating address:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ❌ Delete address
router.delete('/deleteAddress/:addressid', async (req, res) => {
  try {
    const { addressid } = req.params;
    const result = await pool.query('DELETE FROM address WHERE addressid = $1 RETURNING *', [addressid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Address not found.' });
    }

    res.json({ message: 'Address deleted successfully.' });
  } catch (err) {
    console.error('Error deleting address:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; // ✅ بدل "export default"
