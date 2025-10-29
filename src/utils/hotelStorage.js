// Hotel Storage Utility with Firebase Firestore Integration
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Collections
const HOTELS_COLLECTION = 'hotels';
const PENDING_HOTELS_COLLECTION = 'pendingHotels';
const HOTEL_USERS_COLLECTION = 'hotelUsers';

// Check if Firebase is available
const isFirebaseAvailable = () => {
  if (!db) {
    console.warn('Firebase Firestore is not initialized. Using localStorage fallback.');
    return false;
  }
  return true;
};

// Hotel Storage Class
class HotelStorage {
  constructor() {
    this.listeners = [];
    this.useFirebase = isFirebaseAvailable();
    
    // Log storage mode
    if (this.useFirebase) {
      console.log('🔥 Hotel Storage: Using Firebase Firestore');
    } else {
      console.log('💾 Hotel Storage: Using localStorage (Firebase not configured)');
    }
  }

  // Add a new hotel (goes to pending first)
  async addHotel(hotelData) {
    // Use localStorage if Firebase not available
    if (!this.useFirebase) {
      console.log('Adding hotel to localStorage...');
      return this.addToLocalStorage('pendingHotels', hotelData);
    }

    try {
      const hotelWithTimestamp = {
        ...hotelData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'pending'
      };

      const docRef = await addDoc(collection(db, PENDING_HOTELS_COLLECTION), hotelWithTimestamp);
      
      // Also save to localStorage as backup
      this.saveToLocalStorage('pendingHotels', hotelWithTimestamp, docRef.id);
      
      console.log('Hotel added to Firebase:', docRef.id);
      return { id: docRef.id, ...hotelWithTimestamp };
    } catch (error) {
      console.error('Error adding hotel to Firebase:', error);
      // Fallback to localStorage
      return this.addToLocalStorage('pendingHotels', hotelData);
    }
  }

