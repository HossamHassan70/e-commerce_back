const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

pool.on("connect", () => {
  console.log("DB COnnection");
});

pool.on("error", () => {
  console.log("Error on DB COnnection");
  process.exit(-1);
});

module.exports = pool;
