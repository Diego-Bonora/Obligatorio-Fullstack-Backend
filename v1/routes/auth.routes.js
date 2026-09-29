import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";
import { loginRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post("/register", validateBodyMiddleware(registerSchema), registerUser);
router.post("/login", loginRateLimiter, validateBodyMiddleware(loginSchema), loginUser);

export default router;
