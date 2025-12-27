// Seed script to create initial admin user
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Hotel from './models/Hotel.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create master admin user
        const adminExists = await User.findOne({ email: 'master@traveligo.in' });

        if (!adminExists) {
            const admin = await User.create({
                name: 'Master Admin',
                email: 'master@traveligo.in',
                password: 'MASTER@MS@2025',
                role: 'admin',
                isApproved: true
            });
            console.log('✅ Master admin created:', admin.email);
        } else {
            console.log('ℹ️ Master admin already exists');
        }

        // Create sample hotels
        const sampleHotels = [
            {
                name: 'The Grand Palace Hotel',
                description: 'A luxurious 5-star hotel in the heart of the city with world-class amenities.',
                type: 'Hotel',
                address: {
                    street: '123 Main Street',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001',
                    country: 'India'
                },
                pricePerNight: 8500,
                originalPrice: 12000,
                amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Parking', 'Room Service'],
                images: [
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'
                ],
                featuredImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                rating: 4.5,
                totalReviews: 234,
                status: 'approved',
                isActive: true
            },
            {
                name: 'Mountain View Resort',
                description: 'Escape to the mountains with breathtaking views and serene atmosphere.',
                type: 'Resort',
                address: {
                    street: 'Hill Station Road',
                    city: 'Manali',
                    state: 'Himachal Pradesh',
                    pincode: '175131',
                    country: 'India'
                },
                pricePerNight: 6000,
                originalPrice: 8000,
                amenities: ['WiFi', 'Restaurant', 'Parking', 'Mountain View', 'Room Service'],
                images: [
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
                ],
                featuredImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
                rating: 4.8,
                totalReviews: 156,
                status: 'approved',
                isActive: true
            },
            {
                name: 'Beachside Paradise',
                description: 'Wake up to the sound of waves at this beautiful beachfront property.',
                type: 'Resort',
                address: {
                    street: 'Beach Road',
                    city: 'Goa',
                    state: 'Goa',
                    pincode: '403516',
                    country: 'India'
                },
                pricePerNight: 7500,
                originalPrice: 10000,
                amenities: ['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Bar', 'Spa'],
                images: [
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
                ],
                featuredImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
                rating: 4.6,
                totalReviews: 312,
                status: 'approved',
                isActive: true
            }
        ];

        // Check if hotels exist
        const hotelCount = await Hotel.countDocuments();
        if (hotelCount === 0) {
            await Hotel.insertMany(sampleHotels);
            console.log(`✅ ${sampleHotels.length} sample hotels created`);
        } else {
            console.log(`ℹ️ ${hotelCount} hotels already exist in database`);
        }

        console.log('\n🎉 Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedData();
