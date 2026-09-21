import express from "express";
import {
  createRecipe,
  listRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipe.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { validateParamsMiddleware } from "../middlewares/validateParams.middleware.js";
import { validateQueryMiddleware } from "../middlewares/validateQuery.middleware.js";
import {
  createRecipeSchema,
  updateRecipeSchema,
  recipeIdParamsSchema,
  listRecipesQuerySchema,
} from "../validators/recipe.validators.js";

const router = express.Router();

router.post("/", validateBodyMiddleware(createRecipeSchema), createRecipe);
router.get("/", validateQueryMiddleware(listRecipesQuerySchema), listRecipes);
router.get("/:id", validateParamsMiddleware(recipeIdParamsSchema), getRecipe);
router.patch(
  "/:id",
  validateParamsMiddleware(recipeIdParamsSchema),
  validateBodyMiddleware(updateRecipeSchema),
  updateRecipe
);
router.delete("/:id", validateParamsMiddleware(recipeIdParamsSchema), deleteRecipe);

export default router;
