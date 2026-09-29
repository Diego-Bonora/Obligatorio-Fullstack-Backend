import Joi from "joi";

const tag = Joi.string()
  .pattern(/^[\p{L}\p{N}-]+$/u)
  .max(30);

export const buildEnrichmentSchema = (categoryNames) =>
  Joi.object({
    description: Joi.string().trim().min(1).max(200).required(),
    tags: Joi.array().items(tag).min(3).max(6).required(),
    suggestedCategory: categoryNames.length
      ? Joi.string()
          .trim()
          .valid(...categoryNames)
          .insensitive()
          .required()
      : Joi.any().strip(),
  }).options({ stripUnknown: true });

export const substitutionsSchema = Joi.object({
  substitutions: Joi.array()
    .items(
      Joi.object({
        original: Joi.string().trim().min(1).max(100).required(),
        substitute: Joi.string().trim().min(1).max(100).required(),
        reason: Joi.string().trim().min(1).max(200).required(),
      })
    )
    .max(30)
    .required(),
}).options({ stripUnknown: true });
