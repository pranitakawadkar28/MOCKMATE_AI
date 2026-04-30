import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const createPaymentOrder = createAsyncThunk(
  "payment/createOrder",
  async ({ planId, amount, credits }, thunkAPI) => {
    try {
      const res = await api.post("/payment/create-order", { planId, amount, credits });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async (paymentResponse, thunkAPI) => {
    try {
      const res = await api.post("/payment/verify", paymentResponse);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);