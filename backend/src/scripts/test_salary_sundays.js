const { pool } = require('../config/db');

async function testSalaryCalculation() {
    try {
        const school_id = 1;
        const month = 1; // January
        const year = 2026;

        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

        console.log('Testing Salary Calculation for January 2026...\n');

        // Get ALL holidays from school_holidays table
        const allHolidaysRes = await pool.query(
            'SELECT holiday_date, holiday_name, EXTRACT(DOW FROM holiday_date) as day_of_week FROM school_holidays WHERE school_id = $1 AND holiday_date >= $2 AND holiday_date <= $3 ORDER BY holiday_date',
            [school_id, startDate, endDate]
        );

        console.log('ALL Holidays in school_holidays table:');
        allHolidaysRes.rows.forEach(h => {
            const dayName = h.day_of_week == 0 ? ' (SUNDAY - EXCLUDED)' : '';
            console.log(`  - ${h.holiday_date.toISOString().split('T')[0]}: ${h.holiday_name}${dayName}`);
        });
        console.log(`Total in table: ${allHolidaysRes.rows.length}\n`);

        // Get PAID holidays (excluding Sundays)
        const paidHolidaysRes = await pool.query(
            'SELECT holiday_date, holiday_name FROM school_holidays WHERE school_id = $1 AND holiday_date >= $2 AND holiday_date <= $3 AND EXTRACT(DOW FROM holiday_date) != 0 ORDER BY holiday_date',
            [school_id, startDate, endDate]
        );

        console.log('PAID Holidays (excluding Sundays):');
        paidHolidaysRes.rows.forEach(h => {
            console.log(`  - ${h.holiday_date.toISOString().split('T')[0]}: ${h.holiday_name}`);
        });
        console.log(`Total PAID holidays: ${paidHolidaysRes.rows.length}\n`);

        // Get teacher salary calculation
        const teacherRes = await pool.query(
            `WITH month_holidays AS (
                SELECT holiday_date
                FROM school_holidays
                WHERE school_id = $1 
                  AND holiday_date >= $2 
                  AND holiday_date <= $3
                  AND EXTRACT(DOW FROM holiday_date) != 0
            )
            SELECT 
                t.name, 
                t.salary_per_day,
                COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present,
                COUNT(CASE WHEN a.status = 'Holiday' THEN 1 END) as all_holidays,
                COUNT(CASE WHEN a.status = 'Holiday' AND a.date IN (SELECT holiday_date FROM month_holidays) THEN 1 END) as paid_holidays
            FROM teachers t
            LEFT JOIN teacher_attendance a ON t.id = a.teacher_id AND a.date >= $2 AND a.date <= $3
            WHERE t.school_id = $1
            GROUP BY t.id, t.name, t.salary_per_day
            LIMIT 1`,
            [school_id, startDate, endDate]
        );

        if (teacherRes.rows.length > 0) {
            const teacher = teacherRes.rows[0];
            console.log(`Teacher: ${teacher.name}`);
            console.log(`Salary per day: ₹${teacher.salary_per_day}`);
            console.log(`Present days: ${teacher.present}`);
            console.log(`All "Holiday" records in attendance: ${teacher.all_holidays}`);
            console.log(`PAID holidays (excluding Sundays): ${teacher.paid_holidays}`);
            console.log(`Sundays (NOT PAID): ${teacher.all_holidays - teacher.paid_holidays}`);

            const oldSalary = (parseInt(teacher.present) + parseInt(teacher.all_holidays)) * parseFloat(teacher.salary_per_day);
            const newSalary = (parseInt(teacher.present) + parseInt(teacher.paid_holidays)) * parseFloat(teacher.salary_per_day);

            console.log(`\n❌ OLD Salary (with Sundays): ₹${oldSalary.toLocaleString()}`);
            console.log(`✅ NEW Salary (without Sundays): ₹${newSalary.toLocaleString()}`);
            console.log(`💰 Savings: ₹${(oldSalary - newSalary).toLocaleString()}`);
        }

        process.exit(0);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

testSalaryCalculation();
