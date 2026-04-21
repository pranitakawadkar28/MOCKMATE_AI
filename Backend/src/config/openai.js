import axios from "axios";
import { AppError } from "../utils/AppError.js";
import { OPENROUTER_API_KEY } from "./env.js"; 

export const openai = async (messages) => { 
  try {
    if (!messages || !Array.isArray(messages) || messages.length === 0) { 
      throw new AppError("MESSAGES_REQUIRED", 400);
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`, 
          "Content-Type": "application/json",
        },
      },
    );

    const content = response?.data?.choices?.[0]?.message?.content;

    if (!content || !content.trim()) {
      throw new AppError("AI_RETURNED_EMPTY_RESPONSE", 500);
    }

    return content;
  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    throw new AppError("OPENROUTER_API_ERROR", 500);
  }
};