const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register - Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      department,
      position,
    } = req.body;

    // Validar campos requeridos
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: 'Todos los campos son requeridos',
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: 'El usuario o email ya existe',
      });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el usuario (por defecto como employee)
    const result = await pool.query(
      `
      INSERT INTO users (username, email, password_hash, first_name, last_name, department, position, role_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 3)
      RETURNING id, username, email, first_name, last_name, department, position
    `,
      [
        username,
        email,
        hashedPassword,
        firstName,
        lastName,
        department,
        position,
      ],
    );

    const user = result.rows[0];

    // Generar token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        department: user.department,
        position: user.position,
        role: 'employee',
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST /api/auth/login - Inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar campos requeridos
    if (!username || !password) {
      return res.status(400).json({
        message: 'Usuario y contraseña son requeridos',
      });
    }

    // Buscar usuario en la base de datos
    const result = await pool.query(
      `
      SELECT u.id, u.username, u.email, u.password_hash, u.first_name, u.last_name, 
             u.department, u.position, u.is_active, r.name as role
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.username = $1 OR u.email = $1
    `,
      [username],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'Credenciales inválidas',
      });
    }

    const user = result.rows[0];

    // Verificar si el usuario está activo
    if (!user.is_active) {
      return res.status(401).json({
        message: 'Cuenta desactivada',
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Credenciales inválidas',
      });
    }

    // Generar token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    // Generar refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' },
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        department: user.department,
        position: user.position,
        role: user.role || 'employee',
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST /api/auth/refresh - Renovar token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: 'Refresh token requerido',
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Verificar que el usuario existe y está activo
    const result = await pool.query(
      `
      SELECT u.id, u.username, u.email, u.first_name, u.last_name, 
             u.department, u.position, r.name as role
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = $1 AND u.is_active = true
    `,
      [decoded.userId],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'Usuario no válido',
      });
    }

    const user = result.rows[0];

    // Generar nuevo token
    const newToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      token: newToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        department: user.department,
        position: user.position,
        role: user.role || 'employee',
      },
    });
  } catch (error) {
    console.error('Error en refresh:', error);
    res.status(401).json({ message: 'Refresh token inválido' });
  }
});

// GET /api/auth/me - Obtener información del usuario actual
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        department: req.user.department,
        position: req.user.position,
        role: req.user.role || 'employee',
      },
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', auth, async (req, res) => {
  try {
    // En una implementación real, aquí podrías invalidar el token
    // Por ahora, simplemente confirmamos el logout
    res.json({ message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/auth/test - Ruta de prueba
router.get('/test', (req, res) => {
  res.json({
    message: 'API de autenticación funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
