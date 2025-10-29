import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiStar, FiMapPin, FiWifi, FiCoffee, FiDroplet, 
  FiHeart, FiArrowRight, FiUsers, FiHome 
} from 'react-icons/fi';
import LazyImage from '../../common/LazyImage';
import { cardVariants } from '../../../utils/hotelAnimations';

/**
 * Hotel Card Component
 * Displays hotel information in a card format
 */
const HotelCard = ({ 
  hotel, 
  onViewDetails,
  onBookNow,
  isFavorite = false,
  onToggleFavorite,
  className = ""
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate total price with taxes
  const totalPrice = hotel.price + (hotel.taxes || 0);

  // Get amenity icons
  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi')) return <FiWifi />;
    if (amenityLower.includes('pool') || amenityLower.includes('spa')) return <FiDroplet />;
    if (amenityLower.includes('restaurant') || amenityLower.includes('breakfast')) return <FiCoffee />;
    return <FiHome />;
  };

  // Display top 3 amenities
  const displayAmenities = hotel.amenities?.slice(0, 3) || [];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 cursor-pointer transition-shadow hover:shadow-xl ${className}`}
      onClick={() => onViewDetails(hotel)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden group">
        <LazyImage
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Favorite Button */}
        {onToggleFavorite && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(hotel.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
              isFavorite 
                ? 'bg-rose-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiHeart size={18} className={isFavorite ? 'fill-current' : ''} />
          </motion.button>
        )}

        {/* Star Rating Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
          {Array.from({ length: hotel.stars || 5 }).map((_, i) => (
            <FiStar key={i} size={12} className="text-amber-500 fill-current" />
          ))}
        </div>

        {/* Special Badge (if applicable) */}
        {hotel.featured && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Hotel Name and Location */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1 hover:text-rose-600 transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <FiMapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{hotel.location}</span>
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-lg">
            <FiStar size={14} className="mr-1 fill-current" />
            <span className="font-semibold text-sm">{hotel.rating || '4.5'}</span>
          </div>
          <span className="text-sm text-gray-600">
            {hotel.reviews || 0} reviews
          </span>
        </div>

        {/* Amenities */}
        {displayAmenities.length > 0 && (
          <div className="flex items-center space-x-3 text-gray-600">
            {displayAmenities.map((amenity, index) => (
              <div 
                key={index} 
                className="flex items-center text-xs"
                title={amenity}
              >
                {getAmenityIcon(amenity)}
                <span className="ml-1 hidden sm:inline">{amenity}</span>
              </div>
            ))}
            {hotel.amenities?.length > 3 && (
              <span className="text-xs text-gray-500">
                +{hotel.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Price Section */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-500">Starting from</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-800">
                  ₹{hotel.price.toLocaleString()}
                </span>
                {hotel.taxes > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">per night</p>
            </div>

            {/* Book Now Button */}
            {onBookNow && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookNow(hotel);
                }}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center space-x-1 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Book</span>
                <FiArrowRight size={16} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Quick Info */}
        {hotel.rooms && hotel.rooms.length > 0 && (
          <div className="flex items-center text-xs text-gray-500 pt-2">
            <FiUsers size={12} className="mr-1" />
            <span>{hotel.rooms.length} room types available</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Compact Hotel Card (for lists/grids with less space)
 */
export const CompactHotelCard = ({ hotel, onViewDetails, className = "" }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 cursor-pointer transition-all flex overflow-hidden ${className}`}
      onClick={() => onViewDetails(hotel)}
    >
      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0">
        <LazyImage
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">
            {hotel.name}
          </h4>
          <p className="text-xs text-gray-600 line-clamp-1 mt-1">
            {hotel.location}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-green-600">
            <FiStar size={12} className="mr-1 fill-current" />
            <span className="font-semibold">{hotel.rating}</span>
          </div>
          <span className="text-sm font-bold text-gray-800">
            ₹{hotel.price.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Hotel Card Skeleton Loader
 */
export const HotelCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="h-48 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="flex space-x-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
        </div>
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
              <div className="h-8 bg-gray-200 rounded animate-pulse w-32" />
            </div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
