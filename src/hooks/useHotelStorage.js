// React Hook for Hotel Storage Management - MongoDB Version
// This replaces the Firebase-based useHotelStorage hook
import { useState, useEffect, useCallback } from 'react';
import { hotelsAPI } from '../services/api.js';

export const useHotelStorage = () => {
  const [hotels, setHotels] = useState([]);
  const [pendingHotels, setPendingHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load hotels on mount
  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);
      const response = await hotelsAPI.getHotels();
      if (response.success) {
        setHotels(response.data);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading hotels:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load pending hotels (admin only)
  const loadPendingHotels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await hotelsAPI.getPendingHotels();
      if (response.success) {
        setPendingHotels(response.data);
      }
    } catch (err) {
      console.error('Error loading pending hotels:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new hotel
  const addHotel = useCallback(async (hotelData) => {
    try {
      setLoading(true);
      const response = await hotelsAPI.createHotel(hotelData);

      if (response.success) {
        // Add to pending list optimistically
        setPendingHotels(prev => [response.data, ...prev]);
        return response.data;
      }
      throw new Error(response.message || 'Failed to add hotel');
    } catch (err) {
      console.error('Error adding hotel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Approve hotel (admin)
  const approveHotel = useCallback(async (hotelId) => {
    try {
      setLoading(true);
      const response = await hotelsAPI.approveHotel(hotelId);

      if (response.success) {
        // Move from pending to approved
        const approvedHotel = pendingHotels.find(h => h._id === hotelId || h.id === hotelId);
        if (approvedHotel) {
          setHotels(prev => [{ ...approvedHotel, status: 'approved' }, ...prev]);
          setPendingHotels(prev => prev.filter(h => h._id !== hotelId && h.id !== hotelId));
        }
        return response.data;
      }
      throw new Error(response.message || 'Failed to approve hotel');
    } catch (err) {
      console.error('Error approving hotel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pendingHotels]);

  // Reject hotel (admin)
  const rejectHotel = useCallback(async (hotelId, reason) => {
    try {
      setLoading(true);
      const response = await hotelsAPI.rejectHotel(hotelId, reason);

      if (response.success) {
        setPendingHotels(prev => prev.filter(h => h._id !== hotelId && h.id !== hotelId));
        return true;
      }
      throw new Error(response.message || 'Failed to reject hotel');
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
      const response = await hotelsAPI.updateHotel(hotelId, updateData);

      if (response.success) {
        setHotels(prev => prev.map(hotel =>
          (hotel._id === hotelId || hotel.id === hotelId) ? { ...hotel, ...response.data } : hotel
        ));
        return response.data;
      }
      throw new Error(response.message || 'Failed to update hotel');
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
      const response = await hotelsAPI.deleteHotel(hotelId);

      if (response.success) {
        setHotels(prev => prev.filter(h => h._id !== hotelId && h.id !== hotelId));
        return true;
      }
      throw new Error(response.message || 'Failed to delete hotel');
    } catch (err) {
      console.error('Error deleting hotel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadHotels();
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
    loadPendingHotels,
    refreshData,

    // Computed values
    totalHotels: hotels.length,
    totalPending: pendingHotels.length,
    totalRegistered: hotels.length + pendingHotels.length,
    hasData: hotels.length > 0 || pendingHotels.length > 0
  };
};

export default useHotelStorage;