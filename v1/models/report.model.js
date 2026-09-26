import mongoose from 'mongoose';

const { Schema } = mongoose;

const reporteSchema = new Schema(
  {
    receta: {
      type: Schema.Types.ObjectId,
      ref: 'Receta',
      required: true,
    },
    usuarioQueReporta: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    motivo: {
      type: String,
      enum: ['spam', 'contenido_inapropiado', 'otro'],
      required: true,
    },
    detalle: {
      type: String,
      maxlength: 300,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'revisado', 'descartado'],
      default: 'pendiente',
    },
  },
  { timestamps: true }
);

reporteSchema.index({ estado: 1, createdAt: -1 });
reporteSchema.index({ receta: 1, usuarioQueReporta: 1 }, { unique: true });

export default mongoose.model('Report', reporteSchema);