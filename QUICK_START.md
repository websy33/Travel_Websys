# 🚀 Quick Start - Firebase Hotel Storage

## ⚡ 3-Minute Setup

### Step 1: Enable Firestore (1 min)
1. Go to https://console.firebase.google.com
2. Select your project
3. Firestore Database → Create Database
4. Choose "Test mode" → Enable

### Step 2: Set Rules (30 sec)
Firestore → Rules → Paste this:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /hotels/{hotelId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /pendingHotels/{hotelId} {
      allow read, write: if request.auth != null;
    }
  }
}
```
Click "Publish"

### Step 3: Test (30 sec)
Browser console (F12):
```javascript
import('./src/utils/testFirebase.js').then(m => m.testFirebaseConnection());
```

### Step 4: Migrate Data (1 min) - Optional
If you have existing hotels:
```javascript
import('./src/utils/migrateToFirebase.js').then(m => m.migrateLocalStorageToFirebase());
```

## ✅ Done!

Your hotels are now stored in Firebase Firestore!

## 🎯 Quick Commands

### Test Connection
```javascript
window.testFirebase()
```

### Migrate Data
```javascript
window.migrateToFirebase()
```

### Check Firebase Status
Open browser console - should see:
```
✅ Firebase app initialized
✅ Firebase Auth initialized
✅ Google Auth Provider configured
```

## 📊 Verify Success

1. Add a hotel → Check Firebase Console
2. Approve hotel → Moves to 'hotels' collection
3. Refresh page → Data persists

## 🆘 Troubleshooting

**Error: "Missing permissions"**
→ Check Firestore rules are published

**Hotels not showing**
→ Check browser console for errors
→ Verify Firestore has data

**Can't add hotels**
→ Ensure user is logged in
→ Check Firestore write rules

## 📚 Full Documentation

- `FIREBASE_SETUP_CHECKLIST.md` - Detailed setup
- `FIREBASE_MIGRATION_GUIDE.md` - Usage guide
- `MIGRATION_SUMMARY.md` - Technical details

---

**Need help?** Check browser console (F12) for error messages.
