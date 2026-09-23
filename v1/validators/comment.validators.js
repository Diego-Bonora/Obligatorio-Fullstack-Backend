import Joi from "joi";

export const createCommentSchema = Joi.object({
  texto: Joi.string().trim().min(1).max(300).required().messages({
    "string.empty": "El comentario no puede estar vacío",
    "string.max": "El comentario no puede superar los {#limit} caracteres",
    "any.required": "El comentario es obligatorio",
  }),
});

export const listCommentsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});
