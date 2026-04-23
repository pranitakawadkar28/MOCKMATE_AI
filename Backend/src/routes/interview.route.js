import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { generateQuestionController, submitAnswerController } from "../controllers/interview/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.post("/generate-questions", authenticate, generateQuestionController);
interviewRouter.post("/submit-answer", authenticate, submitAnswerController);

export default interviewRouter;
