// Hotel Controller
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';

// @desc    Get all approved hotels
// @route   GET /api/hotels
// @access  Public
export const getHotels = async (req, res) => {
    try {
        const {
            city,
            minPrice,
            maxPrice,
            rating,
            amenities,
            type,
            search,
            page = 1,
            limit = 10
        } = req.query;

        // Build query
        let query = { status: 'approved', isActive: true };

        // Filter by city
        if (city) {
            query['address.city'] = new RegExp(city, 'i');
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.pricePerNight = {};
            if (minPrice) query.pricePerNight.$gte = Number(minPrice);
            if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
        }

        // Filter by rating
        if (rating) {
            query.rating = { $gte: Number(rating) };
        }

        // Filter by type
        if (type) {
            query.type = type;
        }

        // Filter by amenities
        if (amenities) {
            const amenityList = amenities.split(',');
            query.amenities = { $all: amenityList };
        }

        // Text search
        if (search) {
            query.$text = { $search: search };
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        const hotels = await Hotel.find(query)
            .sort({ rating: -1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .select('-reviews'); // Exclude reviews for list view

        const total = await Hotel.countDocuments(query);

        res.status(200).json({
            success: true,
            count: hotels.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: Number(page),
            data: hotels
        });
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching hotels',
            error: error.message
        });
    }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
export const getHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id)
            .populate('owner', 'name email phone')
            .populate('reviews.user', 'name avatar');

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }

        res.status(200).json({
            success: true,
            data: hotel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching hotel',
            error: error.message
        });
    }
};

// @desc    Create new hotel (registration)
// @route   POST /api/hotels
// @access  Private
export const createHotel = async (req, res) => {
    try {
        const hotelData = {
            ...req.body,
            owner: req.user.id,
            ownerEmail: req.user.email,
            status: 'pending'
        };

        const hotel = await Hotel.create(hotelData);

        // Link hotel to user
        await User.findByIdAndUpdate(req.user.id, {
            hotelId: hotel._id,
            role: 'hotel' // Upgrade user to hotel owner role
        });

        res.status(201).json({
            success: true,
            message: 'Hotel registered successfully. Pending admin approval.',
            data: hotel
        });
    } catch (error) {
        console.error('Error creating hotel:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating hotel',
            error: error.message
        });
    }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private (Owner/Admin)
export const updateHotel = async (req, res) => {
    try {
        let hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }

        // Check ownership (unless admin)
        if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this hotel'
            });
        }

        hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Hotel updated successfully',
            data: hotel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating hotel',
            error: error.message
        });
    }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private (Owner/Admin)
export const deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }

        // Check ownership (unless admin)
        if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this hotel'
            });
        }

        await hotel.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Hotel deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting hotel',
            error: error.message
        });
    }
};

// @desc    Get pending hotels (admin only)
// @route   GET /api/hotels/pending
// @access  Private/Admin
export const getPendingHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({ status: 'pending' })
            .populate('owner', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: hotels.length,
            data: hotels
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching pending hotels',
            error: error.message
        });
    }
};

// @desc    Approve hotel (admin only)
// @route   PUT /api/hotels/:id/approve
// @access  Private/Admin
export const approveHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            {
                status: 'approved',
                approvedAt: new Date(),
                approvedBy: req.user.id
            },
            { new: true }
        );

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }

        // Approve the hotel owner user as well
        if (hotel.owner) {
            await User.findByIdAndUpdate(hotel.owner, { isApproved: true });
        }

        res.status(200).json({
            success: true,
            message: 'Hotel approved successfully',
            data: hotel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error approving hotel',
            error: error.message
        });
    }
};

// @desc    Reject hotel (admin only)
// @route   PUT /api/hotels/:id/reject
// @access  Private/Admin
export const rejectHotel = async (req, res) => {
    try {
        const { reason } = req.body;

        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            {
                status: 'rejected',
                rejectionReason: reason || 'Not specified'
            },
            { new: true }
        );

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Hotel rejected',
            data: hotel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error rejecting hotel',
            error: error.message
        });
    }
};

// @desc    Add review to hotel
// @route   POST /api/hotels/:id/reviews
// @access  Private
export const addReview = async (req, res) => {
    try {
        const { rating, title, comment, travelerType, stayDate } = req.body;

        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }

        // Check if user already reviewed
        const alreadyReviewed = hotel.reviews.find(
            r => r.user?.toString() === req.user.id
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this hotel'
            });
        }

        const review = {
            user: req.user.id,
            userName: req.user.name,
            rating: Number(rating),
            title,
            comment,
            travelerType,
            stayDate: stayDate ? new Date(stayDate) : null
        };

        hotel.reviews.push(review);
        await hotel.calculateAverageRating();

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: hotel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding review',
            error: error.message
        });
    }
};

// @desc    Get my hotel (for hotel owners)
// @route   GET /api/hotels/my-hotel
// @access  Private
export const getMyHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.user.id });

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'You have not registered a hotel yet'
            });
        }

        res.status(200).json({
            success: true,
            data: hotel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching your hotel',
            error: error.message
        });
    }
};
