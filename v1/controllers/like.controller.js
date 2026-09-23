import { likeRecipeService, unlikeRecipeService } from "../services/like.services.js";

export const likeRecipe = async (req, res) => {
  await likeRecipeService(req.validatedParams.id, req.decoded.id);
  res.status(201).json({ message: "Like agregado" });
};

export const unlikeRecipe = async (req, res) => {
  await unlikeRecipeService(req.validatedParams.id, req.decoded.id);
  res.json({ message: "Like quitado" });
};
