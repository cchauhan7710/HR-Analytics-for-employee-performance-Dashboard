import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

import {
  getAttendances,
  getAttendance,
  getEmployeeAttendance,
  addAttendance,
  editAttendance,
  removeAttendance,
  importAttendanceFromExcel,
} from "../Controllers/attendance.controller.js";

const router = express.Router();

router.get("/getAttendences", getAttendances);
router.get("/employee/:employee_ID", getEmployeeAttendance);
router.get("/:id", getAttendance);
router.post("/addAttendace", addAttendance);
router.put("/:id", editAttendance);
router.delete("/:id", removeAttendance);
router.post("/import", upload.single("file"), importAttendanceFromExcel);

export default router;
