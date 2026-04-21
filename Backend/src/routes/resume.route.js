import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { analyzeResumeController } from "../controllers/resume/resume.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
const resumeRouter = express.Router();

resumeRouter.post("/resume", authenticate, upload.single("resume"), analyzeResumeController)

export default resumeRouter;
