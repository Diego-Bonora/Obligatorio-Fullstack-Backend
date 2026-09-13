import express from "express";
import authRouter from "./routes/auth.routes.js";
import { authenticateMiddleware } from "./middlewares/authenticate.middleware.js";

const router = express.Router({ mergeParams: true });

// Rutas públicas
router.use("/auth", authRouter);

// A partir de acá, rutas protegidas
router.use(authenticateMiddleware);

// TODO: montar acá los routers de usuarios, recetas, categorias, admin, ia y nutricion
// a medida que se vayan implementando.

export default router;
