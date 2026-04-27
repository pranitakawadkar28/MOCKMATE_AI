import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import { 
    finishInterviewController,
    generateQuestionController, 
    getMyInterviewController, 
    submitAnswerController 
} from "../controllers/interview/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.post("/generate-questions", authenticate, generateQuestionController);
interviewRouter.post("/submit-answer", authenticate, submitAnswerController);
interviewRouter.post("/finish", authenticate, finishInterviewController);
interviewRouter.get("/my-interview", authenticate, getMyInterviewController);

export default interviewRouter;
