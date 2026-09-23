import Like from "../models/like.model.js";
import Recipe from "../models/recipe.model.js";

const buildError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const DUPLICATE_KEY = 11000;

export const likeRecipeService = async (recipeId, userId) => {
  const exists = await Recipe.exists({ _id: recipeId });
  if (!exists) throw buildError("Receta no encontrada", 404);

  try {
    await Like.create({ receta: recipeId, usuario: userId });
  } catch (error) {
    if (error.code === DUPLICATE_KEY) {
      throw buildError("Ya le diste like a esta receta", 409);
    }
    throw error;
  }

  await Recipe.updateOne({ _id: recipeId }, { $inc: { cantidadLikes: 1 } });
};

export const unlikeRecipeService = async (recipeId, userId) => {
  const like = await Like.findOneAndDelete({ receta: recipeId, usuario: userId });
  if (!like) throw buildError("No le diste like a esta receta", 404);

  await Recipe.updateOne({ _id: recipeId }, { $inc: { cantidadLikes: -1 } });
};
