# 📱 Mobile App - Quick Reference Card

## 🚀 Quick Start (60 Seconds)

### For immediate testing:

```powershell
# 1. Start Backend
cd e:\SchoolSoftware\backend
npm run dev

# 2. Start Mobile App (new terminal)
cd e:\SchoolSoftware\mobile-app
npm start

# 3. Scan QR code with Expo Go app
```

## 🔐 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | student@demo.com | 123456 |
| Teacher | teacher@demo.com | 123456 |
| Staff | staff@demo.com | 123456 |

## ⚙️ Essential Configuration

### API URL Setup (REQUIRED!)

**File:** `mobile-app/src/config/api.js`

```javascript
// For Android Emulator
BASE_URL: 'http://10.0.2.2:5000/api'

// For Physical Device (RECOMMENDED)
// 1. Find your IP: run 'ipconfig' in terminal
// 2. Replace with your IP:
BASE_URL: 'http://192.168.1.100:5000/api'  // Use YOUR IP here!

// For iOS Simulator
BASE_URL: 'http://localhost:5000/api'
```

## 📱 Download Expo Go

**Android:** [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)  
**iOS:** [App Store](https://apps.apple.com/app/expo-go/id982107779)

## 📂 Project Structure

```
mobile-app/
├── src/
│   ├── config/api.js          ← Configure API URL here
│   ├── contexts/AuthContext.js
│   ├── navigation/AppNavigator.js
│   ├── screens/
│   │   ├── auth/LoginScreen.js
│   │   ├── student/           ← Student screens
│   │   ├── teacher/           ← Teacher screens
│   │   └── staff/             ← Staff screens
│   └── services/              ← API calls
└── App.js
```

## 🎯 Implemented Features

### ✅ Complete
- Login screen with gradient UI
- Student Dashboard
- Teacher Dashboard
- Staff Dashboard
- Student Attendance (with circular progress)
- Student Fees (with payment history)
- Role-based navigation
- Secure authentication
- API integration layer

### 📝 Navigation Ready (UI Pending)
All other features have routes configured - just need to create screens!

## 🛠️ Common Commands

```powershell
# Start development server
npm start

# Clear cache
npx expo start -c

# Build APK for testing
eas build --platform android --profile preview

# View on web browser
npm run web
```

## 🐛 Quick Fixes

### Can't connect to backend?
✅ Backend running? Check `http://localhost:5000`  
✅ API URL configured? Check `src/config/api.js`  
✅ Same WiFi? Phone and computer must be on same network  
✅ Use IP address, not localhost (for physical devices)

### Expo Go won't load?
```powershell
# Clear cache and restart
npx expo start -c
```

### Login fails?
✅ Backend is running  
✅ Using correct credentials  
✅ API URL is correct  
✅ Check Expo console for errors

## 📊 File Count

| Type | Count |
|------|-------|
| Services | 5 files |
| Screens | 6 screens |
| Context | 1 file |
| Config | 1 file |
| Navigation | 1 file |

## 🎨 UI Features

- 🌈 Gradient backgrounds
- 📊 Circular progress indicators
- 📇 Card-based layouts
- 🔄 Pull-to-refresh
- ⚡ Loading states
- 📭 Empty states
- 🎯 Color-coded badges

## 📖 Documentation

- `README.md` - Installation guide
- `MOBILE_APP_GUIDE.md` - Complete usage guide
- `MOBILE_APP_SUMMARY.md` - Project overview
- `.agent/workflows/build_mobile_app.md` - Build workflow

## ⏱️ Expected Timeline

| Task | Time |
|------|------|
| Initial setup | ✅ Done |
| First test | 2 minutes |
| Configure API | 1 minute |
| Build APK | ~15 minutes |

## 🎯 Next Actions

1. ☑️ App structure created ✅
2. ☑️ Core screens implemented ✅
3. ⬜ Configure API URL
4. ⬜ Test on device
5. ⬜ Implement remaining screens
6. ⬜ Build production APK

## 💡 Pro Tips

1. **Always test on physical device** - Better than emulator
2. **Keep backend running** - Required for API calls
3. **Use your computer's IP** - Not localhost for devices
4. **Check console** - Press 'j' in Expo terminal for debugger
5. **Hot reload works** - Just save files to see changes!

## 🚀 Start Now!

```powershell
cd e:\SchoolSoftware\mobile-app
.\quick-start.ps1
```

Or manually:
```powershell
npm start
```

Then scan QR code with Expo Go!

---

**Status:** ✅ Ready to Test  
**Next Step:** Configure API URL → Start App → Scan QR Code → Test!
