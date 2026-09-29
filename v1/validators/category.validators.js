import Joi from 'joi';

export const idParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const createCategoryBodySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  description: Joi.string().trim().allow(''),
});

export const updateCategoryBodySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  description: Joi.string().trim().allow(''),
  active: Joi.boolean(),
}).min(1);
