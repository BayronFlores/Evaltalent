const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeAdmin = require('../middleware/authorizeAdmin');

// Todas las rutas de usuarios requieren autenticación
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/team', authenticateToken, userController.getTeam);
router.post('/', authenticateToken, userController.createUser);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.activeUser);
router.delete(
  '/permanent/:id',
  authenticateToken,
  authorizeAdmin,
  userController.deleteUserPermanently,
);

module.exports = router;
