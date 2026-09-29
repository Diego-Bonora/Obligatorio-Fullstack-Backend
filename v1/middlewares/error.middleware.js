const multerMessages = {
  LIMIT_FILE_SIZE: "La imagen no puede superar los 4 MB",
  LIMIT_UNEXPECTED_FILE: "Campo de archivo no esperado",
};

const duplicateMessages = {
  username: "El nombre de usuario ya está en uso",
  email: "El email ya está en uso",
};

const DUPLICATE_KEY = 11000;

export const errorMiddleware = (err, req, res, next) => {
  if (err.name === "MulterError") {
    return res
      .status(400)
      .json({ message: multerMessages[err.code] || "Error al subir el archivo", details: null });
  }

  if (err.code === DUPLICATE_KEY) {
    const field = Object.keys(err.keyValue ?? {})[0];
    return res
      .status(409)
      .json({ message: duplicateMessages[field] || "Ya existe un registro con esos datos", details: null });
  }

  if (!err.status) {
    // Unexpected errors (Mongo, Cloudinary...) carry internal details: log them, never send them.
    console.error(err);
    return res.status(500).json({ message: "Error interno del servidor", details: null });
  }

  res.status(err.status).json({ message: err.message, details: err.details || null });
};
