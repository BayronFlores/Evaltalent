const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Usa tu conexión a la base de datos

// Obtener todos los roles
router.get('/', async (req, res) => {
  const roles = await db.query('SELECT * FROM roles');
  res.json(roles.rows);
});

// Obtener todos los permisos
router.get('/permissions', async (req, res) => {
  const permissions = await db.query('SELECT * FROM permissions');
  res.json(permissions.rows);
});

// Crear un nuevo rol
router.post('/', async (req, res) => {
  const { name, description, permissions } = req.body;
  const result = await db.query(
    'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *',
    [name, description],
  );
  const role = result.rows[0];
  // Asignar permisos
  for (const permId of permissions) {
    await db.query(
      'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
      [role.id, permId],
    );
  }
  res.json(role);
});

// Actualizar un rol
router.put('/:id', async (req, res) => {
  const { name, description, permissions } = req.body;
  const { id } = req.params;
  await db.query('UPDATE roles SET name=$1, description=$2 WHERE id=$3', [
    name,
    description,
    id,
  ]);
  // Actualizar permisos
  await db.query('DELETE FROM role_permissions WHERE role_id=$1', [id]);
  for (const permId of permissions) {
    await db.query(
      'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)',
      [id, permId],
    );
  }
  res.json({ success: true });
});

// Eliminar un rol
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM roles WHERE id=$1', [id]);
  res.json({ success: true });
});

// Obtener permisos de un rol
router.get('/:id/permissions', async (req, res) => {
  const { id } = req.params;
  const perms = await db.query(
    `SELECT p.* FROM permissions p
     JOIN role_permissions rp ON rp.permission_id = p.id
     WHERE rp.role_id = $1`,
    [id],
  );
  res.json(perms.rows);
});

module.exports = router;
