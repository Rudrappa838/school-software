# 📱 School Management Mobile App

A full-featured React Native mobile application for School Management System built with Expo, providing dedicated dashboards for Students, Teachers, and Staff members.

## 🎯 Features

### For Students 🎓
- **Dashboard** - Overview of attendance, fees, and academics
- **Attendance** - View attendance records and percentage
- **Academics** - Check marks, exam schedules, and results
- **Fees Status** - View pending fees and payment history
- **Timetable** - View class schedule
- **Library** - Check issued books and due dates
- **Transport** - Track bus routes and timing
- **Hostel** - View hostel room and mess details
- **Certificates** - Request and download certificates
- **Leave Application** - Apply for leaves
- **Ask Doubts** - Post questions to teachers

### For Teachers 👨‍🏫
- **Dashboard** - Overview of classes and schedule
- **My Students** - View assigned students
- **My Timetable** - Teaching schedule
- **Attendance** - View personal attendance
- **Salary** - Check salary slips and payment history
- **Leaves** - Apply for leaves, view status
- **Student Doubts** - Answer student queries
- **Daily Status** - Submit daily work reports

### For Staff 👔
- **Dashboard** - Personal overview
- **My Attendance** - Attendance records
- **Salary** - Salary slips and payment history
- **Leaves** - Leave applications and status
- **Daily Status** - Work reports

## 🏗️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack & Tab)
- **State Management**: Context API
- **API Client**: Axios
- **UI Components**: React Native Paper
- **Storage**: AsyncStorage
- **Gradients**: Expo Linear Gradient

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For Android: Android Studio or Expo Go app
- For iOS: Xcode (Mac only) or Expo Go app

## 🚀 Installation

1. **Navigate to the mobile app directory**:
   ```bash
   cd e:\SchoolSoftware\mobile-app
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Configure API**:
   Edit `src/config/api.js` and update the `BASE_URL`:
   - For Android Emulator: `http://10.0.2.2:5000/api`
   - For iOS Simulator: `http://localhost:5000/api`
   - For Physical Device: `http://YOUR_COMPUTER_IP:5000/api`

## 🎮 Running the App

### Start the Development Server
```bash
npm start
```

### Run on Android
```bash
npm run android
```

### Run on iOS (Mac only)
```bash
npm run ios
```

### Run on Web
```bash
npm run web
```

### Using Expo Go App
1. Install Expo Go on your phone from App Store / Play Store
2. Run `npm start`
3. Scan the QR code with Expo Go (Android) or Camera (iOS)

## 📱 Test Credentials

### Student Account
- Email: `student@demo.com`
- Password: `123456`

### Teacher Account
- Email: `teacher@demo.com`
- Password: `123456`

### Staff Account
- Email: `staff@demo.com`
- Password: `123456`

## 🏗️ Building for Production

### Android APK
```bash
# Build APK
eas build --platform android --profile preview

# Build for Google Play Store
eas build --platform android --profile production
```

### iOS App
```bash
# Build for iOS (requires Mac & Apple Developer Account)
eas build --platform ios --profile production
```

## 📂 Project Structure

```
mobile-app/
├── src/
│   ├── config/         # API configuration
│   ├── contexts/       # React contexts (Auth, etc.)
│   ├── navigation/     # Navigation configuration
│   ├── screens/        # All screen components
│   │   ├── auth/       # Login, Register
│   │   ├── student/    # Student screens
│   │   ├── teacher/    # Teacher screens
│   │   └── staff/      # Staff screens
│   ├── services/       # API service handlers
│   ├── components/     # Reusable components
│   └── utils/          # Utility functions
├── assets/             # Images, fonts, etc.
├── App.js              # Root component
└── package.json        # Dependencies
```

## 🎨 Design Features

- **Modern UI/UX** - Gradient backgrounds, smooth animations
- **Role-based Navigation** - Different dashboards for different user types
- **Responsive Design** - Works on all screen sizes
- **Offline Support** - Data caching with AsyncStorage
- **Pull-to-Refresh** - Refresh data on all screens
- **Loading States** - Proper loading indicators

## 🔧 Configuration

### API Configuration
Edit `src/config/api.js` to change:
- Base URL
- Timeout duration  
- API endpoints

### App Settings
Edit `app.json` to change:
- App name
- App icon
- Splash screen
- Bundle identifier

## 📝 Development Workflow

1. **Start Backend Server** (separate terminal):
   ```bash
   cd e:\SchoolSoftware\backend
   npm run dev
   ```

2. **Start Mobile App**:
   ```bash
   cd e:\SchoolSoftware\mobile-app
   npm start
   ```

3. **Test on Device/Emulator**
4. **Make Changes** - Hot reload will update automatically

## 🐛 Troubleshooting

### Can't connect to backend
- Ensure backend is running on port 5000
- Check BASE_URL in `src/config/api.js`
- For physical device, use computer's IP address
- Ensure device and computer are on same WiFi network

### Build errors
```bash
# Clear cache
expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

## 📦 Dependencies

Key packages:
- `expo` - Expo framework
- `react-navigation` - Navigation
- `axios` - HTTP client
- `@react-native-async-storage/async-storage` - Local storage
- `react-native-paper` - UI components
- `expo-linear-gradient` - Gradient backgrounds

## 🚢 Deployment

### Expo EAS Build
1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Configure: `eas build:configure`
4. Build: `eas build --platform android`

### Standalone APK
The build will be available for download from Expo dashboard.

## 📧 Support

For issues or questions:
- Check the backend is running
- Verify API configuration
- Review console logs for errors

## 📄 License

This is a school management system project.

---

**Built with ❤️ using React Native & Expo**
