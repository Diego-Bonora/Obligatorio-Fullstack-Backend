import Joi from 'joi';

export const idParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).lowercase().required(),
});

export const listAdminUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  plan: Joi.string().valid('plus', 'premium'),
  role: Joi.string().valid('user', 'admin'),
});

export const changeUserStatusBodySchema = Joi.object({
  active: Joi.boolean().required(),
});

export const listReportsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  status: Joi.string().valid('pending', 'reviewed', 'dismissed'),
});

export const resolveReportBodySchema = Joi.object({
  action: Joi.string().valid('takedown', 'dismiss').required(),
});