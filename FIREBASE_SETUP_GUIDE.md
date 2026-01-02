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

## 4. The Database (CRITICAL READ)
Your application is built on **PostgreSQL** (SQL). Firebase's native database (Firestore) is **NoSQL**. They are completely different languages.

**DO NOT TRY TO MIGRATE DATA TO FIREBASE DATABASE.** It would require rewriting 100% of your backend code.

### The Best Strategy: "Hybrid Cloud"
1.  **Frontend**: Hosted on Firebase (Fast, CDN).
2.  **Backend**: Hosted on Firebase Cloud Functions.
3.  **Database**: Keep it on **Render, Supabase, or Neon** (External Postgres).

### ⚠️ IMPORTANT REQUIREMENT ⚠️
To let your Firebase Backend talk to an external database (like Render/Supabase), **you MUST upgrade your Firebase Project to the "Blaze" (Pay-as-you-go) Plan.**
*   **Why?** The Free (Spark) plan blocks all outgoing network requests to non-Google services.
*   **Cost:** For a school app, it is usually **$0 (Free)** because the free quota is huge, but Google *requires* a Credit Card on file to unlock the feature.

**If you cannot add a Credit Card:**
You cannot use Firebase for the Backend. You should keep the Backend on **Render** (which is free without card) and only use Firebase for the Frontend.

## Testing
To test if your backend connects, run:
`node backend/test_firebase.js` (make sure you have the key file for this test).
