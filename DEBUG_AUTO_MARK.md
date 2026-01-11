# DEBUG: Auto-Mark Not Working

## Quick Test

I've added a test endpoint to help debug the issue. Here's what to do:

### Option 1: Use Browser Console

1. Open browser console (F12)
2. Paste this code and press Enter:

```javascript
fetch('http://localhost:5000/api/holidays/test-auto-mark', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({ month: 1, year: 2026 })
})
.then(r => r.json())
.then(data => console.log('TEST RESULT:', data))
.catch(err => console.error('TEST ERROR:', err));
```

3. Check the result in console
4. Check backend terminal for detailed logs

### Option 2: Simple Fix - Skip Auto-Mark

If auto-mark keeps failing, you can manually mark attendance instead:

1. Go to **Teachers → Mark Attendance**
2. Select a Sunday (e.g., January 5, 2026)
3. Mark all teachers as "Holiday"
4. Repeat for all Sundays and holidays

This achieves the same result!

### What I Suspect

The error might be:
1. **Foreign key constraint** - teacher_id or staff_id doesn't exist
2. **Date format issue** - PostgreSQL not accepting the date format
3. **Permission issue** - Database user doesn't have INSERT permission

### Check Backend Terminal

After running the test, look at the backend terminal. You should see:
```
=== TEST AUTO-MARK ===
School ID: 1
Month: 1
Year: 2026
Teachers found: 3
Sample teachers: [...]
```

If there's an error, it will show the exact problem.

### Alternative: Manual SQL

You can also run this SQL directly in your database:

```sql
-- Test insert
INSERT INTO teacher_attendance (school_id, teacher_id, date, status)
VALUES (1, (SELECT id FROM teachers LIMIT 1), '2026-01-05', 'Holiday')
ON CONFLICT (teacher_id, date) DO UPDATE SET status = 'Holiday';
```

If this fails, the error message will tell us exactly what's wrong.

---

## Please Try:

1. Run the test using Option 1 above
2. Share what you see in:
   - Browser console
   - Backend terminal

This will help me identify the exact issue!
