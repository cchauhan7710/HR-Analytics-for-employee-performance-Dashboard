import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  getExits,
  getExit,
  getEmployeeExit,
  addExit,
  editExit,
  removeExit,
  importExitsFromExcel,
} from "../Controllers/exit.controller.js";

const router = express.Router();

router.get("/", protect, getExits);
router.get("/employee/:employee_ID", protect, getEmployeeExit);
router.get("/:id", protect, getExit);
router.post("/", protect, addExit);
router.put("/:id", protect, editExit);
router.delete("/:id", protect, removeExit);
router.post("/import", protect, upload.single("file"), importExitsFromExcel);

export default router;
