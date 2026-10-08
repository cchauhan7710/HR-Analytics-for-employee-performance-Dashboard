import express from "express";
import {
  getEmployees,
  getEmployee,
  addEmployee,
  editEmployee,
  removeEmployee,
  importEmployeesFromExcel,
} from "../Controllers/employee.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/allEmployee", protect, getEmployees);
router.get("/oneEmployee/:id", protect, getEmployee);
router.post("/addEmployee", protect, addEmployee);
router.put("/editEmployee", protect, editEmployee);
router.delete("/removeEmployee/:id", protect, removeEmployee);
router.post(
  "/importEmployeesFromExcel",
  protect,
  upload.single("file"),
  importEmployeesFromExcel,
);

export default router;