  // Approve hotel (move from pending to approved)
  async approveHotel(hotelId) {
    try {
      // Get hotel from pending collection
      const pendingDoc = await getDoc(doc(db, PENDING_HOTELS_COLLECTION, hotelId));
      
      if (pendingDoc.exists()) {
        const hotelData = pendingDoc.data();
        
        // Add to approved hotels collection
        const approvedHotel = {
          ...hotelData,
          status: 'approved',
          approvedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        const approvedDocRef = await addDoc(collection(db, HOTELS_COLLECTION), approvedHotel);
        
        // Remove from pending collection
        await deleteDoc(doc(db, PENDING_HOTELS_COLLECTION, hotelId));
        
        // Update localStorage
        this.saveToLocalStorage('hotels', approvedHotel, approvedDocRef.id);
        this.removeFromLocalStorage('pendingHotels', hotelId);
        
        return { id: approvedDocRef.id, ...approvedHotel };
      }
    } catch (error) {
      console.error('Error approving hotel:', error);
      // Fallback to localStorage
      return this.approveHotelLocalStorage(hotelId);
    }
  }

  // Get all approved hotels
  async getApprovedHotels() {
    // Use localStorage if Firebase not available
    if (!this.useFirebase) {
      console.log('Loading hotels from localStorage...');
      const hotels = this.getFromLocalStorage('hotels');
      console.log(`Loaded ${hotels.length} hotels from localStorage`);
      return hotels;
    }

    try {
      const q = query(
        collection(db, HOTELS_COLLECTION), 
        where('status', '==', 'approved')
      );
      
      const querySnapshot = await getDocs(q);
      const hotels = [];
      
      querySnapshot.forEach((doc) => {
        hotels.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by createdAt in JavaScript to avoid composite index requirement
      hotels.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
        return bTime - aTime; // desc order
      });
      
      // Save to localStorage as backup
      localStorage.setItem('kashmirStays_hotels', JSON.stringify(hotels));
      
      console.log(`Loaded ${hotels.length} hotels from Firebase`);
      return hotels;
    } catch (error) {
      console.error('Error getting approved hotels from Firebase:', error);
      // Fallback to localStorage
      const hotels = this.getFromLocalStorage('hotels');
      console.log(`Fallback: Loaded ${hotels.length} hotels from localStorage`);
      return hotels;
    }
  }

  // Get all pending hotels
  async getPendingHotels() {
    // Use localStorage if Firebase not available
    if (!this.useFirebase) {
      console.log('Loading pending hotels from localStorage...');
      const pendingHotels = this.getFromLocalStorage('pendingHotels');
      console.log(`Loaded ${pendingHotels.length} pending hotels from localStorage`);
      return pendingHotels;
    }

    try {
      const querySnapshot = await getDocs(collection(db, PENDING_HOTELS_COLLECTION));
      const pendingHotels = [];
      
      querySnapshot.forEach((doc) => {
        pendingHotels.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by createdAt in JavaScript
      pendingHotels.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
        return bTime - aTime; // desc order
      });
      
      // Save to localStorage as backup
      localStorage.setItem('kashmirStays_pendingHotels', JSON.stringify(pendingHotels));
      
      console.log(`Loaded ${pendingHotels.length} pending hotels from Firebase`);
      return pendingHotels;
    } catch (error) {
      console.error('Error getting pending hotels from Firebase:', error);
      // Fallback to localStorage
      const pendingHotels = this.getFromLocalStorage('pendingHotels');
      console.log(`Fallback: Loaded ${pendingHotels.length} pending hotels from localStorage`);
      return pendingHotels;
    }
  }

  // Update hotel
  async updateHotel(hotelId, updateData) {
    try {
      const hotelRef = doc(db, HOTELS_COLLECTION, hotelId);
      const updatedData = {
        ...updateData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(hotelRef, updatedData);
      
      // Update localStorage
      this.updateLocalStorage('hotels', hotelId, updatedData);
      
      return { id: hotelId, ...updatedData };
    } catch (error) {
      console.error('Error updating hotel:', error);
      // Fallback to localStorage
      return this.updateLocalStorageItem('hotels', hotelId, updateData);
    }
  }

  // Delete hotel
  async deleteHotel(hotelId) {
    try {
      await deleteDoc(doc(db, HOTELS_COLLECTION, hotelId));
      
      // Remove from localStorage
      this.removeFromLocalStorage('hotels', hotelId);
      
      return true;
    } catch (error) {
      console.error('Error deleting hotel:', error);
      // Fallback to localStorage
      return this.removeFromLocalStorage('hotels', hotelId);
    }
  }

  // Reject hotel (remove from pending)
  async rejectHotel(hotelId) {
    try {
      await deleteDoc(doc(db, PENDING_HOTELS_COLLECTION, hotelId));
      
      // Remove from localStorage
      this.removeFromLocalStorage('pendingHotels', hotelId);
      
      return true;
    } catch (error) {
      console.error('Error rejecting hotel:', error);
      // Fallback to localStorage
      return this.removeFromLocalStorage('pendingHotels', hotelId);
    }
  }

  // Real-time listeners
  subscribeToHotels(callback) {
    try {
      const q = query(
        collection(db, HOTELS_COLLECTION),
        where('status', '==', 'approved')
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const hotels = [];
        querySnapshot.forEach((doc) => {
          hotels.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by createdAt in JavaScript to avoid composite index requirement
        hotels.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
          const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
          return bTime - aTime; // desc order
        });
        
        // Update localStorage
        localStorage.setItem('kashmirStays_hotels', JSON.stringify(hotels));
        
        callback(hotels);
      });
      
      this.listeners.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error subscribing to hotels:', error);
      // Fallback to localStorage polling
      return this.pollLocalStorage('hotels', callback);
    }
  }

  subscribeToPendingHotels(callback) {
    try {
      const unsubscribe = onSnapshot(collection(db, PENDING_HOTELS_COLLECTION), (querySnapshot) => {
        const pendingHotels = [];
        querySnapshot.forEach((doc) => {
          pendingHotels.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by createdAt in JavaScript
        pendingHotels.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
          const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
          return bTime - aTime; // desc order
        });
        
        // Update localStorage
        localStorage.setItem('kashmirStays_pendingHotels', JSON.stringify(pendingHotels));
        
        callback(pendingHotels);
      });
      
      this.listeners.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error subscribing to pending hotels:', error);
      // Fallback to localStorage polling
      return this.pollLocalStorage('pendingHotels', callback);
    }
  }

  // Cleanup listeners
  unsubscribeAll() {
    this.listeners.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    this.listeners = [];
  }

  // LocalStorage fallback methods
  getFromLocalStorage(type) {
    const key = `kashmirStays_${type}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  }

  saveToLocalStorage(type, data, id) {
    const key = `kashmirStays_${type}`;
    const existing = this.getFromLocalStorage(type);
    const newItem = { id: id || Date.now(), ...data };
    const updated = [...existing, newItem];
    localStorage.setItem(key, JSON.stringify(updated));
    return newItem;
  }

  addToLocalStorage(type, data) {
    const newItem = { id: Date.now(), ...data };
    const key = `kashmirStays_${type}`;
    const existing = this.getFromLocalStorage(type);
    const updated = [...existing, newItem];
    localStorage.setItem(key, JSON.stringify(updated));
    return newItem;
  }

  updateLocalStorage(type, id, updateData) {
    const key = `kashmirStays_${type}`;
    const existing = this.getFromLocalStorage(type);
    const updated = existing.map(item => 
      item.id === id ? { ...item, ...updateData } : item
    );
    localStorage.setItem(key, JSON.stringify(updated));
    return updated.find(item => item.id === id);
  }

  removeFromLocalStorage(type, id) {
    const key = `kashmirStays_${type}`;
    const existing = this.getFromLocalStorage(type);
    const updated = existing.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));
    return true;
  }

  approveHotelLocalStorage(hotelId) {
    const pending = this.getFromLocalStorage('pendingHotels');
    const hotelToApprove = pending.find(hotel => hotel.id === hotelId);
    
    if (hotelToApprove) {
      // Add to approved hotels
      const approvedHotel = { ...hotelToApprove, status: 'approved' };
      this.saveToLocalStorage('hotels', approvedHotel, hotelId);
      
      // Remove from pending
      this.removeFromLocalStorage('pendingHotels', hotelId);
      
      return approvedHotel;
    }
    return null;
  }

  pollLocalStorage(type, callback) {
    const interval = setInterval(() => {
      const data = this.getFromLocalStorage(type);
      callback(data);
    }, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }

  // Backup and restore methods
  async createBackup() {
    try {
      const hotels = await this.getApprovedHotels();
      const pendingHotels = await this.getPendingHotels();
      
      const backup = {
        hotels,
        pendingHotels,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      // Save backup to localStorage
      localStorage.setItem('kashmirStays_backup', JSON.stringify(backup));
      
      return backup;
    } catch (error) {
      console.error('Error creating backup:', error);
      return null;
    }
  }

  async restoreFromBackup() {
    try {
      const backup = localStorage.getItem('kashmirStays_backup');
      if (backup) {
        const data = JSON.parse(backup);
        
        // Restore to localStorage
        localStorage.setItem('kashmirStays_hotels', JSON.stringify(data.hotels || []));
        localStorage.setItem('kashmirStays_pendingHotels', JSON.stringify(data.pendingHotels || []));
        
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error restoring backup:', error);
      return null;
    }
  }

  // Migration method to move localStorage data to Firestore
  async migrateToFirestore() {
    try {
      console.log('Starting migration to Firestore...');
      
      // Migrate approved hotels
      const hotels = this.getFromLocalStorage('hotels');
      for (const hotel of hotels) {
        const { id, ...hotelData } = hotel;
        await addDoc(collection(db, HOTELS_COLLECTION), {
          ...hotelData,
          migratedAt: serverTimestamp(),
          originalId: id
        });
      }
      
      // Migrate pending hotels
      const pendingHotels = this.getFromLocalStorage('pendingHotels');
      for (const hotel of pendingHotels) {
        const { id, ...hotelData } = hotel;
        await addDoc(collection(db, PENDING_HOTELS_COLLECTION), {
          ...hotelData,
          migratedAt: serverTimestamp(),
          originalId: id
        });
      }
      
      console.log('Migration completed successfully');
      return true;
    } catch (error) {
      console.error('Error during migration:', error);
      return false;
    }
  }
}

// Create singleton instance
const hotelStorage = new HotelStorage();

export default hotelStorage;

// Export individual methods for convenience
export const {
  addHotel,
  approveHotel,
  getApprovedHotels,
  getPendingHotels,
  updateHotel,
  deleteHotel,
  rejectHotel,
  subscribeToHotels,
  subscribeToPendingHotels,
  unsubscribeAll,
  createBackup,
  restoreFromBackup,
  migrateToFirestore
} = hotelStorage;