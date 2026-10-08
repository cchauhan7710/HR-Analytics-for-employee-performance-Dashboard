import pool from "../../config/db.js";

// ===== 1. Dashboard summary cards =====
export const getDashboardSummary = async () => {
  const [[{ total_employees }]] = await pool.query(
    `SELECT COUNT(*) AS total_employees FROM employee WHERE current_Status = 'Active'`,
  );
  const [[{ total_exits }]] = await pool.query(
    `SELECT COUNT(*) AS total_exits FROM employee_exit`,
  );
  const [[{ avg_ctc }]] = await pool.query(
    `SELECT ROUND(AVG(annual_CTC), 2) AS avg_ctc FROM employee`,
  );
  const [[{ total_departments }]] = await pool.query(
    `SELECT COUNT(DISTINCT department) AS total_departments FROM employee`,
  );

  return { total_employees, total_exits, avg_ctc, total_departments };
};

// ===== 2. Headcount by department =====
export const getHeadcountByDepartment = async () => {
  const [rows] = await pool.query(`
    SELECT department, COUNT(*) AS headcount
    FROM employee
    WHERE current_Status = 'Active'
    GROUP BY department
  `);
  return rows;
};

// ===== 3. Gender distribution =====
export const getGenderDistribution = async () => {
  const [rows] = await pool.query(`
    SELECT gender, COUNT(*) AS count
    FROM employee
    GROUP BY gender
  `);
  return rows;
};

// ===== 4. Grade distribution =====
export const getGradeDistribution = async () => {
  const [rows] = await pool.query(`
    SELECT grade, COUNT(*) AS count
    FROM employee
    GROUP BY grade
    ORDER BY grade
  `);
  return rows;
};

// ===== 5. Average CTC by department =====
export const getAvgCtcByDepartment = async () => {
  const [rows] = await pool.query(`
    SELECT department, ROUND(AVG(annual_CTC), 2) AS avg_ctc
    FROM employee
    GROUP BY department
  `);
  return rows;
};

// ===== 6. Turnover rate (overall) =====
export const getTurnoverRate = async () => {
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM employee`,
  );
  const [[{ exited }]] = await pool.query(
    `SELECT COUNT(*) AS exited FROM employee_exit`,
  );
  const turnover_rate = total > 0 ? ((exited / total) * 100).toFixed(2) : 0;
  return { total_employees: total, exited_employees: exited, turnover_rate };
};

// ===== 7. Turnover by department =====
export const getTurnoverByDepartment = async () => {
  const [rows] = await pool.query(`
    SELECT 
      e.department,
      COUNT(ex.id) AS exits,
      (SELECT COUNT(*) FROM employee e2 WHERE e2.department = e.department) AS dept_total,
      ROUND(
        COUNT(ex.id) / (SELECT COUNT(*) FROM employee e2 WHERE e2.department = e.department) * 100, 2
      ) AS turnover_percent
    FROM employee_exit ex
    JOIN employee e ON ex.employee_ID = e.employee_ID
    GROUP BY e.department
  `);
  return rows;
};

// ===== 8. Exit reasons breakdown =====
export const getExitReasonBreakdown = async () => {
  const [rows] = await pool.query(`
    SELECT exit_reason, COUNT(*) AS count
    FROM employee_exit
    GROUP BY exit_reason
  `);
  return rows;
};

// ===== 9. Absenteeism rate (avg, from attendance_summary) =====
export const getAbsenteeismRate = async () => {
  const [rows] = await pool.query(`
    SELECT department, ROUND(AVG(absenteeism_rate), 2) AS avg_absenteeism_rate
    FROM attendance_summary
    GROUP BY department
  `);
  return rows;
};

// ===== 10. Attendance rate trend by month =====
export const getAttendanceTrendByMonth = async () => {
  const [rows] = await pool.query(`
    SELECT month, ROUND(AVG(attendance_rate), 2) AS avg_attendance_rate
    FROM attendance_summary
    GROUP BY month
  `);
  return rows;
};

// ===== 11. Performance rating distribution =====
export const getPerformanceDistribution = async () => {
  const [rows] = await pool.query(`
    SELECT performance_category, COUNT(*) AS count
    FROM employee_performance
    GROUP BY performance_category
  `);
  return rows;
};

// ===== 12. Average performance score by department =====
export const getAvgPerformanceByDepartment = async () => {
  const [rows] = await pool.query(`
    SELECT department, ROUND(AVG(appraisal_rating), 2) AS avg_rating, ROUND(AVG(goal_attainment), 2) AS avg_goal_attainment
    FROM employee_performance
    GROUP BY department
  `);
  return rows;
};

// ===== 13. Training stats (overall) =====
export const getTrainingStats = async () => {
  const [[stats]] = await pool.query(`
    SELECT 
      ROUND(AVG(training_hours), 2) AS avg_training_hours,
      COUNT(CASE WHEN completion_status = 'Completed' THEN 1 END) AS completed_count,
      COUNT(*) AS total_trainings,
      ROUND(COUNT(CASE WHEN completion_status = 'Completed' THEN 1 END) / COUNT(*) * 100, 2) AS completion_rate_percent,
      ROUND(AVG(score_improvement), 2) AS avg_score_improvement
    FROM employee_training
  `);
  return stats;
};

// ===== 14. Leave utilization (from employee_leave) =====
export const getLeaveUtilization = async () => {
  const [rows] = await pool.query(`
    SELECT 
      leave_Type, 
      SUM(total_leave_days) AS total_days_taken,
      COUNT(*) AS record_count
    FROM employee_leave
    GROUP BY leave_Type
  `);
  return rows;
};

// ===== 15. New joiners (this year) =====
export const getNewJoinersThisYear = async () => {
  const [[{ count }]] = await pool.query(`
    SELECT COUNT(*) AS count FROM employee WHERE YEAR(date_of_Joining) = YEAR(CURDATE())
  `);
  return { new_joiners_this_year: count };
};
