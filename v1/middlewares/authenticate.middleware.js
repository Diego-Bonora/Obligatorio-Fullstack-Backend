import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticateMiddleware = async (req, res, next) => {
  // Expected header: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No se proporcionó el token" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token inválido" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }

  // The JWT stays valid for 1h, so a deactivated or deleted user is only caught by checking the DB.
  const user = await User.findById(decoded.id).select("active");
  if (!user || !user.active) {
    return res.status(401).json({ message: "Usuario inactivo o inexistente" });
  }

  req.decoded = decoded;
  next();
};
