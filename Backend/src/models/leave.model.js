import pool from "../../config/db.js";

export const getAllLeaves = async () => {
  const [rows] = await pool.query("SELECT * FROM  employee_leave");
  return rows;
};

export const getLeavesByEmployeeId = async (employee_ID) => {
  const [rows] = await pool.query(
    "SELECT * FROM  employee_leave WHERE employee_ID = ? ",
    [employee_ID],
  );
  return rows;
};

export const getLeaveById = async (id) => {
  const [rows] = await pool.query(
    "SELECT  * FROM employee_leave WHERE id = ?  ",
    [id],
  );
  return rows[0];
};

export const createLeave = async (leave) => {
  const {
    employeeName,
    employee_ID,
    leave_Type,
    leave_Start_Date,
    leave_end_date,
    total_leave_days,
    entitled_leave_days,
    Year,
    leave_reason,
  } = leave;

  const [newEmpLeaveData] = await pool.query(
    `INSERT INTO employee_leave(
    employeeName,
    employee_ID,
    leave_Type,
    leave_Start_Date,
    leave_end_date,
    total_leave_days,
    entitled_leave_days,
    Year,
    leave_reason) VALUES(?,?,?,?,?,?,?,?,?) `,
    [
      employeeName,
      employee_ID,
      leave_Type,
      leave_Start_Date,
      leave_end_date,
      total_leave_days,
      entitled_leave_days,
      Year,
      leave_reason,
    ],
  );
  return newEmpLeaveData.insertId;
};

export const updateLeave = async (id, leave) => {
  const {
    leave_Type,
    leave_Start_Date,
    leave_end_date,
    total_leave_days,
    entitled_leave_days,
    Year,
    leave_reason,
  } = leave;

  const [result] = await pool.query(
    `UPDATE employee_leave SET 
     leave_Type = ?, leave_Start_Date = ?, leave_end_date = ?, 
     total_leave_days = ?, entitled_leave_days = ?, Year = ?, leave_reason = ?
     WHERE id = ?`,
    [
      leave_Type,
      leave_Start_Date,
      leave_end_date,
      total_leave_days,
      entitled_leave_days,
      Year,
      leave_reason,
      id,
    ],
  );
  return result.affectedRows;
};

export const deleteLeave = async (id) => {
  await pool.query("DELETE FROM employee_leave WHERE id = ?", [id]);
};

export const importBulkemployeeLeave = async (leave) => {
  const values = leave.map((e) => [
    e.employeeName,
    e.employee_ID,
    e.leave_Type,
    e.leave_Start_Date,
    e.leave_end_date,
    e.total_leave_days,
    e.entitled_leave_days,
    e.Year,
    e.leave_reason,
  ]);

  const [result] = await pool.query(
    `INSERT INTO employee_leave 
     (employeeName, employee_ID, leave_Type, leave_Start_Date, leave_end_date, total_leave_days, entitled_leave_days, Year, leave_reason) 
     VALUES ?`,
    [values],
  );
  return result.affectedRows;
};
