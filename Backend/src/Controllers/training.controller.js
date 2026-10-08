import xlsx from "xlsx";
import fs from "fs";
import {
  getAllTraining,
  getTrainingById,
  getTrainingByEmployeeId,
  createTraining,
  updateTraining,
  deleteTraining,
  bulkInsertTraining,
} from "../models/training.model.js";

export const getTrainings = async (req, res) => {
  try {
    const data = await getAllTraining();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTraining = async (req, res) => {
  try {
    const record = await getTrainingById(req.params.id);
    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Training record not found" });
    }
    return res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeTraining = async (req, res) => {
  try {
    const records = await getTrainingByEmployeeId(req.params.employee_ID);
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addTraining = async (req, res) => {
  try {
    const newId = await createTraining(req.body);
    res
      .status(201)
      .json({ success: true, message: "Training record added", id: newId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editTraining = async (req, res) => {
  try {
    const affectedRows = await updateTraining(req.params.id, req.body);
    if (!affectedRows) {
      return res
        .status(404)
        .json({ success: false, message: "Training record not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Training record updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeTraining = async (req, res) => {
  try {
    const affectedRows = await deleteTraining(req.params.id);
    if (!affectedRows) {
      return res
        .status(404)
        .json({ success: false, message: "Training record not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Training record deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const importTrainingFromExcel = async (req, res) => {
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
      training_name: row["Training Name"],
      training_date: formatExcelDate(row["Training Date"]),
      training_hours: row["Training Hours"],
      completion_status: row["Completion Status"],
      pre_training_score: row["Pre-Training Score"],
      post_training_score: row["Post-Training Score"],
      score_improvement: row["Score Improvement"],
    }));

    const insertedCount = await bulkInsertTraining(formattedData);
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `${insertedCount} training records imported successfully`,
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
