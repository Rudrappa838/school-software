# Firebase Integration Guide

To fully connect your app (Frontend & Backend) to Firebase without rebuilding constantly, follow these steps:

## 1. Backend Integration (For Sending Notifications)
You have two options:

### Option A: Hosting Environment Variables (Recommended)
If you host on Render/Netlify/Vercel, add these **Environment Variables** in your dashboard:
- `FIREBASE_PROJECT_ID`: Your project ID (e.g., school-app-123)
- `FIREBASE_CLIENT_EMAIL`: The client email from your Service Account (e.g., firebase-adminsdk-xxx@....gserviceaccount.com)
- `FIREBASE_PRIVATE_KEY`: The entire private key (including `-----BEGIN PRIVATE KEY-----`).

### Option B: Local File
Place your `serviceAccountKey.json` file inside `backend/` folder.

## 2. Frontend Integration (For Android App)
To enable Push Notifications on Android, you MUST provide the `google-services.json` file.

1. Go to Firebase Console -> Project Settings -> General.
2. Under "Your apps", select the Android app (`com.school.app`).
3. Download `google-services.json`.
4. Open `frontend/android/app/google-services.json` in this project.
5. **Paste the content** of your downloaded file into it (replace the PLACEHOLDER content).

## 3. Deployment
- **Backend**: After setting Env Variables, redeploy your backend.
- **Frontend/Mobile**: 
    1. If you added `google-services.json`, you must build the APK **ONE LAST TIME**.
    2. After that, most updates (UI, logic) will happen automatically via the web.

## Testing
To test if your backend connects, run:
`node backend/test_firebase.js` (make sure you have the key file for this test).
