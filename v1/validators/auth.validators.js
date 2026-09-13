import Joi from "joi";

// rol y plan nunca se aceptan desde el body del registro: los fuerza el service.
export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required().messages({
    "string.min": "La contraseña debe tener al menos {#limit} caracteres",
    "string.max": "La contraseña no puede tener más de {#limit} caracteres",
    "any.required": "La contraseña es obligatoria",
  }),
});

export const loginSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).max(30).required(),
});
