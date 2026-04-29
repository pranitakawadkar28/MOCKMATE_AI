import { User } from "../../models/user.model.js";
import { Interview } from "../../models/interview.model.js";
import { AppError } from "../../utils/AppError.js";
import { openai } from "../../config/openai.js";

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
      content: `
You are a real human interviewer conducting a professional interview.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 5 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number them.
- Do NOT add explanations.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 → easy  
Question 2 → easy  
Question 3 → medium  
Question 4 → medium  
Question 5 → hard  

Make questions based on the candidate’s role, experience,interviewMode, projects, skills, and resume details.
`,
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
    model: mode,
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
    userName: user.username,
    questions: interview.questions,
  };
};

export const submitAnswerService = async ({
  interviewId,
  questionIndex,
  answer,
  timeTaken,
}) => {
  const interview = await Interview.findById(interviewId);

  if (!interview) {
    throw new AppError("INTERVIEW_NOT_FOUND", 404);
  }

  const question = interview.questions[questionIndex];

  if (!question) {
    throw new AppError("QUESTION_NOT_FOUND", 404);
  }

  if (!answer) {
    question.score = 0;
    question.feedback = "You did not submit an answer.";
    question.answer = "";

    await interview.save();

    return { feedback: question.feedback };
  }

  if (timeTaken > question.timeLimit) {
    question.score = 0;
    question.feedback = "Time limit exceeded. Answer not evaluated.";
    question.answer = answer;

    await interview.save();

    return { feedback: question.feedback };
  }

  const messages = [
    {
      role: "system",
      content: `
You are a professional human interviewer evaluating a candidate's answer in a real interview.

Evaluate naturally and fairly, like a real person would.

Score the answer in these areas (0 to 10):

1. Confidence – Does the answer sound clear, confident, and well-presented?
2. Communication – Is the language simple, clear, and easy to understand?
3. Correctness – Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.

Calculate:
finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

Feedback Rules:
- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Return ONLY valid JSON in this format:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}
`,
    },
    {
      role: "user",
      content: `
Question: ${question.question}
Answer: ${answer}
`,
    },
  ];

  const openaiResponse = await openai(messages);

  if (!openaiResponse) {
    throw new AppError("AI_RESPONSE_EMPTY", 500);
  }

  let parsed;

  try {
    parsed = JSON.parse(openaiResponse);
  } catch (err) {
    throw new AppError("AI_INVALID_JSON_RESPONSE", 500);
  }

  question.answer = answer;
  question.confidence = parsed.confidence;
  question.communication = parsed.communication;
  question.correctness = parsed.correctness;
  question.score = parsed.finalScore;
  question.feedback = parsed.feedback;

  await interview.save();

  return {
    feedback: parsed.feedback,
    score: parsed.finalScore,
  };
};

export const finishInterviewService = async ({ interviewId }) => {
  const interview = await Interview.findById(interviewId);

  if (!interview) {
    throw new AppError("INTERVIEW_NOT_FOUND", 404);
  }

  const totalQuestions = interview.questions.length;

  let totalScore = 0;
  let totalConfidence = 0;
  let totalCommunication = 0;
  let totalCorrectness = 0;

  interview.questions.forEach((q) => {
    totalScore += q.score || 0;
    totalConfidence += q.confidence || 0;
    totalCommunication += q.communication || 0;
    totalCorrectness += q.correctness || 0;
  });

  const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
  const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
  const avgCommunication = totalQuestions
    ? totalCommunication / totalQuestions
    : 0;
  const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

  interview.finalScore = Number(finalScore.toFixed(1));
  interview.status = "completed";

  await interview.save();

  return {
    finalScore: Number(finalScore.toFixed(1)),
    confidence: Number(avgConfidence.toFixed(1)),
    communication: Number(avgCommunication.toFixed(1)),
    correctness: Number(avgCorrectness.toFixed(1)),
    questionWiseScore: interview.questions.map((q) => ({
      question: q.question,
      score: q.score || 0,
      feedback: q.feedback || "",
      confidence: q.confidence || 0,
      communication: q.communication || 0,
      correctness: q.correctness || 0,
    })),
  };
};

export const getLatestInterviewByUser = async (userId) => {
  const interview = await Interview.find({ userId })
    .sort({ createdAt: -1 })
    .select("role experience mode finalScore status createdAt");

  return interview;
};

export const getInterviewReport = async (interviewId) => {
  const interview = await Interview.findById(interviewId);

  if (!interview) {
    throw new AppError("Interview not found", 404);
  }

  const totalQuestions = interview.questions.length;

  let totalConfidence = 0;
  let totalCommunication = 0;
  let totalCorrectness = 0;

  interview.questions.forEach((q) => {
    totalConfidence += q.confidence || 0;
    totalCommunication += q.communication || 0;
    totalCorrectness += q.correctness || 0;
  });

  const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
  const avgCommunication = totalQuestions
    ? totalCommunication / totalQuestions
    : 0;
  const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

  return {
    finalScore: interview.finalScore,
    confidence: Number(avgConfidence.toFixed(1)),
    communication: Number(avgCommunication.toFixed(1)),
    correctness: Number(avgCorrectness.toFixed(1)),
    questionWiseScore: interview.questions,
  };
};