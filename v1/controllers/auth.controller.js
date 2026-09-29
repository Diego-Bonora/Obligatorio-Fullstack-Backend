import { registerUserService, loginUserService } from "../services/auth.services.js";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.validatedBody;
  const token = await registerUserService(username, email, password);
  res.status(201).json({ message: "Usuario registrado", token });
};

export const loginUser = async (req, res) => {
  const { username, password } = req.validatedBody;
  const token = await loginUserService(username, password);
  res.status(200).json({ message: "Sesión iniciada", token });
};
