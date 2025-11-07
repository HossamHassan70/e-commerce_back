const db = require("../db/pool");

class FavList {
  //@desc GET LIST
  static async get(userid) {
    return (await db.query(`SELECT * FROM favlist WHERE userid = $1`, [userid]))
      .rows;
  }

  //@desc ADD PRODUCT
  static async add(userid, productid) {
    const productExistInCart = await db.query(
      `SELECT productid FROM favlist WHERE userid = $1 AND productid = $2`,
      [userid, productid]
    );
    if (productExistInCart.rows.length > 0) {
       res
      .status(400)
         .json({ message: "Product Already Exists In List" });
    } else {
      return (
        await db.query(
          `INSERT INTO favlist (userid, productid) VALUES ($1, $2) RETURNING *`,
          [userid, productid]
        )
      ).rows[0];
    }
  }

  //@desc REMOVE PRODUCT
  static async remove(userid, productid) {
    return await db.query(
      `DELETE FROM favlist WHERE userid = $1 AND productid = $2 RETURNING *`,
      [userid, productid]
    );
  }

  //@desc EMPTY LIST
  static async empty(userid) {
    return await db.query(`DELETE FROM favlist WHERE userid = $1 RETURNING *`, [
      userid
    ]);
  }
}

module.exports = FavList;
