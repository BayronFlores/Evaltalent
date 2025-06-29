const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const evaluationEvidenceController = require('../controllers/evaluationEvidenceController');
const authenticateToken = require('../middleware/authenticateToken');

// Middleware para verificar permisos
const checkPermission = (permission) => {
  return (req, res, next) => {
    console.log('Permisos del usuario:', req.user.permissions);
    console.log('Permiso requerido:', permission);
    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    next();
  };
};

// Rutas de evaluaciones
router.get(
  '/',
  authenticateToken,
  checkPermission('evaluations.read'),
  evaluationController.getEvaluations,
);

router.post(
  '/',
  authenticateToken,
  checkPermission('evaluations.create'),
  evaluationController.createEvaluation,
);

router.get(
  '/my-results',
  authenticateToken,
  checkPermission('evaluations.read'), // o un permiso más específico si tienes
  evaluationController.getMyResults,
);

router.put(
  '/:id',
  authenticateToken,
  checkPermission('evaluations.update'),
  evaluationEvidenceController.parseFormData,
  evaluationController.updateEvaluation,
);

router.delete(
  '/:id',
  authenticateToken,
  checkPermission('evaluations.delete'),
  evaluationController.deleteEvaluation,
);

router.patch(
  '/:id/progress',
  authenticateToken,
  evaluationController.saveEvaluationProgress,
);

router.post(
  '/:id/evidences',
  authenticateToken,
  evaluationEvidenceController.parseFormData,
  evaluationEvidenceController.uploadEvidence,
);

router.put(
  '/send/:evaluationId',
  authenticateToken,
  evaluationEvidenceController.sendEvaluation,
);

// Descargar archivo evaluación (admin, manager, employee)
router.get(
  '/download/:evaluationId',
  authenticateToken,
  evaluationEvidenceController.downloadEvaluationFile,
);

module.exports = router;
