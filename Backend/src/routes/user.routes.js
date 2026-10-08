import express from "express";
import {
  loginUser,
  registerUser,
  logout,
} from "../Controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logout);

export default router;
