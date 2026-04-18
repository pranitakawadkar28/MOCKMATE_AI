import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "MONGODB_URL",
  "PORT",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASS",
  "REDIS_URL"
];

const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

export const PORT = process.env.PORT;
export const MONGODB_URL = process.env.MONGODB_URL;
export const NODE_ENV = process.env.NODE_ENV;

export const EMAIL_HOST = process.env.EMAIL_HOST
export const EMAIL_PORT = process.env.EMAIL_PORT
export const EMAIL_USER = process.env.EMAIL_USER
export const EMAIL_PASS = process.env.EMAIL_PASS

export const REDIS_URL = process.env.REDIS_URL;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;