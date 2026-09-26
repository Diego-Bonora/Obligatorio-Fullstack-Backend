import {
  createRecipeService,
  listRecipesService,
  getRecipeService,
  updateRecipeService,
  updateRecipeImageService,
  getSubstitutionsService,
  deleteRecipeService,
} from "../services/recipe.services.js";

export const createRecipe = async (req, res) => {
  const recipe = await createRecipeService(req.decoded.id, req.validatedBody);
  res.status(201).json({ message: "Receta creada", recipe });
};

export const listRecipes = async (req, res) => {
  const result = await listRecipesService(req.decoded.id, req.validatedQuery);
  res.json(result);
};

export const getRecipe = async (req, res) => {
  const recipe = await getRecipeService(req.validatedParams.id);
  res.json(recipe);
};

export const updateRecipe = async (req, res) => {
  const recipe = await updateRecipeService(
    req.validatedParams.id,
    req.decoded.id,
    req.validatedBody
  );
  res.json({ message: "Receta actualizada", recipe });
};

export const updateRecipeImage = async (req, res) => {
  const recipe = await updateRecipeImageService(
    req.validatedParams.id,
    req.decoded.id,
    req.file?.buffer
  );
  res.json({ message: "Imagen actualizada", recipe });
};

export const getSubstitutions = async (req, res) => {
  const { restriccion } = req.validatedBody;
  const sustituciones = await getSubstitutionsService(
    req.validatedParams.id,
    req.decoded.id,
    restriccion
  );
  res.json({ restriccion, sustituciones });
};

export const deleteRecipe = async (req, res) => {
  await deleteRecipeService(req.validatedParams.id, req.decoded);
  res.json({ message: "Receta eliminada" });
};
