const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const reportController = require('../controllers/reportController');

router.get('/', authenticateToken, reportController.getReports);
router.get('/types', authenticateToken, reportController.getReportTypes);
router.get('/dashboard', authenticateToken, reportController.getDashboard);
router.post('/', authenticateToken, reportController.createReport);
router.get('/:id/export/pdf', authenticateToken, reportController.exportPDF);
router.get(
  '/:id/export/excel',
  authenticateToken,
  reportController.exportExcel,
);
router.delete('/:id', authenticateToken, reportController.deleteReport);
router.get('/global', authenticateToken, reportController.getGlobalReport);
router.get('/manager', authenticateToken, reportController.getManagerReport);

module.exports = router;
