const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authenticateToken = require('../middleware/authenticateToken');

// Todas las rutas de roles requieren autenticación

// Obtener todos los roles
router.get('/', authenticateToken, roleController.getAllRoles);

// Obtener todos los permisos disponibles
router.get('/permissions', authenticateToken, roleController.getAllPermissions);

// Obtener un rol específico por ID
router.get('/:id', authenticateToken, roleController.getRoleById);

// Obtener permisos de un rol específico
router.get(
  '/:id/permissions',
  authenticateToken,
  roleController.getRolePermissions,
);

// Crear un nuevo rol
router.post('/', authenticateToken, roleController.createRole);

// Actualizar un rol existente
router.put('/:id', authenticateToken, roleController.updateRole);

// Eliminar un rol
router.delete('/:id', authenticateToken, roleController.deleteRole);

module.exports = router;
