# Google Login Troubleshooting Guide

## Quick Fix Steps:

### 1. Check Firebase Console Configuration
1. Go to https://console.firebase.google.com/
2. Select project: `login-d3f1c`
3. Navigate to Authentication > Sign-in method
4. Ensure Google is enabled
5. Add these authorized domains:
   - `localhost`
   - `127.0.0.1`
   - Your production domain

### 2. Test Firebase Connection
Open `debug-firebase.html` in your browser and test Google login.

### 3. Check Browser Console
Look for specific error messages:
- `auth/popup-blocked` - Allow popups
- `auth/unauthorized-domain` - Add domain to Firebase Console
- `auth/network-request-failed` - Check internet connection

### 4. Verify Environment Variables
Ensure `.env` file contains:
```
VITE_FIREBASE_API_KEY=AIzaSyBptxqQHZpstJwUqq1TD2-sbS_iUCm9spk
VITE_FIREBASE_AUTH_DOMAIN=login-d3f1c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=login-d3f1c
VITE_FIREBASE_STORAGE_BUCKET=login-d3f1c.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=132957716999
VITE_FIREBASE_APP_ID=1:132957716999:web:ddaac6be1355184a7560a2
```

### 5. Clear Browser Cache
1. Clear browser cache and cookies
2. Disable ad blockers temporarily
3. Try in incognito/private mode

### 6. Test Backend Connection
Run: `node test-firebase-auth.js`
Visit: `http://localhost:3001/test-firebase`

## Code Changes Made:

### firebase-config.js
- Enhanced error handling
- Better Google Auth Provider configuration
- Debug logging added
- Initialization checks

### Hotels.jsx
- Improved Google sign-in error handling
- Better user feedback
- Specific error code handling
- Popup management

## Common Issues and Solutions:

### Issue: "Popup blocked by browser"
**Solution:** Allow popups for your domain in browser settings

### Issue: "This domain is not authorized"
**Solution:** Add domain to Firebase Console authorized domains

### Issue: "Network request failed"
**Solution:** Check internet connection and Firebase service status

### Issue: "Too many requests"
**Solution:** Wait a few minutes and try again

### Issue: "Invalid API key"
**Solution:** Verify API key in Firebase Console and .env file

## Testing Checklist:
- [ ] Firebase Console configured
- [ ] Google sign-in enabled
- [ ] Authorized domains added
- [ ] Environment variables set
- [ ] Browser allows popups
- [ ] Internet connection stable
- [ ] debug-firebase.html test passes

## If Still Not Working:
1. Check Firebase Console for any service outages
2. Verify Google Cloud Console OAuth settings
3. Try different browser
4. Check network firewall settings
5. Contact Firebase support if needed

## Backend Server Status:
The backend server is properly configured with Firebase Admin SDK and should be running on port 5000.