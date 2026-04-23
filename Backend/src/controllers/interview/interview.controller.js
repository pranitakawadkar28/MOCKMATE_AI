import { generateQuestionService, submitAnswerService } from "../../services/interview/interview.service.js";

export const generateQuestionController = async (req, res, next) => {
  try {
    const result = await generateQuestionService({
      userId: req.userId,
      ...req.body,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error); 
  }
};

export const submitAnswerController = async (req, res, next) => {
  try {
    const result = await submitAnswerService({
      interviewId: req.body.interviewId,
      questionIndex: req.body.questionIndex,
      answer: req.body.answer,
      timeTaken: req.body.timeTaken,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};