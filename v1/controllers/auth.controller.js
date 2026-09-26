import { registrarUsuarioService, ingresarUsuarioService } from "../services/auth.services.js";

export const registrarUsuario = async (req, res) => {
  const { username, email, password } = req.validatedBody;
  const token = await registrarUsuarioService(username, email, password);
  res.status(201).json({ message: "Usuario registrado", token });
};

export const ingresarUsuario = async (req, res) => {
  const { username, password } = req.validatedBody;
  const token = await ingresarUsuarioService(username, password);
  res.status(200).json({ message: "Sesión iniciada", token });
};
