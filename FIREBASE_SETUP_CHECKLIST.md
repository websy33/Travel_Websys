# Firebase Setup Checklist ✅

## Step 1: Verify Firebase Configuration

Check your `.env` file has these variables:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Step 2: Enable Firestore in Firebase Console

1. Go to https://console.firebase.google.com
2. Select your project
3. Click "Firestore Database" in left menu
4. Click "Create database"
5. Choose "Start in test mode" (for development)
6. Click "Enable"

## Step 3: Set Firestore Security Rules

In Firebase Console → Firestore → Rules, paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to approved hotels
    match /hotels/{hotelId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Restrict pending hotels to authenticated users
    match /pendingHotels/{hotelId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // User documents
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click "Publish" to save.

## Step 4: Test Firebase Connection

Open browser console (F12) and run:

```javascript
// Import and run test
import('./src/utils/testFirebase.js').then(module => {
  module.testFirebaseConnection();
});
```

Expected output:
```
✅ Write successful!
✅ Read successful!
✅ Delete successful!
✅ All tests passed!
```

## Step 5: Migrate Existing Data (Optional)

If you have hotels in localStorage:

```javascript
// Run migration
import('./src/utils/migrateToFirebase.js').then(module => {
  module.migrateLocalStorageToFirebase();
});
```

## Step 6: Verify in Firebase Console

1. Go to Firestore Database
2. You should see collections:
   - `hotels` (approved hotels)
   - `pendingHotels` (pending approval)
   - `users` (user accounts)

## Troubleshooting

### Error: "Missing or insufficient permissions"
- Check Firestore rules are published
- Ensure user is authenticated

### Error: "Firebase not initialized"
- Verify `.env` file exists
- Check all Firebase variables are set
- Restart dev server: `npm run dev`

### Hotels not appearing
- Check browser console for errors
- Verify Firestore has data
- Try refreshing the page

## Success Indicators ✅

- [ ] Firebase config loaded (no console errors)
- [ ] Firestore database created
- [ ] Security rules published
- [ ] Test connection passes
- [ ] Hotels appear in Firestore console
- [ ] Real-time updates work

## Next Steps

Once everything works:
1. Test adding a new hotel
2. Test admin approval flow
3. Verify real-time sync across tabs
4. Clear localStorage (data now in Firebase!)

---

**Need Help?** Check the browser console for detailed error messages.
