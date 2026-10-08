import xlsx from "xlsx";
import fs from "fs";
import {
  getAllEmployee,
  getEmployeeById,
  createNewEmployee,
  updateEmployeeDetails,
  deleteEmployeeById,
  bulkInsertEmployees,
} from "../models/employee.model.js";

export const getEmployees = async (req, res) => {
  try {
    const employees = await getAllEmployee();
    res.json({ success: false, data: employees });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employee = await getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: " Employee not found",
      });
    }
    res.json({
      success: true,
      message: "employee found",
      data: employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addEmployee = async (req, res) => {
  try {
    const newEmployeeId = await createNewEmployee(req.body);
    res.status(201).json({
      success: true,
      message: "new employee detail added",
      id: newEmployeeId,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: `error while new entry, ${error.message}`,
    });
  }
};

export const editEmployee = async (req, res) => {
  try {
    const updateEmployee = await updateEmployeeDetails(req.params.id, req.body);
    res.status({
      success: true,
      message: `employee details updated successfully!`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `error while updating the employee details,${error.message}`,
    });
  }
};

export const removeEmployee = async (req, res) => {
  try {
    const empData = await deleteEmployeeById(req.params.id);

    if (!empData)
      return res.status(404).json({
        success: false,
        message: `employee with id is not found`,
      });

    res.status(200).json({
      success: true,
      message: "employee removed successfully",
      empData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `error while removing the  eomployee data,${error.message} `,
    });
  }
};

export const importEmployeesFromExcel = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({
        success: false,
        message: `No file uploaded`,
      });
    const workBook = xlsx.readFile(req.file.path);
    const sheet = workBook.Sheets[workBook.SheetNames[0]];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    const formattedData = rawData.map((row) => ({
      employeeName: row["Employee Name"],
      employee_ID: row["Employee ID"],
      gender: row["Gender"],
      department: row["Department"],
      designation: row["Designation"],
      grade: row["Grade"],
      date_of_Joining: formatExcelDate(row["Date of Joining"]),
      current_Status: row["Current Status"],
      annual_CTC: row["Annual CTC (₹)"],
      annual_leave_entitlement: row["Annual Leave Entitlement (Days)"],
      sick_leave_entitlement: row["Sick Leave Entitlement (Days)"],
    }));

    const insertedCount = await bulkInsertEmployees(formattedData);
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: `${insertedCount} employees imported successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "import failed",
      Error: error.message,
    });
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
