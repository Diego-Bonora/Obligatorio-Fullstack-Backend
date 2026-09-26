import { createReportService } from "../services/report.services.js";

export const reportRecipe = async (req, res) => {
  const report = await createReportService(
    req.validatedParams.id,
    req.decoded.id,
    req.validatedBody
  );
  res.status(201).json({ message: "Reporte enviado", report });
};
