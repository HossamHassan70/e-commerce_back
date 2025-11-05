const express = require("express");
const router = express.Router();
// const pool = require("../db");
const pool = require("../db/pool");
const authController = require("../middleware/authMiddleware");

// ADD PERMISSIONS
router.use(authController.protect);

// get all reviews
router.get("/", authController.allowedTo("admin"), async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM review ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//  get reviews for a specific product
router.get("/:productid", async (req, res) => {
  try {
    const { productid } = req.params;
    const result = await pool.query(
      "SELECT * FROM review WHERE productid = $1 ORDER BY created_at DESC",
      [productid]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this product." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// add new review
router.post("/", async (req, res) => {
  try {
    const userid = req.user.userid;
    const { productid, review, rating } = req.body;

    //  Check if this user already reviewed the same product
    const check = await pool.query(
      `SELECT * FROM review WHERE userid = $1 AND productid = $2`,
      [userid, productid]
    );

    if (check.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product." });
    }

    //  If not reviewed, insert new review
    const result = await pool.query(
      `INSERT INTO review (userid, productid, review, rating)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userid, productid, review, rating]
    );

    res.json({
      message: "Your review was added successfully",
      review: result.rows[0],
    });
  } catch (err) {
    console.error("Error inserting review:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//  update review by userid + productid
router.put("/:reviewid", async (req, res) => {
  try {
    const userid = req.user.userid;
    const { reviewid } = req.params;
    const { review, rating } = req.body;
    // const { productid, review, rating } = req.body;

    // const check = await pool.query(
    //   `SELECT * FROM review WHERE userid = $1 AND productid = $2`,
    //   [userid, productid]
    // );
    const check = await pool.query(
      `SELECT * FROM review WHERE reviewid = $1 AND userid = $2`,
      [reviewid, userid]
    );

    if (check.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No review found for this user and product." });
    }

    // const updated = await pool.query(
    //   `UPDATE review
    //    SET review = $1, rating = $2
    //    WHERE userid = $3 AND productid = $4
    //    RETURNING *`,
    //   [review, rating, userid, productid]
    // );
    const updated = await pool.query(
      `UPDATE review
         SET review = $1, rating = $2
         WHERE reviewid = $3
         RETURNING *`,
      [review, rating, reviewid]
    );

    res.json({
      message: "Your review was updated successfully.",
      review: updated.rows[0],
    });
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// delete review by userid + productid
router.delete(
  "/:reviewid",
  authController.allowedTo("admin", "buyer", "seller"),
  async (req, res) => {
    try {
      const userid = req.user.userid;
      const { reviewid } = req.params;
      // const { productid } = req.body;

      //  Check if review exists
      // const check = await pool.query(
      //   `SELECT * FROM review WHERE userid = $1 AND productid = $2`,
      //   [userid, productid]
      // );
      const check = await pool.query(
        `SELECT * FROM review WHERE reviewid = $1`,
        [reviewid]
      );

      if (check.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "No review found for this user and product." });
      }

      // delete review
      // await pool.query(
      //   `DELETE FROM review WHERE userid = $1 AND productid = $2`,
      //   [userid, productid]
      // );
      await pool.query(`DELETE FROM review WHERE reviewid = $1`, [reviewid]);

      res.json({ message: "Your review was deleted successfully." });
    } catch (err) {
      console.error("Error deleting review:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
