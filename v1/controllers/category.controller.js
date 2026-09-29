import {
  getCategoryService,
  getCategoryUsageService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/category.services.js";

export const getCategoryController = async (req, res, next) => {
  const categories = await getCategoryService();
  res.json(categories);
};

export const getCategoryUsageController = async (req, res, next) => {
  const usage = await getCategoryUsageService(req.validatedParams.id);
  res.json(usage);
};

export const createCategoryController = async (req, res, next) => {
  const category = await createCategoryService(req.validatedBody);
  res.status(201).json(category);
};

export const updateCategoryController = async (req, res, next) => {
  const category = await updateCategoryService(req.validatedParams.id, req.validatedBody);
  res.json(category);
};

export const deleteCategoryController = async (req, res, next) => {
  const category = await deleteCategoryService(req.validatedParams.id);
  res.json(category);
};
