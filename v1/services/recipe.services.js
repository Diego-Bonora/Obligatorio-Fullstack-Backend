import Recipe from "../models/recipe.model.js";
import User from "../models/user.model.js";
import { getSkip, buildPaginatedResponse } from "../utils/pagination.utils.js";

const PLUS_RECIPE_LIMIT = 4;

export const createRecipeService = async (req, res) => {
  const userId = req.decoded.id;

  const reserved = await User.findOneAndUpdate(
    {
      _id: userId,
      $or: [{ plan: "premium" }, { cantidadRecetas: { $lt: PLUS_RECIPE_LIMIT } }],
    },
    { $inc: { cantidadRecetas: 1 } }
  );
  if (!reserved) {
    return res.status(403).json({
      message: `Alcanzaste el límite de ${PLUS_RECIPE_LIMIT} recetas del plan plus. Pasate a premium para publicar más`,
    });
  }

  try {
    const recipe = await Recipe.create({ ...req.validatedBody, author: userId });
    res.status(201).json({ message: "Receta creada", recipe });
  } catch (error) {
    await User.updateOne({ _id: userId }, { $inc: { cantidadRecetas: -1 } });
    throw error;
  }
};

export const listRecipesService = async (req, res) => {
  const { page, limit } = req.validatedQuery;

  const [recipes, total] = await Promise.all([
    Recipe.find()
      .sort({ createdAt: -1 })
      .skip(getSkip(page, limit))
      .limit(limit)
      .populate("author", "username"),
    Recipe.countDocuments(),
  ]);

  res.json(buildPaginatedResponse(recipes, total, page, limit));
};

export const getRecipeService = async (req, res) => {
  const recipe = await Recipe.findById(req.validatedParams.id).populate("author", "username");
  if (!recipe) {
    return res.status(404).json({ message: "Receta no encontrada" });
  }

  res.json(recipe);
};

export const updateRecipeService = async (req, res) => {
  const recipe = await Recipe.findById(req.validatedParams.id);
  if (!recipe) {
    return res.status(404).json({ message: "Receta no encontrada" });
  }
  if (String(recipe.author) !== req.decoded.id) {
    return res.status(403).json({ message: "Solo el autor puede modificar la receta" });
  }

  recipe.set(req.validatedBody);
  await recipe.save();

  res.json({ message: "Receta actualizada", recipe });
};

export const deleteRecipeService = async (req, res) => {
  const recipe = await Recipe.findById(req.validatedParams.id);
  if (!recipe) {
    return res.status(404).json({ message: "Receta no encontrada" });
  }

  const isAuthor = String(recipe.author) === req.decoded.id;
  if (!isAuthor && req.decoded.rol !== "admin") {
    return res.status(403).json({ message: "No tenés permiso para eliminar esta receta" });
  }

  const { deletedCount } = await Recipe.deleteOne({ _id: recipe._id });
  // A taken-down recipe (active: false) already gave its slot back, so it must not decrement twice.
  if (deletedCount && recipe.active) {
    await User.updateOne({ _id: recipe.author }, { $inc: { cantidadRecetas: -1 } });
  }

  res.json({ message: "Receta eliminada" });
};
