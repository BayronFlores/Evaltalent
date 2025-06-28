const pool = require('../config/database');

exports.getEvaluations = async (req, res) => {
  try {
    let query = `
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
    `;

    const params = [];

    if (req.user.role === 'admin') {
      // Sin filtro, ve todas las evaluaciones
    } else if (req.user.role === 'manager') {
      query += ` WHERE e.evaluatee_id IN (SELECT id FROM users WHERE manager_id = $1)`;
      params.push(req.user.id);
    } else if (req.user.role === 'employee') {
      query += ` WHERE e.evaluator_id = $1`;
      params.push(req.user.id);
    } else {
      // Si hay otros roles, no mostrar evaluaciones
      return res
        .status(403)
        .json({ message: 'No autorizado para ver evaluaciones' });
    }

    query += ' ORDER BY e.created_at DESC';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.createEvaluation = async (req, res) => {
  try {
    const { cycle_id, template_id, evaluatee_id, responses, score, comments } =
      req.body;

    if (req.user.role === 'manager') {
      const teamCheck = await pool.query(
        'SELECT id FROM users WHERE id = $1 AND manager_id = $2',
        [evaluatee_id, req.user.id],
      );
      if (teamCheck.rows.length === 0) {
        return res.status(403).json({
          message: 'No puede evaluar a usuarios fuera de su equipo',
        });
      }
    }

    if (req.user.role === 'employee' && evaluatee_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'No autorizado para evaluar a otros usuarios' });
    }

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
};

exports.updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const { responses, score, comments, status } = req.body;

    if (req.user.role === 'manager') {
      const evalCheck = await pool.query(
        'SELECT * FROM evaluations WHERE id = $1 AND evaluatee_id IN (SELECT id FROM users WHERE manager_id = $2)',
        [id, req.user.id],
      );
      if (evalCheck.rows.length === 0) {
        return res
          .status(403)
          .json({ message: 'No autorizado para editar esta evaluación' });
      }
    }

    if (req.user.role === 'employee') {
      return res
        .status(403)
        .json({ message: 'No autorizado para editar evaluaciones' });
    }

    const { rows } = await pool.query(
      `
      UPDATE evaluations
      SET responses = $1, score = $2, comments = $3, status = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
      `,
      [JSON.stringify(responses), score, comments, status, id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Evaluación no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating evaluation:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deleteEvaluation = async (req, res) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query(
      'DELETE FROM evaluations WHERE id = $1',
      [id],
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Evaluación no encontrada' });
    }

    res.json({ message: 'Evaluación eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
