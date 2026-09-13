import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const generarToken = (user) =>
  jwt.sign({ id: user._id, rol: user.rol, plan: user.plan }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

export const registrarUsuarioService = async (req, res) => {
  const { username, email, password } = req.validatedBody;

  const usuarioExistente = await User.findOne({ $or: [{ username }, { email }] });
  if (usuarioExistente) {
    return res.status(409).json({ message: "El usuario ya existe" });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // rol y plan nunca se aceptan del body: se fuerzan acá.
  const user = new User({ username, email, passwordHash, rol: "usuario", plan: "plus" });
  await user.save();

  const token = generarToken(user);
  res.status(201).json({ message: "Usuario registrado", token });
};

export const ingresarUsuarioService = async (req, res) => {
  const { username, password } = req.validatedBody;

  const user = await User.findOne({ username });
  if (!user || !user.activo) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  const passwordValido = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValido) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  const token = generarToken(user);
  res.json({ message: "Sesión iniciada", token });
};
