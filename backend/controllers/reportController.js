// controllers/reportController.js

const pool = require('../config/database');
const ReportService = require('../services/reportService');
const ExportService = require('../services/exportService');

// Obtener reportes con filtros
exports.getReports = async (req, res) => {
  try {
    const { type, generated_by, from, to, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT r.*, u.first_name || ' ' || u.last_name as generated_by_name
      FROM reports r
      LEFT JOIN users u ON r.generated_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (type) {
      query += ` AND r.type = $${params.length + 1}`;
      params.push(type);
    }
    if (generated_by) {
      query += ` AND r.generated_by = $${params.length + 1}`;
      params.push(generated_by);
    }
    if (from) {
      query += ` AND r.created_at >= $${params.length + 1}`;
      params.push(from);
    }
    if (to) {
      query += ` AND r.created_at <= $${params.length + 1}`;
      params.push(to);
    }

    query += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1} OFFSET $${
      params.length + 2
    }`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener tipos de reportes disponibles
exports.getReportTypes = (req, res) => {
  const reportTypes = [
    { value: 'evaluaciones_por_usuario', label: 'Evaluaciones por Usuario' },
    {
      value: 'evaluaciones_por_departamento',
      label: 'Evaluaciones por Departamento',
    },
    { value: 'rendimiento_general', label: 'Rendimiento General' },
    { value: 'evaluaciones_pendientes', label: 'Evaluaciones Pendientes' },
  ];
  res.json(reportTypes);
};

// Obtener datos del dashboard
exports.getDashboard = async (req, res) => {
  try {
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
};

// Crear reporte con generación automática
exports.createReport = async (req, res) => {
  try {
    const { name, type, filters = {} } = req.body;

    // Generar datos del reporte automáticamente
    const data = await ReportService.generateReport(type, filters);

    const { rows } = await pool.query(
      `INSERT INTO reports (name, type, filters, data, generated_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [name, type, JSON.stringify(filters), JSON.stringify(data), req.user.id],
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating report:', error);
    res
      .status(500)
      .json({ message: error.message || 'Error interno del servidor' });
  }
};

// Exportar reporte a PDF
exports.exportPDF = async (req, res) => {
  console.log('Exportando PDF para el reporte:', req.params.id);
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM reports WHERE id = $1', [
      id,
    ]);

    if (!rows.length) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    const report = rows[0];
    await ExportService.exportToPDF(report.data, report.name, res);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    res.status(500).json({ message: 'Error al exportar PDF' });
  }
};

// Exportar reporte a Excel
exports.exportExcel = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM reports WHERE id = $1', [
      id,
    ]);

    if (!rows.length) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    const report = rows[0];
    await ExportService.exportToExcel(report.data, report.name, res);
  } catch (error) {
    console.error('Error exporting Excel:', error);
    res.status(500).json({ message: 'Error al exportar Excel' });
  }
};

// Eliminar reporte
exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'DELETE FROM reports WHERE id = $1 RETURNING *',
      [id],
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    res.json({ message: 'Reporte eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
