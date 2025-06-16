const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const auth = require('../middleware/auth');

// GET /api/users - Obtener usuarios
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT u.id, u.username, u.email, u.first_name, u.last_name, 
             u.department, u.position, u.hire_date, u.is_active,
             r.name as role_name, r.id as role_id,
             m.first_name || ' ' || m.last_name as manager_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN users m ON u.manager_id = m.id
      WHERE u.is_active = true
      ORDER BY u.first_name, u.last_name
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT u.id, u.username, u.email, u.first_name, u.last_name, 
             u.department, u.position, u.hire_date, u.is_active,
             r.name as role_name, r.id as role_id,
             m.first_name || ' ' || m.last_name as manager_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN users m ON u.manager_id = m.id
      WHERE u.id = $1
    `,
      [req.params.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST /api/users - Crear usuario
router.post('/', auth, async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      role_id,
      department,
      position,
      manager_id,
    } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Usuario o email ya existe' });
    }

    // Hashear contraseña
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const { rows } = await pool.query(
      `
      INSERT INTO users (username, email, password_hash, first_name, last_name, role_id, department, position, manager_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, username, email, first_name, last_name, department, position, role_id
    `,
      [
        username,
        email,
        password_hash,
        first_name,
        last_name,
        role_id,
        department,
        position,
        manager_id,
      ],
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      username,
      email,
      first_name,
      last_name,
      role_id,
      department,
      position,
      manager_id,
      is_active,
    } = req.body;

    const { rows } = await pool.query(
      `
      UPDATE users 
      SET username = $1, email = $2, first_name = $3, last_name = $4, 
          role_id = $5, department = $6, position = $7, manager_id = $8, 
          is_active = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING id, username, email, first_name, last_name, department, position, role_id, is_active
    `,
      [
        username,
        email,
        first_name,
        last_name,
        role_id,
        department,
        position,
        manager_id,
        is_active,
        req.params.id,
      ],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// DELETE /api/users/:id - Eliminar usuario (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'UPDATE users SET is_active = false WHERE id = $1 RETURNING id',
      [req.params.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
