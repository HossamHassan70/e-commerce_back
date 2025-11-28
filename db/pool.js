//const { Pool } = require("@neondatabase/serverless");
const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   //ssl: {
//   //  rejectUnauthorized: false,
//   //},
// });
console.log("DATABASE_URL =", process.env.DATABASE_URL);

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  family: 4, // forces IPv4
});

pool.on("connect", () => {
  console.log("DB Connection");
});

pool.on("error", () => {
  console.log("Error on DB COnnection");
  process.exit(-1);
});

module.exports = pool;
