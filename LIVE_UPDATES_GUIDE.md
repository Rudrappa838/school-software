# 🔄 Live Updates Setup Guide - Automatic App Updates

## 📱 Problem
Every time you make changes to your app, users have to:
1. Go to Play Store
2. Download new APK (50+ MB)
3. Wait for installation
4. Lose time and data

## ✅ Solution: Capgo Live Updates
Users get updates **automatically** when they open the app - no Play Store needed!

---

## 🎯 What Gets Updated Automatically?

### ✅ Live Updates (Instant - No Play Store):
- UI changes (colors, layouts, text)
- New features (React components)
- Bug fixes
- API endpoint changes
- Business logic
- **~95% of your changes!**

### ❌ Requires Play Store Update:
- New permissions (camera, location, etc.)
- Native plugin changes
- Capacitor version upgrades
- Package name changes
- **~5% of changes**

---

## 📦 Option 1: Capgo (Recommended - FREE Tier Available)

### Step 1: Install Capgo

```bash
cd frontend
npm install @capgo/capacitor-updater
npx cap sync
```

### Step 2: Create Capgo Account

1. Go to https://capgo.app/
2. Sign up (Free tier: 100 updates/month)
3. Create new app
4. Copy your API key

### Step 3: Configure Capgo

Create `frontend/capacitor.config.json` or update existing:

```json
{
  "appId": "com.school.app",
  "appName": "School Software",
  "webDir": "dist",
  "plugins": {
    "CapacitorUpdater": {
      "autoUpdate": true,
      "resetWhenUpdate": false,
      "updateUrl": "https://api.capgo.app/updates"
    }
  }
}
```

### Step 4: Initialize in Your App

Update `frontend/src/main.jsx`:

```javascript
import { CapacitorUpdater } from '@capgo/capacitor-updater';

// Add this before ReactDOM.render
if (window.Capacitor) {
  CapacitorUpdater.notifyAppReady();
  
  // Check for updates on app start
  CapacitorUpdater.addListener('updateAvailable', (info) => {
    console.log('Update available:', info);
  });
  
  CapacitorUpdater.addListener('downloadComplete', (info) => {
    console.log('Update downloaded, will apply on next restart');
  });
}
```

### Step 5: Upload Your First Update

```bash
# Build your app
npm run build

# Install Capgo CLI
npm install -g @capgo/cli

# Login to Capgo
npx @capgo/cli login YOUR_API_KEY

# Upload update
npx @capgo/cli upload
```

### Step 6: Rebuild APK (ONE TIME ONLY)

```bash
npx cap sync
npx cap open android
# Build APK in Android Studio
```

Upload this APK to Play Store. **This is the LAST time users need to install from Play Store!**

---

## 📦 Option 2: Self-Hosted Updates (100% FREE)

If you don't want to use Capgo's service, you can host updates yourself:

### Step 1: Install Plugin

```bash
cd frontend
npm install @capgo/capacitor-updater
npx cap sync
```

### Step 2: Create Update Server Endpoint

Add to `backend/src/routes/appRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Check for updates
router.get('/check-update', (req, res) => {
    const currentVersion = req.query.version || '1.0.0';
    const latestVersion = '1.0.1'; // Update this manually or from DB
    
    if (currentVersion < latestVersion) {
        res.json({
            version: latestVersion,
            url: `${process.env.BASE_URL}/updates/latest.zip`,
            mandatory: false
        });
    } else {
        res.json({ version: currentVersion, url: null });
    }
});

// Download update
router.get('/updates/:file', (req, res) => {
    const filePath = path.join(__dirname, '../../updates', req.params.file);
    res.download(filePath);
});

module.exports = router;
```

### Step 3: Configure App

Update `frontend/capacitor.config.json`:

```json
{
  "plugins": {
    "CapacitorUpdater": {
      "autoUpdate": true,
      "updateUrl": "https://your-backend.onrender.com/api/app/check-update"
    }
  }
}
```

### Step 4: Create Update Package

