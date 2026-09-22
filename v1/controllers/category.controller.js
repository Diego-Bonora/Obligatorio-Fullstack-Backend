import {
  getCategoryService,
  getUseCategoryService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from '../services/category.services.js';

export const getCategoryController = async (req, res, next) => {
  await getCategoryService(req, res);
};

export const getUseCategoryController = async (req, res, next) => {
  await getUseCategoryService(req, res);
};

export const createCategoryController = async (req, res, next) => {
  await createCategoryService(req, res);
};

export const updateCategoryController = async (req, res, next) => {
  await updateCategoryService(req, res);
};

export const deleteCategoryController = async (req, res, next) => {
  await deleteCategoryService(req, res);
};