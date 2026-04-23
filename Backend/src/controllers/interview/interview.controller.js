import { generateQuestionService } from "../../services/interview/interview.service.js";

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