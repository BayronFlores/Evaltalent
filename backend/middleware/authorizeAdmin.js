module.exports = (req, res, next) => {
  // El middleware authenticateToken debe haber agregado req.user con info del token
  if (!req.user) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  // Verificar rol
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Acceso denegado: solo administradores' });
  }

  // Si es admin, continuar
  next();
};
