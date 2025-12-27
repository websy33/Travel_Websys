// Hotel Model
import mongoose from 'mongoose';

const roomTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    maxGuests: {
        type: Number,
        default: 2
    },
    amenities: [String],
    images: [String],
    available: {
        type: Boolean,
        default: true
    }
});

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userName: String,
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: String,
    comment: String,
    travelerType: {
        type: String,
        enum: ['Business', 'Couple', 'Family', 'Solo', 'Friends']
    },
    stayDate: Date,
    helpful: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hotel name is required'],
        trim: true,
        maxlength: [100, 'Hotel name cannot exceed 100 characters']
    },
    description: {
        type: String,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    type: {
        type: String,
        enum: ['Hotel', 'Resort', 'Homestay', 'Villa', 'Apartment', 'Guest House'],
        default: 'Hotel'
    },

    // Location
    address: {
        street: String,
        city: {
            type: String,
            required: [true, 'City is required']
        },
        state: String,
        pincode: String,
        country: {
            type: String,
            default: 'India'
        }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },

    // Owner Information
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ownerName: String,
    ownerEmail: String,
    ownerPhone: String,

    // Business Details
    panNumber: String,
    gstNumber: String,

    // Pricing
    pricePerNight: {
        type: Number,
        required: [true, 'Price per night is required'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: Number,

    // Features
    amenities: [{
        type: String,
        enum: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Parking',
            'Room Service', 'Laundry', 'AC', 'TV', 'Kitchen', 'Balcony',
            'Mountain View', 'Lake View', 'Beach Access', 'Pet Friendly']
    }],

    roomTypes: [roomTypeSchema],

    // Images
    images: [String],
    featuredImage: String,

    // Ratings
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    reviews: [reviewSchema],

    // Status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'pending'
    },
    isActive: {
        type: Boolean,
        default: true
    },

    // Approval
    approvedAt: Date,
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rejectionReason: String

}, {
    timestamps: true
});

// Index for geospatial queries
hotelSchema.index({ location: '2dsphere' });
// Index for text search
hotelSchema.index({ name: 'text', description: 'text', 'address.city': 'text' });

// Calculate average rating when reviews change
hotelSchema.methods.calculateAverageRating = function () {
    if (this.reviews.length === 0) {
        this.rating = 0;
        this.totalReviews = 0;
    } else {
        const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        this.rating = Math.round((sum / this.reviews.length) * 10) / 10;
        this.totalReviews = this.reviews.length;
    }
    return this.save();
};

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;
