// firebase-config.js - Updated v1.1 to fix export issues
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
} from 'firebase/auth';

// Firebase configuration from .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? '[HIDDEN]' : 'MISSING'
});

// Initialize Firebase with comprehensive error handling
let app;
let auth;
let googleProvider;

try {
  // Initialize Firebase app
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
  
  // Initialize Auth
  auth = getAuth(app);
  console.log('✅ Firebase Auth initialized successfully');
  
  // Configure Google Auth Provider with enhanced settings
  googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('email');
  googleProvider.addScope('profile');
  googleProvider.setCustomParameters({
    prompt: 'select_account',
    login_hint: ''
  });
  
  console.log('✅ Google Auth Provider configured successfully');
  
  // Set auth language (optional)
  auth.languageCode = 'en';
  
  // Configure auth settings for better reliability
  auth.settings.appVerificationDisabledForTesting = false;
  
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  
  // Create fallback objects to prevent app crashes
  auth = null;
  googleProvider = null;
}

// Enhanced Google Sign-In function with multiple fallbacks
const signInWithGoogle = async (useRedirect = false) => {
  if (!auth || !googleProvider) {
    throw new Error('Firebase not properly initialized');
  }

  try {
    let result;
    
    if (useRedirect) {
      // Use redirect method as fallback
      console.log('Using redirect method for Google sign-in');
      await signInWithRedirect(auth, googleProvider);
      return null; // User will be redirected
    } else {
      // Try popup method first
      console.log('Using popup method for Google sign-in');
      result = await signInWithPopup(auth, googleProvider);
      return result;
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    
    // Enhanced error handling with specific cases
    switch (error.code) {
      case 'auth/network-request-failed':
        throw new Error('Network error. Please check your internet connection and try again.');
      
      case 'auth/popup-blocked':
        console.log('Popup blocked, switching to redirect method');
        // Automatically retry with redirect
        await signInWithRedirect(auth, googleProvider);
        return null;
      
      case 'auth/popup-closed-by-user':
        throw new Error('Sign-in was cancelled. Please try again.');
      
      case 'auth/operation-not-allowed':
        throw new Error('Google sign-in is not enabled in Firebase Console. Please enable Google authentication in your Firebase project settings.');
      
      case 'auth/internal-error':
        // Retry with redirect for internal errors
        console.log('Internal error, retrying with redirect method');
        await signInWithRedirect(auth, googleProvider);
        return null;
      
      default:
        throw new Error(`Sign-in failed: ${error.message}`);
    }
  }
};

// Handle redirect results
const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('✅ User signed in via redirect');
      return result;
    }
    return null;
  } catch (error) {
    console.error('Redirect result error:', error);
    throw error;
  }
};

// Check if user is already signed in
const checkAuthState = (callback) => {
  if (!auth) {
    console.error('Auth not initialized');
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User signed in:', user.email);
    } else {
      console.log('No user signed in');
    }
    if (callback) callback(user);
  });
};

// Sign out function
const signOutUser = async () => {
  if (!auth) {
    throw new Error('Firebase not properly initialized');
  }

  try {
    await auth.signOut();
    console.log('✅ User signed out successfully');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Helper function to check if Firebase is properly initialized
const isFirebaseInitialized = () => {
  return !!(app && auth && googleProvider);
};

// Helper function to get current user
const getCurrentUser = () => {
  return auth?.currentUser || null;
};

// Get user profile data
const getUserProfile = () => {
  const user = getCurrentUser();
  if (!user) return null;
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified
  };
};

// Debug function
const debugFirebase = () => {
  console.log('Firebase Debug Info:', {
    app: !!app,
    auth: !!auth,
    googleProvider: !!googleProvider,
    currentUser: auth?.currentUser?.email || 'None',
    config: {
      ...firebaseConfig,
      apiKey: '[HIDDEN]'
    }
  });
};

// Preload Google APIs to prevent network issues
const preloadGoogleAPIs = () => {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Google APIs'));
    script.async = true;
    script.defer = true;
    
    document.head.appendChild(script);
  });
};

// Export all functions and objects
export { 
  auth, 
  googleProvider,
  signInWithGoogle,
  handleRedirectResult,
  checkAuthState,
  signOutUser,
  getUserProfile,
  isFirebaseInitialized,
  debugFirebase,
  preloadGoogleAPIs
};

export default app;