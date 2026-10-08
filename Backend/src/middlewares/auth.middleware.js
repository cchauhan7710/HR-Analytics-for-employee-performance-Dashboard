import jwt from "jsonwebtoken";
import { isBlacklisted } from "../models/tokenBlacklist.model.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthoried access ",
      });
    }

    const refreshToken = authHeader.split(" ")[1];

    const blacklisted = await isBlacklisted(refreshToken);
    if (blacklisted) {
      return res.status(401).json({
        success: false,
        message: "Token has been logged out, please login again",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "token authorization error",
      error: error.message,
    });
  }
};
