import Category from "../models/category.model.js";
import Recipe from "../models/recipe.model.js";

const buildError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const notFoundError = () => buildError('Categoría no encontrada', 404);

export const getCategoryService = async () =>
  Category.find().sort({ nombre: 1 });

export const getUseCategoryService = async (id) => {
  const categoria = await Category.findById(id);
  if (!categoria) throw notFoundError();

  const cantidadRecetas = await Recipe.countDocuments({ categoria: id });
  return { categoria, cantidadRecetas };
};

export const createCategoryService = async ({ nombre, descripcion }) => {
  const yaExiste = await Category.findOne({
    nombre: new RegExp(`^${nombre}$`, 'i'),
  });
  if (yaExiste) {
    throw buildError('Ya existe una categoría con ese nombre', 409);
  }

  return Category.create({ nombre, descripcion });
};

export const updateCategoryService = async (id, data) => {
  if (data.nombre) {
    const yaExiste = await Category.findOne({
      _id: { $ne: id },
      nombre: new RegExp(`^${data.nombre}$`, 'i'),
    });
    if (yaExiste) {
      throw buildError('Ya existe una categoría con ese nombre', 409);
    }
  }

  const categoria = await Category.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!categoria) throw notFoundError();
  return categoria;
};

export const deleteCategoryService = async (id) => {
  const categoria = await Category.findById(id);
  if (!categoria) throw notFoundError();

  const tieneRecetas = await Recipe.exists({ categoria: id });
  if (tieneRecetas) {
    throw buildError(
      'No se puede eliminar: hay recetas asociadas a esta categoría',
      409
    );
  }

  await Category.findByIdAndDelete(id);
  return categoria;
};
