import mysql from "mysql2/promise";
import "dotenv/config";

const isCloudHost =
  process.env.DB_HOST &&
  process.env.DB_HOST !== "localhost" &&
  process.env.DB_HOST !== "127.0.0.1";

const requiresSsl = process.env.DB_SSL === "true" || isCloudHost;

const connectionUri =
  process.env.DATABASE_URL ||
  process.env.MYSQL_URL ||
  process.env.service_url;

const dbConfig = connectionUri
  ? {
      uri: connectionUri,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "defaultdb",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ...(requiresSsl ? { ssl: { rejectUnauthorized: false } } : {}),
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
