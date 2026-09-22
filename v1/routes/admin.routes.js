import { Router } from 'express';

import {
  listAdminsController,
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
  listAdminsQuerySchema,
  changeUserStatusBodySchema,
  listReportsQuerySchema,
  resolveReportBodySchema,
} from "../validators/admin.validators.js";

const router = Router();

router.use(authorizeRoleMiddleware('admin'));

router.get('/usuarios',
  validateQueryMiddleware(listAdminsQuerySchema),
  listAdminsController
);
router.patch('/usuarios/:id/estado',
  validateParamsMiddleware(idParamsSchema),
  validateBodyMiddleware(changeUserStatusBodySchema),
  changeUserStatusController
);

router.get('/reportes',
  validateQueryMiddleware(listReportsQuerySchema),
  listReportsController
);
router.patch('/reportes/:id/resolver',
  validateParamsMiddleware(idParamsSchema),
  validateBodyMiddleware(resolveReportBodySchema),
  resolveReportController
);

router.get('/estadisticas', getStatisticsController);

export default router;