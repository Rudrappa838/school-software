# Mobile App Optimization & Notification Plan

## 1. App Size Reduction (Target: < 30MB)
Completed actions that will be active in next build:
- **Minification Enabled**: `minifyEnabled true` in build.gradle creates smaller code.
- **Resource Shrinking**: `shrinkResources true` removes unused images/layouts.
- **Split ABIs** (To do): We can split the APK by architecture (ARMv7, ARM64) to save 30-40% more space.

## 2. Permissions System
The following permissions are already configured in `AndroidManifest.xml`:
- **Location**: `ACCESS_FINE_LOCATION` (For Driver Tracking)
- **Notifications**: `POST_NOTIFICATIONS` (For Updates)

**To Do:**
- **Camera/Photos**: Add `CAMERA` and `READ_EXTERNAL_STORAGE` permissions for Homework/Profile upload.
- **Microphone**: Add `RECORD_AUDIO` if needed for voice notes.

## 3. Play Store Readiness
- **App Icon**: We need to generate adaptive icons.
- **Signing**: We need to generate a Keystore file (`.jks`) to sign the Release APK.
- **Policy**: Privacy Policy URL must be valid.

## Next Session Action Items
1.  Complete the `google-services.json` setup (User Action).
2.  Enable Camera permissions in code.
3.  Configure Split APKs for maximum size reduction.
4.  Verify Push Notification flow from Backend -> Firebase -> App.
