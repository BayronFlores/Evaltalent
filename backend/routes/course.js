const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, courseController.getCourse);
router.put('/:id', authenticateToken, courseController.putCourse);

module.exports = router;
