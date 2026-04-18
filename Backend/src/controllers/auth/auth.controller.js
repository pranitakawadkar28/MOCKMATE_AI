import { 
  registerService, 
  verifyOtpService 
} from "../../services/auth/auth.service.js";

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