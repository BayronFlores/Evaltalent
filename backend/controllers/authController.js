const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    console.log('📝 Login request received:', req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      console.log('❌ Missing credentials');
      return res.status(400).json({
        message: 'Usuario y contraseña son requeridos',
      });
    }

    // Buscar usuario y rol
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

    console.log('🔍 Usuario encontrado en DB:', {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role_name,
    });

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', username);
      return res.status(401).json({
        message: 'Credenciales inválidas',
      });
    }

    if (!user.is_active) {
      console.log('❌ Usuario inactivo:', username);
      return res.status(403).json({
        message: 'Su usuario no está activo',
      });
    }

    // Obtener permisos del rol
    const permissionsResult = await pool.query(
      `SELECT p.name
       FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       WHERE rp.role_id = $1 AND rp.granted = true`,
      [user.role_id],
    );

    const permissions = permissionsResult.rows.map((row) => row.name);

    // Crear payload del token con permisos
    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role_name,
      permissions: permissions,
    };

    console.log('🔍 Token payload que se va a firmar:', tokenPayload);

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    console.log('🔍 Token generado:', token);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔍 Token decodificado inmediatamente:', decodedToken);

    console.log('✅ Login successful for user:', user.username);

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
        hireDate: user.hire_date,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        managerId: user.manager_id,
        permissions: permissions, // opcional incluir en la respuesta
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.register = async (req, res) => {
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
};

exports.me = async (req, res) => {
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
};

exports.logout = (req, res) => {
  // En JWT, el logout se maneja en el frontend eliminando el token
  // Aquí podrías implementar una blacklist de tokens si fuera necesario
  res.json({ message: 'Logout exitoso' });
};
