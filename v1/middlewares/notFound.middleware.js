const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    message: "Endpoint no encontrado",
  });
};

export default notFoundMiddleware;
