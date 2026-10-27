import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import pool from "./config/db.js";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Parse allowed CORS origins from environment variable or defaults
const configuredOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((s) => s.trim())
  : [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      if (
        configuredOrigins.includes(origin) ||
        configuredOrigins.includes("*") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// ── Health Check API Endpoint (Required for Cloud Deployments) ──
app.get("/api/health", async (req, res) => {
  let dbStatus = "connected";
  try {
    const conn = await pool.getConnection();
    conn.release();
  } catch (err) {
    dbStatus = `disconnected (${err.message})`;
  }

  res.status(200).json({
    status: "ok",
    service: "HR Pulse Analytics Backend",
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: process.env.NODE_ENV || "development",
  });
});

// ── HR Analytics Specification API Routes ──
app.use("/api/employees", employeesRouter);
app.use("/api/performance-reviews", performanceReviewsRouter);
app.use("/api/attendance", attendanceMonthlyRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/reports", reportsRouter);

// ── Existing Auth & Auxiliary Routes ──
app.use("/api/auth", userRoute);
app.use("/api/legacy-employees", employeeRoutes);
app.use("/api/leave", leaveRoute);
app.use("/api/legacy-attendance", attendanceRoutes);
app.use("/api/annual-summary", annualSummaryRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/exits", exitRoutes);
app.use("/api/kpi", kpiRoutes);

// ── Production Frontend Static File Serving ──
const frontendDistPath = path.resolve(__dirname, "../Frontend/dist");
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // SPA fallback for Express 5: any non-API GET route returns index.html
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(frontendDistPath, "index.html"));
    }
    next();
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      service: "HR Pulse API Service",
      status: "online",
      endpoints: {
        health: "/api/health",
        overview: "/api/reports/overview",
        employees: "/api/employees",
      },
    });
  });
}

export default app;
