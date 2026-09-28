import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./v1/v1.routes.js";
import notFoundMiddleware from "./v1/middlewares/notFound.middleware.js";
import { connectDBMiddleware } from "./v1/middlewares/connectDB.middleware.js";
import { errorMiddleware } from "./v1/middlewares/error.middleware.js";

dotenv.config();

const app = express();

// Vercel sits in front as a proxy; without this req.ip is the proxy and the rate limiter would count everyone as one client.
app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", connectDBMiddleware, routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
