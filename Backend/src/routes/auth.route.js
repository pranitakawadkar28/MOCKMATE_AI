import express from "express";
import { validate } from "../middlewares/validator.js";
import { 
    registerSchema 
} from "../validator/auth.validator.js";
import { 
    registerController 
} from "../controllers/auth/auth.controller.js";

const authRouter = express.Router();

authRouter.post(
    "/register",
    validate(registerSchema),
    registerController
)

export default authRouter;