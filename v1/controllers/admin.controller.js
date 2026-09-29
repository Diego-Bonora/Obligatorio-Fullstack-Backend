import {
  listAdminUsersService,
  changeUserStatusService,
  listReportsService,
  resolveReportService,
  getStatisticsService,
} from "../services/admin.services.js";

export const listAdminUsersController = async (req, res, next) => {
  const result = await listAdminUsersService(req.validatedQuery);
  res.json(result);
};

export const changeUserStatusController = async (req, res, next) => {
  const user = await changeUserStatusService(req.validatedParams.id, req.validatedBody.active);
  res.json(user);
};

export const listReportsController = async (req, res, next) => {
  const result = await listReportsService(req.validatedQuery);
  res.json(result);
};

export const resolveReportController = async (req, res, next) => {
  const report = await resolveReportService(req.validatedParams.id, req.validatedBody.action);
  res.json(report);
};

export const getStatisticsController = async (req, res, next) => {
  const statistics = await getStatisticsService();
  res.json(statistics);
};
