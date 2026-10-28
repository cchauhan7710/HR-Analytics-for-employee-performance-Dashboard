import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { addToBlacklist, isBlacklisted } from "../models/tokenBlacklist.model.js";
import { createUser, getUserByEmail, getUserById } from "../models/user.model.js";

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/auth/register ──────────────────────────────────────────────────
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All Fields are required" });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const safeRole = ["admin", "hr_manager", "viewer"].includes(role) ? role : "admin";

    const newUserId = await createUser({ name, email, password: hashedPassword, role: safeRole });

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      userId: newUserId,
      user: { name, email, role: safeRole },
    });
  } catch (error) {
    console.error("User registration error", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ── POST /api/auth/login ─────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All Fields are required!" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found. Please register first." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };

    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });

    res.cookie("refreshToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };

    return res.status(200).json({
      accessToken,
      success: true,
      message: "Login successfully!",
      user: safeUser,
    });
  } catch (error) {
    console.error("Login Error", error.message);
    return res.status(500).json({ success: false, message: "Server login error", error: error.message });
  }
};

// ── POST /api/auth/logout ────────────────────────────────────────────────────
export const logout = async (req, res) => {
  try {
    const authHeader = req.headers?.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (token) await addToBlacklist(token);
    res.clearCookie("refreshToken");
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
