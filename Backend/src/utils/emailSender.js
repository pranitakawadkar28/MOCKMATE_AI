import nodemailer from "nodemailer";
import {
  EMAIL_HOST,
  EMAIL_PASS,
  EMAIL_PORT,
  EMAIL_USER,
} from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `MOCKMATE_AI <${EMAIL_USER}>`,
    to: email,
    subject: "Email Verification OTP",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>Valid for 10 minutes only.</p>
    `,
  });
};

export const sendResetPasswordEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `MOCKMATE_AI <${EMAIL_USER}>`,
    to: email,
    subject: "Reset Password OTP",
    html: `
      <h2>Reset Password</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>Valid for 10 minutes only.</p>
    `,
  });
};