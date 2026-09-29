import Category from "../models/category.model.js";
import Recipe from "../models/recipe.model.js";
import { escapeRegex } from "../utils/regex.utils.js";

const buildError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const notFoundError = () => buildError("Categoría no encontrada", 404);

const nameRegex = (name) => new RegExp(`^${escapeRegex(name)}$`, "i");

export const getCategoryService = async () => Category.find().sort({ name: 1 });

export const getCategoryUsageService = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw notFoundError();

  const recipesCount = await Recipe.countDocuments({ category: id, active: true });
  return { category, recipesCount };
};

export const createCategoryService = async ({ name, description }) => {
  const alreadyExists = await Category.findOne({ name: nameRegex(name) });
  if (alreadyExists) {
    throw buildError("Ya existe una categoría con ese nombre", 409);
  }

  return Category.create({ name, description });
};

export const updateCategoryService = async (id, data) => {
  if (data.name) {
    const alreadyExists = await Category.findOne({
      _id: { $ne: id },
      name: nameRegex(data.name),
    });
    if (alreadyExists) {
      throw buildError("Ya existe una categoría con ese nombre", 409);
    }
  }

  const category = await Category.findByIdAndUpdate(
    id,
    { $set: data },
    { returnDocument: "after", runValidators: true }
  );
  if (!category) throw notFoundError();
  return category;
};

export const deleteCategoryService = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw notFoundError();

  const hasRecipes = await Recipe.exists({ category: id });
  if (hasRecipes) {
    throw buildError("No se puede eliminar: hay recetas asociadas a esta categoría", 409);
  }

  await Category.findByIdAndDelete(id);
  return category;
};
