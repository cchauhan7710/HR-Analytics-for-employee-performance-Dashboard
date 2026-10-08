import pool from "../../config/db.js";

export const getAllExits = async () => {
  const [rows] = await pool.query("SELECT * FROM employee_exit");
  return rows;
};

export const getExitById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM employee_exit WHERE id = ?", [
    id,
  ]);
  return rows[0];
};

export const getExitByEmployeeId = async (employee_ID) => {
  const [rows] = await pool.query(
    "SELECT * FROM employee_exit WHERE employee_ID = ?",
    [employee_ID],
  );
  return rows;
};

export const createExit = async (e) => {
  const {
    employeeName,
    employee_ID,
    department,
    exit_date,
    exit_type,
    exit_reason,
  } = e;

  const [result] = await pool.query(
    `INSERT INTO employee_exit (employeeName, employee_ID, department, exit_date, exit_type, exit_reason) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [employeeName, employee_ID, department, exit_date, exit_type, exit_reason],
  );
  return result.insertId;
};

export const updateExit = async (id, e) => {
  const { department, exit_date, exit_type, exit_reason } = e;

  const [result] = await pool.query(
    `UPDATE employee_exit SET department = ?, exit_date = ?, exit_type = ?, exit_reason = ? WHERE id = ?`,
    [department, exit_date, exit_type, exit_reason, id],
  );
  return result.affectedRows;
};

export const deleteExit = async (id) => {
  const [result] = await pool.query("DELETE FROM employee_exit WHERE id = ?", [
    id,
  ]);
  return result.affectedRows;
};

export const bulkInsertExits = async (records) => {
  const values = records.map((r) => [
    r.employeeName,
    r.employee_ID,
    r.department,
    r.exit_date,
    r.exit_type,
    r.exit_reason,
  ]);

  const [result] = await pool.query(
    `INSERT INTO employee_exit (employeeName, employee_ID, department, exit_date, exit_type, exit_reason) VALUES ?`,
    [values],
  );
  return result.affectedRows;
};
