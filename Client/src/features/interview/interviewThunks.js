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

export const submitAnswer = createAsyncThunk(
  "interview/submitAnswer",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/interview/submit-answer", data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);

export const finishInterview = createAsyncThunk(
  "interview/finish",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/interview/finish", data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);

export const getMyInterview = createAsyncThunk(
  "interview/getMy",
  async (data, thunkAPI) => {
    try {
      const res = await api.get("/interview/my-interview");
      console.log("API Response:", res.data);
      return res.data;
    } catch (error) {
      console.log("Error:", error);
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);

export const getInterviewReport = createAsyncThunk(
  "interview/report",
  async (data, thunkAPI) => {
    try {
      const res = await api.get(`/interview/report/${data}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);
