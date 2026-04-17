import dotenv, { configDotenv } from "dotenv";

configDotenv();

export const PORT = process.env.PORT;
export const MOGODB_URL = process.env.MOGODB_URL;
