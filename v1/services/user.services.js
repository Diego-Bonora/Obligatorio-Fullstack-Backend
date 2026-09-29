import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.util.js";
import { buildPaginatedResponse, getSkip } from "../utils/pagination.utils.js";
import { escapeRegex } from "../utils/regex.utils.js";

const buildError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const notFoundError = () => buildError("Usuario no encontrado", 404);

// What any logged-in user may see about someone else (no email, role or plan).
const PUBLIC_FIELDS = "username profilePicture createdAt";

export const getUserByIdService = async (id) => {
  const user = await User.findOne({ _id: id, active: true });
  if (!user) throw notFoundError();
  return user;
};

export const getPublicUserService = async (id) => {
  const user = await User.findOne({ _id: id, active: true }).select(PUBLIC_FIELDS);
  if (!user) throw notFoundError();
  return user;
};

export const updateUserByIdService = async (id, data) => {
  const { role, plan, recipesCount, active, password, following, ...safeData } = data;

  const user = await User.findOneAndUpdate(
    { _id: id, active: true },
    { $set: safeData },
    { returnDocument: "after", runValidators: true }
  );

  if (!user) throw notFoundError();
  return user;
};

export const listUsersService = async ({ page = 1, limit = 10, search }) => {
  const filter = { active: true };
  if (search) {
    filter.username = { $regex: escapeRegex(search), $options: "i" };
  }

  const [users, total] = await Promise.all([
    User.find(filter).select(PUBLIC_FIELDS).skip(getSkip(page, limit)).limit(limit),
    User.countDocuments(filter),
  ]);

  return buildPaginatedResponse(users, total, page, limit);
};

export const changePlanService = async (id) => {
  const user = await User.findOne({ _id: id, active: true });
  if (!user) throw notFoundError();

  if (user.plan === "premium") {
    throw buildError("El usuario ya tiene plan premium", 409);
  }

  user.plan = "premium";
  await user.save();
  return user;
};

export const followUserService = async (userId, targetId) => {
  if (userId === targetId) {
    throw buildError("No podés seguirte a vos mismo", 400);
  }

  const target = await User.exists({ _id: targetId, active: true });
  if (!target) throw notFoundError();

  const user = await User.findOneAndUpdate(
    { _id: userId, following: { $ne: targetId } },
    { $addToSet: { following: targetId } },
    { returnDocument: "after" }
  );
  if (!user) throw buildError("Ya seguís a este usuario", 409);
  return user;
};

export const unfollowUserService = async (userId, targetId) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, following: targetId },
    { $pull: { following: targetId } },
    { returnDocument: "after" }
  );
  if (!user) throw buildError("No seguís a este usuario", 404);
  return user;
};

export const deleteUserService = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    { $set: { active: false } },
    { returnDocument: "after" }
  );
  if (!user) throw notFoundError();
  return user;
};

export const uploadProfilePictureService = async (id, file) => {
  if (!file) {
    throw buildError("Debe enviar una imagen", 400);
  }

  const result = await uploadBufferToCloudinary(cloudinary, file.buffer, {
    folder: "profile-pictures",
    public_id: `user-${id}`,
    overwrite: true,
    invalidate: true,
    resource_type: "image",
  });

  const user = await User.findOneAndUpdate(
    { _id: id, active: true },
    { profilePicture: result.secure_url },
    { returnDocument: "after", runValidators: true }
  );

  if (!user) throw notFoundError();
  return user;
};
