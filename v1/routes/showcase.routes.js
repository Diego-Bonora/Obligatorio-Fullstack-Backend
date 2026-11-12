import express from "express";
import { getShowcase } from "../controllers/recipe.controller.js";
import { validateQueryMiddleware } from "../middlewares/validateQuery.middleware.js";
import { showcaseQuerySchema } from "../validators/recipe.validators.js";

const router = express.Router();

router.get("/", validateQueryMiddleware(showcaseQuerySchema), getShowcase);

export default router;
