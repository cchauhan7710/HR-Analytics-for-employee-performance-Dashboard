import xlsx from "xlsx";
import fs from "fs";
import {
  getAllExits,
  getExitById,
  getExitByEmployeeId,
  createExit,
  updateExit,
  deleteExit,
  bulkInsertExits,
} from "../models/exit.model.js";

export const getExits = async (req, res) => {
  try {
    const data = await getAllExits();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExit = async (req, res) => {
  try {
    const record = await getExitById(req.params.id);
    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Exit record not found" });
    }
    return res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeExit = async (req, res) => {
  try {
    const records = await getExitByEmployeeId(req.params.employee_ID);
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addExit = async (req, res) => {
  try {
    const newId = await createExit(req.body);
    res
      .status(201)
      .json({ success: true, message: "Exit record added", id: newId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editExit = async (req, res) => {
  try {
    const affectedRows = await updateExit(req.params.id, req.body);
    if (!affectedRows) {
      return res
        .status(404)
        .json({ success: false, message: "Exit record not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Exit record updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeExit = async (req, res) => {
  try {
    const affectedRows = await deleteExit(req.params.id);
    if (!affectedRows) {
      return res
        .status(404)
        .json({ success: false, message: "Exit record not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Exit record deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const importExitsFromExcel = async (req, res) => {
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
      exit_date: formatExcelDate(row["Exit Date"]),
      exit_type: row["Exit Type"],
      exit_reason: row["Exit Reason"],
    }));

    const insertedCount = await bulkInsertExits(formattedData);
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `${insertedCount} exit records imported successfully`,
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
