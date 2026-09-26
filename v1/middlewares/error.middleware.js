const multerMessages = {
  LIMIT_FILE_SIZE: "La imagen no puede superar los 4 MB",
  LIMIT_UNEXPECTED_FILE: "Campo de archivo no esperado",
};

export const errorMiddleware = (err, req, res, next) => {
  if (err.name === "MulterError") {
    return res
      .status(400)
      .json({ message: multerMessages[err.code] || "Error al subir el archivo", details: null });
  }

  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";
  const details = err.details || null;
  res.status(status).json({ message, details });
};
