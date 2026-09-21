import Joi from "joi";

const objectId = Joi.string().hex().length(24);

const ingredientSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  quantity: Joi.string().trim().min(1).max(50).required(),
});

// Joi rejects unknown keys by default, so author, likesCount, active, nutrition,
// imageUrl and aiEnrichmentPending are refused without being listed here.
export const createRecipeSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.min": "El título debe tener al menos {#limit} caracteres",
    "any.required": "El título es obligatorio",
  }),
  description: Joi.string().trim().max(500),
  ingredients: Joi.array().items(ingredientSchema).min(1).required().messages({
    "array.min": "La receta debe tener al menos un ingrediente",
  }),
  steps: Joi.array()
    .items(Joi.string().trim().min(1).max(500))
    .min(1)
    .required()
    .messages({ "array.min": "La receta debe tener al menos un paso" }),
  prepTime: Joi.number().integer().min(1).max(1440).required(), // minutes
  difficulty: Joi.string().valid("easy", "medium", "hard").required(),
  servings: Joi.number().integer().min(1).max(100).required(),
  category: objectId,
  tags: Joi.array().items(Joi.string().trim().lowercase().min(1).max(30)).max(10),
});

export const updateRecipeSchema = createRecipeSchema
  .fork(Object.keys(createRecipeSchema.describe().keys), (field) => field.optional())
  .min(1)
  .messages({ "object.min": "Debe enviar al menos un campo para actualizar" });

export const recipeIdParamsSchema = Joi.object({
  id: objectId.required().messages({ "string.length": "El id de la receta no es válido" }),
});

export const listRecipesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});
