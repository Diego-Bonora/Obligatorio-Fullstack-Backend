import {
  getUserByIdService,
  updateUserByIdService,
  listUsersService,
  changePlanService,
  followUserService,
  unfollowUserService,
  deleteUserService,
  uploadProfilePictureService,
} from "../services/user.services.js";

export const getMeController = async (req, res, next) => {
  const user = await getUserByIdService(req.decoded.id);
  res.json(user);
};

export const updateMeController = async (req, res, next) => {
  const user = await updateUserByIdService(req.decoded.id, req.validatedBody);
  res.json(user);
};

export const deleteMeController = async (req, res, next) => {
  const user = await deleteUserService(req.decoded.id);
  res.json(user);
};

export const uploadProfilePictureController = async (req, res) => {
  const user = await uploadProfilePictureService(req.decoded.id, req.file);
  res.json(user);
};

export const getUserController = async (req, res, next) => {
  const user = await getUserByIdService(req.validatedParams.id);
  res.json(user);
};

export const listUsersController = async (req, res, next) => {
  const result = await listUsersService(req.validatedQuery);
  res.json(result);
};

export const changePlanController = async (req, res, next) => {
  const user = await changePlanService(req.decoded.id);
  res.json(user);
};

export const followUserController = async (req, res, next) => {
  const user = await followUserService(req.decoded.id, req.validatedParams.id);
  res.json(user);
};

export const unfollowUserController = async (req, res, next) => {
  const user = await unfollowUserService(req.decoded.id, req.validatedParams.id);
  res.json(user);
};
