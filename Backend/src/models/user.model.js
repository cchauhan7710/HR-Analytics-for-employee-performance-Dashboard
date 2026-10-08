import pool from "../../config/db.js";

export const getUserByEmail = async (email) => {
  const [userData] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return userData[0];
};

export const getUserById = async (id) => {
  const [userData] = await pool.query(
    "SELECT id ,name , email , role FROM users WHERE id = ?",
    [id],
  );
  return userData[0];
};

export const createUser = async (user) => {
  const { name, email, password, role } = user;

  const [result] = await pool.query(
    "INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)",
    [name, email, password, role || "viewer"],
  );

  return result.insertId;
};

export const getAllUser = async () => {
  const [userData] = await pool.query(
    "SELECT id , name , email , created_at FROM users",
  );
  return userData;
};
