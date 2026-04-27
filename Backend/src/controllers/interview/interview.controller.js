import { finishInterviewService, generateQuestionService, getLatestInterviewByUser, submitAnswerService } from "../../services/interview/interview.service.js";

export const generateQuestionController = async (req, res, next) => {
  try {
    const result = await generateQuestionService({
      userId: req.user.userId, 

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

export const finishInterviewController = async (req, res, next) => {
  try {
    const result = await finishInterviewService({
      interviewId: req.body.interviewId,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyInterviewController = async (req, res) => {
  try {
    const interview = await getLatestInterviewByUser(req.userId);

    if (!interview) {
      return res.status(404).json({
        message: "No interview found",
      });
    }

    return res.status(200).json(interview);
  } catch (error) {
    return res.status(500).json({
      message: `Failed to get interview: ${error.message}`,
    });
  }
};