import pool from "../../config/db.js";

export const addToBlacklist = async (token) => {
  await pool.query("INSERT INTO token_blacklist (token) VALUES (?)", [token]);
};

export const isBlacklisted = async (token) => {
  const [rows] = await pool.query(
    "SELECT * FROM token_blacklist WHERE token = ?",
    [token],
  );
  return rows.length > 0;
};
