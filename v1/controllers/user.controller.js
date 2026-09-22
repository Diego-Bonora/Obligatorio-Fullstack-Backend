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
  await getUserByIdService(req, res);
};

export const updatePerfilController = async (req, res, next) => {
  await updateUserByIdService(req, );
};

export const deletePerfilController = async (req, res, next) => {
  await deleteUserService(req, res);
};

export const getUserController = async (req, res, next) => {
  await getUserByIdService(req, res);
};

export const listUsersController = async (req, res, next) => {
  await listUsersService(req, res);
};

export const changePlanController = async (req, res, next) => {
await changePlanService(req, res);
};

export const followUserController = async (req, res, next) => {
  await followUserService(req, res);
};

export const unfollowUserController = async (req, res, next) => {
  await unfollowUserService(req, res);
};