const pool = require('../config/database');

class ReportService {
  static async generateReport(type, filters = {}) {
    switch (type) {
      case 'evaluaciones_por_usuario':
        return await this.generateUserEvaluationsReport(filters);
      case 'evaluaciones_por_departamento':
        return await this.generateDepartmentEvaluationsReport(filters);
      case 'rendimiento_general':
        return await this.generatePerformanceReport(filters);
      case 'evaluaciones_pendientes':
        return await this.generatePendingEvaluationsReport(filters);
      default:
        throw new Error('Tipo de reporte no soportado');
    }
  }

  static async generateUserEvaluationsReport(filters) {
    let query = `
      SELECT 
        u.id,
        u.first_name || ' ' || u.last_name as nombre_completo,
        u.department,
        u.position,
        COUNT(e.id) as total_evaluaciones,
        COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as evaluaciones_completadas,
        COUNT(CASE WHEN e.status = 'pending' THEN 1 END) as evaluaciones_pendientes,
        AVG(CASE WHEN e.status = 'completed' AND e.score IS NOT NULL THEN e.score END) as promedio_score
      FROM users u
      LEFT JOIN evaluations e ON u.id = e.evaluatee_id
      WHERE u.is_active = true
    `;

    const params = [];
    if (filters.department) {
      query += ` AND u.department = $${params.length + 1}`;
      params.push(filters.department);
    }
    if (filters.dateFrom) {
      query += ` AND e.created_at >= $${params.length + 1}`;
      params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
      query += ` AND e.created_at <= $${params.length + 1}`;
      params.push(filters.dateTo);
    }

    query += ` GROUP BY u.id, u.first_name, u.last_name, u.department, u.position ORDER BY u.last_name`;

    const { rows } = await pool.query(query, params);
    return rows;
  }

  static async generateDepartmentEvaluationsReport(filters) {
    let query = `
      SELECT 
        u.department,
        COUNT(DISTINCT u.id) as total_empleados,
        COUNT(e.id) as total_evaluaciones,
        COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as evaluaciones_completadas,
        AVG(CASE WHEN e.status = 'completed' AND e.score IS NOT NULL THEN e.score END) as promedio_score
      FROM users u
      LEFT JOIN evaluations e ON u.id = e.evaluatee_id
      WHERE u.is_active = true AND u.department IS NOT NULL
    `;

    const params = [];
    if (filters.dateFrom) {
      query += ` AND e.created_at >= $${params.length + 1}`;
      params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
      query += ` AND e.created_at <= $${params.length + 1}`;
      params.push(filters.dateTo);
    }

    query += ` GROUP BY u.department ORDER BY u.department`;

    const { rows } = await pool.query(query, params);
    return rows;
  }

  static async generatePerformanceReport(filters) {
    let query = `
      SELECT 
        e.id,
        u1.first_name || ' ' || u1.last_name as evaluador,
        u2.first_name || ' ' || u2.last_name as evaluado,
        u2.department,
        e.title,
        e.score,
        e.status,
        e.created_at,
        e.completed_at
      FROM evaluations e
      LEFT JOIN users u1 ON e.evaluator_id = u1.id
      LEFT JOIN users u2 ON e.evaluatee_id = u2.id
      WHERE 1=1
    `;

    const params = [];
    if (filters.status) {
      query += ` AND e.status = $${params.length + 1}`;
      params.push(filters.status);
    }
    if (filters.department) {
      query += ` AND u2.department = $${params.length + 1}`;
      params.push(filters.department);
    }
    if (filters.dateFrom) {
      query += ` AND e.created_at >= $${params.length + 1}`;
      params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
      query += ` AND e.created_at <= $${params.length + 1}`;
      params.push(filters.dateTo);
    }

    query += ` ORDER BY e.created_at DESC`;

    const { rows } = await pool.query(query, params);
    return rows;
  }

  static async generatePendingEvaluationsReport(filters) {
    let query = `
      SELECT 
        e.id,
        e.title,
        u1.first_name || ' ' || u1.last_name as evaluador,
        u2.first_name || ' ' || u2.last_name as evaluado,
        u2.department,
        e.due_date,
        CASE 
          WHEN e.due_date < CURRENT_DATE THEN 'Vencida'
          WHEN e.due_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'Por vencer'
          ELSE 'En tiempo'
        END as estado_vencimiento,
        e.created_at
      FROM evaluations e
      LEFT JOIN users u1 ON e.evaluator_id = u1.id
      LEFT JOIN users u2 ON e.evaluatee_id = u2.id
      WHERE e.status = 'pending'
    `;

    const params = [];
    if (filters.department) {
      query += ` AND u2.department = $${params.length + 1}`;
      params.push(filters.department);
    }

    query += ` ORDER BY e.due_date ASC`;

    const { rows } = await pool.query(query, params);
    return rows;
  }
}

module.exports = ReportService;
