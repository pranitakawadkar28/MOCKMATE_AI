import nodemailer from "nodemailer";
import {
  EMAIL_HOST,
  EMAIL_PASS,
  EMAIL_PORT,
  EMAIL_USER,
} from "../config/env.js";

import mg from "nodemailer-mailgun-transport";

const mailgunAuth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

const transporter = nodemailer.createTransport(mg(mailgunAuth));

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