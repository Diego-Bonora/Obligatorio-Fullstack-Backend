import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 300 },
  },
  { timestamps: true }
);

commentSchema.index({ recipe: 1, createdAt: -1 });

const Comment = mongoose.model("Comment", commentSchema, "comments");

export default Comment;
