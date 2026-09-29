import { Router } from 'express';

import {
  listAdminUsersController,
  changeUserStatusController,
  listReportsController,
  resolveReportController,
  getStatisticsController,
} from '../controllers/admin.controller.js';

import { authorizeRoleMiddleware } from "../middlewares/authorizeRole.middleware.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { validateParamsMiddleware } from "../middlewares/validateParams.middleware.js";
import { validateQueryMiddleware } from "../middlewares/validateQuery.middleware.js";

import {
  idParamsSchema,
  listAdminUsersQuerySchema,
  changeUserStatusBodySchema,
  listReportsQuerySchema,
  resolveReportBodySchema,
} from "../validators/admin.validators.js";

const router = Router();

router.use(authorizeRoleMiddleware('admin'));

router.get('/users',
  validateQueryMiddleware(listAdminUsersQuerySchema),
  listAdminUsersController
);
router.patch('/users/:id/status',
  validateParamsMiddleware(idParamsSchema),
  validateBodyMiddleware(changeUserStatusBodySchema),
  changeUserStatusController
);

router.get('/reports',
  validateQueryMiddleware(listReportsQuerySchema),
  listReportsController
);
router.patch('/reports/:id/resolve',
  validateParamsMiddleware(idParamsSchema),
  validateBodyMiddleware(resolveReportBodySchema),
  resolveReportController
);

router.get('/stats', getStatisticsController);

export default router;