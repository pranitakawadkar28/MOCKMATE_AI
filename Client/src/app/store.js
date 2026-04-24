import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import resumeReducer from "../features/resume/resumeSlice.js";
import interviewReducer from "../features/interview/interviewSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    interview: interviewReducer,
  },
});
