const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const auth = async (req, res, next) => {
  try {
    // Corregir el método para obtener el header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Obtener información completa del usuario
    const { rows } = await pool.query(
      `
      SELECT u.id, u.username, u.email, u.first_name, u.last_name, 
             u.department, u.position, r.name as role
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = $1 AND u.is_active = true
    `,
      [decoded.userId],
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no válido' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token no válido' });
  }
};

module.exports = auth;
