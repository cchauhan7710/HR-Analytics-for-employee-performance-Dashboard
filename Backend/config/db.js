import mysql from "mysql2/promise";
import "dotenv/config";

const dbConfig =
  process.env.DATABASE_URL || process.env.MYSQL_URL
    ? process.env.DATABASE_URL || process.env.MYSQL_URL
    : {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "Hr_Analytics",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ...(process.env.DB_SSL === "true"
          ? { ssl: { rejectUnauthorized: false } }
          : {}),
      };

const pool = mysql.createPool(dbConfig);

try {
  const connection = await pool.getConnection();
  console.log("MySQL connected successfully!");
  connection.release();
} catch (error) {
  console.warn("MySQL Connection warning:", error.message);
}
export default pool;
