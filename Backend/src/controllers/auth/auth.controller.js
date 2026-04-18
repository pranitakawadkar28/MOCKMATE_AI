import { REFRESH_TOKEN_SECRET } from "../../config/env.js";
import { 
  getMeService,
  loginService,
  logoutService,
  refreshTokenService,
  registerService, 
  verifyOtpService 
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

    const result = await verifyOtpService({ email, otp });

    res.status(200).json(result);
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
        user: user.toJSON()
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    await logoutService(accessToken, refreshToken);

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

    const { newAccessToken, newRefreshToken } = await refreshTokenService(refreshToken);

    setAuthCookies(res, newAccessToken, newRefreshToken);

    res.status(200).json({
      success: true,
      message: "TOKEN_REFRESHED_SUCCESSFULLY",
    });
  } catch (err) {
    next(err);
  }
};