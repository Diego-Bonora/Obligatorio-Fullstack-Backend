import express from "express";
import authRouter from "./routes/auth.routes.js";
import recipeRouter from "./routes/recipe.routes.js";
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import { authenticateMiddleware } from "./middlewares/authenticate.middleware.js";

const router = express.Router({ mergeParams: true });

// Rutas públicas
router.use("/auth", authRouter);

// A partir de acá, rutas protegidas
router.use(authenticateMiddleware);

router.use("/recipes", recipeRouter);
router.use("/users", userRouter);

//Admin 

router.use("/admin", adminRouter);
export default router;
