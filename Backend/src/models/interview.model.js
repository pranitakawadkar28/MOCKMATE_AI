import mongoose from "mongoose";
import { questionsSchema } from "./question.model.js";  

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: { type: String, required: true },
    experience: { type: String, required: true },
    model: {
      type: String,
      enum: ["HR", "Technical"],
      required: true,
    },
    resumeText: { type: String },
    questions: [questionsSchema],
    finalScore: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Incompleted", "completed"],
      default: "Incompleted",
    }
  },
  { timestamps: true }
);

export const Interview = mongoose.model("Interview", interviewSchema);