import Recipe from "../models/recipe.model.js";
import User from "../models/user.model.js";
import { getSkip, buildPaginatedResponse } from "../utils/pagination.utils.js";

const PLUS_RECIPE_LIMIT = 4;

const buildError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const notFoundError = () => buildError("Receta no encontrada", 404);

export const createRecipeService = async (userId, recipeData) => {
  const reserved = await User.findOneAndUpdate(
    {
      _id: userId,
      $or: [{ plan: "premium" }, { cantidadRecetas: { $lt: PLUS_RECIPE_LIMIT } }],
    },
    { $inc: { cantidadRecetas: 1 } }
  );
  if (!reserved) {
    throw buildError(
      `Alcanzaste el límite de ${PLUS_RECIPE_LIMIT} recetas del plan plus. Pasate a premium para publicar más`,
      403
    );
  }

  try {
    return await Recipe.create({ ...recipeData, autor: userId });
  } catch (error) {
    await User.updateOne({ _id: userId }, { $inc: { cantidadRecetas: -1 } });
    throw error;
  }
};

export const listRecipesService = async ({ page, limit }) => {
  const [recipes, total] = await Promise.all([
    Recipe.find()
      .sort({ createdAt: -1 })
      .skip(getSkip(page, limit))
      .limit(limit)
      .populate("autor", "username"),
    Recipe.countDocuments(),
  ]);

  return buildPaginatedResponse(recipes, total, page, limit);
};

export const getRecipeService = async (id) => {
  const recipe = await Recipe.findById(id).populate("autor", "username");
  if (!recipe) throw notFoundError();
  return recipe;
};

export const updateRecipeService = async (id, userId, recipeData) => {
  const recipe = await Recipe.findById(id);
  if (!recipe) throw notFoundError();
  if (String(recipe.autor) !== userId) {
    throw buildError("Solo el autor puede modificar la receta", 403);
  }

  recipe.set(recipeData);
  await recipe.save();
  return recipe;
};

export const deleteRecipeService = async (id, user) => {
  const recipe = await Recipe.findById(id);
  if (!recipe) throw notFoundError();

  const isAuthor = String(recipe.autor) === user.id;
  if (!isAuthor && user.rol !== "admin") {
    throw buildError("No tenés permiso para eliminar esta receta", 403);
  }

  const { deletedCount } = await Recipe.deleteOne({ _id: recipe._id });
  // A taken-down recipe (activa: false) already gave its slot back, so it must not decrement twice.
  if (deletedCount && recipe.activa) {
    await User.updateOne({ _id: recipe.autor }, { $inc: { cantidadRecetas: -1 } });
  }
};
