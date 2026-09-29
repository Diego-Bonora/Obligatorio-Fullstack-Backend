export const authorizeRoleMiddleware =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.decoded || !allowedRoles.includes(req.decoded.role)) {
      return res
        .status(403)
        .json({ message: 'No tenés permisos para realizar esta acción' });
    }
    next();
  };