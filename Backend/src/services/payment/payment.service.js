import Payment from "../../models/payment.model.js";
import razorpay from "../../config/razorpay.js";
import crypto from "crypto";
import { RAZORPAY_API_SECRET } from "../../config/env.js";
import { User } from "../../models/user.model.js";

export const createRazorpayOrder = async ({ userId, planId, amount, credits }) => {
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  await Payment.create({
    userId,
    planId,
    amount,
    credits,
    razorpayOrderId: order.id,
    status: "created",
  });

  return order;
};

export const verifyRazorpayPayment = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_API_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new Error("Invalid payment signature");
  }

  // Find payment
  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "paid") {
    return { alreadyProcessed: true };
  }

  // Update payment
  payment.status = "paid";
  payment.razorpayPaymentId = razorpay_payment_id;
  await payment.save();

  // Add credits to user
  const updatedUser = await User.findByIdAndUpdate(
    payment.userId,
    { $inc: { credits: payment.credits } },
    { new: true }
  );

  return { alreadyProcessed: false, updatedUser };
};