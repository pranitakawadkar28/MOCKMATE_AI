import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String
    },
    otp: {
        type: String
    },
    expiresAt: {
        type: Date
    }
})

export const Otp = mongoose.model("Otp", otpSchema); 