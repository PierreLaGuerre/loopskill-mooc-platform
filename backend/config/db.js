require("dotenv").config({ quiet: true });

const mysql = require("mysql2/promise");

function shouldUseSsl() {
  return process.env.DB_SSL === "true";
}

const poolConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mooc_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

if (shouldUseSsl()) {
  poolConfig.ssl = {
    rejectUnauthorized: true
  };
}

const pool = mysql.createPool(poolConfig);

pool
  .getConnection()
  .then((connection) => {
    console.log("Connected to MySQL");
    connection.release();
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

module.exports = pool;
