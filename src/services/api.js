// API Service for Frontend
// Replace Firebase calls with these API functions
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with defaults
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============ AUTH API ============

export const authAPI = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Login user
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Get current user
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Check if logged in
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Get stored user
    getStoredUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Get all users (admin)
    getUsers: async () => {
        const response = await api.get('/auth/users');
        return response.data;
    },

    // Approve user (admin)
    approveUser: async (userId) => {
        const response = await api.put(`/auth/users/${userId}/approve`);
        return response.data;
    }
};

// ============ HOTELS API ============

export const hotelsAPI = {
    // Get all approved hotels
    getHotels: async (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const response = await api.get(`/hotels?${params.toString()}`);
        return response.data;
    },

    // Get single hotel
    getHotel: async (id) => {
        const response = await api.get(`/hotels/${id}`);
        return response.data;
    },

    // Create new hotel (registration)
    createHotel: async (hotelData) => {
        const response = await api.post('/hotels', hotelData);
        return response.data;
    },

    // Update hotel
    updateHotel: async (id, hotelData) => {
        const response = await api.put(`/hotels/${id}`, hotelData);
        return response.data;
    },

    // Delete hotel
    deleteHotel: async (id) => {
        const response = await api.delete(`/hotels/${id}`);
        return response.data;
    },

    // Get my hotel (for hotel owners)
    getMyHotel: async () => {
        const response = await api.get('/hotels/owner/my-hotel');
        return response.data;
    },

    // Add review
    addReview: async (hotelId, reviewData) => {
        const response = await api.post(`/hotels/${hotelId}/reviews`, reviewData);
        return response.data;
    },

    // ===== ADMIN FUNCTIONS =====

    // Get pending hotels (admin)
    getPendingHotels: async () => {
        const response = await api.get('/hotels/admin/pending');
        return response.data;
    },

    // Approve hotel (admin)
    approveHotel: async (hotelId) => {
        const response = await api.put(`/hotels/${hotelId}/approve`);
        return response.data;
    },

    // Reject hotel (admin)
    rejectHotel: async (hotelId, reason) => {
        const response = await api.put(`/hotels/${hotelId}/reject`, { reason });
        return response.data;
    }
};

// Export default api instance for custom calls
export default api;
