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
      discount_percent,
    } = data;

    const statement = `
            INSERT INTO product (userid, categoryid, title, p_description, price, stock, img, availability_status, discount_percent)
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
      discount_percent,
    ];
    const { rows } = await db.query(statement, values);
    return rows[0];
  }

  // @desc GET ALL PRODUCT
  static async getAll(filters = {}, userid = 0) {
    if (userid !== 0) {
      const { rows } = await db.query(
        `SELECT * FROM product WHERE userid = $1`,
        [userid]
      );
      return rows;
    }
    let statement = `
            SELECT p.productid, p.categoryid, p.title, p.p_description, p.price, p.stock, p.img, p.availability_status, p.discount_percent, c.name
            FROM product p
            FULL JOIN category c ON p.categoryid = c.categoryid
            WHERE 1=1
        `;
    let values = [];
    let index = 1;

    if (filters.categoryid) {
      statement += ` AND p.categoryid = $${index++}`;
      values.push(filters.categoryid);
    }

    if (filters.title) {
      statement += ` AND LOWER(p.title) LIKE LOWER($${index++})`;
      values.push(`%${filters.title}%`);
    }

    if (filters.availability_status) {
      statement += ` AND LOWER(p.availability_status) = LOWER($${index++})`;
      values.push(filters.availability_status);
    }

    if (filters.discount_percent === true) {
      statement += ` AND p.discount_percent > 0`;
    }

    if (filters.discount_percent === false) {
      statement += ` AND p.discount_percent = 0`;
    }

    statement += ` ORDER BY p.updated_at DESC`;

    const { rows } = await db.query(statement, values);
    return rows;
  }
  //@desc GET ALL PRODUCTS AND SELLER FOR ADMIN VIEW
  static async getProductsInfo() {
    const { rows } = await db.query(`
          SELECT p.* , u.first_name, u.last_name, u.email
          FROM product p
          INNER JOIN users u ON p.userid = c.userid`);
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
