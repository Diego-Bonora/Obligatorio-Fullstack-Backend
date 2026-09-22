import Joi from 'joi';

export const idParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const createCategoryBodySchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(50).required(),
  descripcion: Joi.string().trim().allow(''),
});

export const updateCategoryBodySchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(50),
  descripcion: Joi.string().trim().allow(''),
  activa: Joi.boolean(),
}).min(1);
