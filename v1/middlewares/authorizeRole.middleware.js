export const authorizeRoleMiddleware =
  (...rolesPermitidos) =>
  (req, res, next) => {
    if (!req.decoded || !rolesPermitidos.includes(req.decoded.rol)) {
      return res
        .status(403)
        .json({ message: 'No tenés permisos para realizar esta acción' });
    }
    next();
  };