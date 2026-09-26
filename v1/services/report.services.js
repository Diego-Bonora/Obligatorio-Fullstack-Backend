import Report from "../models/report.model.js";
import Recipe from "../models/recipe.model.js";

const buildError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const DUPLICATE_KEY = 11000;

export const createReportService = async (recipeId, userId, reportData) => {
  const exists = await Recipe.exists({ _id: recipeId, activa: true });
  if (!exists) throw buildError("Receta no encontrada", 404);

  try {
    return await Report.create({ ...reportData, receta: recipeId, usuarioQueReporta: userId });
  } catch (error) {
    if (error.code === DUPLICATE_KEY) {
      throw buildError("Ya reportaste esta receta", 409);
    }
    throw error;
  }
};
