import connectDB from "../config/db.config.js";

export const connectDBMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    const dbError = new Error("Servicio no disponible, intentá de nuevo");
    dbError.status = 503;
    next(dbError);
  }
};
