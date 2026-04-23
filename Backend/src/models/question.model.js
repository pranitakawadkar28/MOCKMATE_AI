import mongoose from "mongoose";

const questionsSchema = new mongoose.Schema({
    question: String,
    difficulty: String,
    timeLimit: Number,
    answer: String,
    feedback: String,
    score: { 
        type: Number, 
        default: 0 
    },
    confidence: { 
        type: Number, 
        default: 0 
    },
    communication: { 
        type: Number, 
        default: 0 
    },
    correctness: { 
        type: Number, 
        default: 0 
    }
});

export { questionsSchema };