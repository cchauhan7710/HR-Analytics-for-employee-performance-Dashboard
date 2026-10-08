import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  getTrainings,
  getTraining,
  getEmployeeTraining,
  addTraining,
  editTraining,
  removeTraining,
  importTrainingFromExcel,
} from "../Controllers/training.controller.js";

const router = express.Router();

router.get("/", protect, getTrainings);
router.get("/employee/:employee_ID", protect, getEmployeeTraining);
router.get("/:id", protect, getTraining);
router.post("/", protect, addTraining);
router.put(
  "/:id",
  protect,

  editTraining,
);
router.delete("/:id", protect, removeTraining);
router.post(
  "/import",
  protect,

  upload.single("file"),
  importTrainingFromExcel,
);

export default router;
