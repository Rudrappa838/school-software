# ⚠️ CRITICAL: Backend Connection Setup

## 🔧 **ONE-TIME CONFIGURATION REQUIRED**

Your mobile app is **fully configured** to connect to your backend at `http://localhost:5000`, 
BUT you need to update the API URL based on how you're testing!

---

## 📱 **CHOOSE YOUR TESTING METHOD:**

### **Option 1: Physical Device (RECOMMENDED)**

**File to Edit:** `mobile-app/src/config/api.js`

**Step 1: Find Your Computer's IP Address**
```powershell
ipconfig
```
Look for "IPv4 Address" under your Wi-Fi adapter (e.g., `192.168.1.100`)

**Step 2: Update api.js**
```javascript
export const API_CONFIG = {
    // Change this line:
    BASE_URL: 'http://YOUR_IP_ADDRESS:5000/api',
    // Example: 'http://192.168.1.100:5000/api'
    TIMEOUT: 30000,
};
```

**Requirements:**
- ✅ Backend running on port 5000
- ✅ Phone and computer on SAME WiFi network

---

### **Option 2: Android Emulator**

**File to Edit:** `mobile-app/src/config/api.js`

```javascript
export const API_CONFIG = {
    BASE_URL: 'http://10.0.2.2:5000/api',  // ✅ Already configured!
    TIMEOUT: 30000,
};
```

**This is ALREADY set!** Just run:
```powershell
# Start Android emulator
# Then run:
cd e:\SchoolSoftware\mobile-app
npm start
# Press 'a' to open in Android emulator
```

---

### **Option 3: iOS Simulator**

**File to Edit:** `mobile-app/src/config/api.js`

```javascript
export const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    TIMEOUT: 30000,
};
```

---

## ✅ **VERIFY BACKEND IS RUNNING**

Before testing mobile app, ensure backend is running:

```powershell
# Check if backend is running
# You should see: "Server running on port 5000"

# If not running:
cd e:\SchoolSoftware\backend
npm run dev
```

**Backend should be accessible at:** `http://localhost:5000`

---

## 🔐 **AUTHENTICATION IS CONFIGURED**

The app will automatically:
- ✅ Send login credentials to `/api/auth/login`
- ✅ Store JWT token in AsyncStorage
- ✅ Include token in all API requests
- ✅ Add `x-school-id` header for school context
- ✅ Handle 401 errors (auto-logout)

---

## 📊 **ALL ENDPOINTS CONFIGURED**

The mobile app will call these backend endpoints:

### **Auth**
- `POST /api/auth/login`
- `POST /api/auth/logout`

### **Student** (11 endpoints)
- `GET /api/students/profile`
- `GET /api/students/my-attendance`
- `GET /api/fees/my-status`
- `GET /api/marks/my-marks`
- `GET /api/library/my-books`
- `GET /api/hostel/my-details`
- `GET /api/transport/my-route`
- `GET /api/certificates/my-certificates`
- `GET /api/leaves/my-leaves`
- `GET /api/doubts/my-doubts`
- + more...

### **Teacher** (8 endpoints)
- `GET /api/teachers/profile`
- `GET /api/teachers/my-attendance`
- `GET /api/salary/teacher`
- + more...

### **Staff** (5 endpoints)
- `GET /api/staff/profile`
- `GET /api/staff/my-attendance`
- `GET /api/salary/staff`
- + more...

---

## 🚀 **QUICK TEST GUIDE**

### **Step 1: Update API URL**
Edit `mobile-app/src/config/api.js` with YOUR IP address

### **Step 2: Ensure Backend Running**
```powershell
cd e:\SchoolSoftware\backend
npm run dev
# Should show: "Server running on port 5000"
```

### **Step 3: Start Mobile App**
```powershell
cd e:\SchoolSoftware\mobile-app
npm start
```

### **Step 4: Test on Phone**
- Scan QR code with Expo Go
- Login with: `student@demo.com` / `123456`
- App will call backend API at `http://YOUR_IP:5000/api`

---

## 🔍 **TROUBLESHOOTING**

### **Problem: "Network Error" or "Cannot connect"**

**Solutions:**
1. ✅ Backend is running (`npm run dev` in backend folder)
2. ✅ Phone and computer on SAME WiFi
3. ✅ API_CONFIG.BASE_URL uses YOUR computer's IP (not localhost)
4. ✅ Firewall allows port 5000
5. ✅ Try accessing `http://YOUR_IP:5000` in phone's browser first

### **Problem: "401 Unauthorized"**

**Solutions:**
1. ✅ Login credentials are correct
2. ✅ Backend authentication is working
3. ✅ Test login in web app first

### **Problem: "404 Not Found"**

**Solutions:**
1. ✅ Backend endpoints match the ones in `api.js`
2. ✅ Backend routes are registered correctly
3. ✅ Check backend console for incoming requests

---

## 📝 **EXAMPLE CONFIGURATION**

**Your Computer IP:** `192.168.1.100` (find with `ipconfig`)

**Update `api.js` to:**
```javascript
export const API_CONFIG = {
    BASE_URL: 'http://192.168.1.100:5000/api',
    TIMEOUT: 30000,
};
```

**Then:**
```powershell
# Terminal 1: Backend
cd e:\SchoolSoftware\backend
npm run dev

# Terminal 2: Mobile App
cd e:\SchoolSoftware\mobile-app
npm start

# Scan QR code and test!
```

---

## ✅ **VERIFICATION CHECKLIST**

Before testing:
- [ ] Backend running on port 5000
- [ ] API URL in `api.js` updated with YOUR IP
- [ ] Phone and computer on same WiFi
- [ ] Mobile app started with `npm start`
- [ ] Expo Go app installed on phone

**Then you're ready to test!** 🚀

---

**Current Status:**
- ✅ Mobile app built (27 screens)
- ✅ Backend configured
- ✅ API endpoints mapped
- ⏳ **Just update IP address and test!**
