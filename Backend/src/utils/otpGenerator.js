import crypto from "crypto";
import redisClient from "../config/redis.js";

// 6 digit OTP generate
export const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// Redis store (TTL: 10 min)
export const storeOTP = async (email, otp) => {
    await redisClient.setEx(
        `otp:${email}`,
        10 * 60,
        otp
    );
};

export const getOTP = async (email) => {
  return await redisClient.get(`otp:${email}`);
};

// OTP delete after use
export const deleteOTP = async (email) => {
  await redisClient.del(`otp:${email}`);
};