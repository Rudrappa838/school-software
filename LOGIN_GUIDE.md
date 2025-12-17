# Login System Architecture

## Separate Login Pages for Enhanced Security

For improved security, the system now has **two distinct login pages**:

---

## 1. **Regular Login** (`/login`)

**URL:** `http://localhost:5173/login`

**Available Roles:**
- School Admin
- Teacher
- Student
- Staff

**Features:**
- Clean, user-friendly interface
- 4 role selection buttons (2x2 grid)
- Supports email or Attendance ID login
- Purple/Indigo gradient theme

**Test Credentials:**

| Role | Email | Password |
|------|-------|----------|
| School Admin | `admin@demo.com` | `123456` |
| Teacher | `teacher@demo.com` | `123456` |
| Student | `student@demo.com` | `123456` |
| Staff | `mrudru7@gmail.com` | `123456` |

---

## 2. **Super Admin Login** (`/super-admin-login`)

**URL:** `http://localhost:5173/super-admin-login`

**Available Role:**
- Super Admin **ONLY**

**Features:**
- Dedicated secure portal
- Dark theme with Red/Orange gradient
- Security warning banner
- Restricted access notice
- Link back to regular login

**Security Benefits:**
- ✅ Isolated entry point
- ✅ Prevents unauthorized Super Admin access attempts via regular login
- ✅ Enhanced visual distinction
- ✅ Clearer access separation

**Test Credentials:**

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `superadmin@example.com` | `admin123` |

---

## Route Structure

```
/                       → Redirects to /login
/login                  → Regular Login (School Admin, Teacher, Student, Staff)
/super-admin-login      → Super Admin Login (Super Admin Only)

/school-admin           → School Admin Dashboard
/teacher                → Teacher Dashboard
/student                → Student Dashboard
/staff                  → Staff Dashboard (also for Drivers)
/super-admin            → Super Admin Dashboard
```

---

## Navigation Flow

### Regular Users:
1. Visit `http://localhost:5173` 
2. Auto-redirected to `/login`
3. Select role and login
4. Redirected to respective dashboard

### Super Admin:
1. Visit `http://localhost:5173/super-admin-login` (Direct URL)
2. Login with Super Admin credentials
3. Redirected to `/super-admin` dashboard

---

## Security Notes

- Super Admin role is **NOT visible** on the regular login page
- Super Admin must access their dedicated portal via direct URL
- Unauthorized role access attempts redirect to `/login`
- All routes are protected with role-based authentication

**Use the appropriate login page based on your role.**
