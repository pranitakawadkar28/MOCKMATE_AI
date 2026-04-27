import { createSlice } from "@reduxjs/toolkit";
import { generateQuestions, submitAnswer, finishInterview } from "./interviewThunks";
const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  loading: false,
  error: null,
  interviewDone: false,
  feedback: null,
  result: null,
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

    // generate Question
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
      })

      // Submit Answer
    .addCase(submitAnswer.pending, (state) => {
      state.loading = true;
    })
    .addCase(submitAnswer.fulfilled, (state, action) => {
      state.loading = false;
      state.feedback = action.payload.feedback;
    })
    .addCase(submitAnswer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Finish Interview
    .addCase(finishInterview.pending, (state) => {
      state.loading = true;
    })
    .addCase(finishInterview.fulfilled, (state, action) => {
      state.loading = false;
      state.interviewDone = true;
      state.result = action.payload;
    })
    .addCase(finishInterview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { nextQuestion, saveAnswer, resetInterview } = interviewSlice.actions;
export default interviewSlice.reducer;