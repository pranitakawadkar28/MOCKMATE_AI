import dotenv, { configDotenv } from "dotenv";

configDotenv();

export const PORT = process.env.PORT;
