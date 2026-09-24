import { Router } from "express";

import {
  getPerfilController,
  updatePerfilController,
  deletePerfilController,
  getUserController,
  listUsersController,
  changePlanController,
  followUserController,
  unfollowUserController,
  uploadProfilePictureController,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

import {authenticateMiddleware} from "../middlewares/authenticate.middleware.js";
import {validateBodyMiddleware} from "../middlewares/validateBody.middleware.js";
import {validateParamsMiddleware} from "../middlewares/validateParams.middleware.js";
import {validateQueryMiddleware} from "../middlewares/validateQuery.middleware.js";

import {
  updateUserBodySchema,
  userIdParamsSchema,
  listUsersQuerySchema,
} from "../validators/user.validators.js";

const router = Router();

router.get('/perfil', authenticateMiddleware, getPerfilController);
router.put(
  '/perfil',
  authenticateMiddleware,
  validateBodyMiddleware(updateUserBodySchema),
  updatePerfilController
);
router.delete('/perfil', authenticateMiddleware, deletePerfilController);

router.patch(
  "/perfil/foto",
  authenticateMiddleware,
  upload.single("profilePicture"),
  uploadProfilePictureController
);

router.get('/',
  authenticateMiddleware,
  validateQueryMiddleware(listUsersQuerySchema),
  listUsersController
);
router.get('/:id',
  authenticateMiddleware,
  validateParamsMiddleware(userIdParamsSchema),
  getUserController
);

router.patch('/perfil/plan', changePlanController);

router.post('/:id/seguir',
  authenticateMiddleware,
  validateParamsMiddleware(userIdParamsSchema),
  followUserController
);
router.delete('/:id/seguir',
  authenticateMiddleware,
  validateParamsMiddleware(userIdParamsSchema),
  unfollowUserController
);

export default router;