// React Hook for Hotel Storage Management
import { useState, useEffect, useCallback } from 'react';
import hotelStorage from '../utils/hotelStorage';
import initializeSampleData from '../utils/initializeSampleData';

export const useHotelStorage = () => {
  const [hotels, setHotels] = useState([]);
  const [pendingHotels, setPendingHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize data and set up real-time listeners
  useEffect(() => {
    let hotelsUnsubscribe;
    let pendingUnsubscribe;

    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Initialize sample data if needed
        initializeSampleData();
        
        // Load initial data
        const [initialHotels, initialPending] = await Promise.all([
          hotelStorage.getApprovedHotels(),
          hotelStorage.getPendingHotels()
        ]);
        
        console.log(`✅ Hotels loaded: ${initialHotels.length} approved, ${initialPending.length} pending`);
        
        setHotels(initialHotels);
        setPendingHotels(initialPending);
        
        // Set up real-time listeners
        hotelsUnsubscribe = hotelStorage.subscribeToHotels((updatedHotels) => {
          setHotels(updatedHotels);
        });
        
        pendingUnsubscribe = hotelStorage.subscribeToPendingHotels((updatedPending) => {
          setPendingHotels(updatedPending);
        });
        
        setError(null);
      } catch (err) {
        console.error('Error initializing hotel data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();

    // Cleanup function
    return () => {
      if (hotelsUnsubscribe) hotelsUnsubscribe();
      if (pendingUnsubscribe) pendingUnsubscribe();
    };
  }, []);

  // Add new hotel
  const addHotel = useCallback(async (hotelData) => {
    try {
      setLoading(true);
      const newHotel = await hotelStorage.addHotel(hotelData);
      
      // Update local state immediately for better UX
      setPendingHotels(prev => [newHotel, ...prev]);
      
      return newHotel;
    } catch (err) {
      console.error('Error adding hotel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Approve hotel
  const approveHotel = useCallback(async (hotelId) => {
    try {
      setLoading(true);
      const approvedHotel = await hotelStorage.approveHotel(hotelId);
      
      if (approvedHotel) {
        // Update local state immediately
        setHotels(prev => [approvedHotel, ...prev]);
        setPendingHotels(prev => prev.filter(hotel => hotel.id !== hotelId));
      }
      
      return approvedHotel;
    } catch (err) {
      console.error('Error approving hotel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reject hotel
  const rejectHotel = useCallback(async (hotelId) => {
    try {
      setLoading(true);
      await hotelStorage.rejectHotel(hotelId);
      
      // Update local state immediately
      setPendingHotels(prev => prev.filter(hotel => hotel.id !== hotelId));
      
      return true;
    } catch (err) {
      console.error('Error rejecting hotel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update hotel
  const updateHotel = useCallback(async (hotelId, updateData) => {
    try {
      setLoading(true);
      const updatedHotel = await hotelStorage.updateHotel(hotelId, updateData);
      
      // Update local state immediately
      setHotels(prev => prev.map(hotel => 
        hotel.id === hotelId ? { ...hotel, ...updatedHotel } : hotel
      ));
      
      return updatedHotel;
    } catch (err) {
      console.error('Error updating hotel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete hotel
  const deleteHotel = useCallback(async (hotelId) => {
    try {
      setLoading(true);
      await hotelStorage.deleteHotel(hotelId);
      
      // Update local state immediately
      setHotels(prev => prev.filter(hotel => hotel.id !== hotelId));
      
      return true;
    } catch (err) {
      console.error('Error deleting hotel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create backup
  const createBackup = useCallback(async () => {
    try {
      const backup = await hotelStorage.createBackup();
      return backup;
    } catch (err) {
      console.error('Error creating backup:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Restore from backup
  const restoreFromBackup = useCallback(async () => {
    try {
      setLoading(true);
      const restored = await hotelStorage.restoreFromBackup();
      
      if (restored) {
        setHotels(restored.hotels || []);
        setPendingHotels(restored.pendingHotels || []);
      }
      
      return restored;
    } catch (err) {
      console.error('Error restoring backup:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Migrate to Firestore
  const migrateToFirestore = useCallback(async () => {
    try {
      setLoading(true);
      const success = await hotelStorage.migrateToFirestore();
      return success;
    } catch (err) {
      console.error('Error migrating to Firestore:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data manually
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [refreshedHotels, refreshedPending] = await Promise.all([
        hotelStorage.getApprovedHotels(),
        hotelStorage.getPendingHotels()
      ]);
      
      setHotels(refreshedHotels);
      setPendingHotels(refreshedPending);
      setError(null);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data
    hotels,
    pendingHotels,
    loading,
    error,
    
    // Actions
    addHotel,
    approveHotel,
    rejectHotel,
    updateHotel,
    deleteHotel,
    createBackup,
    restoreFromBackup,
    migrateToFirestore,
    refreshData,
    
    // Computed values
    totalHotels: hotels.length,
    totalPending: pendingHotels.length,
    totalRegistered: hotels.length + pendingHotels.length, // Total registered hotels (approved + pending)
    hasData: hotels.length > 0 || pendingHotels.length > 0
  };
};

export default useHotelStorage;