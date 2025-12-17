const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken: protect, authorize } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Student Profile (Accessible by Student)
router.get('/profile', authorize('STUDENT'), studentController.getStudentProfile);
router.get('/attendance/my-report', authorize('STUDENT'), studentController.getMyAttendanceReport);
router.get('/my-attendance', authorize('STUDENT'), studentController.getMyAttendanceReport);
router.get('/my-fees', authorize('STUDENT'), studentController.getMyFees);

// Restrict remaining routes to Admin/Teacher
router.use(authorize('SCHOOL_ADMIN', 'TEACHER', 'STAFF')); // Added STAFF if they need access, usually Admin/Teacher

router.post('/', studentController.addStudent);
router.get('/', studentController.getStudents);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

router.post('/attendance', studentController.markAttendance);
router.get('/attendance', studentController.getAttendanceReport);

router.get('/attendance/summary', studentController.getAttendanceSummary);
router.get('/attendance/daily', studentController.getDailyAttendance);
router.post('/roll-numbers', studentController.reorderRollNumbers);

module.exports = router;
