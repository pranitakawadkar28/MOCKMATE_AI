import { User } from "../../models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { sendOtpEmail } from "../../utils/emailSender.js";
import { hashPassword } from "../../utils/hash.js";
import {
  deleteOTP,
  generateOTP,
  getOTP,
  storeOTP,
} from "../../utils/otpGenerator.js";

export const registerService = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw new AppError("PLEASE_PROVIDE_USERNAME,EMAIL,PASSWORD", 400);
  }

  const isUserAlreadyExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExist) {
    throw new AppError("USER_ALREADY_EXISTS", 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    isVerified: false,
  });

  const otp = generateOTP();
  await storeOTP(email, otp);
  
  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    await User.deleteOne({ email });
    throw new AppError("FAILED_TO_SEND_OTP", 500);
  }

  return { user };
};

export const verifyOtpService = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new AppError("EMAIL_AND_OTP_REQUIRED", 400);
  }

  const storedOtp = await getOTP(email);

  if (!storedOtp) {
    throw new AppError("OTP_EXPIRED_OR_NOT_FOUND", 400);
  }

  if (storedOtp !== otp) {
    throw new AppError("INVALID_OTP", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("USER_NOT_FOUND", 404);
  }

  user.isVerified = true;
  await user.save();

  await deleteOTP(email);

  return { message: "USER_VERIFIED_SUCCESSFULLY" };
};
