import express from "express";
import authRouter from "./routes/auth.routes.js";
import recipeRouter from "./routes/recipe.routes.js";
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import categoryRouter from "./routes/category.routes.js";
import { authenticateMiddleware } from "./middlewares/authenticate.middleware.js";

const router = express.Router({ mergeParams: true });

// Public routes
router.use("/auth", authRouter);

// Everything below requires a valid token
router.use(authenticateMiddleware);

router.use("/recipes", recipeRouter);
router.use("/users", userRouter);

router.use("/admin", adminRouter);
router.use("/categories", categoryRouter);

export default router;
