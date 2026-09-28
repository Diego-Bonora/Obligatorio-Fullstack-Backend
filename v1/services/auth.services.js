import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const generarToken = (user) =>
  jwt.sign({ id: user._id, rol: user.rol, plan: user.plan }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const registrarUsuarioService = async (username, email, password) => {
  const usuarioExistente = await User.findOne({ $or: [{ username }, { email }] });
  if (usuarioExistente) {
    throw httpError(409, "El usuario ya existe");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // rol y plan nunca se aceptan del body: se fuerzan acá.
  const user = await User.create({ username, email, passwordHash, rol: "usuario", plan: "plus" });

  return generarToken(user);
};

export const ingresarUsuarioService = async (username, password) => {
  const user = await User.findOne({ username }).select("+passwordHash");
  if (!user || !user.activo) {
    throw httpError(401, "Credenciales incorrectas");
  }

  const passwordValido = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValido) {
    throw httpError(401, "Credenciales incorrectas");
  }

  return generarToken(user);
};
