const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/database');

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/evidences/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: multer.memoryStorage() });

// Middleware combinado: multer + lógica
exports.uploadEvidence = (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error('Error en multer:', err);
      return res
        .status(400)
        .json({ message: 'Error al subir archivo', error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Archivo no recibido' });
    }

    try {
      const evaluationId = req.params.id;
      const userId = req.user.id;

      // Validar que la evaluación exista y permisos (igual que antes)
      const evalCheck = await pool.query(
        'SELECT * FROM evaluations WHERE id = $1',
        [evaluationId],
      );
      if (evalCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Evaluación no encontrada' });
      }
      const evaluation = evalCheck.rows[0];

      if (req.user.role === 'employee' && evaluation.evaluatee_id !== userId) {
        return res
          .status(403)
          .json({ message: 'No autorizado para subir evidencia' });
      }
      if (req.user.role === 'manager') {
        const teamCheck = await pool.query(
          'SELECT id FROM users WHERE id = $1 AND manager_id = $2',
          [evaluation.evaluatee_id, userId],
        );
        if (teamCheck.rows.length === 0) {
          return res
            .status(403)
            .json({ message: 'No autorizado para subir evidencia' });
        }
      }

      // Guardar archivo en base de datos
      const { originalname, buffer, mimetype } = req.file;

      const { rows } = await pool.query(
        `INSERT INTO evaluation_evidences (evaluation_id, file_name, file_data, uploaded_by)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [evaluationId, originalname, buffer, userId],
      );

      res.status(201).json({ message: 'Evidencia subida', evidence: rows[0] });
    } catch (error) {
      console.error('Error subiendo evidencia:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });
};

exports.parseFormData = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Error en multer:', err);
      return res
        .status(400)
        .json({ message: 'Error al subir archivo', error: err.message });
    }

    console.log('Campos recibidos:', req.body);
    console.log('Archivo recibido:', req.file);

    if (req.body.responses) {
      try {
        req.body.responses = JSON.parse(req.body.responses);
      } catch (e) {
        console.error('Error parseando respuestas:', e);
        return res
          .status(400)
          .json({ message: 'Formato inválido en respuestas' });
      }
    } else {
      req.body.responses = {};
    }

    next();
  });
};

exports.getEvidenceFile = async (req, res) => {
  try {
    const { id } = req.params; // id de la evidencia

    const { rows } = await pool.query(
      'SELECT file_name, file_data FROM evaluation_evidences WHERE id = $1',
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }

    const file = rows[0];
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.file_name}"`,
    );
    // Opcional: setear Content-Type si lo tienes guardado
    res.send(file.file_data);
  } catch (error) {
    console.error('Error obteniendo archivo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.sendEvaluation = async (req, res) => {
  try {
    const { evaluationId } = req.params;
    const evaluation = await Evaluation.findByPk(evaluationId);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    evaluation.status = 'sent';
    await evaluation.save();
    res.status(200).json({ message: 'Evaluation sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.downloadEvaluationFile = async (req, res) => {
  try {
    const { evaluationId } = req.params;
    const evaluation = await Evaluation.findByPk(evaluationId);
    if (!evaluation || !evaluation.filePath) {
      return res.status(404).json({ message: 'File not found' });
    }
    const filePath = path.resolve(evaluation.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }
    res.download(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
