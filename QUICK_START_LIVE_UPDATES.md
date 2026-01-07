# 🚀 Quick Start: Enable Live Updates for Your School App

## 🎯 Goal
After this setup, you can update your app WITHOUT users reinstalling from Play Store!

---

## ⚡ FASTEST SOLUTION: Capgo (15 minutes setup)

### Step 1: Install Capgo Plugin (2 minutes)

```bash
cd e:\SchoolSoftware\frontend

# Install the plugin
npm install @capgo/capacitor-updater

# Sync with native project
npx cap sync
```

### Step 2: Sign Up for Capgo (3 minutes)

1. Go to https://web.capgo.app/register
2. Sign up with your email
3. Create a new app
4. Copy your **API Key** (looks like: `ae1234567890abcdef`)

### Step 3: Update Capacitor Config (1 minute)

Add this to your `capacitor.config.json`:

```json
{
  "appId": "com.school.app",
  "appName": "SchoolApp",
  "webDir": "dist",
  "plugins": {
    "CapacitorUpdater": {
      "autoUpdate": true,
      "appReadyTimeout": 10000,
      "responseTimeout": 10,
      "autoDeleteFailed": true,
      "autoDeletePrevious": true,
      "resetWhenUpdate": false,
      "directUpdate": true
    },
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    },
    "SplashScreen": {
      "launchShowDuration": 500,
      "launchAutoHide": true,
      "backgroundColor": "#0ea5e9",
      "androidSplashResourceName": "splash",
      "showSpinner": false
    },
    "Geolocation": {
      "permissions": ["location"]
    }
  },
  "android": {
    "allowMixedContent": true,
    "captureInput": true,
    "webContentsDebuggingEnabled": false
  }
}
```

### Step 4: Initialize in Your App (2 minutes)

Update `e:\SchoolSoftware\frontend\src\main.jsx`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Capacitor } from '@capacitor/core';

// Initialize Capgo Live Updates (Mobile Only)
if (Capacitor.isNativePlatform()) {
  // Notify app is ready
  CapacitorUpdater.notifyAppReady();
  
  // Listen for updates
  CapacitorUpdater.addListener('updateAvailable', (info) => {
    console.log('🔄 Update available:', info.version);
  });
  
  CapacitorUpdater.addListener('downloadComplete', (info) => {
    console.log('✅ Update downloaded:', info.version);
    // Update will be applied on next app restart
  });
  
  CapacitorUpdater.addListener('updateFailed', (info) => {
    console.error('❌ Update failed:', info);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### Step 5: Install Capgo CLI (1 minute)

```bash
# Install globally
npm install -g @capgo/cli

# Login with your API key
npx @capgo/cli login YOUR_API_KEY_HERE
```

### Step 6: Link Your App (1 minute)

```bash
cd e:\SchoolSoftware\frontend

# Link to Capgo
npx @capgo/cli init YOUR_API_KEY_HERE
```

### Step 7: Build and Upload First Version (3 minutes)

```bash
# Build your app
npm run build

# Upload to Capgo
npx @capgo/cli upload --channel production
```

### Step 8: Rebuild APK ONE LAST TIME (5 minutes)

```bash
# Sync native code
npx cap sync

# Open in Android Studio
npx cap open android

# In Android Studio:
# 1. Build → Generate Signed Bundle / APK
# 2. Choose APK
# 3. Build Release APK
```

**Upload this APK to Play Store. Users will NEVER need to reinstall again!**

---

## 🔄 Daily Workflow (After Setup)

### When You Make Changes:

```bash
cd e:\SchoolSoftware\frontend

# 1. Make your changes to React code
# 2. Build
npm run build

# 3. Upload update
npx @capgo/cli upload --channel production

# 4. DONE! ✨
```

**Users will get the update automatically within minutes!**

---

## 📱 What Happens on User's Phone?

```
1. User opens app
   ↓
2. App checks for updates (background)
   ↓
3. If update available → Downloads silently (1-5 MB)
   ↓
4. Next time user opens app → New version loads!
   ↓
5. User sees your new features! 🎉
```

**User doesn't need to do ANYTHING!**

---

## 🎯 Version Management

Update `package.json` before each upload:

```json
{
  "version": "1.0.1"  // Increment this
}
```

**Version Rules:**
- `1.0.0` → `1.0.1` = Bug fix (Live update)
- `1.0.0` → `1.1.0` = New feature (Live update)
- `1.0.0` → `2.0.0` = Major change (May need Play Store update)

---

## 🆓 Capgo Pricing

| Plan | Updates/Month | Cost |
|------|---------------|------|
| **Free** | 100 | $0 |
| **Solo** | Unlimited | $15/month |
| **Team** | Unlimited + Team features | $30/month |

**For development: Free tier is perfect!**

---

## 🔍 Monitor Updates

Dashboard: https://web.capgo.app/

You can see:
- ✅ How many users updated
- ✅ Update success rate
- ✅ Active versions
- ✅ Rollback if needed

---

## 🚨 Emergency Rollback

If you push a bad update:

```bash
# Rollback to previous version
npx @capgo/cli rollback --channel production
```

**All users will get the old version back instantly!**

---

## 💡 Pro Tips

### 1. Test Before Production

```bash
# Upload to test channel first
npx @capgo/cli upload --channel test

# Install test version on your phone
# Test thoroughly
# Then upload to production
npx @capgo/cli upload --channel production
```

### 2. Gradual Rollout

In Capgo dashboard:
- Set update to 10% of users first
- Monitor for issues
- Increase to 100% if all good

### 3. Force Update for Critical Fixes

Update `capacitor.config.json`:

```json
{
  "plugins": {
    "CapacitorUpdater": {
      "autoUpdate": true,
      "directUpdate": true  // Forces immediate update
    }
  }
}
```

---

## ❓ FAQ

**Q: Do I still need Play Store?**
A: Yes, for the initial install and major native updates. But 95% of updates will be live!

**Q: Is this allowed by Play Store?**
A: Yes! It's explicitly allowed for web content updates (HTML/CSS/JS).

**Q: What if user has no internet?**
A: App works normally with old version. Updates when internet is available.

**Q: Can I update native code?**
A: No. Native changes require Play Store update. But most changes are web content!

**Q: How big are updates?**
A: Usually 1-5 MB (vs 50+ MB for full APK).

**Q: How fast are updates?**
A: Download: 5-30 seconds. Apply: Next app restart.

---

## ✅ Checklist

Before going to production:

- [ ] Capgo plugin installed
- [ ] Capacitor config updated
- [ ] main.jsx updated with Capgo initialization
- [ ] First version uploaded to Capgo
- [ ] New APK built with Capgo plugin
- [ ] APK uploaded to Play Store
- [ ] Tested update flow on real device

---

## 🎉 Success!

After this setup:
- ✅ You can push updates anytime
- ✅ Users get updates automatically
- ✅ No Play Store approval needed (for most changes)
- ✅ Updates are instant (minutes, not days)
- ✅ You can rollback bad updates
- ✅ Users save data (small updates)

**Your development speed just increased 10x!** 🚀

---

## 📞 Need Help?

- Capgo Docs: https://capgo.app/docs/
- Capgo Discord: https://discord.gg/VnYRvBfgA6
- Your LIVE_UPDATES_GUIDE.md for detailed info

---

## 🔗 Quick Commands Reference

```bash
# Build and upload update
npm run build && npx @capgo/cli upload --channel production

# Check upload status
npx @capgo/cli list

# Rollback
npx @capgo/cli rollback --channel production

# View logs
npx @capgo/cli logs
```

**Save these commands - you'll use them daily!**
