import Joi from "joi";

export const createReportSchema = Joi.object({
  motivo: Joi.string().valid("spam", "contenido_inapropiado", "otro").required().messages({
    "any.only": "El motivo debe ser spam, contenido_inapropiado u otro",
    "any.required": "El motivo es obligatorio",
  }),
  detalle: Joi.string().trim().max(300).messages({
    "string.max": "El detalle no puede superar los {#limit} caracteres",
  }),
});
