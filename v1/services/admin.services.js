import User from '../models/user.model.js';
import Recipe from '../models/recipe.model.js';
import Report from '../models/report.model.js';

const buildError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const notFoundError = (mensaje) => buildError(mensaje, 404);


export const listAdminsService = async ({
  page = 1,
  limit = 10,
  plan,
  rol,
}) => {
  const filter = {};
  if (plan) filter.plan = plan;
  if (rol) filter.rol = rol;

  const skip = (page - 1) * limit;
  const [usuarios, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    data: usuarios,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const changeUserStatusService = async (id, activo) => {
  const usuario = await User.findByIdAndUpdate(
    id,
    { $set: { activo } },
    { new: true }
  );
  if (!usuario) throw notFoundError('Usuario no encontrado');
  return usuario;
};


export const listReportsService = async ({ page = 1, limit = 10, estado }) => {
  const filter = {};
  if (estado) filter.estado = estado;

  const skip = (page - 1) * limit;
  const [reportes, total] = await Promise.all([
    Report.find(filter)
      .populate('receta', 'titulo')
      .populate('usuarioQueReporta', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Report.countDocuments(filter),
  ]);

  return {
    data: reportes,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const resolveReportService = async (id, accion) => {
  const reporte = await Report.findById(id);
  if (!reporte) throw notFoundError('Reporte no encontrado');

  if (accion === 'baja') {
    await Recipe.findByIdAndUpdate(reporte.receta, {
      $set: { activa: false },
    });
    reporte.estado = 'revisado';
  } else if (accion === 'descartar') {
    reporte.estado = 'descartado';
  } else {
    throw buildError('Acción inválida', 400);
  }

  await reporte.save();
  return reporte;
};

export const getStatisticsService = async () => {
  const [usuariosPorPlan, recetasPorCategoria, topAutores] =
    await Promise.all([
      User.aggregate([
        { $match: { activo: true } },
        { $group: { _id: '$plan', cantidad: { $sum: 1 } } },
        { $project: { _id: 0, plan: '$_id', cantidad: 1 } },
      ]),

      Recipe.aggregate([
        { $match: { activa: true } },
        { $group: { _id: '$categoria', cantidad: { $sum: 1 } } },
        {
          $lookup: {
            from: 'categorias',
            localField: '_id',
            foreignField: '_id',
            as: 'categoria',
          },
        },
        { $unwind: '$categoria' },
        {
          $project: {
            _id: 0,
            categoria: '$categoria.nombre',
            cantidad: 1,
          },
        },
        { $sort: { cantidad: -1 } },
      ]),

      Recipe.aggregate([
        { $match: { activa: true } },
        { $group: { _id: '$autor', cantidadRecetas: { $sum: 1 } } },
        { $sort: { cantidadRecetas: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'autor',
          },
        },
        { $unwind: '$autor' },
        {
          $project: {
            _id: 0,
            autor: '$autor.username',
            cantidadRecetas: 1,
          },
        },
      ]),
    ]);

  return { usuariosPorPlan, recetasPorCategoria, topAutores };
};