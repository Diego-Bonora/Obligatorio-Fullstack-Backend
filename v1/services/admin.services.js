import User from "../models/user.model.js";
import Recipe from "../models/recipe.model.js";
import Report from "../models/report.model.js";
import { deactivateRecipeService } from "./recipe.services.js";
import { buildPaginatedResponse, getSkip } from "../utils/pagination.utils.js";

const buildError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const notFoundError = (message) => buildError(message, 404);

export const listAdminUsersService = async ({ page = 1, limit = 10, plan, role }) => {
  const filter = {};
  if (plan) filter.plan = plan;
  if (role) filter.role = role;

  const [users, total] = await Promise.all([
    User.find(filter).skip(getSkip(page, limit)).limit(limit),
    User.countDocuments(filter),
  ]);

  return buildPaginatedResponse(users, total, page, limit);
};

export const changeUserStatusService = async (id, active) => {
  const user = await User.findByIdAndUpdate(id, { $set: { active } }, { returnDocument: "after" });
  if (!user) throw notFoundError("Usuario no encontrado");
  return user;
};

export const listReportsService = async ({ page = 1, limit = 10, status }) => {
  const filter = {};
  if (status) filter.status = status;

  const [reports, total] = await Promise.all([
    Report.find(filter)
      .populate("recipe", "title")
      .populate("reportedBy", "username")
      .sort({ createdAt: -1 })
      .skip(getSkip(page, limit))
      .limit(limit),
    Report.countDocuments(filter),
  ]);

  return buildPaginatedResponse(reports, total, page, limit);
};

export const resolveReportService = async (id, action) => {
  const report = await Report.findById(id);
  if (!report) throw notFoundError("Reporte no encontrado");
  if (report.status !== "pending") throw buildError("El reporte ya fue resuelto", 409);

  if (action === "takedown") {
    await deactivateRecipeService(report.recipe);
    report.status = "reviewed";
  } else if (action === "dismiss") {
    report.status = "dismissed";
  } else {
    throw buildError("Acción inválida", 400);
  }

  await report.save();
  return report;
};

export const getStatisticsService = async () => {
  const [usersByPlan, recipesByCategory, topAuthors] = await Promise.all([
    User.aggregate([
      { $match: { active: true } },
      { $group: { _id: "$plan", count: { $sum: 1 } } },
      { $project: { _id: 0, plan: "$_id", count: 1 } },
    ]),

    Recipe.aggregate([
      { $match: { active: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          category: "$category.name",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]),

    Recipe.aggregate([
      { $match: { active: true } },
      { $group: { _id: "$author", recipesCount: { $sum: 1 } } },
      { $sort: { recipesCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          _id: 0,
          author: "$author.username",
          recipesCount: 1,
        },
      },
    ]),
  ]);

  return { usersByPlan, recipesByCategory, topAuthors };
};
