-- SQL Script to Check and Create Attendance Tables

-- Check if teacher_attendance table exists and create if needed
CREATE TABLE IF NOT EXISTS teacher_attendance (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(teacher_id, date)
);

-- Check if staff_attendance table exists and create if needed
CREATE TABLE IF NOT EXISTS staff_attendance (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL,
    staff_id INTEGER NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, date)
);

-- Check if you have any teachers
SELECT COUNT(*) as teacher_count FROM teachers;

-- Check if you have any staff
SELECT COUNT(*) as staff_count FROM staff;

-- Check if school_holidays table exists
SELECT COUNT(*) as holiday_count FROM school_holidays;
