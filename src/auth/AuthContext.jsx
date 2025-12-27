// Authentication Context - MongoDB/JWT Version
// This replaces the Firebase-based AuthContext
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authAPI } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authAPI.getStoredUser();
        const token = localStorage.getItem('token');

        if (storedUser && token) {
          // Verify token is still valid
          try {
            const response = await authAPI.getMe();
            if (response.success) {
              setUser(response.data);
            } else {
              // Token invalid, clear storage
              authAPI.logout();
              setUser(null);
            }
          } catch (err) {
            // Token expired or invalid
            console.warn('Session expired, please login again');
            authAPI.logout();
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(email, password);

      if (response.success) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }

      setError(response.message || 'Login failed');
      return { success: false, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Register
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register(userData);

      if (response.success) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }

      setError(response.message || 'Registration failed');
      return { success: false, message: response.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
  }, []);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  // Check if user is hotel owner
  const isHotelOwner = useCallback(() => {
    return user?.role === 'hotel';
  }, [user]);

  // Check if user is approved
  const isApproved = useCallback(() => {
    return user?.isApproved === true;
  }, [user]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,

    // Actions
    login,
    register,
    logout,

    // Role checks
    hasRole,
    isAdmin,
    isHotelOwner,
    isApproved,

    // For backward compatibility with Firebase-based code
    profile: user, // Alias for user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
