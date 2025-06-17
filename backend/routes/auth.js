const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Auth funcionando correctamente' });
});

// Rutas de autenticación
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', authenticateToken, authController.me);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
