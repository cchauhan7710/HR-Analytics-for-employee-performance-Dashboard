import xlsx from "xlsx";
import fs from "fs";
import {
  getAllPerformance,
  getPerformanceById,
  getPerformanceByEmployeeId,
  createPerformance,
  updatePerformance,
  deletePerformance,
  bulkInsertPerformance,
} from "../models/performance.model.js";

export const getPerformances = async (req, res) => {
  try {
    const data = await getAllPerformance();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPerformance = async (req, res) => {
  try {
    const record = await getPerformanceById(req.params.id);
    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Performance record not found" });
    }
    return res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeePerformance = async (req, res) => {
  try {
    const records = await getPerformanceByEmployeeId(req.params.employee_ID);
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addPerformance = async (req, res) => {
  try {
    const newId = await createPerformance(req.body);
    res
      .status(201)
      .json({ success: true, message: "Performance record added", id: newId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editPerformance = async (req, res) => {
  try {
    const affectedRows = await updatePerformance(req.params.id, req.body);
    if (!affectedRows) {
      return res
        .status(404)
        .json({ success: false, message: "Performance record not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Performance record updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removePerformance = async (req, res) => {
  try {
    const affectedRows = await deletePerformance(req.params.id);
    if (!affectedRows) {
      return res
        .status(404)
        .json({ success: false, message: "Performance record not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Performance record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const importPerformanceFromExcel = async (req, res) => {
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
      performance_year: row["Performance Year"],
      appraisal_rating: row["Appraisal Rating (Out of 5)"],
      goal_attainment: row["Goal Attainment (%)"],
      performance_category: row["Performance Category"],
    }));

    const insertedCount = await bulkInsertPerformance(formattedData);
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: `${insertedCount} performance records imported successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Import failed", error: error.message });
  }
};
