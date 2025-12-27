// Authentication Routes
import express from 'express';
import {
    register,
    login,
    getMe,
    getUsers,
    approveUser
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

// Admin routes
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id/approve', protect, authorize('admin'), approveUser);

export default router;
