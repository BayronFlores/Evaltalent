// controllers/roleController.js
const pool = require('../config/database');

const roleController = {
  // Obtener todos los roles
  getAllRoles: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, name, description, created_at, updated_at 
        FROM roles 
        ORDER BY name
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching roles:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Obtener todos los permisos disponibles
  getAllPermissions: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, name, description 
        FROM permissions 
        ORDER BY name
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Obtener un rol específico por ID
  getRoleById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT id, name, description, created_at, updated_at FROM roles WHERE id = $1',
        [id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Rol no encontrado' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching role:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Obtener permisos de un rol específico
  getRolePermissions: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `
        SELECT p.id, p.name, p.description
        FROM permissions p
        INNER JOIN role_permissions rp ON p.id = rp.permission_id
        WHERE rp.role_id = $1
        ORDER BY p.name
      `,
        [id],
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Crear un nuevo rol
  createRole: async (req, res) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { name, description, permissions = [] } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ error: 'El nombre del rol es requerido' });
      }

      // Crear el rol
      const roleResult = await client.query(
        'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *',
        [name, description],
      );

      const newRole = roleResult.rows[0];

      // Asignar permisos si se proporcionaron
      if (permissions.length > 0) {
        const permissionValues = permissions
          .map((permId) => `(${newRole.id}, ${permId})`)
          .join(',');
        await client.query(`
          INSERT INTO role_permissions (role_id, permission_id) 
          VALUES ${permissionValues}
        `);
      }

      await client.query('COMMIT');
      res.status(201).json(newRole);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating role:', error);

      if (error.code === '23505') {
        // Unique violation
        res.status(400).json({ error: 'Ya existe un rol con ese nombre' });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    } finally {
      client.release();
    }
  },

  // Actualizar un rol existente
  updateRole: async (req, res) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { id } = req.params;
      const { name, description, permissions = [] } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ error: 'El nombre del rol es requerido' });
      }

      // Actualizar el rol
      const roleResult = await client.query(
        'UPDATE roles SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        [name, description, id],
      );

      if (roleResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Rol no encontrado' });
      }

      // Eliminar permisos existentes
      await client.query('DELETE FROM role_permissions WHERE role_id = $1', [
        id,
      ]);

      // Asignar nuevos permisos
      if (permissions.length > 0) {
        const permissionValues = permissions
          .map((permId) => `(${id}, ${permId})`)
          .join(',');
        await client.query(`
          INSERT INTO role_permissions (role_id, permission_id) 
          VALUES ${permissionValues}
        `);
      }

      await client.query('COMMIT');
      res.json(roleResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating role:', error);

      if (error.code === '23505') {
        res.status(400).json({ error: 'Ya existe un rol con ese nombre' });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    } finally {
      client.release();
    }
  },

  // Eliminar un rol
  deleteRole: async (req, res) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { id } = req.params;

      // Verificar si el rol existe
      const roleCheck = await client.query(
        'SELECT id FROM roles WHERE id = $1',
        [id],
      );
      if (roleCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Rol no encontrado' });
      }

      // Eliminar permisos del rol
      await client.query('DELETE FROM role_permissions WHERE role_id = $1', [
        id,
      ]);

      // Eliminar el rol
      await client.query('DELETE FROM roles WHERE id = $1', [id]);

      await client.query('COMMIT');
      res.json({ message: 'Rol eliminado exitosamente' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error deleting role:', error);

      if (error.code === '23503') {
        // Foreign key violation
        res.status(400).json({
          error:
            'No se puede eliminar el rol porque está siendo usado por usuarios',
        });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    } finally {
      client.release();
    }
  },
};

module.exports = roleController;
