import { Router } from 'express';

import {
  getCategoryController,
  getUseCategoryController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from '../controllers/category.controller.js';

import {authenticateMiddleware} from '../middlewares/authenticate.middleware.js';
import {authorizeRoleMiddleware} from '../middlewares/authorizeRole.middleware.js';
import {validateBodyMiddleware} from '../middlewares/validateBody.middleware.js';
import {validateParamsMiddleware} from '../middlewares/validateParams.middleware.js';

import {
  idParamsSchema,
  createCategoryBodySchema,
  updateCategoryBodySchema,
} from '../validators/category.validators.js';

const router = Router();
router.use(authenticateMiddleware);

router.get('/', getCategoryController);
router.get(
  '/:id/uso',
  validateParamsMiddleware(idParamsSchema),
  getUseCategoryController
);

router.post(
  '/',
  authorizeRoleMiddleware('admin'),
  validateBodyMiddleware(createCategoryBodySchema),
  createCategoryController
);
router.patch(
  '/:id',
  authorizeRoleMiddleware('admin'),
  validateParamsMiddleware(idParamsSchema),
  validateBodyMiddleware(updateCategoryBodySchema),
  updateCategoryController
);
router.delete(
  '/:id',
  authorizeRoleMiddleware('admin'),
  validateParamsMiddleware(idParamsSchema),
  deleteCategoryController
);

export default router;
