# Holiday & Sunday Handling for Teacher/Staff Salary

## Problem Statement
Teachers and staff salaries are calculated based on daily attendance. However:
1. **Holidays** (festivals, school holidays) - No attendance marked, but should be paid
2. **Sundays** (weekly offs) - No attendance marked, but should be paid
3. **Leaves** - Marked as "Leave", may or may not be paid depending on policy

## Solution Overview

### Approach 1: Auto-Count Working Days (Recommended)
Instead of counting only "Present" days, calculate salary based on:
- **Total Working Days in Month** = Total Days - Sundays - Holidays
- **Payable Days** = Working Days - Absent Days
- **Salary** = Payable Days × Daily Rate

### Approach 2: Holiday Table + Auto-Mark
Create a holidays table and automatically mark attendance as "Holiday" for those dates.

---

## Implementation: Approach 1 (Smart Calculation)

### Step 1: Update Salary Calculation Logic

The salary query should be modified to:
1. Calculate total days in the month
2. Subtract Sundays (automatically)
3. Subtract registered holidays
4. Subtract absent days
5. Result = Payable days

### Modified Query Logic:
```sql
-- Calculate working days
WITH month_days AS (
    SELECT generate_series(
        DATE '2026-01-01',  -- Start of month
        DATE '2026-01-31',  -- End of month
        '1 day'::interval
    )::date AS day
),
working_days AS (
    SELECT COUNT(*) as total_working_days
    FROM month_days
    WHERE EXTRACT(DOW FROM day) != 0  -- Exclude Sundays (0 = Sunday)
      AND day NOT IN (SELECT holiday_date FROM school_holidays WHERE school_id = $1)
)
SELECT 
    t.id,
    t.name,
    t.salary_per_day,
    wd.total_working_days,
    COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as days_absent,
    (wd.total_working_days - COUNT(CASE WHEN a.status = 'Absent' THEN 1 END)) as payable_days,
    ((wd.total_working_days - COUNT(CASE WHEN a.status = 'Absent' THEN 1 END)) * t.salary_per_day) as calculated_salary
FROM teachers t
CROSS JOIN working_days wd
LEFT JOIN teacher_attendance a ON t.id = a.teacher_id 
    AND a.date >= $2 AND a.date <= $3
WHERE t.school_id = $1
GROUP BY t.id, t.name, t.salary_per_day, wd.total_working_days
```

---

## Implementation: Approach 2 (Holiday Table)

### Step 1: Create Holidays Table
```sql
CREATE TABLE school_holidays (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    holiday_date DATE NOT NULL,
    holiday_name VARCHAR(255),
    is_paid BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, holiday_date)
);
```

### Step 2: Seed Common Holidays
```sql
INSERT INTO school_holidays (school_id, holiday_date, holiday_name, is_paid) VALUES
(1, '2026-01-26', 'Republic Day', TRUE),
(1, '2026-08-15', 'Independence Day', TRUE),
(1, '2026-10-02', 'Gandhi Jayanti', TRUE),
(1, '2026-12-25', 'Christmas', TRUE);
-- Add more as needed
```

### Step 3: Auto-Mark Sundays & Holidays
Create a cron job or manual function to auto-mark attendance:
```javascript
// Auto-mark Sundays and Holidays as "Holiday"
exports.autoMarkHolidays = async (school_id, month, year) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    // Get all teachers and staff
    const teachers = await pool.query('SELECT id FROM teachers WHERE school_id = $1', [school_id]);
    const staff = await pool.query('SELECT id FROM staff WHERE school_id = $1', [school_id]);
    
    // Get holidays for this month
    const holidays = await pool.query(
        'SELECT holiday_date FROM school_holidays WHERE school_id = $1 AND holiday_date >= $2 AND holiday_date <= $3',
        [school_id, startDate, endDate]
    );
    
    const holidayDates = holidays.rows.map(h => h.holiday_date);
    
    // Loop through each day
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const currentDate = new Date(d);
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Check if Sunday or Holiday
        if (dayOfWeek === 0 || holidayDates.some(hd => hd.toISOString().split('T')[0] === dateStr)) {
            // Mark all teachers as "Holiday"
            for (const teacher of teachers.rows) {
                await pool.query(
                    `INSERT INTO teacher_attendance (school_id, teacher_id, date, status)
                     VALUES ($1, $2, $3, 'Holiday')
                     ON CONFLICT (teacher_id, date) DO NOTHING`,
                    [school_id, teacher.id, dateStr]
                );
            }
            
            // Mark all staff as "Holiday"
            for (const staffMember of staff.rows) {
                await pool.query(
                    `INSERT INTO staff_attendance (school_id, staff_id, date, status)
                     VALUES ($1, $2, $3, 'Holiday')
                     ON CONFLICT (staff_id, date) DO NOTHING`,
                    [school_id, staffMember.id, dateStr]
                );
            }
        }
    }
};
```

### Step 4: Update Salary Calculation to Include "Holiday" as Paid
```sql
SELECT 
    t.id,
    t.name,
    t.salary_per_day,
    COUNT(CASE WHEN a.status IN ('Present', 'Holiday') THEN 1 END) as payable_days,
    COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as days_absent,
    COUNT(CASE WHEN a.status = 'Leave' THEN 1 END) as days_leave,
    (COUNT(CASE WHEN a.status IN ('Present', 'Holiday') THEN 1 END) * t.salary_per_day) as calculated_salary
FROM teachers t
LEFT JOIN teacher_attendance a ON t.id = a.teacher_id 
    AND a.date >= $2 AND a.date <= $3
WHERE t.school_id = $1
GROUP BY t.id, t.name, t.salary_per_day
```

---

## Recommended Solution

**Use Approach 2** with the following workflow:

1. **Create `school_holidays` table** - Store all holidays
2. **Add Holiday Management UI** - Allow admin to add/edit holidays
3. **Auto-mark Sundays & Holidays** - Run daily or when viewing salary page
4. **Update Salary Query** - Count "Present" + "Holiday" as payable days

### Benefits:
✅ Clear audit trail (attendance records show "Holiday")
✅ Flexible (can mark some holidays as unpaid if needed)
✅ Easy to understand for users
✅ Works with existing attendance system

### Next Steps:
1. Create the database table
2. Add holiday management page in admin dashboard
3. Update salary calculation query
4. Add auto-mark function (can run monthly or on-demand)

Would you like me to implement this solution in your codebase?
