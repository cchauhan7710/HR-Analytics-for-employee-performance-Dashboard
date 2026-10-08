import xlsx from "xlsx";
import fs from "fs";
import {
  getAllAnnualSummary,
  getAnnualSummaryByEmployeeId,
  bulkInsertAnnualSummary,
} from "../models/annualSummary.model.js";

export const getAnnualSummaries = async (req, res) => {
  try {
    const data = await getAllAnnualSummary();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeAnnualSummary = async (req, res) => {
  try {
    const data = await getAnnualSummaryByEmployeeId(req.params.employee_ID);
    if (!data.length) {
      return res.status(404).json({
        success: false,
        message: "No annual summary found for this employee",
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const importAnnualSummaryFromExcel = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    const formattedData = rawData.map((row) => ({
      employeeName: row["Employee Name"],
      employee_ID: row["Employee ID"],
      department: row["Department"],
      current_Status: row["Current Status"],
      total_working_days_year: row["Total Working Days (Year)"],
      total_present_days_year: row["Total Present Days (Year)"],
      total_absent_days_year: row["Total Absent Days (Year)"],
      total_leave_days_year: row["Total Leave Days (Year)"],
      attendance_rate: row["Attendance Rate (%)"],
      absenteeism_rate: row["Absenteeism Rate (%)"],
      total_leave_entitlement: row["Total Leave Entitlement (Days)"],
      leave_utilization: row["Leave Utilization (%)"],
      appraisal_rating: row["Appraisal Rating (Out of 5)"],
      goal_attainment: row["Goal Attainment (%)"],
      total_training_hours: row["Total Training Hours"],
      training_completion: row["Training Completion (%)"],
      avg_pre_training_score: row["Average Pre-Training Score"],
      avg_post_training_score: row["Average Post-Training Score"],
      training_improvement: row["Training Improvement (%)"],
      exit_status: row["Exit Status"],
      exit_reason: row["Exit Reason"],
    }));

    const insertedCount = await bulkInsertAnnualSummary(formattedData);
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `${insertedCount} annual summary records imported successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Import failed", error: error.message });
  }
};
