import Comment from "../models/comment.model.js";
import Recipe from "../models/recipe.model.js";
import { getSkip, buildPaginatedResponse } from "../utils/pagination.utils.js";

const buildError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const ensureRecipeExists = async (recipeId) => {
  const exists = await Recipe.exists({ _id: recipeId, activa: true });
  if (!exists) throw buildError("Receta no encontrada", 404);
};

export const listCommentsService = async (recipeId, { page, limit }) => {
  await ensureRecipeExists(recipeId);

  const filter = { receta: recipeId };
  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .sort({ createdAt: -1 })
      .skip(getSkip(page, limit))
      .limit(limit)
      .populate("autor", "username"),
    Comment.countDocuments(filter),
  ]);

  return buildPaginatedResponse(comments, total, page, limit);
};

export const createCommentService = async (recipeId, userId, { texto }) => {
  await ensureRecipeExists(recipeId);
  return Comment.create({ receta: recipeId, autor: userId, texto });
};
