const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const auth = require('../middleware/auth');

// GET /api/reports - Obtener reportes
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT r.*, u.first_name || ' ' || u.last_name as generated_by_name
      FROM reports r
      LEFT JOIN users u ON r.generated_by = u.id
      ORDER BY r.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/reports/dashboard - Obtener datos del dashboard
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Estadísticas generales
    const totalUsers = await pool.query(
      'SELECT COUNT(*) FROM users WHERE is_active = true',
    );
    const totalEvaluations = await pool.query(
      'SELECT COUNT(*) FROM evaluations',
    );
    const pendingEvaluations = await pool.query(
      'SELECT COUNT(*) FROM evaluations WHERE status = $1',
      ['pending'],
    );
    const completedEvaluations = await pool.query(
      'SELECT COUNT(*) FROM evaluations WHERE status = $1',
      ['completed'],
    );

    // Evaluaciones recientes
    const recentEvaluations = await pool.query(`
      SELECT e.*, 
             u1.first_name || ' ' || u1.last_name as evaluator_name,
             u2.first_name || ' ' || u2.last_name as evaluatee_name
      FROM evaluations e
      LEFT JOIN users u1 ON e.evaluator_id = u1.id
      LEFT JOIN users u2 ON e.evaluatee_id = u2.id
      ORDER BY e.created_at DESC
      LIMIT 5
    `);

    // Distribución por departamento
    const departmentStats = await pool.query(`
      SELECT department, COUNT(*) as count
      FROM users 
      WHERE is_active = true AND department IS NOT NULL
      GROUP BY department
      ORDER BY count DESC
    `);

    const dashboardData = {
      stats: {
        totalUsers: parseInt(totalUsers.rows[0].count),
        totalEvaluations: parseInt(totalEvaluations.rows[0].count),
        pendingEvaluations: parseInt(pendingEvaluations.rows[0].count),
        completedEvaluations: parseInt(completedEvaluations.rows[0].count),
      },
      recentEvaluations: recentEvaluations.rows,
      departmentStats: departmentStats.rows,
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST /api/reports - Crear reporte
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, filters, data } = req.body;

    const { rows } = await pool.query(
      `
      INSERT INTO reports (name, type, filters, data, generated_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
      [name, type, JSON.stringify(filters), JSON.stringify(data), req.user.id],
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
