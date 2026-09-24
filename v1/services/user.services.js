import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.util.js";

const buildError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const notFoundError = () => buildError('Usuario no encontrado', 404);

export const getUserByIdService = async (id) => {
  const usuario = await User.findOne({ _id: id, activo: true });
  if (!usuario) throw notFoundError();
  return usuario;
};

export const updateUserByIdService = async (id, data) => {
  const {
    rol,
    plan,
    cantidadRecetas,
    activo,
    password,
    following,
    ...safeData
  } = data;

  const usuario = await User.findOneAndUpdate(
    { _id: id, activo: true },
    { $set: safeData },
    { new: true, runValidators: true }
  );

  if (!usuario) throw notFoundError();
  return usuario;
};

export const listUsersService = async ({ page = 1, limit = 10, search }) => {
  const filter = { activo: true };
  if (search) {
    filter.username = { $regex: search, $options: 'i' };
  }

  const skip = (page - 1) * limit;
  const [usuarios, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    data: usuarios,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const changePlanService = async (id) => {
  const usuario = await User.findOne({ _id: id, activo: true });
  if (!usuario) throw notFoundError();

  if (usuario.plan === 'premium') {
    throw buildError('El usuario ya tiene plan premium', 409);
  }

  usuario.plan = 'premium';
  await usuario.save();
  return usuario;
};

export const followUserService = async (usuarioId, targetId) => {
  if (usuarioId === targetId) {
    throw buildError('No podés seguirte a vos mismo', 400);
  }

  const target = await User.findOne({ _id: targetId, activo: true });
  if (!target) throw notFoundError();

  const usuario = await User.findOne({ _id: usuarioId, activo: true });
  if (!usuario) throw notFoundError();

  const yaLoSigue = usuario.following.some(
    (seguidoId) => seguidoId.toString() === targetId
  );

  if (yaLoSigue) {
    usuario.following = usuario.following.filter(
      (seguidoId) => seguidoId.toString() !== targetId
    );
  } else {
    usuario.following.push(targetId);
  }

  await usuario.save();
  return usuario;
};

export const unfollowUserService = async (usuarioId, targetId) => {
  const usuario = await User.findOne({ _id: usuarioId, activo: true });
  if (!usuario) throw notFoundError();

  const yaLoSigue = usuario.following.some(
    (seguidoId) => seguidoId.toString() === targetId
  );
  if (!yaLoSigue) throw notFoundError();

  usuario.following = usuario.following.filter(
    (seguidoId) => seguidoId.toString() !== targetId
  );
  await usuario.save();
  return usuario;
};

export const deleteUserService = async (id) => {
  const usuario = await User.findByIdAndUpdate(
    id,
    { $set: { activo: false } },
    { new: true }
  );
  if (!usuario) throw notFoundError();
  return usuario;
};

export const uploadProfilePictureService = async (id, file) => {
  if (!file) {
    const error = new Error("Debe enviar una imagen");
    error.status = 400;
    throw error;
  }

  const result = await uploadBufferToCloudinary(
    cloudinary,
    file.buffer,
    {
      folder: "profile-pictures",
      public_id: `user-${id}`,
      overwrite: true,
      invalidate: true,
      resource_type: "image",
    }
  );

  const usuario = await User.findOneAndUpdate(
    { _id: id, activo: true },
    { profilePicture: result.secure_url },
    { new: true, runValidators: true }
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    error.status = 404;
    throw error;
  }

  return usuario;
};

