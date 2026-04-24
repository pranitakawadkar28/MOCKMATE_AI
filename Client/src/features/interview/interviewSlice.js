import { createSlice } from "@reduxjs/toolkit";
import { generateQuestions } from "./interviewThunks";

const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  loading: false,
  error: null,
  interviewDone: false,
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      } else {
        state.interviewDone = true;
      }
    },
    saveAnswer: (state, action) => {
      state.answers.push(action.payload); // { question, answer }
    },
    resetInterview: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions || [];
        state.currentQuestionIndex = 0;
      })
      .addCase(generateQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { nextQuestion, saveAnswer, resetInterview } = interviewSlice.actions;
export default interviewSlice.reducer;