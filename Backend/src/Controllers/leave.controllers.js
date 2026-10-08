import xlsx from "xlsx";
import fs from "fs";
import {
  getAllLeaves,
  getLeavesByEmployeeId,
  getLeaveById,
  createLeave,
  updateLeave,
  deleteLeave,
  importBulkemployeeLeave,
} from "../models/leave.model.js";

export const getLeaves = async (req, res) => {
  try {
    const leave = await getAllLeaves();
    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "somehting went wrong while getting leave data",
      error: error.message,
    });
  }
};

export const getEmployeeLeave = async (req, res) => {
  try {
    const leave = await getLeavesByEmployeeId(req.params.employee_ID);
    res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getLeave = async (req, res) => {
  try {
    const leave = await getLeaveById(req.params.id);
    if (!leave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave record not found" });
    }
    res.json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addleave = async (req, res) => {
  try {
    const leave = await createLeave(req.body);
    res
      .status(201)
      .json({ success: true, message: "Leave record added", id: newId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editLeave = async (req, res) => {
  try {
    const leave = await updateLeave(req.params.id, req.body);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave records are not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Leave details are updated successfully",
      data: leave,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeLeave = async (req, res) => {
  try {
    await deleteLeave(req.params.id);
    res.json({ success: true, message: "Leave record deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const importLeavesFromExcel = async (req, res) => {
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
      leave_Type: row["Leave Type"],
      leave_Start_Date: formatExcelDate(row["Leave Start Date"]),
      leave_end_date: formatExcelDate(row["Leave End Date"]),
      total_leave_days: row["Total Leave Days"],
      entitled_leave_days: row["Entitled Leave Days"],
      Year: row["Year"],
      leave_reason: row["Leave Reason"],
    }));

    const insertedCount = await importBulkemployeeLeave(formattedData);
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `${insertedCount} leave records imported successfully`,
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
