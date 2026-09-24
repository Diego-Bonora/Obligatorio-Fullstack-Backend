import { registrarUsuarioService, ingresarUsuarioService } from "../services/auth.services.js";

export const registrarUsuario = async (req, res) => {
  await registrarUsuarioService(req, res);
  res.status(201).json({ message: "Usuario registrado exitosamente" });
};

export const ingresarUsuario = async (req, res) => {
  await ingresarUsuarioService(req, res);
  res.status(200).json({ message: "Usuario ingresado exitosamente" });
};
