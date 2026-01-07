-- Add exam_type_id column to grades table
-- This allows different grade configurations for different exam types

ALTER TABLE grades 
ADD COLUMN IF NOT EXISTS exam_type_id INTEGER REFERENCES exam_types(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_grades_exam_type ON grades(exam_type_id);

-- Note: Existing grades will have NULL exam_type_id
-- You may want to assign them to a default exam type or delete them
