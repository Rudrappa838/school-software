const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const { searchUsers, updateCredentials, markDeviceAttendance, handleExternalDeviceLog } = require('../controllers/biometricController');

// PUBLIC WEBHOOK (For Devices)
router.all('/external-log', handleExternalDeviceLog);

// PROTECTED ROUTES (Dashboard)
router.use(authenticateToken);
router.get('/search', authorize('SCHOOL_ADMIN'), searchUsers);
router.post('/enroll', authorize('SCHOOL_ADMIN'), updateCredentials);

// Device Attendance can be hit by Admin (Scanning using PC)
// Ideally devices have their own token, but for now assuming Admin Dashboard usage
router.post('/attendance', authorize('SCHOOL_ADMIN'), markDeviceAttendance);

module.exports = router;
