import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, plan: user.plan }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const registerUserService = async (username, email, password) => {
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw httpError(409, "El usuario ya existe");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // role and plan are never taken from the body: they are forced here.
  const user = await User.create({ username, email, passwordHash, role: "user", plan: "plus" });

  return generateToken(user);
};

export const loginUserService = async (username, password) => {
  const user = await User.findOne({ username }).select("+passwordHash");
  if (!user || !user.active) {
    throw httpError(401, "Credenciales incorrectas");
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    throw httpError(401, "Credenciales incorrectas");
  }

  return generateToken(user);
};
