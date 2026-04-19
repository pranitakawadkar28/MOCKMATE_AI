import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/auth/register", data);
      return res.data.data.user.email; 
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, thunkAPI) => {
    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      // 🔥 assume backend login kar deta hai (tokens set)
      return res.data.data.user;

    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", data);

      return res.data.data.user; // ✅ user return
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/password/forgot",
  async (email, thunkAPI) => {
    try {
      await api.post("auth/Password/forgot", { email });
      return email; // ✅ email save karenge state mein
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/Password/reset",
  async (data, thunkAPI) => {
    try {
      await api.post("/auth/password/reset", data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/auth/me");
      return res.data.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // silently fail, local state toh clear hoga hi
    }
  }
);