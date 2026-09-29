import Recipe from "../models/recipe.model.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import { getSkip, buildPaginatedResponse } from "../utils/pagination.utils.js";
import { escapeRegex } from "../utils/regex.utils.js";
import cloudinary from "../config/cloudinary.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.util.js";
import { generateRecipeEnrichment, generateSubstitutions } from "./groq.services.js";
import { getNutrition } from "./spoonacular.services.js";

const PLUS_RECIPE_LIMIT = 4;
const MAX_TAGS = 10;

const buildError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const notFoundError = () => buildError("Receta no encontrada", 404);

const enrichWithAI = async (recipeData) => {
  const categories = recipeData.category ? [] : await Category.find({ active: true }, "name");
  const ai = await generateRecipeEnrichment(
    recipeData.title,
    recipeData.ingredients,
    recipeData.steps,
    categories.map((category) => category.name)
  );
  if (!ai) return { ...recipeData, aiEnrichmentPending: true };

  const enriched = {
    ...recipeData,
    tags: [...new Set([...(recipeData.tags ?? []), ...ai.tags])].slice(0, MAX_TAGS),
  };
  if (!recipeData.description) enriched.description = ai.description;
  if (ai.suggestedCategory) {
    const suggested = ai.suggestedCategory.toLowerCase();
    const match = categories.find((category) => category.name.toLowerCase() === suggested);
    if (match) enriched.category = match._id;
  }
  return enriched;
};

export const createRecipeService = async (userId, recipeData) => {
  const reserved = await User.findOneAndUpdate(
    {
      _id: userId,
      $or: [{ plan: "premium" }, { recipesCount: { $lt: PLUS_RECIPE_LIMIT } }],
    },
    { $inc: { recipesCount: 1 } }
  );
  if (!reserved) {
    throw buildError(
      `Alcanzaste el límite de ${PLUS_RECIPE_LIMIT} recetas del plan plus. Pasate a premium para publicar más`,
      403
    );
  }

  try {
    const [enriched, nutrition] = await Promise.all([
      enrichWithAI(recipeData),
      getNutrition(recipeData.ingredients.map((i) => `${i.quantity} ${i.name}`)),
    ]);
    return await Recipe.create({ ...enriched, author: userId, nutrition });
  } catch (error) {
    await User.updateOne({ _id: userId }, { $inc: { recipesCount: -1 } });
    throw error;
  }
};

const buildFeedFilter = async (userId, query) => {
  const { feed, category, author, difficulty, maxTime, ingredient, tags } = query;
  const conditions = [{ active: true }];

  if (category) conditions.push({ category });
  if (author) conditions.push({ author });
  if (difficulty) conditions.push({ difficulty });
  if (maxTime) conditions.push({ prepTime: { $lte: maxTime } });
  if (ingredient) {
    conditions.push({
      "ingredients.name": { $regex: escapeRegex(ingredient), $options: "i" },
    });
  }
  if (tags) {
    const tagList = tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean);
    if (tagList.length) conditions.push({ tags: { $all: tagList } });
  }
  if (feed === "following") {
    const user = await User.findById(userId).select("following");
    conditions.push({ author: { $in: user?.following ?? [] } });
  }

  return { $and: conditions };
};

export const listRecipesService = async (userId, query) => {
  const { page, limit, feed } = query;
  const filter = await buildFeedFilter(userId, query);
  const sort = feed === "popular" ? { likesCount: -1, createdAt: -1 } : { createdAt: -1 };

  const [recipes, total] = await Promise.all([
    Recipe.find(filter)
      .sort(sort)
      .skip(getSkip(page, limit))
      .limit(limit)
      .populate("author", "username"),
    Recipe.countDocuments(filter),
  ]);

  return buildPaginatedResponse(recipes, total, page, limit);
};

export const getRecipeService = async (id) => {
  const recipe = await Recipe.findOne({ _id: id, active: true }).populate("author", "username");
  if (!recipe) throw notFoundError();
  return recipe;
};

export const updateRecipeService = async (id, userId, recipeData) => {
  const recipe = await Recipe.findOne({ _id: id, active: true });
  if (!recipe) throw notFoundError();
  if (String(recipe.author) !== userId) {
    throw buildError("Solo el autor puede modificar la receta", 403);
  }

  recipe.set(recipeData);
  await recipe.save();
  return recipe;
};

export const updateRecipeImageService = async (id, userId, fileBuffer) => {
  if (!fileBuffer) throw buildError("Debe enviar una imagen", 400);

  const recipe = await Recipe.findOne({ _id: id, active: true });
  if (!recipe) throw notFoundError();
  if (String(recipe.author) !== userId) {
    throw buildError("Solo el autor puede modificar la receta", 403);
  }

  const result = await uploadBufferToCloudinary(cloudinary, fileBuffer, {
    folder: "recipes",
    public_id: `recipe-${id}`,
    overwrite: true,
    invalidate: true,
    resource_type: "image",
  });

  recipe.imageUrl = result.secure_url;
  await recipe.save();
  return recipe;
};

export const getSubstitutionsService = async (id, userId, restriction) => {
  const user = await User.findById(userId).select("plan");
  if (user?.plan !== "premium") {
    throw buildError("Las sustituciones son exclusivas del plan premium", 403);
  }

  const recipe = await Recipe.findOne({ _id: id, active: true }).select("ingredients");
  if (!recipe) throw notFoundError();

  const substitutions = await generateSubstitutions(recipe.ingredients, restriction);
  if (!substitutions) {
    throw buildError(
      "Servicio de sustituciones no disponible en este momento, probá de nuevo en unos minutos",
      503
    );
  }
  return substitutions;
};

export const deleteRecipeService = async (id, user) => {
  const recipe = await Recipe.findOne({ _id: id, active: true });
  if (!recipe) throw notFoundError();

  const isAuthor = String(recipe.author) === user.id;
  if (!isAuthor && user.role !== "admin") {
    throw buildError("No tenés permiso para eliminar esta receta", 403);
  }

  await deactivateRecipeService(recipe._id);
};

export const deactivateRecipeService = async (recipeId) => {
  const recipe = await Recipe.findOneAndUpdate({ _id: recipeId, active: true }, { active: false });
  if (recipe) {
    await User.updateOne({ _id: recipe.author }, { $inc: { recipesCount: -1 } });
  }
  return recipe;
};
