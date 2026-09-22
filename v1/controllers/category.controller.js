import {
  getCategoryService,
  getUseCategoryService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from '../services/category.services.js';

export const getCategoryController = async (req, res, next) => {
  try {
    const categorias = await getCategoryService();
    res.status(200).json(categorias);
  } catch (error) {
    next(error);
  }
};

export const getUseCategoryController = async (req, res, next) => {
  try {
    const resultado = await getUseCategoryService(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const createCategoryController = async (req, res, next) => {
  try {
    const categoria = await createCategoryService(req.body);
    res.status(201).json(categoria);
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (req, res, next) => {
  try {
    const categoria = await updateCategoryService(
      req.params.id,
      req.body
    );
    res.status(200).json(categoria);
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryController = async (req, res, next) => {
  try {
    await deleteCategoryService(req.params.id);
    res.status(200).json({ message: 'Categoría eliminada' });
  } catch (error) {
    next(error);
  }
};