import express from "express";
import { validate } from "../middlewares/validator.js";
import {
  loginSchema,
  registerSchema,
  verifyOtpSchema,
} from "../validator/auth.validator.js";
import {
  loginController,
  logoutController,
  registerController,
  verifyOtpController,
} from "../controllers/auth/auth.controller.js";

const authRouter = express.Router();

authRouter.post(
    "/register", 
    validate(registerSchema), 
    registerController
);

authRouter.post(
    "/verify-otp", 
    validate(verifyOtpSchema), 
    verifyOtpController
);

authRouter.post(
    "/login", 
    validate(loginSchema), 
    loginController
);

authRouter.post(
    "/logout",
    logoutController
);

export default authRouter;
