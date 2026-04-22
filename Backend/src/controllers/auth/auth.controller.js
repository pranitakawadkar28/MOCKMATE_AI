import { FRONTEND_URL } from "../../config/env.js";
import {
  forgotPasswordService,
  getMeService,
  googleLoginService,
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
  resetPasswordService,
  verifyOtpService,
} from "../../services/auth/auth.service.js";

import { clearAuthCookies, setAuthCookies } from "../../utils/cookies.js";

export const registerController = async (req, res, next) => {
  try {
    const { user } = await registerService(req.body);

    res.status(201).json({
      success: true,
      message: "USER_REGISTERED_SUCCESSFULLY",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const verifyOtpController = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const { user } = await verifyOtpService({ email, otp });

    res.status(200).json({
      success: true,
      message: "OTP_VERIFIED_SUCCESSFULLY",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await loginService(req.body);

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "USER_LOGGED_IN_SUCCESSFULLY",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken; // ✅ sirf yeh kaafi hai

    await logoutService(null, refreshToken);

    clearAuthCookies(res); // cookies clear

    res.status(200).json({
      success: true,
      message: "USER_LOGGED_OUT_SUCCESSFULLY",
    });
  } catch (err) {
    next(err);
  }
};

export const getMeController = async (req, res, next) => {
  try {
    const { user } = await getMeService(req.user.userId);

    res.status(200).json({
      success: true,
      message: "USER_FETCHED_SUCCESSFULLY",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const refreshTokenController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    const { newAccessToken, newRefreshToken } =
      await refreshTokenService(refreshToken);

    setAuthCookies(res, newAccessToken, newRefreshToken);

    res.status(200).json({
      success: true,
      message: "TOKEN_REFRESHED_SUCCESSFULLY",
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPasswordController = async (req, res, next) => {
  try {
    await forgotPasswordService(req.body);

    res.status(200).json({
      success: true,
      message: "RESET_OTP_SENT_SUCCESSFULLY",
    });
  } catch (err) {
    next(err);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    await resetPasswordService(req.body);

    res.status(200).json({
      success: true,
      message: "PASSWORD_RESET_SUCCESSFULLY",
    });
  } catch (err) {
    next(err);
  }
};

export const googleCallbackController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await googleLoginService(
      req.user,
    );
    setAuthCookies(res, accessToken, refreshToken);

    res.redirect(`${FRONTEND_URL}/`);
  } catch (error) {
    next(error);
  }
};
