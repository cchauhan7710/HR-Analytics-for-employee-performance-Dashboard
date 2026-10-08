import pool from "../../config/db.js";

export const getAllEmployee = async () => {
  const [empData] = await pool.query("SELECT * FROM employee");

  return empData;
};

export const getEmployeeById = async (id) => {
  const [empData] = await pool.query("SELECT * FROM employee WHERE id = ?", [
    id,
  ]);
  return empData[0];
};

export const createNewEmployee = async (newEmp) => {
  const {
    employeeName,
    employee_ID,
    gender,
    department,
    designation,
    grade,
    date_of_Joining,
    current_Status,
    annual_CTC,
    annual_leave_entitlement,
    sick_leave_entitlement,
  } = newEmp;

  const [newEmpData] = await pool.query(
    `INSERT INTO employee( 
    employeeName,
    employee_ID,
    gender,
    department,
    designation,
    grade,
    date_of_Joining,
    current_Status,
    annual_CTC,
    annual_leave_entitlement,
    sick_leave_entitlement,)VALUE(?,?,?,?,?,?,?,?,?,?)`,
    [
      employee_ID,
      gender,
      department,
      designation,
      grade,
      date_of_Joining,
      current_Status,
      annual_CTC,
      annual_leave_entitlement,
      sick_leave_entitlement,
    ],
  );
  return newEmpData.insertId;
};

export const updateEmployeeDetails = async (id, empData) => {
  const {
    employeeName,
    gender,
    department,
    designation,
    grade,
    current_Status,
    annual_CTC,
    annual_leave_entitlement,
    sick_leave_entitlement,
  } = empData;
  await pool.query(
    `
    UPDATE employee SET 
    employeeName = ?,gender = ? , departemnt = ?, designation = ?, grade = ?,
    cureent_status = ?,annual_CTC = ?, annual_leave_entitlement = ? , sick_leave_entitlement = ?,WHERE id = ? `,
    [
      employeeName,
      gender,
      department,
      designation,
      grade,
      current_Status,
      annual_CTC,
      annual_leave_entitlement,
      sick_leave_entitlement,
      id,
    ],
  );
};

export const deleteEmployeeById = async (id) => {
  const empdata = await pool.query("DELETE FROM employee WHERE id = ?", [id]);
  return empdata;
};

// Bulk insert (used by Excel import)
export const bulkInsertEmployees = async (employees) => {
  const values = employees.map((e) => [
    e.employeeName,
    e.employee_ID,
    e.gender,
    e.department,
    e.designation,
    e.grade,
    e.date_of_Joining,
    e.current_Status,
    e.annual_CTC,
    e.annual_leave_entitlement,
    e.sick_leave_entitlement,
  ]);

  const [result] = await pool.query(
    `INSERT INTO employee 
     (employeeName, employee_ID, gender, department, designation, grade, date_of_Joining, current_Status, annual_CTC, annual_leave_entitlement, sick_leave_entitlement) 
     VALUES ?`,
    [values],
  );
  return result.affectedRows;
};
