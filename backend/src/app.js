const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logger
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));
app.use('/api/library', require('./routes/libraryRoutes'));
app.use('/api/salary', require('./routes/salaryRoutes'));
app.use('/api/timetable', require('./routes/timetableRoutes'));
app.use('/api/marks', require('./routes/marksRoutes'));
app.use('/api/exam-schedule', require('./routes/examScheduleRoutes'));
app.use('/api/hostel', require('./routes/hostelRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/transport', require('./routes/transportRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/admissions', require('./routes/admissionsRoutes'));
app.use('/api/biometric', require('./routes/biometricRoutes'));
app.use('/api/doubts', require('./routes/doubtRoutes'));

// Basic Health Check Route
app.get('/', (req, res) => {
    res.json({ message: 'School Management System API is running 🚀' });
});

module.exports = app;
