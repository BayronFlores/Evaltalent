const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'EvalTalent Backend API funcionando' });
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Test de conexión a base de datos
app.get('/api/db/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Conexión a base de datos exitosa',
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    console.error('❌ Error de conexión a DB:', error);
    res.status(500).json({
      message: 'Error de conexión a base de datos',
      error: error.message,
    });
  }
});

// Rutas de autenticación
app.get('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth funcionando correctamente' });
});

// LOGIN - Conectado a base de datos real
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('📝 Login request received:', req.body);

    const { username, password } = req.body;

    // Validar campos requeridos
    if (!username || !password) {
      console.log('❌ Missing credentials');
      return res.status(400).json({
        message: 'Usuario y contraseña son requeridos',
      });
    }

    // Buscar usuario en la base de datos
    const userQuery = `
      SELECT u.*, r.name as role_name 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE u.username = $1 OR u.email = $1
    `;

    const userResult = await pool.query(userQuery, [username]);

    if (userResult.rows.length === 0) {
      console.log('❌ User not found:', username);
      return res.status(401).json({
        message: 'Credenciales inválidas',
      });
    }

    const user = userResult.rows[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', username);
      return res.status(401).json({
        message: 'Credenciales inválidas',
      });
    }

    // Generar token JWT real
    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role_name,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    console.log('✅ Login successful for user:', user.username);

    // Respuesta exitosa
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        department: user.department,
        position: user.position,
        role: user.role_name,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET USER INFO - Conectado a base de datos real
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const userQuery = `
      SELECT u.*, r.name as role_name 
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE u.id = $1
    `;

    const userResult = await pool.query(userQuery, [req.user.id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = userResult.rows[0];

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        department: user.department,
        position: user.position,
        role: user.role_name,
      },
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// LOGOUT
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  // En JWT, el logout se maneja en el frontend eliminando el token
  // Aquí podrías implementar una blacklist de tokens si fuera necesario
  res.json({ message: 'Logout exitoso' });
});

// REGISTER - Nuevo endpoint para crear usuarios
app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      roleId,
      department,
      position,
    } = req.body;

    // Validar campos requeridos
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: 'Todos los campos obligatorios deben ser completados',
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: 'El usuario o email ya existe',
      });
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insertar nuevo usuario
    const insertQuery = `
      INSERT INTO users (username, email, password_hash, first_name, last_name, role_id, department, position)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, username, email, first_name, last_name, department, position
    `;

    const result = await pool.query(insertQuery, [
      username,
      email,
      passwordHash,
      firstName,
      lastName,
      roleId || 3, // Por defecto rol 'employee'
      department,
      position,
    ]);

    const newUser = result.rows[0];

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        department: newUser.department,
        position: newUser.position,
      },
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log('🔗 Endpoints disponibles:');
  console.log('   GET  /api/test - Test general');
  console.log('   GET  /api/db/test - Test base de datos');
  console.log('   POST /api/auth/login - Login');
  console.log('   GET  /api/auth/me - Info usuario actual');
  console.log('   POST /api/auth/logout - Logout');
  console.log('   POST /api/auth/register - Registro');
});
