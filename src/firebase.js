// Clean Firebase configuration - Alternative to firebase-config.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  onSnapshot,
} from 'firebase/firestore';

// Firebase configuration from .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Configure Google Auth Provider
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Auth state checker
export const checkAuthState = (callback) => {
  if (!auth) {
    console.error('Auth not initialized');
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// Ensure a user document exists and return it
export const ensureUserDoc = async (user, defaults = {}) => {
  if (!user) return null;
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    const userDoc = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      role: defaults.role || 'hotel',
      approved: defaults.approved ?? false,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    };
    await setDoc(userRef, userDoc, { merge: true });
    return userDoc;
  } else {
    const data = snap.data();
    // update lastLogin
    await updateDoc(userRef, { lastLogin: serverTimestamp() });
    return data;
  }
};

export const getUserDoc = async (uid) => {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
};

// Google Sign-In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error('Google sign-in error:', error);
    
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Google sign-in is not enabled in Firebase Console. Please enable Google authentication in your Firebase project settings.');
    }
    
    throw error;
  }
};

// Google sign-in with approval gating and role management
export const signInWithGoogleAndCheckApproval = async () => {
  const result = await signInWithGoogle();
  const user = result?.user;
  if (!user) return { status: 'error', error: new Error('No user returned') };

  // Create/fetch user doc
  const userDoc = await ensureUserDoc(user, { role: 'hotel', approved: false });

  // If not approved, sign out and inform caller
  if (!userDoc.approved) {
    await auth.signOut().catch(() => {});
    return { status: 'pending', user: { uid: user.uid, email: user.email } };
  }

  return { status: 'approved', role: userDoc.role, user };
};

// Handle redirect result
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error) {
    console.error('Redirect result error:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await auth.signOut();
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = () => {
  const user = auth?.currentUser;
  if (!user) return null;
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified
  };
};

// Check if Firebase is initialized
export const isFirebaseInitialized = () => {
  return !!(app && auth && googleProvider && db);
};

// Debug function
export const debugFirebase = () => {
  console.log('Firebase Debug Info:', {
    app: !!app,
    auth: !!auth,
    googleProvider: !!googleProvider,
    db: !!db,
    currentUser: auth?.currentUser?.email || 'None'
  });
};

export default app;