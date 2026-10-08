import pool from "../../config/db.js";

export const getAllAttendance = async () => {
  const [rows] = await pool.query("SELECT * FROM attendance_summary");
  return rows;
};

export const getAttendanceById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM attendance_summary WHERE id = ?",
    [id],
  );
  return rows[0];
};

export const getAttendanceByEmployeeId = async (employee_ID) => {
  const [rows] = await pool.query(
    "SELECT * FROM attendance_summary WHERE employee_ID = ?",
    [employee_ID],
  );
  return rows;
};

export const createAttendance = async (att) => {
  const {
    employeeName,
    employee_ID,
    department,
    month,
    month_start_date,
    month_end_date,
    total_working_days,
    present_days,
    absent_days,
    leave_days,
    total_accounted_days,
    attendance_rate,
    absenteeism_rate,
  } = att;

  const [result] = await pool.query(
    `INSERT INTO attendance_summary (
      employeeName, employee_ID, department, month, month_start_date, month_end_date,
      total_working_days, present_days, absent_days, leave_days,
      total_accounted_days, attendance_rate, absenteeism_rate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      employeeName,
      employee_ID,
      department,
      month,
      month_start_date,
      month_end_date,
      total_working_days,
      present_days,
      absent_days,
      leave_days,
      total_accounted_days,
      attendance_rate,
      absenteeism_rate,
    ],
  );
  return result.insertId;
};

export const updateAttendance = async (id, att) => {
  const {
    department,
    month,
    month_start_date,
    month_end_date,
    total_working_days,
    present_days,
    absent_days,
    leave_days,
    total_accounted_days,
    attendance_rate,
    absenteeism_rate,
  } = att;

  const [result] = await pool.query(
    `UPDATE attendance_summary SET 
     department = ?, month = ?, month_start_date = ?, month_end_date = ?,
     total_working_days = ?, present_days = ?, absent_days = ?, leave_days = ?,
     total_accounted_days = ?, attendance_rate = ?, absenteeism_rate = ?
     WHERE id = ?`,
    [
      department,
      month,
      month_start_date,
      month_end_date,
      total_working_days,
      present_days,
      absent_days,
      leave_days,
      total_accounted_days,
      attendance_rate,
      absenteeism_rate,
      id,
    ],
  );
  return result.affectedRows;
};

export const deleteAttendance = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM attendance_summary WHERE id = ?",
    [id],
  );
  return result.affectedRows;
};

export const bulkInsertAttendance = async (records) => {
  const values = records.map((r) => [
    r.employeeName,
    r.employee_ID,
    r.department,
    r.month,
    r.month_start_date,
    r.month_end_date,
    r.total_working_days,
    r.present_days,
    r.absent_days,
    r.leave_days,
    r.total_accounted_days,
    r.attendance_rate,
    r.absenteeism_rate,
  ]);

  const [result] = await pool.query(
    `INSERT INTO attendance_summary (
      employeeName, employee_ID, department, month, month_start_date, month_end_date,
      total_working_days, present_days, absent_days, leave_days,
      total_accounted_days, attendance_rate, absenteeism_rate
    ) VALUES ?`,
    [values],
  );
  return result.affectedRows;
};
