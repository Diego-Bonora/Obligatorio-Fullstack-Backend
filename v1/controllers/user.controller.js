import {
  getUserByIdService,
  updateUserByIdService,
  listUsersService,
  changePlanService,
  followUserService,
  unfollowUserService,
  deleteUserService,
} from '../services/user.services.js';

export const getPerfilController = async (req, res, next) => {
  try {
    const usuario = await getUserByIdService(req.decoded.id);
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};

export const updatePerfilController = async (req, res, next) => {
  try {
    const usuario = await updateUserByIdService(req.decoded.id, req.body);
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};

export const deletePerfilController = async (req, res, next) => {
  try {
    await deleteUserService(req.usuario.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getUserController = async (req, res, next) => {
  try {
    const usuario = await getUserByIdService(req.params.id);
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};

export const listUsersController = async (req, res, next) => {
  try {
    const result = await listUsersService(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const changePlanController = async (req, res, next) => {
  try {
    const usuario = await changePlanService(req.decoded.id);
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};

export const followUserController = async (req, res, next) => {
  try {
    const usuario = await followUserService(req.decoded.id, req.params.id);
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};

export const unfollowUserController = async (req, res, next) => {
  try {
    const usuario = await unfollowUserService(req.decoded.id, req.params.id);
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};