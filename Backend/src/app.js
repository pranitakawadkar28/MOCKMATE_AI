import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { errorHandler } from "./middlewares/error.middleware.js";

import authRouter from "./routes/auth.route.js";
import resumeRouter from "./routes/resume.route.js";

import { FRONTEND_URL } from "./config/env.js";
import passport from "./config/passport.js";
import interviewRouter from "./routes/interview.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true, 
}));

app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/interview", interviewRouter);

app.use(errorHandler);

export default app;