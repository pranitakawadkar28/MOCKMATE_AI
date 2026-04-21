import fs from "fs";
import { analyzeResumeService } from "../../services/resume/resume.service.js";

export const analyzeResumeController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "RESUME_REQUIRED" });
    }

    const filePath = req.file.path;

    const result = await analyzeResumeService(filePath);

    // delete file after processing
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({ message: error.message });
  }
};