export const validateQueryMiddleware = (schema) => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));
      return res.status(400).json({ message: "Error de validación", details });
    }
    req.validatedQuery = value;
    next();
  };
};
