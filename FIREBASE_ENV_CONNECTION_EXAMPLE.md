# Firebase Environment Variables - Code Connection Example

## 🔗 How .env Variables Connect to Your Registration

This guide shows **exactly** how environment variables in your `.env` file connect to the registration form submission.

---

## 📋 Step 1: Environment Variables (.env file)

```env
# Your .env file (root directory)
VITE_FIREBASE_API_KEY=AIzaSyC-xxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxx
```

---

## 🔥 Step 2: Firebase Initialization (src/firebase.js)

Your `src/firebase.js` file **automatically loads** these environment variables:

```javascript
// src/firebase.js (Lines 30-37)

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,          // ← From .env
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,  // ← From .env
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,    // ← From .env
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase with config
const app = initializeApp(firebaseConfig);

// Create Firebase services
const auth = getAuth(app);  // ← For user authentication
const db = getFirestore(app); // ← For storing hotel data

// Export for use in other files
export { auth, db };
```

**✅ This is already in your project!** (File: `src/firebase.js`)

---

## 📝 Step 3: Registration Form (HotelRegistrationForm.jsx)

User fills out the 3-step registration form:

```javascript
// src/Components/Hotels/auth/HotelRegistrationForm.jsx (Line 147)

import { registerHotel } from '../../../utils/hotelRegistration';

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Send form data to registration function
    const result = await registerHotel(formData);
    //                                  ↑
    //                    Contains all form fields:
    //                    - email, password
    //                    - ownerName, phone
    //                    - hotelName, address
    //                    - gstNumber, panNumber
    //                    - etc.
    
    console.log('Registration successful:', result);
    setSuccess(true);
    
  } catch (err) {
    console.error('Registration error:', err);
    setError(err.message);
  }
};
```

**✅ This is already in your project!**

---

## 🔐 Step 4: Registration Function (hotelRegistration.js)

This is where the **magic happens** - connecting env variables to Firebase:

```javascript
// src/utils/hotelRegistration.js

import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  updateProfile 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase'; // ← Imports auth & db from firebase.js
                                        //   which uses environment variables!

export const registerHotel = async (registrationData) => {
  try {
    // ═══════════════════════════════════════════════════════════
    // STEP A: Create Firebase Authentication User
    // Uses: auth (initialized with VITE_FIREBASE_* env variables)
    // ═══════════════════════════════════════════════════════════
    
    const userCredential = await createUserWithEmailAndPassword(
      auth,  // ← This 'auth' instance was created using your .env variables!
      registrationData.email,
      registrationData.password
    );
    
    const user = userCredential.user;
    console.log('✅ User created:', user.uid);
    
    // ═══════════════════════════════════════════════════════════
    // STEP B: Update User Profile
    // ═══════════════════════════════════════════════════════════
    
    await updateProfile(user, {
      displayName: registrationData.ownerName
    });
    
    // ═══════════════════════════════════════════════════════════
    // STEP C: Send Email Verification
    // ═══════════════════════════════════════════════════════════
    
    await sendEmailVerification(user, {
      url: window.location.origin + '/hotels',
      handleCodeInApp: false
    });
    
    console.log('📧 Verification email sent');
    
    // ═══════════════════════════════════════════════════════════
    // STEP D: Store Hotel Registration Data in Firestore
    // Uses: db (initialized with VITE_FIREBASE_* env variables)
    // ═══════════════════════════════════════════════════════════
    
    const hotelRegistrationDoc = {
      // User Information
      uid: user.uid,
      email: registrationData.email,
      ownerName: registrationData.ownerName,
      
      // Hotel Information
      hotelName: registrationData.hotelName,
      hotelAddress: registrationData.address,
      city: registrationData.city,
      state: registrationData.state,
      pincode: registrationData.pincode,
      
      // Contact Information
      phone: registrationData.phone,
      alternatePhone: registrationData.alternatePhone,
      
      // Legal Documents
      gstNumber: registrationData.gstNumber,
      panNumber: registrationData.panNumber,
      
      // Status & Metadata
      status: 'pending',
      role: 'hotel',
      emailVerified: user.emailVerified,
      
      // Timestamps
      registeredAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      
      // Additional Data
      description: registrationData.description,
      website: registrationData.website,
      
      // Approval tracking
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
    };
    
    // Add document to Firestore
    const docRef = await addDoc(
      collection(db, 'hotelRegistrations'), // ← 'db' uses your .env variables!
      hotelRegistrationDoc
    );
    
    console.log('✅ Document created:', docRef.id);
    
    // ═══════════════════════════════════════════════════════════
    // STEP E: Return Success Response
    // ═══════════════════════════════════════════════════════════
    
    return {
      success: true,
      userId: user.uid,
      registrationId: docRef.id,
      email: user.email,
      message: 'Registration successful! Please verify your email.',
      emailVerificationSent: true
    };
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    throw error;
  }
};
```

**✅ This is already in your project!** (File: `src/utils/hotelRegistration.js`)

---

