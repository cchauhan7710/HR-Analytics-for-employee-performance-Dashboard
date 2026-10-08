import pool from "../../config/db.js";

// ============================================================================
// 1. EMPLOYEES CONTROLLERS
// ============================================================================

/**
 * GET /api/employees
 * List / search employees with optional department filter and pagination.
 */
export const getEmployees = async (req, res) => {
  try {
    const { search = "", department = "", status = "", page, limit } = req.query;

    let query = "SELECT * FROM employees WHERE 1=1";
    const params = [];

    if (search.trim()) {
      query += " AND (employee_id LIKE ? OR job_title LIKE ? OR department LIKE ?)";
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (department && department !== "All") {
      query += " AND department = ?";
      params.push(department);
    }

    if (status && status !== "All") {
      query += " AND employment_status = ?";
      params.push(status);
    }

    query += " ORDER BY employee_id ASC";

    // Optional pagination
    if (page && limit) {
      const p = Math.max(1, parseInt(page, 10));
      const l = Math.max(1, parseInt(limit, 10));
      const offset = (p - 1) * l;
      query += " LIMIT ? OFFSET ?";
      params.push(l, offset);
    }

    const [rows] = await pool.query(query, params);

    // Also get unique departments for quick filter population
    const [deptRows] = await pool.query(
      "SELECT DISTINCT department FROM employees ORDER BY department ASC"
    );

    return res.status(200).json({
      success: true,
      count: rows.length,
      departments: deptRows.map((d) => d.department),
      employees: rows,
    });
  } catch (error) {
    console.error("getEmployees error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

/**
 * GET /api/employees/:employeeId
 * Get single employee profile with aggregate performance & task stats.
 */
export const getEmployeeById = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const [empRows] = await pool.query(
      "SELECT * FROM employees WHERE employee_id = ?",
      [employeeId]
    );

    if (empRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID '${employeeId}' not found.`,
      });
    }

    const employee = empRows[0];

    // Aggregate stats
    const [[reviewSummary]] = await pool.query(
      `SELECT 
        COUNT(*) AS total_reviews,
        ROUND(AVG(rating_out_of_5), 2) AS avg_rating,
        ROUND(AVG(goals_completed_percent), 1) AS avg_goals_completed
       FROM performance_reviews WHERE employee_id = ?`,
      [employeeId]
    );

    const [[attendanceSummary]] = await pool.query(
      `SELECT 
        ROUND(AVG(attendance_rate_percent), 1) AS avg_attendance_rate,
        ROUND(AVG(absenteeism_rate_percent), 1) AS avg_absenteeism_rate,
        SUM(working_days) AS total_working_days,
        SUM(present_days) AS total_present_days,
        SUM(leave_days) AS total_leave_days
       FROM attendance_monthly WHERE employee_id = ?`,
      [employeeId]
    );

    const [[taskSummary]] = await pool.query(
      `SELECT 
        COUNT(*) AS total_tasks,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress_tasks,
        SUM(CASE WHEN status = 'Completed' AND completed_date <= due_date THEN 1 ELSE 0 END) AS on_time_tasks,
        ROUND(AVG(CASE WHEN status = 'Completed' AND completed_date IS NOT NULL THEN DATEDIFF(completed_date, assigned_date) ELSE NULL END), 1) AS avg_completion_days
       FROM tasks WHERE employee_id = ?`,
      [employeeId]
    );

    const onTimeRate =
      taskSummary.completed_tasks > 0
        ? Math.round(
            (taskSummary.on_time_tasks / taskSummary.completed_tasks) * 1000
          ) / 10
        : 0;

    return res.status(200).json({
      success: true,
      employee,
      stats: {
        total_reviews: reviewSummary.total_reviews || 0,
        avg_rating: reviewSummary.avg_rating !== null ? parseFloat(reviewSummary.avg_rating) : null,
        avg_goals_completed: reviewSummary.avg_goals_completed !== null ? parseFloat(reviewSummary.avg_goals_completed) : null,
        avg_attendance_rate: attendanceSummary.avg_attendance_rate !== null ? parseFloat(attendanceSummary.avg_attendance_rate) : null,
        avg_absenteeism_rate: attendanceSummary.avg_absenteeism_rate !== null ? parseFloat(attendanceSummary.avg_absenteeism_rate) : null,
        total_tasks: taskSummary.total_tasks || 0,
        completed_tasks: taskSummary.completed_tasks || 0,
        in_progress_tasks: taskSummary.in_progress_tasks || 0,
        on_time_completion_rate: onTimeRate,
        avg_completion_days: taskSummary.avg_completion_days !== null ? parseFloat(taskSummary.avg_completion_days) : null,
      },
    });
  } catch (error) {
    console.error("getEmployeeById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve employee profile",
      error: error.message,
    });
  }
};

/**
 * POST /api/employees
 * Add a new employee with backend validation.
 */
export const createEmployee = async (req, res) => {
  try {
    const { employee_id, department, job_title, date_joined, employment_status = "Active" } = req.body;

    if (!employee_id || !employee_id.trim()) {
      return res.status(400).json({ success: false, message: "Employee ID is required." });
    }
    if (!department || !department.trim()) {
      return res.status(400).json({ success: false, message: "Department is required." });
    }
    if (!job_title || !job_title.trim()) {
      return res.status(400).json({ success: false, message: "Job title is required." });
    }
    if (!date_joined) {
      return res.status(400).json({ success: false, message: "Date joined is required." });
    }

    // Check duplicate
    const [existing] = await pool.query(
      "SELECT employee_id FROM employees WHERE employee_id = ?",
      [employee_id.trim().toUpperCase()]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Employee with ID '${employee_id.trim().toUpperCase()}' already exists.`,
      });
    }

    const cleanId = employee_id.trim().toUpperCase();
    await pool.query(
      `INSERT INTO employees (employee_id, department, job_title, date_joined, employment_status)
       VALUES (?, ?, ?, ?, ?)`,
      [cleanId, department.trim(), job_title.trim(), date_joined, employment_status.trim()]
    );

    return res.status(201).json({
      success: true,
      message: `Employee ${cleanId} added successfully.`,
      employee: {
        employee_id: cleanId,
        department: department.trim(),
        job_title: job_title.trim(),
        date_joined,
        employment_status: employment_status.trim(),
      },
    });
  } catch (error) {
    console.error("createEmployee error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create employee",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/employees/:employeeId
 * Update employee details.
 */
export const updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { department, job_title, date_joined, employment_status } = req.body;

    const [existing] = await pool.query(
      "SELECT * FROM employees WHERE employee_id = ?",
      [employeeId]
    );
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Employee '${employeeId}' not found.`,
      });
    }

    const current = existing[0];
    const updatedDept = department !== undefined ? department.trim() : current.department;
    const updatedTitle = job_title !== undefined ? job_title.trim() : current.job_title;
    const updatedDate = date_joined !== undefined ? date_joined : current.date_joined;
    const updatedStatus = employment_status !== undefined ? employment_status.trim() : current.employment_status;

    await pool.query(
      `UPDATE employees 
       SET department = ?, job_title = ?, date_joined = ?, employment_status = ?
       WHERE employee_id = ?`,
      [updatedDept, updatedTitle, updatedDate, updatedStatus, employeeId]
    );

    return res.status(200).json({
      success: true,
      message: `Employee '${employeeId}' updated successfully.`,
      employee: {
        employee_id: employeeId,
        department: updatedDept,
        job_title: updatedTitle,
        date_joined: updatedDate,
        employment_status: updatedStatus,
      },
    });
  } catch (error) {
    console.error("updateEmployee error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update employee",
      error: error.message,
    });
  }
};

// ============================================================================
// 2. PERFORMANCE REVIEWS CONTROLLERS
// ============================================================================

/**
 * GET /api/employees/:employeeId/performance-reviews
 * Retrieve dated review history for an individual employee.
 */
export const getEmployeePerformanceReviews = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const [reviews] = await pool.query(
      `SELECT review_id, employee_id, DATE_FORMAT(review_date, '%Y-%m-%d') AS review_date,
              review_period, rating_out_of_5, goals_completed_percent, review_summary, created_at
       FROM performance_reviews
       WHERE employee_id = ?
       ORDER BY review_date ASC`,
      [employeeId]
    );

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("getEmployeePerformanceReviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve performance reviews",
      error: error.message,
    });
  }
};

/**
 * POST /api/performance-reviews
 * Add a new performance review record with validation.
 */
export const createPerformanceReview = async (req, res) => {
  try {
    const {
      employee_id,
      review_date,
      review_period,
      rating_out_of_5,
      goals_completed_percent,
      review_summary = "",
    } = req.body;

    if (!employee_id) {
      return res.status(400).json({ success: false, message: "Employee ID is required." });
    }
    if (!review_date) {
      return res.status(400).json({ success: false, message: "Review date is required." });
    }
    if (!review_period || !review_period.trim()) {
      return res.status(400).json({ success: false, message: "Review period (e.g. 2025-H1) is required." });
    }

    const rating = parseFloat(rating_out_of_5);
    if (isNaN(rating) || rating < 1.0 || rating > 5.0) {
      return res.status(400).json({
        success: false,
        message: "Rating out of 5 must be a valid number between 1.0 and 5.0.",
      });
    }

    const goals = parseFloat(goals_completed_percent);
    if (isNaN(goals) || goals < 0 || goals > 100) {
      return res.status(400).json({
        success: false,
        message: "Goals completed percent must be a valid number between 0% and 100%.",
      });
    }

    // Verify employee exists
    const [emp] = await pool.query("SELECT employee_id FROM employees WHERE employee_id = ?", [
      employee_id,
    ]);
    if (emp.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Employee '${employee_id}' not found. Cannot add review.`,
      });
    }

    const [result] = await pool.query(
      `INSERT INTO performance_reviews 
        (employee_id, review_date, review_period, rating_out_of_5, goals_completed_percent, review_summary)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [employee_id, review_date, review_period.trim(), rating, goals, review_summary]
    );

    return res.status(201).json({
      success: true,
      message: "Performance review added successfully.",
      reviewId: result.insertId,
      review: {
        review_id: result.insertId,
        employee_id,
        review_date,
        review_period: review_period.trim(),
        rating_out_of_5: rating,
        goals_completed_percent: goals,
        review_summary,
      },
    });
  } catch (error) {
    console.error("createPerformanceReview error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add performance review",
      error: error.message,
    });
  }
};

// ============================================================================
// 3. ATTENDANCE MONTHLY CONTROLLERS
// ============================================================================

/**
 * GET /api/employees/:employeeId/attendance
 * Retrieve monthly attendance history for an employee.
 */
export const getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const [records] = await pool.query(
      `SELECT attendance_id, employee_id, month, working_days, present_days,
              absent_days, leave_days, attendance_rate_percent, absenteeism_rate_percent, created_at
       FROM attendance_monthly
       WHERE employee_id = ?
       ORDER BY month ASC`,
      [employeeId]
    );

    return res.status(200).json({
      success: true,
      count: records.length,
      attendance: records,
    });
  } catch (error) {
    console.error("getEmployeeAttendance error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve attendance history",
      error: error.message,
    });
  }
};

/**
 * POST /api/attendance
 * Add a monthly attendance record with validation.
 */
export const createAttendance = async (req, res) => {
  try {
    const {
      employee_id,
      month,
      working_days,
      present_days,
      absent_days,
      leave_days,
    } = req.body;

    if (!employee_id) {
      return res.status(400).json({ success: false, message: "Employee ID is required." });
    }
    if (!month || !/^\d{4}-\d{2}$/.test(month.trim())) {
      return res.status(400).json({
        success: false,
        message: "Month is required and must follow YYYY-MM format (e.g. 2025-06).",
      });
    }

    const wDays = parseInt(working_days, 10);
    const pDays = parseInt(present_days, 10);
    const aDays = parseInt(absent_days, 10);
    const lDays = parseInt(leave_days, 10);

    if (isNaN(wDays) || wDays <= 0) {
      return res.status(400).json({ success: false, message: "Working days must be greater than 0." });
    }
    if (isNaN(pDays) || pDays < 0 || pDays > wDays) {
      return res.status(400).json({
        success: false,
        message: "Present days must be between 0 and working days.",
      });
    }
    if (isNaN(aDays) || aDays < 0) {
      return res.status(400).json({ success: false, message: "Absent days must be >= 0." });
    }
    if (isNaN(lDays) || lDays < 0) {
      return res.status(400).json({ success: false, message: "Leave days must be >= 0." });
    }

    // Verify employee
    const [emp] = await pool.query("SELECT employee_id FROM employees WHERE employee_id = ?", [
      employee_id,
    ]);
    if (emp.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Employee '${employee_id}' not found. Cannot add attendance record.`,
      });
    }

    // Calculate rates: Attendance Rate = (present_days / working_days) * 100
    // Absenteeism Rate = (absent_days / working_days) * 100
    const attendanceRate = Math.round((pDays / wDays) * 1000) / 10;
    const absenteeismRate = Math.round((aDays / wDays) * 1000) / 10;

    const [result] = await pool.query(
      `INSERT INTO attendance_monthly 
        (employee_id, month, working_days, present_days, absent_days, leave_days, attendance_rate_percent, absenteeism_rate_percent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [employee_id, month.trim(), wDays, pDays, aDays, lDays, attendanceRate, absenteeismRate]
    );

    return res.status(201).json({
      success: true,
      message: `Monthly attendance for ${month.trim()} added successfully.`,
      attendanceId: result.insertId,
      attendance: {
        attendance_id: result.insertId,
        employee_id,
        month: month.trim(),
        working_days: wDays,
        present_days: pDays,
        absent_days: aDays,
        leave_days: lDays,
        attendance_rate_percent: attendanceRate,
        absenteeism_rate_percent: absenteeismRate,
      },
    });
  } catch (error) {
    console.error("createAttendance error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add attendance record",
      error: error.message,
    });
  }
};

// ============================================================================
// 4. TASKS CONTROLLERS
// ============================================================================

/**
 * GET /api/employees/:employeeId/tasks
 * Retrieve task history for an employee.
 */
export const getEmployeeTasks = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const [tasks] = await pool.query(
      `SELECT task_id, employee_id,
              DATE_FORMAT(assigned_date, '%Y-%m-%d') AS assigned_date,
              DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date,
              DATE_FORMAT(completed_date, '%Y-%m-%d') AS completed_date,
              status, priority, created_at,
              CASE 
                WHEN completed_date IS NOT NULL THEN DATEDIFF(completed_date, assigned_date)
                ELSE NULL 
              END AS completion_duration_days,
              CASE
                WHEN status = 'Completed' AND completed_date <= due_date THEN 1
                WHEN status = 'Completed' AND completed_date > due_date THEN 0
                ELSE NULL
              END AS is_on_time
       FROM tasks
       WHERE employee_id = ?
       ORDER BY assigned_date DESC`,
      [employeeId]
    );

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("getEmployeeTasks error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve employee tasks",
      error: error.message,
    });
  }
};

/**
 * POST /api/tasks
 * Add a new task record with validation.
 */
export const createTask = async (req, res) => {
  try {
    const {
      task_id,
      employee_id,
      assigned_date,
      due_date,
      completed_date = null,
      status = "In Progress",
      priority = "Medium",
    } = req.body;

    if (!employee_id) {
      return res.status(400).json({ success: false, message: "Employee ID is required." });
    }
    if (!assigned_date) {
      return res.status(400).json({ success: false, message: "Assigned date is required." });
    }
    if (!due_date) {
      return res.status(400).json({ success: false, message: "Due date is required." });
    }

    // Verify employee
    const [emp] = await pool.query("SELECT employee_id FROM employees WHERE employee_id = ?", [
      employee_id,
    ]);
    if (emp.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Employee '${employee_id}' not found. Cannot assign task.`,
      });
    }

    // Generate task ID if not provided
    const cleanTaskId =
      task_id && task_id.trim()
        ? task_id.trim()
        : `TSK-${employee_id.replace(/^EMP/, "")}-${Date.now().toString().slice(-4)}`;

    const cleanCompletedDate = completed_date && completed_date.trim() ? completed_date : null;

    await pool.query(
      `INSERT INTO tasks (task_id, employee_id, assigned_date, due_date, completed_date, status, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [cleanTaskId, employee_id, assigned_date, due_date, cleanCompletedDate, status, priority]
    );

    return res.status(201).json({
      success: true,
      message: `Task ${cleanTaskId} created successfully.`,
      task: {
        task_id: cleanTaskId,
        employee_id,
        assigned_date,
        due_date,
        completed_date: cleanCompletedDate,
        status,
        priority,
      },
    });
  } catch (error) {
    console.error("createTask error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/tasks/:taskId
 * Update task status, completed date, or priority.
 */
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, completed_date, priority } = req.body;

    const [existing] = await pool.query("SELECT * FROM tasks WHERE task_id = ?", [taskId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Task with ID '${taskId}' not found.`,
      });
    }

    const current = existing[0];
    let newStatus = status !== undefined ? status : current.status;
    let newCompletedDate =
      completed_date !== undefined ? completed_date : current.completed_date;
    let newPriority = priority !== undefined ? priority : current.priority;

    // If marked Completed and no completed_date specified, set to current date
    if (newStatus === "Completed" && !newCompletedDate) {
      newCompletedDate = new Date().toISOString().split("T")[0];
    } else if (newStatus !== "Completed" && completed_date === null) {
      newCompletedDate = null;
    }

    await pool.query(
      `UPDATE tasks 
       SET status = ?, completed_date = ?, priority = ?
       WHERE task_id = ?`,
      [newStatus, newCompletedDate, newPriority, taskId]
    );

    return res.status(200).json({
      success: true,
      message: `Task '${taskId}' updated successfully.`,
      task: {
        task_id: taskId,
        employee_id: current.employee_id,
        status: newStatus,
        completed_date: newCompletedDate,
        priority: newPriority,
      },
    });
  } catch (error) {
    console.error("updateTask error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

// ============================================================================
// 5. REPORTS AND DASHBOARD OVERVIEW CONTROLLERS
// ============================================================================

/**
 * GET /api/reports/overview
 * Organization-wide summary metrics, trends, and department breakdowns.
 */
export const getOverviewReport = async (req, res) => {
  try {
    const { department = "All", period = "All" } = req.query;

    let empWhere = "";
    let reviewWhere = "";
    let attWhere = "";
    let taskWhere = "";
    const empParams = [];
    const reviewParams = [];
    const attParams = [];
    const taskParams = [];

    if (department && department !== "All") {
      empWhere += " WHERE department = ?";
      empParams.push(department);

      reviewWhere += " WHERE employee_id IN (SELECT employee_id FROM employees WHERE department = ?)";
      reviewParams.push(department);

      attWhere += " WHERE employee_id IN (SELECT employee_id FROM employees WHERE department = ?)";
      attParams.push(department);

      taskWhere += " WHERE employee_id IN (SELECT employee_id FROM employees WHERE department = ?)";
      taskParams.push(department);
    }

    // 1. Core KPIs
    const [[empKpi]] = await pool.query(
      `SELECT 
        COUNT(*) AS total_employees,
        SUM(CASE WHEN employment_status = 'Active' THEN 1 ELSE 0 END) AS active_employees
       FROM employees ${empWhere}`,
      empParams
    );

    const [[reviewKpi]] = await pool.query(
      `SELECT 
        ROUND(AVG(rating_out_of_5), 2) AS avg_review_rating,
        ROUND(AVG(goals_completed_percent), 1) AS avg_goals_completed,
        COUNT(*) AS total_reviews
       FROM performance_reviews ${reviewWhere}`,
      reviewParams
    );

    const [[attKpi]] = await pool.query(
      `SELECT 
        ROUND(AVG(attendance_rate_percent), 1) AS avg_attendance_rate,
        ROUND(AVG(absenteeism_rate_percent), 1) AS avg_absenteeism_rate,
        SUM(working_days) AS total_working_days,
        SUM(present_days) AS total_present_days,
        SUM(leave_days) AS total_leave_days
       FROM attendance_monthly ${attWhere}`,
      attParams
    );

    const [[taskKpi]] = await pool.query(
      `SELECT 
        COUNT(*) AS total_tasks,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks,
        SUM(CASE WHEN status = 'Completed' AND completed_date <= due_date THEN 1 ELSE 0 END) AS on_time_tasks,
        ROUND(AVG(CASE WHEN status = 'Completed' AND completed_date IS NOT NULL THEN DATEDIFF(completed_date, assigned_date) ELSE NULL END), 1) AS avg_completion_days
       FROM tasks ${taskWhere}`,
      taskParams
    );

    const onTimeRate =
      taskKpi.completed_tasks > 0
        ? Math.round((taskKpi.on_time_tasks / taskKpi.completed_tasks) * 1000) / 10
        : 0;

    // 2. Trend: Reviews by Period (e.g. 2023-H1 to 2025-H2)
    const [reviewTrends] = await pool.query(
      `SELECT 
        review_period,
        ROUND(AVG(rating_out_of_5), 2) AS avg_rating,
        ROUND(AVG(goals_completed_percent), 1) AS avg_goals_completed,
        COUNT(*) AS review_count
       FROM performance_reviews ${reviewWhere}
       GROUP BY review_period
       ORDER BY review_period ASC`,
      reviewParams
    );

    // 3. Trend: Monthly Attendance across calendar year (2025-01 to 2025-12)
    const [attendanceTrends] = await pool.query(
      `SELECT 
        month,
        ROUND(AVG(attendance_rate_percent), 1) AS avg_attendance_rate,
        ROUND(AVG(absenteeism_rate_percent), 1) AS avg_absenteeism_rate,
        COUNT(DISTINCT employee_id) AS employees_reported
       FROM attendance_monthly ${attWhere}
       GROUP BY month
       ORDER BY month ASC`,
      attParams
    );

    // 4. Department Comparison Breakdown
    const [deptBreakdown] = await pool.query(
      `SELECT 
        e.department,
        COUNT(DISTINCT e.employee_id) AS employee_count,
        ROUND(AVG(pr.rating_out_of_5), 2) AS avg_rating,
        ROUND(AVG(pr.goals_completed_percent), 1) AS avg_goals_completed,
        ROUND(AVG(am.attendance_rate_percent), 1) AS avg_attendance_rate,
        COUNT(DISTINCT t.task_id) AS total_tasks,
        ROUND(
          (SUM(CASE WHEN t.status = 'Completed' AND t.completed_date <= t.due_date THEN 1 ELSE 0 END) / 
           NULLIF(SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END), 0)) * 100, 1
        ) AS on_time_rate
       FROM employees e
       LEFT JOIN performance_reviews pr ON e.employee_id = pr.employee_id
       LEFT JOIN attendance_monthly am ON e.employee_id = am.employee_id
       LEFT JOIN tasks t ON e.employee_id = t.employee_id
       GROUP BY e.department
       ORDER BY e.department ASC`
    );

    // 5. Task Status & Priority Distribution
    const [taskStatusDistribution] = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM tasks ${taskWhere}
       GROUP BY status`,
      taskParams
    );

    const [taskPriorityDistribution] = await pool.query(
      `SELECT priority, COUNT(*) AS count
       FROM tasks ${taskWhere}
       GROUP BY priority`,
      taskParams
    );

    // 6. Departments list
    const [deptList] = await pool.query(
      "SELECT DISTINCT department FROM employees ORDER BY department ASC"
    );

    return res.status(200).json({
      success: true,
      kpis: {
        total_employees: empKpi.total_employees || 0,
        active_employees: empKpi.active_employees || 0,
        avg_review_rating: reviewKpi.avg_review_rating !== null ? parseFloat(reviewKpi.avg_review_rating) : null,
        avg_goals_completed: reviewKpi.avg_goals_completed !== null ? parseFloat(reviewKpi.avg_goals_completed) : null,
        total_reviews: reviewKpi.total_reviews || 0,
        avg_attendance_rate: attKpi.avg_attendance_rate !== null ? parseFloat(attKpi.avg_attendance_rate) : null,
        avg_absenteeism_rate: attKpi.avg_absenteeism_rate !== null ? parseFloat(attKpi.avg_absenteeism_rate) : null,
        total_tasks: taskKpi.total_tasks || 0,
        completed_tasks: taskKpi.completed_tasks || 0,
        on_time_completion_rate: onTimeRate,
        avg_completion_days: taskKpi.avg_completion_days !== null ? parseFloat(taskKpi.avg_completion_days) : null,
      },
      reviewTrends,
      attendanceTrends,
      deptBreakdown,
      taskStatusDistribution,
      taskPriorityDistribution,
      departments: deptList.map((d) => d.department),
    });
  } catch (error) {
    console.error("getOverviewReport error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate overview report",
      error: error.message,
    });
  }
};

/**
 * GET /api/reports/employee/:employeeId
 * Comprehensive individual performance report data.
 */
export const getEmployeeReport = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // 1. Employee profile
    const [empRows] = await pool.query("SELECT * FROM employees WHERE employee_id = ?", [
      employeeId,
    ]);
    if (empRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Employee '${employeeId}' not found.`,
      });
    }
    const employee = empRows[0];

    // 2. Performance reviews history
    const [reviews] = await pool.query(
      `SELECT review_id, employee_id, DATE_FORMAT(review_date, '%Y-%m-%d') AS review_date,
              review_period, rating_out_of_5, goals_completed_percent, review_summary
       FROM performance_reviews
       WHERE employee_id = ?
       ORDER BY review_date ASC`,
      [employeeId]
    );

    // 3. Attendance monthly history
    const [attendance] = await pool.query(
      `SELECT attendance_id, employee_id, month, working_days, present_days,
              absent_days, leave_days, attendance_rate_percent, absenteeism_rate_percent
       FROM attendance_monthly
       WHERE employee_id = ?
       ORDER BY month ASC`,
      [employeeId]
    );

    // 4. Tasks history
    const [tasks] = await pool.query(
      `SELECT task_id, employee_id,
              DATE_FORMAT(assigned_date, '%Y-%m-%d') AS assigned_date,
              DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date,
              DATE_FORMAT(completed_date, '%Y-%m-%d') AS completed_date,
              status, priority,
              CASE 
                WHEN completed_date IS NOT NULL THEN DATEDIFF(completed_date, assigned_date)
                ELSE NULL 
              END AS completion_duration_days,
              CASE
                WHEN status = 'Completed' AND completed_date <= due_date THEN 1
                WHEN status = 'Completed' AND completed_date > due_date THEN 0
                ELSE NULL
              END AS is_on_time
       FROM tasks
       WHERE employee_id = ?
       ORDER BY assigned_date DESC`,
      [employeeId]
    );

    // Summary calculations
    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? Math.round(
            (reviews.reduce((sum, r) => sum + parseFloat(r.rating_out_of_5), 0) / totalReviews) *
              100
          ) / 100
        : null;

    const avgGoals =
      totalReviews > 0
        ? Math.round(
            (reviews.reduce((sum, r) => sum + parseFloat(r.goals_completed_percent), 0) /
              totalReviews) *
              10
          ) / 10
        : null;

    const totalAttendanceMonths = attendance.length;
    const avgAttendance =
      totalAttendanceMonths > 0
        ? Math.round(
            (attendance.reduce((sum, a) => sum + parseFloat(a.attendance_rate_percent), 0) /
              totalAttendanceMonths) *
              10
          ) / 10
        : null;

    const completedTasks = tasks.filter((t) => t.status === "Completed");
    const onTimeTasks = completedTasks.filter((t) => t.is_on_time === 1);
    const onTimeRate =
      completedTasks.length > 0
        ? Math.round((onTimeTasks.length / completedTasks.length) * 1000) / 10
        : 0;

    const durations = completedTasks
      .map((t) => t.completion_duration_days)
      .filter((d) => d !== null);
    const avgTaskDays =
      durations.length > 0
        ? Math.round((durations.reduce((sum, d) => sum + d, 0) / durations.length) * 10) / 10
        : null;

    return res.status(200).json({
      success: true,
      employee,
      summary: {
        totalReviews,
        avgRating,
        avgGoals,
        avgAttendance,
        totalTasks: tasks.length,
        completedTasksCount: completedTasks.length,
        onTimeRate,
        avgTaskDays,
      },
      reviews,
      attendance,
      tasks,
    });
  } catch (error) {
    console.error("getEmployeeReport error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate individual employee report",
      error: error.message,
    });
  }
};