```bash
# Build your app
cd frontend
npm run build

# Create zip of dist folder
cd dist
zip -r ../latest.zip .
cd ..

# Move to backend updates folder
mkdir -p ../backend/updates
mv latest.zip ../backend/updates/
```

### Step 5: Deploy Update

```bash
# Push to GitHub
git add .
git commit -m "New update v1.0.1"
git push

# Render auto-deploys backend with new update file
# Users get update automatically on next app open!
```

---

## 🚀 Workflow After Setup

### For Most Changes (95% of time):

```bash
# 1. Make your changes in React code
# 2. Build
cd frontend
npm run build

# 3. Upload update (Capgo)
npx @capgo/cli upload

# OR (Self-hosted)
cd dist && zip -r ../latest.zip . && cd ..
mv latest.zip ../backend/updates/
git add . && git commit -m "Update" && git push

# 4. DONE! Users get update automatically ✨
```

**Time: 2 minutes**
**User action needed: NONE** (updates automatically)

### For Native Changes (5% of time):

```bash
# 1. Make changes
# 2. Update version in package.json
# 3. Build APK
npx cap sync
npx cap open android
# Build in Android Studio

# 4. Upload to Play Store
# 5. Users update from Play Store (one time)
```

**Time: 30 minutes**
**User action: Manual Play Store update**

---

## 📊 Update Flow Diagram

```
User Opens App
     ↓
Check for Updates (Background)
     ↓
Update Available?
     ↓ YES
Download Update (Silent)
     ↓
Apply on Next Restart
     ↓
User Sees New Features! ✨
```

---

## 🎯 Version Strategy

Update `frontend/package.json`:

```json
{
  "version": "1.2.3",
  "versionCode": 123
}
```

**Rules:**
- **1.x.x** - Major changes (Play Store update needed)
- **x.2.x** - New features (Live update)
- **x.x.3** - Bug fixes (Live update)

---

## ✅ Benefits

| Feature | Without Live Updates | With Live Updates |
|---------|---------------------|-------------------|
| Update time | 5-10 minutes | 5 seconds |
| User action | Manual download | Automatic |
| Data usage | 50+ MB | 1-5 MB |
| Play Store approval | 1-3 days | Instant |
| Rollback | Impossible | Easy |

---

## 🔒 Security

Live updates are secure because:
- ✅ Updates are signed and verified
- ✅ Only code changes (HTML/CSS/JS)
- ✅ Native code cannot be changed
- ✅ Permissions cannot be added
- ✅ Complies with Play Store policies

---

## 💰 Cost Comparison

| Solution | Free Tier | Paid Tier |
|----------|-----------|-----------|
| **Capgo** | 100 updates/month | $15/month (unlimited) |
| **Self-hosted** | FREE (unlimited) | FREE |
| **Ionic Appflow** | No free tier | $29/month |

---

## 🎯 My Recommendation

**Start with Capgo Free Tier:**
1. Easy setup (15 minutes)
2. 100 updates/month is enough for development
3. Automatic update management
4. Good dashboard

**Switch to Self-hosted later if needed:**
- When you exceed 100 updates/month
- When you want full control
- When you want zero costs

---

## 📝 Next Steps

1. Choose: Capgo or Self-hosted?
2. Follow setup steps above
3. Test with a small change
4. Deploy to Play Store (one time)
5. Enjoy automatic updates forever! 🎉

---

## 🆘 Troubleshooting

**Update not downloading?**
- Check internet connection
- Verify updateUrl is correct
- Check Capgo dashboard for errors

**Update downloaded but not applied?**
- Updates apply on next app restart
- Call `CapacitorUpdater.reload()` to force restart

**Want to force immediate update?**
```javascript
CapacitorUpdater.addListener('downloadComplete', async () => {
  await CapacitorUpdater.reload();
});
```

---

## 🎉 Success!

After setup, your workflow becomes:
1. Make changes
2. Run `npm run build && npx @capgo/cli upload`
3. Users get updates automatically!

**No more Play Store uploads for every small change!** 🚀