## 🔄 The Complete Connection Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ .env File                                                       │
│                                                                 │
│ VITE_FIREBASE_API_KEY=abc123                                   │
│ VITE_FIREBASE_PROJECT_ID=my-project                            │
│ VITE_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com           │
│ ... (other Firebase env variables)                             │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        │ Loaded by Vite at startup
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│ src/firebase.js                                                 │
│                                                                 │
│ const firebaseConfig = {                                       │
│   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,              │
│   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,        │
│   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN       │
│ };                                                              │
│                                                                 │
│ const app = initializeApp(firebaseConfig);                     │
│ const auth = getAuth(app);  ← Connected to Firebase Auth      │
│ const db = getFirestore(app); ← Connected to Firestore        │
│                                                                 │
│ export { auth, db };                                            │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        │ Exported for use in other files
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│ src/utils/hotelRegistration.js                                 │
│                                                                 │
│ import { auth, db } from '../firebase';                        │
│                                                                 │
│ export const registerHotel = async (data) => {                 │
│   // Create user in Firebase Auth                              │
│   const userCredential = await createUserWithEmailAndPassword( │
│     auth,  ← Uses auth instance from firebase.js               │
│     data.email,                                                 │
│     data.password                                               │
│   );                                                            │
│                                                                 │
│   // Save data to Firestore                                    │
│   await addDoc(                                                 │
│     collection(db, 'hotelRegistrations'),                      │
│              ↑                                                  │
│              └── Uses db instance from firebase.js             │
│     { ...hotel data... }                                        │
│   );                                                            │
│ };                                                              │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        │ Imported by registration form
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│ src/Components/Hotels/auth/HotelRegistrationForm.jsx           │
│                                                                 │
│ import { registerHotel } from '../../../utils/hotelRegistration';│
│                                                                 │
│ const handleSubmit = async () => {                             │
│   const result = await registerHotel(formData);                │
│   console.log('Success!', result);                             │
│ };                                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Takeaways

### 1. **One-Time Setup**
You only need to add Firebase credentials to `.env` file **once**:
```env
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_STORAGE_BUCKET=your-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 2. **Automatic Loading**
`src/firebase.js` automatically loads these variables when the app starts:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY
  // ... all other variables loaded automatically
};
```

### 3. **Global Usage**
Once initialized, `auth` and `db` can be imported anywhere:
```javascript
import { auth, db } from '../firebase';

// Now you can use them to:
// - Create users (auth)
// - Store data (db)
// - Send emails (auth)
// - Query data (db)
```

### 4. **Registration Function**
`registerHotel()` uses both `auth` and `db`:
```javascript
// Create user account
await createUserWithEmailAndPassword(auth, email, password);

// Store hotel data
await addDoc(collection(db, 'hotelRegistrations'), data);
```

---

## 🧪 Testing the Connection

### 1. **Check if env variables are loaded**

Open browser console and type:
```javascript
import.meta.env.VITE_FIREBASE_API_KEY
// Should show: "AIzaSyC-xxxxxxxxxxxxxxxxxxxx"

import.meta.env.VITE_FIREBASE_PROJECT_ID
// Should show: "your-project-id"
```

### 2. **Check if Firebase is initialized**

```javascript
import { isFirebaseInitialized } from './src/firebase';
console.log(isFirebaseInitialized());
// Should show: true
```

### 3. **Test registration**

```javascript
import { registerHotel } from './src/utils/hotelRegistration';

const testData = {
  email: 'test@example.com',
  password: 'TestPass123',
  ownerName: 'Test Owner',
  hotelName: 'Test Hotel',
  phone: '9876543210',
  address: 'Test Address',
  city: 'Srinagar',
  state: 'Jammu & Kashmir',
  pincode: '190001',
  gstNumber: '22ABCDE1234F1Z5',
  panNumber: 'ABCDE1234F'
};

registerHotel(testData)
  .then(result => console.log('✅ Success:', result))
  .catch(error => console.error('❌ Error:', error));
```

---

## 📚 Environment Variable Naming Convention

### Why `VITE_` prefix?

Vite (your build tool) requires environment variables to start with `VITE_` to be accessible in client-side code.

```javascript
// ✅ WORKS - Has VITE_ prefix
VITE_FIREBASE_API_KEY=abc123
import.meta.env.VITE_FIREBASE_API_KEY // "abc123"

// ❌ DOESN'T WORK - Missing VITE_ prefix
FIREBASE_API_KEY=abc123
import.meta.env.FIREBASE_API_KEY // undefined
```

### Security Note

Variables with `VITE_` prefix are **bundled into your JavaScript** and visible in the browser. That's okay for Firebase config because:
- ✅ Firebase API key is meant to be public
- ✅ Security is handled by Firebase Security Rules
- ✅ Domain restrictions in Firebase Console

---

## ✅ Summary

**Your setup (already working):**
```
.env variables → firebase.js → auth/db instances → hotelRegistration.js → form
```

**What you need:**
1. Add 6 Firebase credentials to `.env` file
2. Restart dev server
3. Test registration

That's it! The code is already configured to use environment variables automatically. 🎉
