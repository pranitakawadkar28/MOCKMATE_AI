import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { openai } from "../../config/openai.js";
import { AppError } from "../../utils/AppError.js";

export const analyzeResumeService = async (filePath) => {
  try {
    const fileBuffer = await fs.promises.readFile(filePath);
    const uintArray = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({ data: uintArray }).promise;

    let resumeText = "";

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str)
        .join(" ");

      resumeText += pageText + "\n";
    }

    resumeText = resumeText.replace(/\s+/g, " ").trim();

    if (!resumeText) {
      throw new AppError("Unable to extract text from resume", 400);
    }

    const messages = [
      {
        role: "system",
        content: `
Extract structured data from resume.
Return strictly JSON:
{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
        `,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    const aiResponse = await openai(messages);

    let parsed;

    try {
      parsed = JSON.parse(aiResponse);
    } catch (err) {
      throw new AppError("AI returned invalid JSON format", 500);
    }

    return {
      role: parsed.role || "",
      experience: parsed.experience || "",
      projects: parsed.projects || [],
      skills: parsed.skills || [],
      resumeText,
    };
  } catch (error) {
    throw new AppError(error.message || "Resume analysis failed", 500);
  }
};