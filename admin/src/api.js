// API Service for Admin Portal
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
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
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
            localStorage.setItem('admin_token', response.data.data.token);
            localStorage.setItem('admin_user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    getStoredUser: () => {
        const user = localStorage.getItem('admin_user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('admin_token');
    }
};

export const hotelsAPI = {
    getHotels: async () => {
        const response = await api.get('/hotels');
        return response.data;
    },

    getPendingHotels: async () => {
        const response = await api.get('/hotels/admin/pending');
        return response.data;
    },

    approveHotel: async (hotelId) => {
        const response = await api.put(`/hotels/${hotelId}/approve`);
        return response.data;
    },

    rejectHotel: async (hotelId, reason) => {
        const response = await api.put(`/hotels/${hotelId}/reject`, { reason });
        return response.data;
    },

    deleteHotel: async (hotelId) => {
        const response = await api.delete(`/hotels/${hotelId}`);
        return response.data;
    }
};

export default api;
