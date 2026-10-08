import pool from "../../config/db.js";
import { protect } from "../middlewares/auth.middleware.js";

export const getAllTraining = async () => {
  const [rows] = await pool.query("SELECT * FROM employee_training");
  return rows;
};

export const getTrainingById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM employee_training WHERE id = ?",
    [id],
  );
  return rows[0];
};

export const getTrainingByEmployeeId = async (employee_ID) => {
  const [rows] = await pool.query(
    "SELECT * FROM employee_training WHERE employee_ID = ?",
    [employee_ID],
  );
  return rows;
};

export const createTraining = async (t) => {
  const {
    employeeName,
    employee_ID,
    department,
    training_name,
    training_date,
    training_hours,
    completion_status,
    pre_training_score,
    post_training_score,
    score_improvement,
  } = t;

  const [result] = await pool.query(
    `INSERT INTO employee_training (
      employeeName, employee_ID, department, training_name, training_date,
      training_hours, completion_status, pre_training_score, post_training_score, score_improvement
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      employeeName,
      employee_ID,
      department,
      training_name,
      training_date,
      training_hours,
      completion_status,
      pre_training_score,
      post_training_score,
      score_improvement,
    ],
  );
  return result.insertId;
};

export const updateTraining = async (id, t) => {
  const {
    department,
    training_name,
    training_date,
    training_hours,
    completion_status,
    pre_training_score,
    post_training_score,
    score_improvement,
  } = t;

  const [result] = await pool.query(
    `UPDATE employee_training SET 
     department = ?, training_name = ?, training_date = ?, training_hours = ?,
     completion_status = ?, pre_training_score = ?, post_training_score = ?, score_improvement = ?
     WHERE id = ?`,
    [
      department,
      training_name,
      training_date,
      training_hours,
      completion_status,
      pre_training_score,
      post_training_score,
      score_improvement,
      id,
    ],
  );
  return result.affectedRows;
};

export const deleteTraining = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM employee_training WHERE id = ?",
    [id],
  );
  return result.affectedRows;
};

export const bulkInsertTraining = async (records) => {
  const values = records.map((r) => [
    r.employeeName,
    r.employee_ID,
    r.department,
    r.training_name,
    r.training_date,
    r.training_hours,
    r.completion_status,
    r.pre_training_score,
    r.post_training_score,
    r.score_improvement,
  ]);

  const [result] = await pool.query(
    `INSERT INTO employee_training (
      employeeName, employee_ID, department, training_name, training_date,
      training_hours, completion_status, pre_training_score, post_training_score, score_improvement
    ) VALUES ?`,
    [values],
  );
  return result.affectedRows;
};
