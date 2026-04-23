import { User } from "../../models/user.model.js";
import { Interview } from "../../models/interview.model.js";
import { AppError } from "../../utils/AppError.js";

export const generateQuestionService = async ({
  userId,
  role,
  experience,
  mode,
  resumeText,
  projects,
  skills,
}) => {
  role = role?.trim();
  experience = experience?.trim();
  mode = mode?.trim();

  if (!role || !experience || !mode) {
    throw new AppError("ROLE_EXPERIENCE_AND_MODE_ARE_REQUIRED", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("USER_NOT_FOUND", 404);
  }

  if (user.credits < 50) {
    throw new AppError("NOT_ENOUGH_CREDITS_MINIMUM_50_REQUIRED", 400);
  }

  const projectText =
    Array.isArray(projects) && projects.length ? projects.join(", ") : "None";

  const skillsText =
    Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

  const safeResume = resumeText?.trim() || "None";

  const userPrompt = `
Role:${role}
Experience:${experience}
InterviewMode:${mode}
Projects:${projectText}
Skills:${skillsText}
Resume:${safeResume}
`;

  if (!userPrompt.trim()) {
    throw new AppError("PROMPT_CONTENT_IS_EMPTY", 400);
  }

  const messages = [
    {
      role: "system",
      content: `Generate 5 interview questions based on input.`,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];

  const openaiResponse = await openai(messages);

  if (!openaiResponse || !openaiResponse.trim()) {
    throw new AppError("AI_RETURNED_EMPTY_RESPONSE", 500);
  }

  const questionsArray = openaiResponse
    .split("\n") 
    .map((q) => q.trim())
    .filter((q) => q.length > 0)
    .slice(0, 5);

  if (questionsArray.length === 0) {
    throw new AppError("AI_FAILED_TO_GENERATE_QUESTIONS", 500);
  }

  user.credits -= 50; 
  await user.save();

  const interview = await Interview.create({
    userId: user._id,
    role,
    experience,
    mode,
    resumeText: safeResume,
    questions: questionsArray.map((q, index) => ({
      question: q,
      difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
      timeLimit: [60, 60, 90, 90, 120][index], 
    })),
  });

  return {
    interviewId: interview._id,
    creditsLeft: user.credits,
    userName: user.name,
    questions: interview.questions,
  };
};