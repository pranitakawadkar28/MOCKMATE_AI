import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export const authenticate = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("UNAUTHORIZED", 401);
    }

    // JWT verify
    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      req.user = decoded;
      req.userId = decoded.userId;

      next();
    } catch (err) {
      throw new AppError("INVALID_TOKEN", 401);
    }
  } catch (err) {
    next(err);
  }
};
