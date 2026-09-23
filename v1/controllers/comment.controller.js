import { listCommentsService, createCommentService } from "../services/comment.services.js";

export const listComments = async (req, res) => {
  const result = await listCommentsService(req.validatedParams.id, req.validatedQuery);
  res.json(result);
};

export const createComment = async (req, res) => {
  const comment = await createCommentService(
    req.validatedParams.id,
    req.decoded.id,
    req.validatedBody
  );
  res.status(201).json({ message: "Comentario creado", comment });
};
