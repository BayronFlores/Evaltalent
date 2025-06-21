const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const roleRoutes = require('./routes/roles');
const reportRoutes = require('./routes/reports'); // ← AGREGAR ESTA LÍNEA
const ScheduledReports = require('./services/scheduledReports');

const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

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

// Usar las rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/reports', reportRoutes);

ScheduledReports.init();

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
  console.log('   GET  /api/users - Obtener usuarios');
  console.log('   POST /api/users - Crear usuario');
  console.log('   PUT  /api/users/:id - Actualizar usuario');
  console.log('   DELETE /api/users/:id - Eliminar usuario');
  console.log('   GET  /api/roles - Obtener roles');
  console.log('   GET  /api/reports - Obtener reportes'); // ← AGREGAR
  console.log('   GET  /api/reports/types - Tipos de reportes'); // ← AGREGAR
  console.log('   POST /api/reports - Crear reporte'); // ← AGREGAR
  console.log('Reportes programados inicializados');
});
