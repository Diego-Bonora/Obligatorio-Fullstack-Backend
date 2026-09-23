import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./v1/v1.routes.js";
import notFoundMiddleware from "./v1/middlewares/notFound.middleware.js";
import connectDB from "./v1/config/db.config.js";
import { errorMiddleware } from "./v1/middlewares/error.middleware.js";

dotenv.config();

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
