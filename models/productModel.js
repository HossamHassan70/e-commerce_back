const db = require("../db/pool");

class Product {
  // @desc CREATE PRODUCT
  static async create(data) {
    const {
      userid,
      categoryid,
      title,
      p_description,
      price,
      stock,
      img,
      availability_status,
      discount_precent,
    } = data;

    const statement = `
            INSERT INTO product (userid, categoryid, title, p_description, price, stock, img, availability_status, discount_precent)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
    const values = [
      userid,
      categoryid,
      title,
      p_description,
      price,
      stock,
      img,
      availability_status,
      discount_precent,
    ];
    const { rows } = await db.query(statement, values);
    return rows[0];
  }

  // @desc GET ALL PRODUCT
  static async getAll() {
    const statement = `
            SELECT * FROM product
        `;
    const { rows } = await db.query(statement);
    return rows;
  }

  // @desc GET ONE PRODUCT BY ID
  static async findById(productid) {
    const statement = `
            SELECT * FROM product
            WHERE productid = $1
        `;
    const { rows } = await db.query(statement, [productid]);
    return rows[0];
  }

  // @desc UPDATE PRODUCT BY ID
  static async findByIdAndUpdate(productId, userid, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);

    if (keys.length === 0) throw new Error("No Values to update");

    const setFields = keys
      .map((key, index) => `${key}=$${index + 1}`)
      .join(", ");
    const statement = `
            UPDATE product
            SET ${setFields}
            WHERE productId =$${keys.length + 1} AND userid =$${keys.length + 2}
            RETURNING *
        `;
    const { rows } = await db.query(statement, [...values, productId, userid]);
    return rows[0];
  }

  // @desc DELETE PRODUCT BY ID
  static async findByIdAndDelete(productId, userid) {
    const statement = `
            DELETE FROM product
            WHERE productid = $1 AND userid = $2
            RETURNING *
        `;
    const { rows } = await db.query(statement, [productId, userid]);
    return rows[0];
  }
}

module.exports = Product;
