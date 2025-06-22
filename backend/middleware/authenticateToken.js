const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ Token verification failed:', err.message);
      return res.status(403).json({ message: 'Token inválido' });
    }

    // 🔍 LOG: Mostrar el contenido decodificado del token
    console.log('🔍 Token decodificado:', user);

    req.user = user;

    // 🔍 LOG: Mostrar el usuario que se adjunta a la request
    console.log('🔍 req.user en authenticateToken:', req.user);

    next();
  });
};

module.exports = authenticateToken;
