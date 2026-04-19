import express from "express";
import passport from "../config/passport.js";
import { FRONTEND_URL } from "../config/env.js";

import { validate } from "../middlewares/validator.middleware.js";
import {
    forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "../validator/auth.validator.js";

import {
    forgotPasswordController,
  getMeController,
  googleCallbackController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resetPasswordController,
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
    logoutController
);

authRouter.get(
    "/me",
    authenticate,
    getMeController
);

authRouter.post(
    "/refresh-token", 
    refreshTokenController
);

authRouter.post(
  "/password/forgot",
  validate(forgotPasswordSchema),
  forgotPasswordController
);

authRouter.post(
  "/password/reset",
  validate(resetPasswordSchema),
  resetPasswordController
);

// Google OAuth initiate 
authRouter.get(
  "/google",
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    session: false 
  })
);

// Google callback route
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { 
    session: false,
    failureRedirect: `${FRONTEND_URL}/login?error=google_auth_failed`
  }),
  googleCallbackController
);


export default authRouter;
