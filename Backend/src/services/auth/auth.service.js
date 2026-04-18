import crypto from "crypto";
import jwt from "jsonwebtoken"; 

import { User } from "../../models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { sendOtpEmail } from "../../utils/emailSender.js";
import { comparePassword, hashPassword } from "../../utils/hash.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import {
  deleteOTP,
  generateOTP,
  getOTP,
  storeOTP,
} from "../../utils/otpGenerator.js";
import { REFRESH_TOKEN_SECRET } from "../../config/env.js";

export const registerService = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw new AppError("PLEASE_PROVIDE_USERNAME,EMAIL,PASSWORD", 400);
  }

  const isUserAlreadyExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExist) {
    throw new AppError("USER_ALREADY_EXISTS", 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    isVerified: false,
  });

  const otp = generateOTP();
  await storeOTP(email, otp);

  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    await User.deleteOne({ email });
    throw new AppError("FAILED_TO_SEND_OTP", 500);
  }

  return { user };
};

export const verifyOtpService = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new AppError("EMAIL_AND_OTP_REQUIRED", 400);
  }

  const storedOtp = await getOTP(email);

  if (!storedOtp) {
    throw new AppError("OTP_EXPIRED_OR_NOT_FOUND", 400);
  }

  if (storedOtp !== otp) {
    throw new AppError("INVALID_OTP", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("USER_NOT_FOUND", 404);
  }

  user.isVerified = true;
  await user.save();

  await deleteOTP(email);

  return { message: "USER_VERIFIED_SUCCESSFULLY" };
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("INVALID_CREDENTIALS", 401);
  }

  if (!user.isVerified) {
    throw new AppError("EMAIL_NOT_VERIFIED", 403);
  }

  const isMatched = await comparePassword(password, user.password);

  if (!isMatched) {
    throw new AppError("INVALID_CREDENTIALS", 401);
  }

  const accessToken = generateAccessToken({
    userId: user._id,
    tokenVersion: user.tokenVersion,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
    tokenVersion: user.tokenVersion,
  });

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  user.refreshToken = hashedRefreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const logoutService = async (accessToken, refreshToken) => {
  if (!refreshToken) return;

  const hashed = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await User.updateOne(
    { refreshToken: hashed },
    { $unset: { refreshToken: 1 } }
  );
};

export const getMeService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("USER_NOT_FOUND", 404);
  }

  return { user };
};

export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("REFRESH_TOKEN_MISSING", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new AppError("INVALID_OR_EXPIRED_REFRESH_TOKEN", 401);
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new AppError("USER_NOT_FOUND", 404);
  }

  if (user.tokenVersion !== decoded.tokenVersion) {
    throw new AppError("TOKEN_NO_LONGER_VALID", 401);
  }

  const newAccessToken = generateAccessToken({
    userId: user._id,
    tokenVersion: user.tokenVersion,
  });

  const newRefreshToken = generateRefreshToken({
    userId: user._id,
    tokenVersion: user.tokenVersion,
  });

  return { newAccessToken, newRefreshToken };
};