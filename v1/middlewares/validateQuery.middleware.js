export const validateQueryMiddleware = (schema) => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({ mensaje: "Error de validación", error: error });
    }
    req.validatedQuery = value;
    next();
  };
};
