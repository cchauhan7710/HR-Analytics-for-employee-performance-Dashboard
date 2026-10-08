import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  addToBlacklist,
  isBlacklisted,
} from "../models/tokenBlacklist.model.js";

import { createUser, getUserByEmail } from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser)
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserId = await createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json({
      success: true,
      message: "user created successfully!",
      userId: newUserId,
      user: {
        name: name,
        email: email,
        role: role,
      }
    });
  } catch (error) {
    console.error(" User registration error", error);
    res.status(500).json({
      success: false,
      message: "Server Error ",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(409).json({
        success: false,
        message: "All Fields are required!",
      });
    }

    const user = await getUserByEmail(email);
    if (!user)
      return res.status(400).json({
        success: false,
        message: "User not found please Login first",
      });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(409).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    const refreshToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day, matching your JWT expiry
    });
    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: 7 * 24 * 60 * 60 * 1000,
      },
    );

    return res.status(201).json({
      accessToken,
      success: true,
      message: "Login successFully !",
      user,
    });
  } catch (error) {
    console.error("login Error", error.message);
    return res.status(500).json({
      success: false,
      message: "login error",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const authHeader = req.headers?.authorization || (typeof req.header === "function" ? req.header("authorization") : null);
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    if (token) {
      await addToBlacklist(token);
    }
    return res.status(200).json({
      success: true,
      message: "logged out Successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
