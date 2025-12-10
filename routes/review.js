const express = require("express");
const router = express.Router();
// const pool = require("../db");
const pool = require("../db/pool");
const authController = require("../middleware/authMiddleware");

// ADD PERMISSIONS
//router.use(authController.protect);

// get all reviews for Admin
router.get(
  "/",
  authController.protect,
  authController.allowedTo("admin"),
  async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM review ORDER BY created_at DESC"
      );
      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

//get reviews for seller products
router.get("/SellerReviews", authController.protect, async (req, res) => {
  const userid = req.user.userid;

  if (req.user.role !== "seller") {
    return res
      .status(401)
      .json({ msg: "User is Not authorized For this Route" });
  }

  try {
    const reviewProducts = await pool.query(
      "SELECT * FROM review WHERE userid = $1 ORDER BY created_at DESC",
      [userid]
    );

    if (!reviewProducts.rows.length) {
      return res.status(200).json({ msg: "No Reviews For this Seller" });
    }

    res.status(200).json({
      status: "success",
      length: reviewProducts.rows.length,
      reviewProducts: reviewProducts.rows,
    });
  } catch (err) {
    console.error("Error fetching seller reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/SellerAllReviews", authController.protect, async (req, res) => {
  const sellerId = req.user.userid;

  if (req.user.role !== "seller") {
    return res
      .status(401)
      .json({ msg: "You are not authorized to view seller reviews" });
  }

  try {
    const reviews = await pool.query(
      `SELECT r.reviewid, r.review, r.rating, r.created_at,
              r.userid AS reviewer_id,
              p.productid, p.title
       FROM review r
       JOIN product p ON r.productid = p.productid
       WHERE p.userid = $1
       ORDER BY r.created_at DESC`,
      [sellerId]
    );

    if (reviews.rows.length === 0) {
      return res
        .status(200)
        .json({ msg: "This seller has no product reviews yet" });
    }

    res.status(200).json({
      status: "success",
      count: reviews.rows.length,
      reviews: reviews.rows,
    });
  } catch (err) {
    console.error("Error fetching seller product reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// get all reviews For User
router.get("/UserReviews", authController.protect, async (req, res) => {
  try {
    const userid = req.user.userid;
    const result = await pool.query(
      "SELECT * FROM review WHERE userid = $1 ORDER BY created_at DESC",
      [userid]
    );
    if (!result) {
      res.status(200).json({ msg: "No Reviews For this User" });
    }
    res.status(200).json(result.rows);
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

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// add new review
router.post("/", authController.protect, async (req, res) => {
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

    //  Check ownership
    const checkOwner = await pool.query(
      `SELECT * FROM product WHERE userid = $1 AND productid = $2`,
      [userid, productid]
    );

    if (checkOwner.rows.length > 0) {
      return res.status(400).json({
        message: "This product Belongs To current User, Can Not Review.",
      });
    }

    //  If not reviewed, insert new review
    const result = await pool.query(
      `INSERT INTO review (userid, productid, review, rating)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userid, productid, review, rating]
    );

    res.status(200).json({
      message: "Your review was added successfully",
      review: result.rows[0],
    });
  } catch (err) {
    console.error("Error inserting review:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//  update review by userid + productid
router.put("/:reviewid", authController.protect, async (req, res) => {
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

    res.status(200).json({
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
  authController.protect,
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

      res.json({ message: "Review was deleted successfully." });
    } catch (err) {
      console.error("Error deleting review:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
