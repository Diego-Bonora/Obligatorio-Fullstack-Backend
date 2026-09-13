import express from "express";
import { registrarUsuario, ingresarUsuario } from "../controllers/auth.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";

const router = express.Router();

router.post("/register", validateBodyMiddleware(registerSchema), registrarUsuario);
router.post("/login", validateBodyMiddleware(loginSchema), ingresarUsuario);

export default router;
