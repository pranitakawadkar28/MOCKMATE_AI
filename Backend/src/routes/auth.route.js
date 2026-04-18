import express from "express";
import { validate } from "../middlewares/validator.middleware.js";
import {
  loginSchema,
  registerSchema,
  verifyOtpSchema,
} from "../validator/auth.validator.js";

import {
  getMeController,
  loginController,
  logoutController,
  registerController,
  verifyOtpController,
} from "../controllers/auth/auth.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

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
    authenticate,
    logoutController
);

authRouter.get(
    "/me",
    authenticate,
    getMeController
)

export default authRouter;
