import express from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  getEmployeePerformanceReviews,
  createPerformanceReview,
  getEmployeeAttendance,
  createAttendance,
  getEmployeeTasks,
  createTask,
  updateTask,
  getOverviewReport,
  getEmployeeReport,
} from "../Controllers/hrAnalytics.controller.js";

// Router 1: /api/employees
export const employeesRouter = express.Router();
employeesRouter.get("/", getEmployees);
employeesRouter.post("/", createEmployee);
employeesRouter.get("/:employeeId", getEmployeeById);
employeesRouter.patch("/:employeeId", updateEmployee);
employeesRouter.get("/:employeeId/performance-reviews", getEmployeePerformanceReviews);
employeesRouter.get("/:employeeId/attendance", getEmployeeAttendance);
employeesRouter.get("/:employeeId/tasks", getEmployeeTasks);

// Router 2: /api/performance-reviews
export const performanceReviewsRouter = express.Router();
performanceReviewsRouter.post("/", createPerformanceReview);

// Router 3: /api/attendance (monthly attendance)
export const attendanceMonthlyRouter = express.Router();
attendanceMonthlyRouter.post("/", createAttendance);
attendanceMonthlyRouter.get("/:employeeId", getEmployeeAttendance);

// Router 4: /api/tasks
export const tasksRouter = express.Router();
export const taskPatchRouter = express.Router();
tasksRouter.post("/", createTask);
tasksRouter.patch("/:taskId", updateTask);
tasksRouter.get("/employee/:employeeId", getEmployeeTasks);

// Router 5: /api/reports
export const reportsRouter = express.Router();
reportsRouter.get("/overview", getOverviewReport);
reportsRouter.get("/employee/:employeeId", getEmployeeReport);
