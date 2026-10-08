import pool from "../../config/db.js";

export const getAllPerformance = async () => {
  const [rows] = await pool.query("SELECT * FROM employee_performance");
  return rows;
};

export const getPerformanceById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM employee_performance WHERE id = ?",
    [id],
  );
  return rows[0];
};

export const getPerformanceByEmployeeId = async (employee_ID) => {
  const [rows] = await pool.query(
    "SELECT * FROM employee_performance WHERE employee_ID = ?",
    [employee_ID],
  );
  return rows;
};

export const createPerformance = async (perf) => {
  const {
    employeeName,
    employee_ID,
    department,
    performance_year,
    appraisal_rating,
    goal_attainment,
    performance_category,
  } = perf;

  const [result] = await pool.query(
    `INSERT INTO employee_performance (
      employeeName, employee_ID, department, performance_year,
      appraisal_rating, goal_attainment, performance_category
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      employeeName,
      employee_ID,
      department,
      performance_year,
      appraisal_rating,
      goal_attainment,
      performance_category,
    ],
  );
  return result.insertId;
};

export const updatePerformance = async (id, perf) => {
  const {
    department,
    performance_year,
    appraisal_rating,
    goal_attainment,
    performance_category,
  } = perf;

  const [result] = await pool.query(
    `UPDATE employee_performance SET 
     department = ?, performance_year = ?, appraisal_rating = ?, goal_attainment = ?, performance_category = ?
     WHERE id = ?`,
    [
      department,
      performance_year,
      appraisal_rating,
      goal_attainment,
      performance_category,
      id,
    ],
  );
  return result.affectedRows;
};

export const deletePerformance = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM employee_performance WHERE id = ?",
    [id],
  );
  return result.affectedRows;
};

export const bulkInsertPerformance = async (records) => {
  const values = records.map((r) => [
    r.employeeName,
    r.employee_ID,
    r.department,
    r.performance_year,
    r.appraisal_rating,
    r.goal_attainment,
    r.performance_category,
  ]);

  const [result] = await pool.query(
    `INSERT INTO employee_performance (
      employeeName, employee_ID, department, performance_year,
      appraisal_rating, goal_attainment, performance_category
    ) VALUES ?`,
    [values],
  );
  return result.affectedRows;
};
