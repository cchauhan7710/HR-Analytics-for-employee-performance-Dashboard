import express from "express";
import { protect } from "../middlewares/auth.middleware.js";

import {
  getDashboardSummary,
  getHeadcountByDepartment,
  getGenderDistribution,
  getGradeDistribution,
  getAvgCtcByDepartment,
  getTurnoverRate,
  getTurnoverByDepartment,
  getExitReasonBreakdown,
  getAbsenteeismRate,
  getAttendanceTrendByMonth,
  getPerformanceDistribution,
  getAvgPerformanceByDepartment,
  getTrainingStats,
  getLeaveUtilization,
  getNewJoinersThisYear,
} from "../models/kpi.model.js";

const router = express.Router();

router.get("/summary", protect, getDashboardSummary);

router.get("/headcount", protect, getHeadcountByDepartment);

router.get("/gender", protect, getGenderDistribution);

router.get("/grade", protect, getGradeDistribution);

router.get("/avg-ctc", protect, getAvgCtcByDepartment);

router.get("/turnover", protect, getTurnoverRate);

router.get("/turnover-by-department", protect, getTurnoverByDepartment);

router.get("/exit-reasons", protect, getExitReasonBreakdown);

router.get("/absenteeism", protect, getAbsenteeismRate);

router.get("/attendance-trend", protect, getAttendanceTrendByMonth);

router.get("/performance-distribution", protect, getPerformanceDistribution);

router.get(
  "/performance-by-department",
  protect,
  getAvgPerformanceByDepartment,
);

router.get("/training-stats", protect, getTrainingStats);

router.get("/leave-utilization", protect, getLeaveUtilization);

router.get("/new-joiners", protect, getNewJoinersThisYear);

export default router;
