const db = require("../db/pool");
const { trace } = require("../routes/cartRouter");

class Cart {
  // @desc GET USER CART
  static async get(userid) {
    const statement = `
        SELECT c.quantity, p.productid, p.title, p.p_description, p.price, p.img, p.availability_status, p.discount_percent
        FROM cart c
        JOIN product p ON c.productid = p.productid
        WHERE c.userid = $1
        `;
    const { rows } = await db.query(statement, [userid]);
    return rows;
  }

  // @desc CHECK IF PRODUCT BELONGS TO SELLER
  static async checkOwner(userid, productid) {
    const productOwnership = await db.query(
      `SELECT p.productid FROM product p JOIN users u ON p.userid = u.userid WHERE u.userid = $1 AND p.productid = $2 `,
      [userid, productid]
    );
    if (productOwnership.rows.length > 0) return true;
    return false;
  }

  // @desc ADD OR INC QUANTITY TO CART
  static async addOrUpdate(userid, productid, quantity) {
    // const checkIfInStock = await db.query(
    //   `SELECT productid FROM product WHERE productid = $1 AND availability_status = $2`,
    //   [productid, "In stock"]
    // );

    // if (checkIfInStock.rows.length === 0) {
    //   res.status(401).json({
    //     message: "Product is out Of Stock, You can Add It to Favorite List",
    //   });
    // }

    // const productExistInCart = await db.query(
    //   `SELECT quantity FROM cart WHERE userid = $1 AND productid = $2`,
    //   [userid, productid]
    // );

    // if (productExistInCart.rows.length > 0) {
    //   const newQnt = productExistInCart.rows[0].quantity + quantity;
    //   const updateQnt = await db.query(
    //     `UPDATE cart SET quantity = $1 WHERE userid = $2 AND productid = $3 RETURNING *`,
    //     [newQnt, userid, productid]
    //   );
    //   return updateQnt.rows[0];
    // } else {
    const addProduct = await db.query(
      `INSERT INTO cart (userid, productid, quantity) VALUES ($1, $2, $3) RETURNING *`,
      [userid, productid, quantity]
    );
    return addProduct.rows[0];
    //}
  }

  // @desc REDUCE QUANTITY
  // static async decreaseQnt(userid, productid, quantity) {
  //   const productInCart = await db.query(
  //     `SELECT quantity FROM cart WHERE userid = $1 AND productid = $2`,
  //     [userid, productid]
  //   );

  //   const currentQnt = productInCart.rows[0].quantity;
  //   const newQnt = currentQnt - quantity;
  //   if (newQnt <= 0) {
  //     await db.query(
  //       `DELETE FROM cart WHERE userid = $1 AND productid = $2 RETURNING *`,
  //       [userid, productid]
  //     );

  //     return { message: "Item Removed" };
  // } else {
  //   const reduceQnt = await db.query(
  //     `UPDATE cart SET quantity = $1 WHERE userid = $2 AND productid = $3 RETURNING *`,
  //     [newQnt, userid, productid]
  //   );

  //return reduceQnt.rows[0];

  //}

  // @desc REMOVE PRODUCT FROM CART
  static async remove(userid, productid) {
    return await db.query(
      `DELETE FROM cart WHERE userid = $1 AND productid = $2 RETURNING *`,
      [userid, productid]
    );
  }
}

module.exports = Cart;
