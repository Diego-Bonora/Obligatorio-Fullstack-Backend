import { Router } from "express";

import {
  getMeController,
  updateMeController,
  deleteMeController,
  getUserController,
  listUsersController,
  changePlanController,
  followUserController,
  unfollowUserController,
  uploadProfilePictureController,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { validateParamsMiddleware } from "../middlewares/validateParams.middleware.js";
import { validateQueryMiddleware } from "../middlewares/validateQuery.middleware.js";

import {
  updateUserBodySchema,
  userIdParamsSchema,
  listUsersQuerySchema,
} from "../validators/user.validators.js";

const router = Router();

router.get('/me', getMeController);
router.put('/me', validateBodyMiddleware(updateUserBodySchema), updateMeController);
router.delete('/me', deleteMeController);

router.patch("/me/picture", upload.single("profilePicture"), uploadProfilePictureController);
router.patch('/me/plan', changePlanController);

router.get('/', validateQueryMiddleware(listUsersQuerySchema), listUsersController);
router.get('/:id', validateParamsMiddleware(userIdParamsSchema), getUserController);

router.post('/:id/follow', validateParamsMiddleware(userIdParamsSchema), followUserController);
router.delete('/:id/follow', validateParamsMiddleware(userIdParamsSchema), unfollowUserController);

export default router;
