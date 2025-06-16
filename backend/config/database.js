const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'evaltalent',
  user: process.env.DB_USER || 'evaltalent',
  password: process.env.DB_PASSWORD || 'evaltalent123',
});

// Probar conexión al inicializar
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error en PostgreSQL:', err);
});

module.exports = pool;
