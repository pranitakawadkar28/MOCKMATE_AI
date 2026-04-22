import { createSlice } from "@reduxjs/toolkit";
import { analyzeResume } from "./resumeThunk";

const initialState = {
  role: "",
  experience: "",
  projects: [],
  skills: [],
  resumeText: "",
  analyzing: false,
  analysisDone: false,
  error: null,
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    resetResume: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeResume.pending, (state) => {
        state.analyzing = true;
        state.error = null;
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.analyzing = false;
        state.analysisDone = true;
        state.role = action.payload.role || "";
        state.experience = action.payload.experience || "";
        state.projects = action.payload.projects || [];
        state.skills = action.payload.skills || [];
        state.resumeText = action.payload.resumeText || "";
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.analyzing = false;
        state.error = action.payload;
      });
  },
});

export const { resetResume } = resumeSlice.actions;
export default resumeSlice.reducer;