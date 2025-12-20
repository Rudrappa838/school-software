# Fixes to Implement

## 1. Student Attendance Monthly Report - Total Present/Absent Display

**Issue:** Totals showing dates instead of counts  
**Status:** Code looks correct (lines 237-238 in StudentAttendanceReports.jsx)  
**Action:** Need to verify if backend is returning correct data

**Fix:** Check backend `/students/attendance` endpoint to ensure it returns proper attendance records

---

## 2. Teacher/Staff Mobile Number - Unique Validation

**Issue:** Allow duplicate mobile numbers  
**Fix Required:** Add unique constraint and validation

### Backend Changes:

**File:** `backend/src/controllers/teacherController.js`  
**In `addTeacher` function, add before INSERT:**

```javascript
// Check if phone number already exists
const phoneCheck = await client.query(
    'SELECT id FROM teachers WHERE phone = $1 AND school_id = $2',
    [phone, school_id]
);
if (phoneCheck.rows.length > 0) {
    throw new Error('Phone number already exists for another teacher');
}
```

**File:** `backend/src/controllers/staffController.js`  
**In `addStaff` function, add similar check:**

```javascript
// Check if phone number already exists
const phoneCheck = await client.query(
    'SELECT id FROM staff WHERE phone = $1 AND school_id = $2',
    [phone, school_id]
);
if (phoneCheck.rows.length > 0) {
    throw new Error('Phone number already exists for another staff member');
}
```

---

## 3. Admission Form - Character Validation

**Issue:** No validation on form fields  
**Fix Required:** Add input validation

**File:** `frontend/src/components/dashboard/students/StudentManagement.jsx`

### Add validation for:
- **Name:** Only letters and spaces, 2-50 characters
- **Email:** Valid email format
- **Phone:** 10 digits only
- **Address:** Max 200 characters
- **Parent Name:** Only letters and spaces
- **Parent Phone:** 10 digits only

### Example validation:

```javascript
const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!/^[a-zA-Z\s]{2,50}$/.test(formData.name)) {
        errors.name = 'Name must be 2-50 characters, letters only';
    }
    
    // Phone validation
    if (!/^\d{10}$/.test(formData.phone)) {
        errors.phone = 'Phone must be exactly 10 digits';
    }
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Invalid email format';
    }
    
    return errors;
};
```

---

## 4. Class Selection - Dropdown Instead of Text Input

**Issue:** Class field is text input, should be dropdown  
**Fix Required:** Change input to select dropdown

**File:** `frontend/src/components/dashboard/students/StudentManagement.jsx`

### Change from:
```javascript
<input type="text" name="class" ... />
```

### To:
```javascript
<select name="class_id" value={formData.class_id} onChange={handleChange}>
    <option value="">Select Class</option>
    {config.classes?.map(c => (
        <option key={c.class_id} value={c.class_id}>
            {c.class_name}
        </option>
    ))}
</select>
```

---

## Priority Order:

1. ✅ **Class Dropdown** - Easiest, immediate impact
2. ✅ **Form Validation** - Important for data quality
3. ✅ **Unique Mobile Numbers** - Prevents duplicates
4. ⏳ **Attendance Report** - Need to verify if actually broken

---

## Implementation Time:

- Class Dropdown: 5 minutes
- Form Validation: 15 minutes
- Unique Mobile: 10 minutes
- **Total: ~30 minutes**

---

## Note:

These fixes should be implemented AFTER the APK build completes and is tested successfully.
