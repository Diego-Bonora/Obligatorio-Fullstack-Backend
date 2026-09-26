import Joi from "joi";

const objectId = Joi.string().hex().length(24);

const ingredienteSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(100).required(),
  cantidad: Joi.string().trim().min(1).max(50).required(),
});

// Joi rejects unknown keys by default, so autor, cantidadLikes, activa, nutricion,
// imagenUrl and iaEnriquecimientoPendiente are refused without being listed here.
export const createRecipeSchema = Joi.object({
  titulo: Joi.string().trim().min(3).max(100).required().messages({
    "string.min": "El título debe tener al menos {#limit} caracteres",
    "any.required": "El título es obligatorio",
  }),
  descripcion: Joi.string().trim().max(500),
  ingredientes: Joi.array().items(ingredienteSchema).min(1).max(50).required().messages({
    "array.min": "La receta debe tener al menos un ingrediente",
    "array.max": "La receta no puede tener más de {#limit} ingredientes",
  }),
  pasos: Joi.array().items(Joi.string().trim().min(1).max(500)).min(1).max(50).required().messages({
    "array.min": "La receta debe tener al menos un paso",
    "array.max": "La receta no puede tener más de {#limit} pasos",
  }),
  tiempoPreparacion: Joi.number().integer().min(1).max(1440).required(), // minutes
  dificultad: Joi.string().valid("facil", "media", "dificil").required(),
  porciones: Joi.number().integer().min(1).max(100).required(),
  categoria: objectId,
  tags: Joi.array()
    .items(Joi.string().trim().lowercase().replace(/\s+/g, "-").min(1).max(30))
    .max(10),
});

export const updateRecipeSchema = createRecipeSchema
  .fork(Object.keys(createRecipeSchema.describe().keys), (field) => field.optional())
  .min(1)
  .messages({ "object.min": "Debe enviar al menos un campo para actualizar" });

export const substitutionsBodySchema = Joi.object({
  restriccion: Joi.string().valid("sin_gluten", "sin_lactosa", "vegetariano").required().messages({
    "any.only": "La restricción debe ser sin_gluten, sin_lactosa o vegetariano",
    "any.required": "La restricción es obligatoria",
  }),
});

export const recipeIdParamsSchema = Joi.object({
  id: objectId.required().messages({ "string.length": "El id de la receta no es válido" }),
});

export const listRecipesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  feed: Joi.string().valid("recent", "following", "popular").default("recent"),
  category: objectId,
  author: objectId,
  difficulty: Joi.string().valid("facil", "media", "dificil"),
  maxTime: Joi.number().integer().min(1).max(1440),
  ingredient: Joi.string().trim().min(1).max(50),
  tags: Joi.string().trim().max(200), // comma-separated: ?tags=postre,sin-tacc
});
