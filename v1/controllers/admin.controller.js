import {
  listAdminsService,
  changeUserStatusService,
  listReportsService,
  resolveReportService,
  getStatisticsService,
} from '../services/admin.services.js';

export const listAdminsController = async (req, res, next) => {
  try {
    const result = await listAdminsService(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const changeUserStatusController = async (req, res, next) => {
  try {
    const usuario = await changeUserStatusService(
      req.params.id,
      req.body.activo
    );
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};

export const listReportsController = async (req, res, next) => {
  try {
    const result = await listReportsService(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const resolveReportController = async (req, res, next) => {
  try {
    const reporte = await resolveReportService(
      req.params.id,
      req.body.accion
    );
    res.status(200).json(reporte);
  } catch (error) {
    next(error);
  }
};

export const getStatisticsController = async (req, res, next) => {
  try {
    const estadisticas = await getStatisticsService();
    res.status(200).json(estadisticas);
  } catch (error) {
    next(error);
  }
};