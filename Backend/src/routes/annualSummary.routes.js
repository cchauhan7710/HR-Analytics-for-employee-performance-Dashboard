import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  getAnnualSummaries,
  getEmployeeAnnualSummary,
  importAnnualSummaryFromExcel,
} from "../Controllers/annualSummary.controller.js";

const router = express.Router();

router.get("/", protect, getAnnualSummaries);
router.get("/employee/:employee_ID", protect, getEmployeeAnnualSummary);
router.post(
  "/import",
  protect,
  upload.single("file"),
  importAnnualSummaryFromExcel,
);

export default router;
