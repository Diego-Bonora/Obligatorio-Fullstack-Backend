import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  const allowedTypes = ["image/jpeg", "image/png"];

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Solo se permiten imágenes JPG o PNG");
    error.status = 400;
    return callback(error);
  }

  callback(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});