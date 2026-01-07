# Student Promotion System - Documentation

## Overview
The Student Promotion System allows school administrators to promote students from one class to another while preserving all historical data (attendance, marks, fees) linked to specific academic years.

## Features

### 1. **Bulk Student Promotion**
- Select multiple students using checkboxes
- Promote them all at once to a new class
- Automatically tracks promotion history

### 2. **Academic Year Tracking**
- All student records are tagged with an academic year (e.g., "2025-2026")
- Historical data is preserved when students are promoted
- Attendance, marks, and fees remain linked to the correct academic year

### 3. **Data Preservation**
- When a student is promoted:
  - Old attendance records remain in the database with the previous academic year
  - Old marks remain linked to the previous academic year
  - Old fee payments remain linked to the previous academic year
  - The student's current class is updated to the new class
  - The academic year is updated to the new year

### 4. **Promotion History**
- Every promotion is recorded in the `student_promotions` table
- Track: From Class → To Class, From Year → To Year
- See who promoted the student and when
- Add notes for each promotion

## How to Use

### For Administrators:

1. **Navigate to Student Management**
   - Go to School Admin Dashboard → Students → Student Management

2. **Select Students to Promote**
   - Use checkboxes to select individual students
   - Or click the header checkbox to select all students in the current view
   - Filter by class/section first to promote specific groups

3. **Click "Promote" Button**
   - The button appears when at least one student is selected
   - Shows the count of selected students

4. **Fill Promotion Details**
   - **Target Class**: Select the class students will be promoted to
   - **Target Section**: Select the section (if applicable)
   - **Academic Year**: Automatically set to current year, can be modified
   - **Notes**: Optional notes about the promotion

5. **Confirm Promotion**
   - Click "Promote X Students" button
   - System will:
     - Update each student's class and academic year
     - Record the promotion in history
     - Preserve all old data

## Database Schema

### New Tables:

#### `student_promotions`
```sql
- id: Serial Primary Key
- student_id: Reference to students table
- school_id: Reference to schools table
- from_class_id: Previous class
- from_section_id: Previous section
- to_class_id: New class
- to_section_id: New section
- from_academic_year: Previous academic year (e.g., "2024-2025")
- to_academic_year: New academic year (e.g., "2025-2026")
- promoted_by: User who performed the promotion
- promoted_at: Timestamp of promotion
- notes: Optional notes
```

### Modified Tables:

#### `students`
- Added: `academic_year` VARCHAR(20) - Current academic year

#### `attendance`
- Added: `academic_year` VARCHAR(20) - Year when attendance was marked

#### `marks` (if exists)
- Added: `academic_year` VARCHAR(20) - Year when marks were recorded

#### `fee_payments` (if exists)
- Added: `academic_year` VARCHAR(20) - Year when fee was paid

## API Endpoints

### POST `/api/students/promote`
Promote multiple students to a new class

**Request Body:**
```json
{
  "student_ids": [1, 2, 3],
  "to_class_id": 5,
  "to_section_id": 2,
  "to_academic_year": "2025-2026",
  "notes": "Annual promotion"
}
```

**Response:**
```json
{
  "message": "Successfully promoted 3 student(s)",
  "promoted": [
    {
      "student_id": 1,
      "name": "John Doe",
      "from_class": 4,
      "to_class": 5
    }
  ],
  "errors": []
}
```

### GET `/api/students/:student_id/promotion-history`
Get promotion history for a specific student

**Response:**
```json
[
  {
    "id": 1,
    "from_class_name": "Class 4",
    "from_section_name": "A",
    "to_class_name": "Class 5",
    "to_section_name": "B",
    "from_academic_year": "2024-2025",
    "to_academic_year": "2025-2026",
    "promoted_by_name": "Admin User",
    "promoted_at": "2025-04-01T10:00:00Z",
    "notes": "Annual promotion"
  }
]
```

### GET `/api/students/academic-year/current`
Get the current academic year

**Response:**
```json
{
  "academic_year": "2025-2026"
}
```

## Important Notes

1. **Academic Year Format**: Always use "YYYY-YYYY" format (e.g., "2025-2026")

2. **Data Integrity**: The system uses database transactions to ensure all promotions are atomic - either all students are promoted successfully, or none are.

3. **Historical Queries**: When querying historical data (attendance, marks, fees), always filter by academic_year to get accurate results for a specific year.

4. **Permissions**: Only SCHOOL_ADMIN, TEACHER, and STAFF roles can promote students.

5. **Rollback**: If a promotion was done incorrectly, you can manually update the student's class and academic year in the database, but the promotion history will remain.

## Future Enhancements

- **Automatic Promotion**: Schedule automatic promotions at the end of academic year
- **Bulk Rollback**: Undo promotions in bulk
- **Promotion Reports**: Generate reports of all promotions
- **Conditional Promotion**: Promote only students who meet certain criteria (attendance %, marks, etc.)
- **Notification**: Send notifications to parents when students are promoted

## Troubleshooting

### Students not appearing after promotion
- Check that you're filtering by the correct academic year
- Verify the student's `academic_year` field was updated

### Old data not showing
- Ensure queries include `academic_year` filter
- Check that the migration ran successfully

### Promotion fails
- Check console for error messages
- Verify user has correct permissions
- Ensure target class and section exist
