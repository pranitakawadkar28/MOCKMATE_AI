import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { generateQuestionController } from "../controllers/interview/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.post("/generate-questions", authenticate, generateQuestionController);

export default interviewRouter;
