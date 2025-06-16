const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const auth = require('../middleware/auth');

// GET /api/evaluations - Obtener evaluaciones
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT e.*, 
             u1.first_name || ' ' || u1.last_name as evaluator_name,
             u2.first_name || ' ' || u2.last_name as evaluatee_name,
             ec.name as cycle_name,
             et.name as template_name
      FROM evaluations e
      LEFT JOIN users u1 ON e.evaluator_id = u1.id
      LEFT JOIN users u2 ON e.evaluatee_id = u2.id
      LEFT JOIN evaluation_cycles ec ON e.cycle_id = ec.id
      LEFT JOIN evaluation_templates et ON e.template_id = et.id
      ORDER BY e.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST /api/evaluations - Crear evaluación
router.post('/', auth, async (req, res) => {
  try {
    const { cycle_id, template_id, evaluatee_id, responses, score, comments } =
      req.body;

    const { rows } = await pool.query(
      `
      INSERT INTO evaluations (cycle_id, template_id, evaluator_id, evaluatee_id, responses, score, comments, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'completed')
      RETURNING *
    `,
      [
        cycle_id,
        template_id,
        req.user.id,
        evaluatee_id,
        JSON.stringify(responses),
        score,
        comments,
      ],
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating evaluation:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
