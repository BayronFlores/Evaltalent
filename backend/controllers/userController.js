const pool = require('../config/database');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
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
};

exports.createUser = async (req, res) => {
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
};

exports.updateUser = async (req, res) => {
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
};

exports.deleteUser = async (req, res) => {
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
};
exports.getTeam = async (req, res) => {
  try {
    const manager_id = req.user.id; // El id del usuario autenticado (manager)

    // 🔍 LOG 1: Verificar el ID del manager
    console.log('🔍 ID del manager autenticado:', manager_id);
    console.log('🔍 Tipo del manager_id:', typeof manager_id);

    const query = `
      SELECT u.id, u.username, u.email, u.first_name, u.last_name, 
             u.department, u.position, u.hire_date, u.is_active, u.created_at,
             r.name as role_name, r.id as role_id
      FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE u.manager_id = $1 AND u.is_active = true
      ORDER BY u.first_name, u.last_name
    `;

    // 🔍 LOG 2: Verificar la consulta que se va a ejecutar
    console.log('🔍 Query a ejecutar:', query);
    console.log('🔍 Parámetro manager_id:', manager_id);

    const result = await pool.query(query, [manager_id]);

    // 🔍 LOG 3: Verificar el resultado de la consulta
    console.log('🔍 Filas encontradas:', result.rows.length);
    console.log('🔍 Datos crudos de la DB:', result.rows);

    const mappedTeam = result.rows.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      department: user.department,
      position: user.position,
      hireDate: user.hire_date,
      role: user.role_name,
      roleId: user.role_id,
      isActive: user.is_active,
      createdAt: user.created_at,
    }));

    // 🔍 LOG 4: Verificar el resultado final
    console.log('🔍 Team mapeado final:', mappedTeam);

    res.json({
      team: mappedTeam,
    });
  } catch (error) {
    console.error('❌ Get team error:', error);
    res.status(500).json({ message: 'Error al obtener el equipo' });
  }
};
