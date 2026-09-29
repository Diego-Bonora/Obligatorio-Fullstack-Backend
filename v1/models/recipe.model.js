import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    ingredients: { type: [ingredientSchema], required: true },
    steps: { type: [String], required: true },
    prepTime: { type: Number, required: true, min: 1 },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    servings: { type: Number, required: true, min: 1 },
    imageUrl: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tags: { type: [String], default: [] },
    nutrition: {
      calories: Number,
      protein: Number,
      fat: Number,
      carbs: Number,
      fetchedAt: Date,
    },
    likesCount: { type: Number, default: 0 },
    aiEnrichmentPending: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

recipeSchema.index({ author: 1, createdAt: -1 });
recipeSchema.index({ category: 1 });
recipeSchema.index({ likesCount: -1, createdAt: -1 });

const Recipe = mongoose.model("Recipe", recipeSchema, "recipes");

export default Recipe;
