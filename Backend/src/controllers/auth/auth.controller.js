import { 
  loginService,
  registerService, 
  verifyOtpService 
} from "../../services/auth/auth.service.js";

import { setAuthCookies } from "../../utils/cookies.js";

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