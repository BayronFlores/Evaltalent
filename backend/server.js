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

// GET - Obtener todos los usuarios
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.username, u.email, u.first_name, u.last_name, 
             u.department, u.position, u.is_active, u.created_at,
             r.name as role_name, r.id as role_id
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      ORDER BY u.created_at DESC
    `;

    const result = await pool.query(query);

    res.json({
      users: result.rows.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        department: user.department,
        position: user.position,
        role: user.role_name,
        roleId: user.role_id,
        isActive: user.is_active,
        createdAt: user.created_at,
      })),
    });
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// GET - Obtener todos los roles
app.get('/api/roles', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description FROM roles ORDER BY name',
    );
    res.json({ roles: result.rows });
  } catch (error) {
    console.error('❌ Get roles error:', error);
    res.status(500).json({ message: 'Error al obtener roles' });
  }
});

// POST - Crear nuevo usuario
app.post('/api/users', authenticateToken, async (req, res) => {
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
    if (
      !username ||
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !roleId
    ) {
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
    const passwordHash = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario
    const insertQuery = `
      INSERT INTO users (username, email, password_hash, first_name, last_name, role_id, department, position)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, username, email, first_name, last_name, department, position, role_id, created_at
    `;

    const result = await pool.query(insertQuery, [
      username,
      email,
      passwordHash,
      firstName,
      lastName,
      roleId,
      department,
      position,
    ]);

    const newUser = result.rows[0];

    // Obtener el nombre del rol
    const roleResult = await pool.query(
      'SELECT name FROM roles WHERE id = $1',
      [roleId],
    );
    const roleName = roleResult.rows[0]?.name || 'Unknown';

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
        role: roleName,
        roleId: newUser.role_id,
        isActive: true,
        createdAt: newUser.created_at,
      },
    });
  } catch (error) {
    console.error('❌ Create user error:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});

// PUT - Actualizar usuario
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      firstName,
      lastName,
      roleId,
      department,
      position,
      isActive,
    } = req.body;

    // Verificar si el usuario existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [id],
    );
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si username/email ya existen en otros usuarios
    const duplicateCheck = await pool.query(
      'SELECT id FROM users WHERE (username = $1 OR email = $2) AND id != $3',
      [username, email, id],
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        message: 'El usuario o email ya existe en otro registro',
      });
    }

    // Actualizar usuario
    const updateQuery = `
      UPDATE users 
      SET username = $1, email = $2, first_name = $3, last_name = $4, 
          role_id = $5, department = $6, position = $7, is_active = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING id, username, email, first_name, last_name, department, position, role_id, is_active, updated_at
    `;

    const result = await pool.query(updateQuery, [
      username,
      email,
      firstName,
      lastName,
      roleId,
      department,
      position,
      isActive,
      id,
    ]);

    const updatedUser = result.rows[0];

    // Obtener el nombre del rol
    const roleResult = await pool.query(
      'SELECT name FROM roles WHERE id = $1',
      [roleId],
    );
    const roleName = roleResult.rows[0]?.name || 'Unknown';

    res.json({
      message: 'Usuario actualizado exitosamente',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        department: updatedUser.department,
        position: updatedUser.position,
        role: roleName,
        roleId: updatedUser.role_id,
        isActive: updatedUser.is_active,
        updatedAt: updatedUser.updated_at,
      },
    });
  } catch (error) {
    console.error('❌ Update user error:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

// DELETE - Eliminar usuario (soft delete)
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el usuario existe
    const existingUser = await pool.query(
      'SELECT id, username FROM users WHERE id = $1',
      [id],
    );
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Soft delete - marcar como inactivo
    await pool.query(
      'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id],
    );

    res.json({
      message: `Usuario ${existingUser.rows[0].username} desactivado exitosamente`,
    });
  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
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
