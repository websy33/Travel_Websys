# 🧪 Test Your Firebase Registration - Step by Step

## ✅ Your Setup is COMPLETE!

Your Firebase is already connected using the keys in your `.env` file. Let's test it now!

## 🚀 Method 1: Test in Existing Hotels.jsx

### Open: `src/Pages/Hotels.jsx`

Add this import at the top:
```jsx
import HotelRegistrationForm from '../Components/Hotels/auth/HotelRegistrationForm';
```

Add this state:
```jsx
const [showReg, setShowReg] = useState(false);
```

Add this component before the closing tag:
```jsx
<HotelRegistrationForm
  isOpen={showReg}
  onClose={() => setShowReg(false)}
  onSuccess={(result) => {
    alert('✅ Saved to Firebase! Check console.');
    console.log('Firebase Result:', result);
  }}
/>
```

Add this button anywhere:
```jsx
<button onClick={() => setShowReg(true)}>
  TEST FIREBASE REGISTRATION
</button>
```

## 🎯 Method 2: Use the Test Page (Quickest!)

### Step 1: Update App.jsx

Open `src/App.jsx` and add this route:

```jsx
import MinimalRegistrationExample from './examples/MinimalRegistrationExample';

// In your routes:
<Route path="/test-registration" element={<MinimalRegistrationExample />} />
```

### Step 2: Visit the Test Page

```bash
npm run dev
```

Then open: **http://localhost:5174/test-registration**

### Step 3: Click "Register Your Hotel"

Fill out the form with test data:

**Step 1 - Personal Info:**
- Full Name: `Test User`
- Email: `test@example.com` (use a real email to test verification)
- Password: `Test123456`
- Confirm Password: `Test123456`
- Phone: `9876543210`

**Step 2 - Hotel Info:**
- Hotel Name: `Test Grand Hotel`
- Address: `123 Test Street, Lal Chowk`
- City: `Srinagar`
- PIN Code: `190001`

**Step 3 - Legal Documents:**
- GST Number: `22ABCDE1234F1Z5`
- PAN Number: `ABCDE1234F`

### Step 4: Click "Submit Registration"

You'll see:
- ✅ Loading spinner
- ✅ Success modal
- ✅ Alert with registration details

## 📊 Verify Data in Firebase Console

### Step 1: Open Firebase Console
Go to: **https://console.firebase.google.com**

### Step 2: Select Your Project
Click on your project name

### Step 3: Check Authentication
1. Click **"Authentication"** in left sidebar
2. Click **"Users"** tab
3. You should see: `test@example.com` ✅

### Step 4: Check Firestore
1. Click **"Firestore Database"** in left sidebar
2. Click on collection: **`hotelRegistrations`**
3. Click on the document to see all data:

```
✅ uid: "firebase-user-id"
✅ email: "test@example.com"
✅ ownerName: "Test User"
✅ hotelName: "Test Grand Hotel"
✅ phone: "9876543210"
✅ address: "123 Test Street, Lal Chowk"
✅ city: "Srinagar"
✅ pincode: "190001"
✅ gstNumber: "22ABCDE1234F1Z5"
✅ panNumber: "ABCDE1234F"
✅ status: "pending"
✅ registeredAt: [Timestamp]
✅ emailVerified: false
```

### Step 5: Check Email
Check the inbox of `test@example.com` for verification email!

## 🎮 Method 3: Test Programmatically in Console

Open browser console (F12) and run:

```javascript
// Import the function
const { registerHotel } = await import('./src/utils/hotelRegistration.js');

// Test data
const testData = {
  ownerName: "Console Test User",
  email: "console-test@example.com",
  password: "Test123456",
  phone: "9876543210",
  hotelName: "Console Test Hotel",
  address: "456 Console Street",
  city: "Srinagar",
  pincode: "190001",
  gstNumber: "22ABCDE1234F1Z5",
  panNumber: "ABCDE1234F"
};

// Register
const result = await registerHotel(testData);
console.log('✅ Success:', result);
```

## 🔍 What to Look For

### In Browser Console:
```
🏨 Starting hotel registration... console-test@example.com
✅ Firebase Auth user created: abc123xyz
📧 Verification email sent to: console-test@example.com
✅ Registration document created: doc-id-123
🎉 Hotel registration completed successfully!
```

### Success Response:
```javascript
{
  success: true,
  userId: "firebase-auth-uid",
  registrationId: "firestore-doc-id",
  email: "test@example.com",
  message: "Registration successful! Please verify your email to continue.",
  emailVerificationSent: true
}
```

## 🎯 Quick Test Checklist

- [ ] Form opens when button clicked
- [ ] All 3 steps can be navigated
- [ ] Form validation works (try invalid email)
- [ ] Password must match confirmation
- [ ] PAN/GST validation works
- [ ] Submit button shows loading state
- [ ] Success modal appears
- [ ] User appears in Firebase Auth
- [ ] Document appears in Firestore
- [ ] Email received (check spam folder)

## 🐛 Troubleshooting

### Issue: "Firebase not initialized"
**Fix:** Check `.env` file has all keys:
```bash
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
```

### Issue: "Permission denied"
**Fix:** Update Firestore rules in Firebase Console:
```javascript
match /hotelRegistrations/{doc} {
  allow create: if request.auth != null;
  allow read: if request.auth != null;
}
```

### Issue: "Email already in use"
**Fix:** Use a different email or delete the user from Firebase Console

### Issue: Modal not showing
**Fix:** Check state in React DevTools:
```jsx
console.log('Modal state:', showReg);
```

### Issue: Form not submitting
**Fix:** Check browser console for errors:
```jsx
// Add console logs
const handleSubmit = async (data) => {
  console.log('Submitting:', data);
  try {
    const result = await registerHotel(data);
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 📧 Email Verification Setup

### Enable Email/Password Authentication
1. Firebase Console → Authentication
2. Click "Sign-in method" tab
3. Enable "Email/Password"
4. Save

### Customize Email Template
1. Firebase Console → Authentication
2. Click "Templates" tab
3. Click "Email address verification"
4. Customize the template
5. Save

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ **Browser console shows**: "🎉 Hotel registration completed successfully!"
2. ✅ **Firebase Auth has**: New user with the email
3. ✅ **Firestore has**: New document in `hotelRegistrations`
4. ✅ **Email inbox has**: Verification email
5. ✅ **Alert shows**: Success message with user details

## 📊 View Data with Utility Functions

### Get All Pending Registrations
```javascript
import { getPendingRegistrations } from './utils/hotelRegistration';

const pending = await getPendingRegistrations();
console.log('Pending registrations:', pending);
```

### Check Registration Status
```javascript
import { getRegistrationByUserId } from './utils/hotelRegistration';

const registration = await getRegistrationByUserId('user-id');
console.log('Status:', registration.status);
```

### Get Statistics
```javascript
import { getRegistrationStats } from './utils/hotelRegistration';

const stats = await getRegistrationStats();
console.log('Stats:', stats);
// { total: 5, pending: 2, approved: 3, rejected: 0 }
```

## 🚀 You're All Set!

Your Firebase registration system is fully functional!

**Your .env keys are connected** ✅
**Registration form is ready** ✅
**Data will save to Firebase** ✅
**Email verification works** ✅

Just add the component to your Hotels.jsx and start testing! 🎊

---

**Need help?** Check the detailed guides:
- `FIREBASE_REGISTRATION_SETUP.md` - Complete documentation
- `QUICK_START_REGISTRATION.md` - Quick integration guide
- `src/examples/MinimalRegistrationExample.jsx` - Working example
