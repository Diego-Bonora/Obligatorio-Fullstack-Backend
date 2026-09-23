import {
  getCategoryService,
  getUseCategoryService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/category.services.js";

export const getCategoryController = async (req, res, next) => {
  const categorias = await getCategoryService();
  res.json(categorias);
};

export const getUseCategoryController = async (req, res, next) => {
  const uso = await getUseCategoryService(req.validatedParams.id);
  res.json(uso);
};

export const createCategoryController = async (req, res, next) => {
  const categoria = await createCategoryService(req.validatedBody);
  res.status(201).json(categoria);
};

export const updateCategoryController = async (req, res, next) => {
  const categoria = await updateCategoryService(req.validatedParams.id, req.validatedBody);
  res.json(categoria);
};

export const deleteCategoryController = async (req, res, next) => {
  const categoria = await deleteCategoryService(req.validatedParams.id);
  res.json(categoria);
};
