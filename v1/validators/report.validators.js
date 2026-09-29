import Joi from "joi";

export const createReportSchema = Joi.object({
  reason: Joi.string().valid("spam", "inappropriate_content", "other").required().messages({
    "any.only": "El motivo debe ser spam, inappropriate_content u other",
    "any.required": "El motivo es obligatorio",
  }),
  details: Joi.string().trim().max(300).messages({
    "string.max": "El detalle no puede superar los {#limit} caracteres",
  }),
});
