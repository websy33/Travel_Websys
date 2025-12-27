// Hotel Routes
import express from 'express';
import {
    getHotels,
    getHotel,
    createHotel,
    updateHotel,
    deleteHotel,
    getPendingHotels,
    approveHotel,
    rejectHotel,
    addReview,
    getMyHotel
} from '../controllers/hotelController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getHotels);
router.get('/:id', getHotel);

// Protected routes (logged in users)
router.post('/', protect, createHotel);
router.get('/owner/my-hotel', protect, getMyHotel);
router.put('/:id', protect, updateHotel);
router.delete('/:id', protect, deleteHotel);
router.post('/:id/reviews', protect, addReview);

// Admin routes
router.get('/admin/pending', protect, authorize('admin'), getPendingHotels);
router.put('/:id/approve', protect, authorize('admin'), approveHotel);
router.put('/:id/reject', protect, authorize('admin'), rejectHotel);

export default router;
