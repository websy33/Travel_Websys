# Firebase Hotel Registration - Complete Setup Guide

## ✅ Your Setup Status

Your Firebase is already configured! The `.env` file contains all necessary Firebase keys.

## 📁 Files Created

1. ✅ **`src/utils/hotelRegistration.js`** - Firebase registration utilities
2. ✅ **`src/Components/Hotels/auth/HotelRegistrationForm.jsx`** - Registration form component

## 🚀 How to Use

### Step 1: Import the Registration Component

```jsx
import HotelRegistrationForm from './Components/Hotels/auth/HotelRegistrationForm';
```

### Step 2: Add to Your Component

```jsx
import React, { useState } from 'react';
import HotelRegistrationForm from './Components/Hotels/auth/HotelRegistrationForm';

function YourPage() {
  const [showRegistration, setShowRegistration] = useState(false);

  const handleRegistrationSuccess = (result) => {
    console.log('Registration successful!', result);
    // Show success message or redirect
    alert('Registration successful! Please check your email.');
  };

  return (
    <div>
      {/* Your existing code */}
      
      <button onClick={() => setShowRegistration(true)}>
        Register Hotel
      </button>

      {/* Registration Modal */}
      <HotelRegistrationForm
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
}
```

### Step 3: Quick Integration Example

Here's a complete working example:

```jsx
import React, { useState } from 'react';
import HotelRegistrationForm from './Components/Hotels/auth/HotelRegistrationForm';
import AdminLogin from './Components/Hotels/auth/AdminLogin';

function HotelsPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setShowLogin(false);
    console.log('User logged in:', userData);
  };

  const handleRegistrationSuccess = (result) => {
    console.log('Registration successful:', result);
    setShowRegister(false);
    // Optionally show login modal
    setTimeout(() => setShowLogin(true), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hotels</h1>
          
          <div className="space-x-4">
            {currentUser ? (
              <span>Welcome, {currentUser.name}</span>
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegister(true)}
                  className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                >
                  Register Hotel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AdminLogin
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <HotelRegistrationForm
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
}

export default HotelsPage;
```

## 🔥 Firestore Database Structure

Your registration data will be stored in this structure:

### Collection: `hotelRegistrations`

```javascript
{
  // Document ID (auto-generated)
  "randomDocId123": {
    // User Information
    uid: "firebase-auth-uid",
    email: "hotel@example.com",
    ownerName: "John Doe",
    
    // Hotel Information
    hotelName: "Grand Hotel",
    hotelAddress: "123 Main Street",
    city: "Srinagar",
    state: "Jammu & Kashmir",
    pincode: "190001",
    
    // Contact
    phone: "9876543210",
    alternatePhone: "9876543211",
    
    // Legal Documents
    gstNumber: "22ABCDE1234F1Z5",
    panNumber: "ABCDE1234F",
    
    // Status
    status: "pending", // pending, approved, rejected
    role: "hotel",
    emailVerified: false,
    
    // Timestamps
    registeredAt: Timestamp,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    
    // Approval Info
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null
  }
}
```

### Collection: `hotelUsers`

```javascript
{
  uid: "firebase-auth-uid",
  email: "hotel@example.com",
  displayName: "John Doe",
  role: "hotel",
  status: "pending",
  registrationId: "randomDocId123",
  createdAt: Timestamp,
  lastLogin: Timestamp
}
```

## 🔒 Firestore Security Rules

**IMPORTANT:** You need to add these security rules in Firebase Console.

### Go to: Firebase Console → Firestore Database → Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Hotel Registrations Collection
    match /hotelRegistrations/{registrationId} {
      // Anyone can create (register)
      allow create: if isSignedIn();
      
      // User can read their own registration
      allow read: if isOwner(resource.data.uid) || isAdmin();
      
      // User can update their own pending registration
      allow update: if isOwner(resource.data.uid) && 
                       resource.data.status == 'pending';
      
      // Only admin can approve/reject
      allow update: if isAdmin() && 
                       request.resource.data.status in ['approved', 'rejected'];
      
      // Only admin can delete
      allow delete: if isAdmin();
    }
    
    // Hotel Users Collection
    match /hotelUsers/{userId} {
      allow create: if isSignedIn();
      allow read: if isOwner(userId) || isAdmin();
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Users Collection (for profiles)
    match /users/{userId} {
      allow create: if isSignedIn();
      allow read: if isOwner(userId) || isAdmin();
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Admins Collection (create manually in Firebase Console)
    match /admins/{adminId} {
      allow read: if isSignedIn();
      allow write: if false; // Only via Firebase Console
    }
    
    // Hotels Collection (approved hotels)
    match /hotels/{hotelId} {
      allow read: if true; // Public read
      allow create: if isSignedIn();
      allow update: if isOwner(resource.data.submittedBy) || isAdmin();
      allow delete: if isAdmin();
    }
  }
}
```

### Setting Up Admin Access

1. Go to Firebase Console → Firestore Database
2. Create a collection called `admins`
3. Add a document with your admin user's UID as the document ID
4. Add field: `email: "admin@traveligo.com"`
5. Add field: `role: "admin"`

## 📊 Available Functions

### Register a Hotel

```javascript
import { registerHotel } from './utils/hotelRegistration';

