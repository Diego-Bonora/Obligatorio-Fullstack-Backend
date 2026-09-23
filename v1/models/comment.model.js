import mongoose from "mongoose";

const comentarioSchema = new mongoose.Schema(
  {
    receta: { type: mongoose.Schema.Types.ObjectId, ref: "Receta", required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    texto: { type: String, required: true, trim: true, maxlength: 300 },
  },
  { timestamps: true }
);

comentarioSchema.index({ receta: 1, createdAt: -1 });

const Comment = mongoose.model("Comentario", comentarioSchema, "comentarios");

export default Comment;
