import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    receta: { type: mongoose.Schema.Types.ObjectId, ref: "Receta", required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

likeSchema.index({ receta: 1, usuario: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema, "likes");

export default Like;
