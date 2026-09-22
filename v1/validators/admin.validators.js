import Joi from 'joi';

export const idParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const listAdminsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  plan: Joi.string().valid('plus', 'premium'),
  rol: Joi.string().valid('usuario', 'admin'),
});

export const changeUserStatusBodySchema = Joi.object({
  activo: Joi.boolean().required(),
});

export const listReportsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  estado: Joi.string().valid('pendiente', 'revisado', 'descartado'),
});

export const resolveReportBodySchema = Joi.object({
  accion: Joi.string().valid('baja', 'descartar').required(),
});