import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  getPerformances,
  getPerformance,
  getEmployeePerformance,
  addPerformance,
  editPerformance,
  removePerformance,
  importPerformanceFromExcel,
} from "../Controllers/performance.controller.js";

const router = express.Router();

router.get("/", protect, getPerformances);
router.get("/employee/:employee_ID", protect, getEmployeePerformance);
router.get("/:id", protect, getPerformance);
router.post(
  "/",
  protect,

  addPerformance,
);
router.put(
  "/:id",
  protect,

  editPerformance,
);
router.delete("/:id", protect, removePerformance);
router.post(
  "/import",
  protect,
  upload.single("file"),
  importPerformanceFromExcel,
);

export default router;
