import express from "express";
import {
  getLeaves,
  getEmployeeLeave,
  getLeave,
  addleave,
  editLeave,
  removeLeave,
  importLeavesFromExcel,
} from "../Controllers/leave.controllers.js";

import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/AllLeave", getLeaves);
router.get("/leaveByEmpId/:employee_ID", getEmployeeLeave);
router.get("/getLeaveById/:id", getLeave);
router.post("/CreatLeave", addleave);
router.put("/editLeave/:id", editLeave);
router.delete("/deleteLeave/:id", removeLeave);
router.post("/importLeaveData", upload.single("file"), importLeavesFromExcel);

export default router;
