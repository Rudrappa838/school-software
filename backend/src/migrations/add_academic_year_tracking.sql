-- Migration: Add Academic Year Tracking for Student Promotion System
-- This allows tracking student progression through different classes over years

-- 1. Add academic_year column to students table
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS academic_year VARCHAR(20) DEFAULT '2025-2026';

-- 2. Add academic_year to attendance table
ALTER TABLE attendance 
ADD COLUMN IF NOT EXISTS academic_year VARCHAR(20) DEFAULT '2025-2026';

-- 3. Add academic_year to marks table (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'marks') THEN
        ALTER TABLE marks ADD COLUMN IF NOT EXISTS academic_year VARCHAR(20) DEFAULT '2025-2026';
    END IF;
END $$;

-- 4. Add academic_year to fee_payments table (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fee_payments') THEN
        ALTER TABLE fee_payments ADD COLUMN IF NOT EXISTS academic_year VARCHAR(20) DEFAULT '2025-2026';
    END IF;
END $$;

-- 5. Create student_promotions table to track promotion history
CREATE TABLE IF NOT EXISTS student_promotions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    from_class_id INTEGER REFERENCES classes(id),
    from_section_id INTEGER REFERENCES sections(id),
    to_class_id INTEGER NOT NULL REFERENCES classes(id),
    to_section_id INTEGER REFERENCES sections(id),
    from_academic_year VARCHAR(20) NOT NULL,
    to_academic_year VARCHAR(20) NOT NULL,
    promoted_by INTEGER REFERENCES users(id),
    promoted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- 6. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_students_academic_year ON students(academic_year);
CREATE INDEX IF NOT EXISTS idx_attendance_academic_year ON attendance(academic_year);
CREATE INDEX IF NOT EXISTS idx_promotions_student ON student_promotions(student_id);
CREATE INDEX IF NOT EXISTS idx_promotions_school ON student_promotions(school_id);

-- 7. Add comments for documentation
COMMENT ON COLUMN students.academic_year IS 'Current academic year for the student (e.g., 2025-2026)';
COMMENT ON TABLE student_promotions IS 'Tracks student promotions between classes and academic years';
