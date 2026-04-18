import express from "express";
import { validate } from "../middlewares/validator.js";
import { 
    registerSchema, 
    verifyOtpSchema
} from "../validator/auth.validator.js";
import { 
    registerController, 
    verifyOtpController
} from "../controllers/auth/auth.controller.js";

const authRouter = express.Router();

authRouter.post(
    "/register",
    validate(registerSchema),
    registerController
)

authRouter.post(
    "/verify-otp",
    validate(verifyOtpSchema),
    verifyOtpController
)

export default authRouter;