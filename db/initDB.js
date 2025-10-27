// initDB.js
const fs = require("fs");
const path = require("path");
const pool = require("./pool");

const initDB = async () => {
  try {
    const sqlFilePath = path.join(__dirname, "init.sql");
    const sql = fs.readFileSync(sqlFilePath, "utf8");

    console.log("⚙️  Running init.sql to create tables...");

    await pool.query(sql);

    console.log("✅ Database initialized successfully!");
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
  }
};

initDB();
