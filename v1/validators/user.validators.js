import Joi from 'joi';

export const updateUserBodySchema = Joi.object({
  username: Joi.string().trim().min(3).max(30),
  email: Joi.string().trim().lowercase().email(),
  profilePicture: Joi.string().uri().allow(null),
}).min(1);
 
export const userIdParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
 
export const listUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  search: Joi.string().trim().allow(''),
});