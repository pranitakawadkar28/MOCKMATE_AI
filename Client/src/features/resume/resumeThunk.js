import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const analyzeResume = createAsyncThunk(
  "resume/analyze",
  async (file, thunkAPI) => {
    try {
      const formdata = new FormData();
      formdata.append("resume", file);

      const res = await api.post("/resume", formdata);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);