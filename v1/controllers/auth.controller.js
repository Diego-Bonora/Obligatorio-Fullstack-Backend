import { registrarUsuarioService, ingresarUsuarioService } from "../services/auth.services.js";

export const registrarUsuario = async (req, res) => {
  await registrarUsuarioService(req, res);
};

export const ingresarUsuario = async (req, res) => {
  await ingresarUsuarioService(req, res);
};
