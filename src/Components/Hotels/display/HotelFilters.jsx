import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFilter, FiX, FiSearch, FiChevronDown, FiStar,
  FiDollarSign, FiCheck, FiSliders 
} from 'react-icons/fi';
import { slideInRightVariants } from '../../../utils/hotelAnimations';

/**
 * Hotel Filters Component
 * Provides filtering, sorting, and search functionality
 */
const HotelFilters = ({
  filters,
  onFiltersChange,
  availableAmenities = [],
  onReset,
  hotelCount = 0
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    rating: true,
    amenities: true,
    stars: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = (min, max) => {
    onFiltersChange({
      ...filters,
      priceRange: [min, max]
    });
  };

  const handleStarRatingChange = (stars) => {
    const currentStars = filters.starRating || [];
    const newStars = currentStars.includes(stars)
      ? currentStars.filter(s => s !== stars)
      : [...currentStars, stars];
    
    onFiltersChange({
      ...filters,
      starRating: newStars
    });
  };

  const handleAmenityChange = (amenity) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    onFiltersChange({
      ...filters,
      amenities: newAmenities
    });
  };

  const handleSortChange = (sortBy) => {
    onFiltersChange({
      ...filters,
      sortBy
    });
  };

  const handleSearchChange = (searchQuery) => {
    onFiltersChange({
      ...filters,
      searchQuery
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search hotels..."
            value={filters.searchQuery || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy || 'price'}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
        >
          <option value="price">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Rating: High to Low</option>
          <option value="reviews">Most Reviewed</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
        >
          <span className="flex items-center">
            <FiDollarSign className="mr-2" />
            Price Range
          </span>
          <FiChevronDown 
            className={`transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} 
          />
        </button>
        
        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange?.[0] || 0}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0, filters.priceRange?.[1] || 50000)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange?.[1] || 50000}
                  onChange={(e) => handlePriceChange(filters.priceRange?.[0] || 0, parseInt(e.target.value) || 50000)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              
              {/* Quick Price Filters */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Under ₹2,000', value: [0, 2000] },
                  { label: '₹2,000 - ₹5,000', value: [2000, 5000] },
                  { label: '₹5,000 - ₹10,000', value: [5000, 10000] },
                  { label: 'Above ₹10,000', value: [10000, 50000] }
                ].map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handlePriceChange(option.value[0], option.value[1])}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filters.priceRange?.[0] === option.value[0] && filters.priceRange?.[1] === option.value[1]
                        ? 'bg-rose-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Star Rating */}
      <div>
        <button
          onClick={() => toggleSection('stars')}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
        >
          <span className="flex items-center">
            <FiStar className="mr-2" />
            Star Rating
          </span>
          <FiChevronDown 
            className={`transition-transform ${expandedSections.stars ? 'rotate-180' : ''}`} 
          />
        </button>
        
        <AnimatePresence>
          {expandedSections.stars && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {[5, 4, 3].map((stars) => (
                <label key={stars} className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={(filters.starRating || []).includes(stars)}
                    onChange={() => handleStarRatingChange(stars)}
                    className="h-4 w-4 text-rose-600 rounded focus:ring-rose-500 border-gray-300"
                  />
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: stars }).map((_, i) => (
                      <FiStar 
                        key={i} 
                        size={14} 
                        className="text-amber-500 fill-current" 
                      />
                    ))}
                    <span className="text-sm text-gray-700 group-hover:text-rose-600 transition-colors">
                      {stars} Star{stars > 1 ? 's' : ''}
                    </span>
                  </div>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Amenities */}
      <div>
        <button
          onClick={() => toggleSection('amenities')}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3"
        >
          <span className="flex items-center">
            <FiSliders className="mr-2" />
            Amenities
          </span>
          <FiChevronDown 
            className={`transition-transform ${expandedSections.amenities ? 'rotate-180' : ''}`} 
          />
        </button>
        
        <AnimatePresence>
          {expandedSections.amenities && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 max-h-48 overflow-y-auto"
            >
              {availableAmenities.map((amenity, index) => (
                <label key={index} className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={(filters.amenities || []).includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="h-4 w-4 text-rose-600 rounded focus:ring-rose-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-rose-600 transition-colors">
                    {amenity}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
      >
        Reset All Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white rounded-xl shadow-md p-6 sticky top-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <FiFilter className="mr-2" />
            Filters
          </h3>
          {hotelCount > 0 && (
            <span className="text-sm text-gray-600">
              {hotelCount} hotels found
            </span>
          )}
        </div>
        
        <FilterContent />
      </div>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white p-4 rounded-full shadow-lg z-40 flex items-center space-x-2"
      >
        <FiFilter size={20} />
        <span className="font-semibold">Filters</span>
        {(filters.amenities?.length > 0 || filters.starRating?.length > 0) && (
          <span className="bg-white text-rose-600 px-2 py-0.5 rounded-full text-xs font-bold">
            {(filters.amenities?.length || 0) + (filters.starRating?.length || 0)}
          </span>
        )}
      </button>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              variants={slideInRightVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <FiFilter className="mr-2" />
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                
                <FilterContent />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HotelFilters;
