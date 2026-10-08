import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./src/routes/user.routes.js";
import employeeRoutes from "./src/routes/employee.routes.js";
import leaveRoute from "./src/routes/leave.routes.js";
import attendanceRoutes from "./src/routes/attendance.routes.js";
import annualSummaryRoutes from "./src/routes/annualSummary.routes.js";
import performanceRoutes from "./src/routes/performance.routes.js";
import trainingRoutes from "./src/routes/training.routes.js";
import exitRoutes from "./src/routes/exit.router.js";
import kpiRoutes from "./src/routes/kpi.routes.js";
import {
  employeesRouter,
  performanceReviewsRouter,
  attendanceMonthlyRouter,
  tasksRouter,
  reportsRouter,
} from "./src/routes/hrAnalytics.routes.js";

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// HR Analytics Core Specification Routes
app.use("/api/employees", employeesRouter);
app.use("/api/performance-reviews", performanceReviewsRouter);
app.use("/api/attendance", attendanceMonthlyRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/reports", reportsRouter);

// Existing Legacy & Auth Routes
app.use("/api/auth", userRoute);
app.use("/api/employees", employeeRoutes);
app.use("/api/leave", leaveRoute);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/annual-summary", annualSummaryRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/exits", exitRoutes);
app.use("/api/kpi", kpiRoutes);

export default app;
