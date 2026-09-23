import {
  listAdminsService,
  changeUserStatusService,
  listReportsService,
  resolveReportService,
  getStatisticsService,
} from "../services/admin.services.js";

export const listAdminsController = async (req, res, next) => {
  const resultado = await listAdminsService(req.validatedQuery);
  res.json(resultado);
};

export const changeUserStatusController = async (req, res, next) => {
  const usuario = await changeUserStatusService(req.validatedParams.id, req.validatedBody.activo);
  res.json(usuario);
};

export const listReportsController = async (req, res, next) => {
  const resultado = await listReportsService(req.validatedQuery);
  res.json(resultado);
};

export const resolveReportController = async (req, res, next) => {
  const reporte = await resolveReportService(req.validatedParams.id, req.validatedBody.accion);
  res.json(reporte);
};

export const getStatisticsController = async (req, res, next) => {
  const estadisticas = await getStatisticsService();
  res.json(estadisticas);
};
