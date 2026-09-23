import {
  getUserByIdService,
  updateUserByIdService,
  listUsersService,
  changePlanService,
  followUserService,
  unfollowUserService,
  deleteUserService,
} from "../services/user.services.js";

export const getPerfilController = async (req, res, next) => {
  const usuario = await getUserByIdService(req.decoded.id);
  res.json(usuario);
};

export const updatePerfilController = async (req, res, next) => {
  const usuario = await updateUserByIdService(req.decoded.id, req.validatedBody);
  res.json(usuario);
};

export const deletePerfilController = async (req, res, next) => {
  const usuario = await deleteUserService(req.decoded.id);
  res.json(usuario);
};

export const getUserController = async (req, res, next) => {
  const usuario = await getUserByIdService(req.validatedParams.id);
  res.json(usuario);
};

export const listUsersController = async (req, res, next) => {
  const resultado = await listUsersService(req.validatedQuery);
  res.json(resultado);
};

export const changePlanController = async (req, res, next) => {
  const usuario = await changePlanService(req.decoded.id);
  res.json(usuario);
};

export const followUserController = async (req, res, next) => {
  const usuario = await followUserService(req.decoded.id, req.validatedParams.id);
  res.json(usuario);
};

export const unfollowUserController = async (req, res, next) => {
  const usuario = await unfollowUserService(req.decoded.id, req.validatedParams.id);
  res.json(usuario);
};
