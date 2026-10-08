import pool from "../../config/db.js";

// Get all annual summary records
export const getAllAnnualSummary = async () => {
  const [rows] = await pool.query("SELECT * FROM employee_annual_summary");
  return rows;
};

// Get annual summary for one employee
export const getAnnualSummaryByEmployeeId = async (employee_ID) => {
  const [rows] = await pool.query(
    "SELECT * FROM employee_annual_summary WHERE employee_ID = ?",
    [employee_ID],
  );
  return rows;
};

// Bulk insert (used by Excel import)
export const bulkInsertAnnualSummary = async (records) => {
  const values = records.map((r) => [
    r.employeeName,
    r.employee_ID,
    r.department,
    r.current_Status,
    r.total_working_days_year,
    r.total_present_days_year,
    r.total_absent_days_year,
    r.total_leave_days_year,
    r.attendance_rate,
    r.absenteeism_rate,
    r.total_leave_entitlement,
    r.leave_utilization,
    r.appraisal_rating,
    r.goal_attainment,
    r.total_training_hours,
    r.training_completion,
    r.avg_pre_training_score,
    r.avg_post_training_score,
    r.training_improvement,
    r.exit_status,
    r.exit_reason,
  ]);

  const [result] = await pool.query(
    `INSERT INTO employee_annual_summary (
      employeeName, employee_ID, department, current_Status,
      total_working_days_year, total_present_days_year, total_absent_days_year, total_leave_days_year,
      attendance_rate, absenteeism_rate, total_leave_entitlement, leave_utilization,
      appraisal_rating, goal_attainment,
      total_training_hours, training_completion, avg_pre_training_score, avg_post_training_score, training_improvement,
      exit_status, exit_reason
    ) VALUES ?`,
    [values],
  );
  return result.affectedRows;
};
