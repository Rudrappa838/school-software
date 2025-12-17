const express = require('express');
const router = express.Router();
const doubtController = require('../controllers/doubtController');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');

// Student Routes
router.post('/my-doubts', authenticateToken, authorize('STUDENT'), doubtController.createDoubt);
router.get('/my-doubts', authenticateToken, authorize('STUDENT'), doubtController.getDoubtsForStudent);

// Teacher Routes
router.get('/teacher', authenticateToken, authorize('TEACHER'), doubtController.getDoubtsForTeacher);
router.put('/:id/reply', authenticateToken, authorize('TEACHER'), doubtController.replyToDoubt);

module.exports = router;
