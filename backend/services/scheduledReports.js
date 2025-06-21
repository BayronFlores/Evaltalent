const cron = require('node-cron');
const pool = require('../config/database');
const ReportService = require('./reportService');

class ScheduledReports {
  static init() {
    // Reporte semanal de evaluaciones pendientes - Lunes 8:00 AM
    cron.schedule('0 8 * * 1', async () => {
      try {
        console.log('Generando reporte semanal de evaluaciones pendientes...');
        const data = await ReportService.generateReport(
          'evaluaciones_pendientes',
          {},
        );

        await pool.query(
          `INSERT INTO reports (name, type, filters, data, generated_by)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            `Reporte Semanal - Evaluaciones Pendientes ${new Date().toLocaleDateString(
              'es-ES',
            )}`,
            'evaluaciones_pendientes',
            '{}',
            JSON.stringify(data),
            1, // ID del usuario admin o sistema
          ],
        );

        console.log('Reporte semanal generado correctamente');
      } catch (error) {
        console.error('Error generando reporte semanal:', error);
      }
    });

    // Reporte mensual de rendimiento - Primer día del mes 9:00 AM
    cron.schedule('0 9 1 * *', async () => {
      try {
        console.log('Generando reporte mensual de rendimiento...');
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const filters = {
          dateFrom: new Date(
            lastMonth.getFullYear(),
            lastMonth.getMonth(),
            1,
          ).toISOString(),
          dateTo: new Date(
            lastMonth.getFullYear(),
            lastMonth.getMonth() + 1,
            0,
          ).toISOString(),
        };

        const data = await ReportService.generateReport(
          'rendimiento_general',
          filters,
        );

        await pool.query(
          `INSERT INTO reports (name, type, filters, data, generated_by)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            `Reporte Mensual - Rendimiento ${lastMonth.toLocaleDateString(
              'es-ES',
              { month: 'long', year: 'numeric' },
            )}`,
            'rendimiento_general',
            JSON.stringify(filters),
            JSON.stringify(data),
            1,
          ],
        );

        console.log('Reporte mensual generado correctamente');
      } catch (error) {
        console.error('Error generando reporte mensual:', error);
      }
    });
  }
}

module.exports = ScheduledReports;
