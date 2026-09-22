import {
  listAdminsService,
  changeUserStatusService,
  listReportsService,
  resolveReportService,
  getStatisticsService,
} from '../services/admin.services.js';

export const listAdminsController = async (req, res, next) => {
  await listAdminsService(req, res);
};

export const changeUserStatusController = async (req, res, next) => {
  await changeUserStatusService(req, res);
};

export const listReportsController = async (req, res, next) => {
  await listReportsService(req, res);
};

export const resolveReportController = async (req, res, next) => {
  await resolveReportService(req, res);
};

export const getStatisticsController = async (req, res, next) => {
  await getStatisticsService(req, res);
};