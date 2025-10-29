/**
 * Hotel Registration Firestore Utilities
 * Handles storing and managing hotel registration data in Firebase
 */

import { 
  collection, 
  addDoc, 
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  updateProfile 
} from 'firebase/auth';
import { auth, db } from '../firebase';

// Firestore collection names
const HOTEL_REGISTRATIONS_COLLECTION = 'hotelRegistrations';
const HOTEL_USERS_COLLECTION = 'hotelUsers';

/**
 * Register a new hotel with complete data
 * Creates Firebase Auth account + Firestore document
 * 
 * @param {Object} registrationData - Complete registration form data
 * @returns {Promise<Object>} - Registration result with user ID and status
 */
export const registerHotel = async (registrationData) => {
  try {
    console.log('🏨 Starting hotel registration...', registrationData.email);

    // Validate required fields
    if (!registrationData.email || !registrationData.password) {
      throw new Error('Email and password are required');
    }

    // Step 1: Create Firebase Authentication account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      registrationData.email,
      registrationData.password
    );
    const user = userCredential.user;

    console.log('✅ Firebase Auth user created:', user.uid);

    // Step 2: Update user profile with display name
    await updateProfile(user, {
      displayName: registrationData.ownerName || registrationData.hotelName
    });

    // Step 3: Send email verification
    await sendEmailVerification(user, {
      url: window.location.origin + '/hotels',
      handleCodeInApp: false
    });

    console.log('📧 Verification email sent to:', registrationData.email);

    // Step 4: Create Firestore document for hotel registration
    const hotelRegistrationDoc = {
      // User Information
      uid: user.uid,
      email: registrationData.email,
      ownerName: registrationData.ownerName || '',
      
      // Hotel Information
      hotelName: registrationData.hotelName || '',
      hotelAddress: registrationData.address || '',
      city: registrationData.city || '',
      state: registrationData.state || 'Jammu & Kashmir',
      pincode: registrationData.pincode || '',
      
      // Contact Information
      phone: registrationData.phone || '',
      alternatePhone: registrationData.alternatePhone || '',
      
      // Rate Information
      defaultRate: parseFloat(registrationData.defaultRate) || 0,
      defaultWeekendRate: parseFloat(registrationData.defaultWeekendRate) || parseFloat(registrationData.defaultRate) || 0,
      seasonalRates: registrationData.seasonalRates || [],
      blackoutDates: registrationData.blackoutDates || [],
      
      // Legal Documents
      gstNumber: registrationData.gstNumber || '',
      panNumber: registrationData.panNumber || '',
      documents: registrationData.documents || [],
      
      // Status & Metadata
      status: 'pending', // pending, approved, rejected
      role: 'hotel',
      emailVerified: user.emailVerified,
      
      // Timestamps
      registeredAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      
      // Additional Data
      description: registrationData.description || '',
      website: registrationData.website || '',
      
      // Approval tracking
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
    };

    console.log('📊 Hotel registration document being saved:', {
      defaultRate: hotelRegistrationDoc.defaultRate,
      defaultWeekendRate: hotelRegistrationDoc.defaultWeekendRate,
      seasonalRates: hotelRegistrationDoc.seasonalRates,
      blackoutDates: hotelRegistrationDoc.blackoutDates
    });

    // Add to Firestore
    const docRef = await addDoc(
      collection(db, HOTEL_REGISTRATIONS_COLLECTION),
      hotelRegistrationDoc
    );

    console.log('✅ Registration document created:', docRef.id);
    console.log('📋 Saved rate data:', {
      seasonalRates: hotelRegistrationDoc.seasonalRates.length,
      blackoutDates: hotelRegistrationDoc.blackoutDates.length
    });

    // Step 5: Create user profile document
    const userProfileDoc = {
      uid: user.uid,
      email: user.email,
      displayName: registrationData.ownerName || registrationData.hotelName,
      role: 'hotel',
      status: 'pending',
      registrationId: docRef.id,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    };

    await addDoc(collection(db, HOTEL_USERS_COLLECTION), userProfileDoc);

    console.log('🎉 Hotel registration completed successfully!');

    return {
      success: true,
      userId: user.uid,
      registrationId: docRef.id,
      email: user.email,
      message: 'Registration successful! Please verify your email to continue.',
      emailVerificationSent: true
    };

  } catch (error) {
    console.error('❌ Hotel registration error:', error);

    // Handle specific Firebase errors
    let errorMessage = 'Registration failed. Please try again.';

    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered. Please login instead.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address format.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password must be at least 6 characters long.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password authentication is not enabled. Please contact support.';
        break;
      case 'permission-denied':
        errorMessage = 'Permission denied. Please check Firestore security rules.';
        break;
      default:
        errorMessage = error.message || errorMessage;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Get all pending hotel registrations (Admin only)
 */
export const getPendingRegistrations = async () => {
  try {
    const q = query(
      collection(db, HOTEL_REGISTRATIONS_COLLECTION),
      where('status', '==', 'pending'),
      orderBy('registeredAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const registrations = [];

    querySnapshot.forEach((doc) => {
      registrations.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`📋 Found ${registrations.length} pending registrations`);
    return registrations;

  } catch (error) {
    console.error('Error fetching pending registrations:', error);
    throw error;
  }
};

/**
 * Get registration by user ID
 */
export const getRegistrationByUserId = async (uid) => {
  try {
    const q = query(
      collection(db, HOTEL_REGISTRATIONS_COLLECTION),
      where('uid', '==', uid)
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };

  } catch (error) {
    console.error('Error fetching registration:', error);
    throw error;
  }
};

/**
 * Approve a hotel registration (Admin only)
 */
export const approveRegistration = async (registrationId, adminId) => {
  try {
    const registrationRef = doc(db, HOTEL_REGISTRATIONS_COLLECTION, registrationId);

    await updateDoc(registrationRef, {
      status: 'approved',
      approvedBy: adminId,
      approvedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Registration approved:', registrationId);
    return { success: true, message: 'Registration approved successfully' };

  } catch (error) {
    console.error('Error approving registration:', error);
    throw error;
  }
};

/**
 * Reject a hotel registration (Admin only)
 */
export const rejectRegistration = async (registrationId, reason, adminId) => {
  try {
    const registrationRef = doc(db, HOTEL_REGISTRATIONS_COLLECTION, registrationId);

    await updateDoc(registrationRef, {
      status: 'rejected',
      rejectionReason: reason,
      approvedBy: adminId,
      approvedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('❌ Registration rejected:', registrationId);
    return { success: true, message: 'Registration rejected' };

  } catch (error) {
    console.error('Error rejecting registration:', error);
    throw error;
  }
};

/**
 * Update registration data
 */
export const updateRegistration = async (registrationId, updateData) => {
  try {
    const registrationRef = doc(db, HOTEL_REGISTRATIONS_COLLECTION, registrationId);

    await updateDoc(registrationRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Registration updated:', registrationId);
    return { success: true, message: 'Registration updated successfully' };

  } catch (error) {
    console.error('Error updating registration:', error);
    throw error;
  }
};

/**
 * Delete registration (Admin only)
 */
export const deleteRegistration = async (registrationId) => {
  try {
    const registrationRef = doc(db, HOTEL_REGISTRATIONS_COLLECTION, registrationId);
    await deleteDoc(registrationRef);

    console.log('🗑️ Registration deleted:', registrationId);
    return { success: true, message: 'Registration deleted successfully' };

  } catch (error) {
    console.error('Error deleting registration:', error);
    throw error;
  }
};

/**
 * Get all approved hotel owners
 */
export const getApprovedHotelOwners = async () => {
  try {
    const q = query(
      collection(db, HOTEL_REGISTRATIONS_COLLECTION),
      where('status', '==', 'approved'),
      orderBy('approvedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const owners = [];

    querySnapshot.forEach((doc) => {
      owners.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`✅ Found ${owners.length} approved hotel owners`);
    return owners;

  } catch (error) {
    console.error('Error fetching approved owners:', error);
    throw error;
  }
};

/**
 * Check if email is already registered
 */
export const isEmailRegistered = async (email) => {
  try {
    const q = query(
      collection(db, HOTEL_REGISTRATIONS_COLLECTION),
      where('email', '==', email.toLowerCase())
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;

  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};

/**
 * Get registration statistics (Admin dashboard)
 */
export const getRegistrationStats = async () => {
  try {
    const allDocs = await getDocs(collection(db, HOTEL_REGISTRATIONS_COLLECTION));
    
    const stats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    };

    allDocs.forEach((doc) => {
      const data = doc.data();
      stats.total++;
      
      if (data.status === 'pending') stats.pending++;
      else if (data.status === 'approved') stats.approved++;
      else if (data.status === 'rejected') stats.rejected++;
    });

    return stats;

  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export default {
  registerHotel,
  getPendingRegistrations,
  getRegistrationByUserId,
  approveRegistration,
  rejectRegistration,
  updateRegistration,
  deleteRegistration,
  getApprovedHotelOwners,
  isEmailRegistered,
  getRegistrationStats
};
