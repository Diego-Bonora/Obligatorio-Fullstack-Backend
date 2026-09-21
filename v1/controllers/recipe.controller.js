import {
  createRecipeService,
  listRecipesService,
  getRecipeService,
  updateRecipeService,
  deleteRecipeService,
} from "../services/recipe.services.js";

export const createRecipe = async (req, res) => {
  await createRecipeService(req, res);
};

export const listRecipes = async (req, res) => {
  await listRecipesService(req, res);
};

export const getRecipe = async (req, res) => {
  await getRecipeService(req, res);
};

export const updateRecipe = async (req, res) => {
  await updateRecipeService(req, res);
};

export const deleteRecipe = async (req, res) => {
  await deleteRecipeService(req, res);
};
