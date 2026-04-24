import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const generateQuestions = createAsyncThunk(
  "interview/generate",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/interview/generate-questions", data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);