const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticateToken');
const reportController = require('../controllers/reportController');

router.get('/', auth, reportController.getReports);
router.get('/types', auth, reportController.getReportTypes);
router.get('/dashboard', auth, reportController.getDashboard);
router.post('/', auth, reportController.createReport);
router.get('/:id/export/pdf', auth, reportController.exportPDF);
router.get('/:id/export/excel', auth, reportController.exportExcel);
router.delete('/:id', auth, reportController.deleteReport);

module.exports = router;
