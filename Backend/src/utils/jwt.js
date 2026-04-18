import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/env.js";

export const generateAccessToken = (playload) => {
  return jwt.sign(
    {
      ...playload,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

export const generateRefreshToken = (playload) => {
  return jwt.sign(
    {
      ...playload,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
};