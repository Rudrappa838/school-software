# Auto-Mark Holidays Troubleshooting Guide

## Current Status
✅ Attendance tables exist
✅ Teachers: 14
✅ Staff: 10
✅ Holidays: 1

## If Auto-Mark is Failing

### Step 1: Check Browser Console
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Try auto-marking again
4. Look for error messages (they will be in red)
5. Share the exact error message

### Step 2: Check Network Tab
1. Press **F12** to open Developer Tools
2. Go to **Network** tab
3. Try auto-marking again
4. Look for the request to `/api/holidays/auto-mark`
5. Click on it and check the **Response** tab
6. Share what you see there

### Step 3: Common Issues

#### Issue 1: "Failed to auto-mark holidays" (Generic Error)
**Possible Causes:**
- Network connection issue
- Backend not responding
- Database connection lost

**Solution:**
1. Check if backend is running (should be on port 5000)
2. Refresh the page
3. Try again

#### Issue 2: Specific Error Message
If you see a specific error like:
- "Month and year are required" → The request is malformed
- "No teachers or staff found" → Add teachers/staff first
- "Server error" → Check backend logs

### Step 4: Manual Test

You can test the endpoint directly using this command:

```bash
# Open PowerShell in backend directory
cd e:\SchoolSoftware\backend

# Test the endpoint (replace YOUR_TOKEN with actual auth token)
curl -X POST http://localhost:5000/api/holidays/auto-mark `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -d '{"month": 1, "year": 2026}'
```

### Step 5: Check Backend Logs

The backend now logs detailed error information. After trying auto-mark:

1. Look at the backend terminal window
2. Check for error messages
3. Share any error messages you see

## Expected Behavior

When auto-mark works correctly, you should see:
1. **Success toast message**: "✅ X attendance records marked as Holiday"
2. **Details**: Number of teachers and staff processed
3. **In attendance**: Sundays and holidays show "Holiday" status

## What Auto-Mark Does

For the selected month:
1. Finds all Sundays (day of week = 0)
2. Finds all registered holidays
3. For each Sunday and holiday:
   - Marks ALL teachers as "Holiday"
   - Marks ALL staff as "Holiday"
4. Returns count of records marked

## Debug Mode

To see exactly what's happening, open browser console (F12) before clicking auto-mark.
The frontend will log:
- Request being sent
- Response received
- Any errors

## Next Steps

Please try auto-marking again and:
1. Open browser console (F12 → Console tab)
2. Click "Auto-Mark Holidays"
3. Screenshot or copy the error message
4. Share it so I can provide a specific fix

---

## Quick Fixes to Try

1. **Refresh the page** and try again
2. **Logout and login** again
3. **Clear browser cache** (Ctrl+Shift+Delete)
4. **Try a different month** (maybe current month)
5. **Check year is 2026** (not 2025 or 2027)

If none of these work, please share the exact error message from the browser console!
