import Recipe from "../models/recipe.model.js";
import User from "../models/user.model.js";
import { getSkip, buildPaginatedResponse } from "../utils/pagination.utils.js";
import { escapeRegex } from "../utils/regex.utils.js";
import { obtenerNutricion } from "./spoonacular.services.js";


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
    const nutricion = await obtenerNutricion(
      recipeData.ingredientes.map((i) => `${i.cantidad} ${i.nombre}`)
    );
    return await Recipe.create({ ...recipeData, autor: userId, nutricion });
  } catch (error) {
    await User.updateOne({ _id: userId }, { $inc: { cantidadRecetas: -1 } });
    throw error;
  }
};

const buildFeedFilter = async (userId, query) => {
  const { feed, category, author, difficulty, maxTime, ingredient, tags } = query;
  const conditions = [{ activa: true }];

  if (category) conditions.push({ categoria: category });
  if (author) conditions.push({ autor: author });
  if (difficulty) conditions.push({ dificultad: difficulty });
  if (maxTime) conditions.push({ tiempoPreparacion: { $lte: maxTime } });
  if (ingredient) {
    conditions.push({
      "ingredientes.nombre": { $regex: escapeRegex(ingredient), $options: "i" },
    });
  }
  if (tags) {
    const tagList = tags.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean);
    if (tagList.length) conditions.push({ tags: { $all: tagList } });
  }
  if (feed === "following") {
    const user = await User.findById(userId).select("following");
    conditions.push({ autor: { $in: user?.following ?? [] } });
  }

  return { $and: conditions };
};

export const listRecipesService = async (userId, query) => {
  const { page, limit, feed } = query;
  const filter = await buildFeedFilter(userId, query);
  const sort = feed === "popular" ? { cantidadLikes: -1, createdAt: -1 } : { createdAt: -1 };

  const [recipes, total] = await Promise.all([
    Recipe.find(filter)
      .sort(sort)
      .skip(getSkip(page, limit))
      .limit(limit)
      .populate("autor", "username"),
    Recipe.countDocuments(filter),
  ]);

  return buildPaginatedResponse(recipes, total, page, limit);
};

export const getRecipeService = async (id) => {
  const recipe = await Recipe.findOne({ _id: id, activa: true }).populate("autor", "username");
  if (!recipe) throw notFoundError();
  return recipe;
};

export const updateRecipeService = async (id, userId, recipeData) => {
  const recipe = await Recipe.findOne({ _id: id, activa: true });
  if (!recipe) throw notFoundError();
  if (String(recipe.autor) !== userId) {
    throw buildError("Solo el autor puede modificar la receta", 403);
  }

  recipe.set(recipeData);
  await recipe.save();
  return recipe;
};

export const deleteRecipeService = async (id, user) => {
  const recipe = await Recipe.findOne({ _id: id, activa: true });
  if (!recipe) throw notFoundError();

  const isAuthor = String(recipe.autor) === user.id;
  if (!isAuthor && user.rol !== "admin") {
    throw buildError("No tenés permiso para eliminar esta receta", 403);
  }

  await deactivateRecipeService(recipe._id);
};

export const deactivateRecipeService = async (recipeId) => {
  const recipe = await Recipe.findOneAndUpdate({ _id: recipeId, activa: true }, { activa: false });
  if (recipe) {
    await User.updateOne({ _id: recipe.autor }, { $inc: { cantidadRecetas: -1 } });
  }
  return recipe;
};
