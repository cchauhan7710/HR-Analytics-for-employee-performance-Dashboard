import xlsx from "xlsx";
import fs from "fs";
import {
  getAllAttendance,
  getAttendanceById,
  getAttendanceByEmployeeId,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  bulkInsertAttendance,
} from "../models/attendance.model.js";

export const getAttendances = async (req, res) => {
  try {
    const data = await getAllAttendance();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const record = await getAttendanceById(req.params.id);
    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance record not found" });
    }
    return res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeAttendance = async (req, res) => {
  try {
    const records = await getAttendanceByEmployeeId(req.params.employee_ID);
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addAttendance = async (req, res) => {
  try {
    const newId = await createAttendance(req.body);
    res
      .status(201)
      .json({ success: true, message: "Attendance record added", id: newId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editAttendance = async (req, res) => {
  try {
    const affectedRows = await updateAttendance(req.params.id, req.body);
    if (!affectedRows) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance record not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Attendance updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeAttendance = async (req, res) => {
  try {
    const affectedRows = await deleteAttendance(req.params.id);
    if (!affectedRows) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance record not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Attendance record deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const importAttendanceFromExcel = async (req, res) => {
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
      month: row["Month"],
      month_start_date: formatExcelDate(row["Month Start Date"]),
      month_end_date: formatExcelDate(row["Month End Date"]),
      total_working_days: row["Total Working Days"],
      present_days: row["Present Days"],
      absent_days: row["Absent Days"],
      leave_days: row["Leave Days"],
      total_accounted_days: row["Total Accounted Days"],
      attendance_rate: row["Attendance Rate (%)"],
      absenteeism_rate: row["Absenteeism Rate (%)"],
    }));

    const insertedCount = await bulkInsertAttendance(formattedData);
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `${insertedCount} attendance records imported successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Import failed", error: error.message });
  }
};

function formatExcelDate(value) {
  if (!value) return null;
  if (typeof value === "number") {
    const excelEpoch = new Date(1899, 11, 30);
    return new Date(excelEpoch.getTime() + value * 86400000)
      .toISOString()
      .split("T")[0];
  }
  return String(value).split(" ")[0];
}