const formData = {
  ownerName: "John Doe",
  email: "hotel@example.com",
  password: "SecurePass123",
  phone: "9876543210",
  hotelName: "Grand Hotel",
  address: "123 Main Street",
  city: "Srinagar",
  pincode: "190001",
  gstNumber: "22ABCDE1234F1Z5",
  panNumber: "ABCDE1234F"
};

try {
  const result = await registerHotel(formData);
  console.log('Success:', result);
  // Result: { success: true, userId, registrationId, email, message }
} catch (error) {
  console.error('Error:', error.message);
}
```

### Get Pending Registrations (Admin)

```javascript
import { getPendingRegistrations } from './utils/hotelRegistration';

const pendingList = await getPendingRegistrations();
console.log('Pending:', pendingList);
```

### Approve Registration (Admin)

```javascript
import { approveRegistration } from './utils/hotelRegistration';

await approveRegistration('registrationId123', 'adminUserId');
```

### Reject Registration (Admin)

```javascript
import { rejectRegistration } from './utils/hotelRegistration';

await rejectRegistration('registrationId123', 'Invalid documents', 'adminUserId');
```

### Get Registration by User ID

```javascript
import { getRegistrationByUserId } from './utils/hotelRegistration';

const registration = await getRegistrationByUserId('userId123');
console.log('Registration:', registration);
```

### Check if Email is Already Registered

```javascript
import { isEmailRegistered } from './utils/hotelRegistration';

const exists = await isEmailRegistered('hotel@example.com');
if (exists) {
  alert('This email is already registered!');
}
```

### Get Statistics (Admin Dashboard)

```javascript
import { getRegistrationStats } from './utils/hotelRegistration';

const stats = await getRegistrationStats();
console.log('Stats:', stats);
// { total: 50, pending: 10, approved: 35, rejected: 5 }
```

## 🧪 Testing Your Setup

### 1. Test Registration Form

```bash
npm run dev
```

Open http://localhost:5174 and click "Register Hotel"

### 2. Check Firebase Console

After submitting registration:
1. Go to Firebase Console
2. Click on "Authentication" → Check if user was created
3. Click on "Firestore Database" → Check `hotelRegistrations` collection
4. Verify email was sent (check spam folder)

### 3. Test in Console

```javascript
// In browser console (F12)
import { registerHotel } from './src/utils/hotelRegistration';

const testData = {
  ownerName: "Test User",
  email: "test@example.com",
  password: "Test123456",
  phone: "9876543210",
  hotelName: "Test Hotel",
  address: "Test Address",
  city: "Srinagar",
  pincode: "190001",
  gstNumber: "22ABCDE1234F1Z5",
  panNumber: "ABCDE1234F"
};

registerHotel(testData).then(console.log).catch(console.error);
```

## 🔍 Debugging

### Common Issues

#### 1. "Firebase not initialized"
**Solution:** Check if `.env` file has all Firebase keys

```bash
# In .env file (example format)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

#### 2. "Permission denied"
**Solution:** Update Firestore security rules (see above)

#### 3. "Email already in use"
**Solution:** User already exists - use login instead

#### 4. "Weak password"
**Solution:** Password must be at least 6 characters

### Enable Console Logging

```javascript
// Add to your component
console.log('Form data:', formData);
console.log('Firebase initialized:', isFirebaseInitialized());
```

## 📧 Email Verification

The system automatically sends verification emails. Configure email templates:

1. Go to Firebase Console → Authentication → Templates
2. Customize "Email address verification" template
3. Set your app's domain and logo

## 🎯 Next Steps

1. ✅ Registration form works with Firebase
2. ✅ Data stored in Firestore
3. ✅ Email verification sent
4. ⏳ Create Admin Panel to approve registrations
5. ⏳ Create Hotel Management Dashboard
6. ⏳ Add document upload functionality

## 💡 Pro Tips

### 1. Add Loading States
```jsx
const [loading, setLoading] = useState(false);

const handleSubmit = async (data) => {
  setLoading(true);
  try {
    await registerHotel(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### 2. Add Success Toast Notifications
```jsx
import { toast } from 'react-hot-toast';

await registerHotel(data);
toast.success('Registration successful!');
```

### 3. Validate Email Before Submit
```jsx
const checkEmail = async (email) => {
  const exists = await isEmailRegistered(email);
  if (exists) {
    setError('Email already registered');
    return false;
  }
  return true;
};
```

### 4. Auto-fill City from PIN Code
```jsx
const pincodeData = {
  '190001': 'Srinagar',
  '191201': 'Gulmarg',
  // Add more
};

const handlePincodeChange = (e) => {
  const pin = e.target.value;
  if (pincodeData[pin]) {
    setFormData(prev => ({ ...prev, city: pincodeData[pin] }));
  }
};
```

## ✨ Success!

Your hotel registration is now fully integrated with Firebase! 

Registration data will be:
- ✅ Stored in Firestore
- ✅ User created in Firebase Auth
- ✅ Email verification sent
- ✅ Ready for admin approval

## 📞 Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Verify Firebase keys in `.env`
3. Check Firestore security rules
4. Ensure Firebase Authentication is enabled
5. Check that Email/Password provider is enabled in Firebase Console
