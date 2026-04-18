import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/,
    "Password must contain at least one letter and one number"
  );

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, _"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  password: passwordSchema,
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});