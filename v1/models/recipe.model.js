import mongoose from "mongoose";

const ingredienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    cantidad: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const recetaSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    ingredientes: { type: [ingredienteSchema], required: true },
    pasos: { type: [String], required: true },
    tiempoPreparacion: { type: Number, required: true, min: 1 },
    dificultad: { type: String, enum: ["facil", "media", "dificil"], required: true },
    porciones: { type: Number, required: true, min: 1 },
    imagenUrl: { type: String },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tags: { type: [String], default: [] },
    nutricion: {
      calorias: Number,
      proteinas: Number,
      grasas: Number,
      carbohidratos: Number,
      consultadoEn: Date,
    },
    cantidadLikes: { type: Number, default: 0 },
    iaEnriquecimientoPendiente: { type: Boolean, default: false },
    activa: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Receta", recetaSchema, "recetas");

export default Recipe;
