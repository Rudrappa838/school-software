# School ID (6-Digit Code) Implementation

## Overview
Each school now has a unique **6-digit numeric code** that serves as their School ID.

---

## What Changed

### **Database Schema**
✅ Added `school_code` column to `schools` table
- Type: VARCHAR(6)
- Constraint: UNIQUE
- Format: 6-digit numeric string (e.g., "485721", "902341")

### **Backend Changes**

#### 1. School Creation (`schoolController.js`)
- Automatically generates a unique 6-digit code during school registration
- Uses random generation with uniqueness verification
- Returns `schoolCode` in the API response

#### 2. School Retrieval
- `school_code` is included in all school query responses
- Available via `/api/schools` and `/api/schools/:id` endpoints

### **Frontend Changes**

#### 1. Super Admin Dashboard - School Cards
- Displays School ID prominently on each school card
- Format: Shown in indigo color with mono font
- Location: Bottom of each school card

**Before:** `ID: SC-001`  
**After:** `School ID: 485721`

#### 2. View Details Modal
- School ID shown as first field in the details grid
- Larger, highlighted display (text-lg font)
- Indigo color to emphasize importance

---

## Features

### **Automatic Generation**
- When creating a new school, the system automatically generates a unique 6-digit code
- No manual input required
- Guaranteed uniqueness across all schools

### **Visual Design**
```
School ID: 485721
```
- Monospace font for better readability
- Indigo color (#a5b4fc) for visual distinction
- Highlighted in modals with larger font size

---

## Migration

### **Existing Schools**
All existing schools have been assigned unique 6-digit codes via the migration script:

```bash
node src/scripts/add_school_code.js
```

This script:
1. Adds the `school_code` column if missing
2. Generates unique codes for all schools without one
3. Ensures no duplicate codes exist

---

## Usage

### **Creating a New School**
When you create a school via Super Admin:
1. Fill in school details (name, email, etc.)
2. System auto-generates a 6-digit School ID
3. Code is displayed in the success message
4. Code appears on the school card immediately

### **Viewing School ID**
- **School Cards:** Bottom of each card
- **School Details Modal:** Top section, first field
- **API Response:** `school_code` field

---

## Example Codes
Sample generated codes:
- `102459`
- `785621`
- `483092`
- `591037`

**Format:** Always 6 digits (100000 - 999999)

---

## Technical Details

### **Generation Algorithm**
```javascript
Math.floor(100000 + Math.random() * 900000).toString()
```

- Range: 100000 - 999999
- Uniqueness check before insertion
- Retry logic if collision detected

### **Database Query**
```sql
SELECT * FROM schools WHERE school_code = '485721';
```

---

## Benefits

✅ **Easy to Remember:** 6 digits vs long database IDs  
✅ **Unique Identifier:** Each school has a distinct code  
✅ **Professional:** Looks official and organized  
✅ **Portable:** Can be shared, printed, or communicated easily  
✅ **Automatic:** No manual management required  

---

**Status:** ✅ Fully Implemented and Tested
