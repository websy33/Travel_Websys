/**
 * Hotels.jsx - Refactored Version (Example Structure)
 * 
 * This is an example of how the main Hotels.jsx file should look
 * after refactoring - clean, organized, and easy to maintain.
 * 
 * Original: 6,992 lines
 * Target: ~500-800 lines (orchestration only)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Hooks
import useHotelStorage from '../hooks/useHotelStorage';

// Common Components
import LoadingSpinner from '../Components/common/LoadingSpinner';

// Hotel Components - Authentication
import AdminLogin from '../Components/Hotels/auth/AdminLogin';
// import HotelRegistration from '../Components/Hotels/auth/HotelRegistration';

// Hotel Components - Display
import HotelCard from '../Components/Hotels/display/HotelCard';
import HotelFilters from '../Components/Hotels/display/HotelFilters';
// import HotelDetailsModal from '../Components/Hotels/display/HotelDetailsModal';

// Hotel Components - Management
// import AdminPanel from '../Components/Hotels/management/AdminPanel';
// import HotelManagementPanel from '../Components/Hotels/management/HotelManagementPanel';

// Utils
import { pageTransitionVariants } from '../utils/hotelAnimations';

/**
 * Main Hotels Component
 * Orchestrates all hotel-related functionality
 */
const Hotels = ({ showAdminLogin = false, showRegister = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==================== STATE MANAGEMENT ====================
  
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  // Modal States
  const [showLoginModal, setShowLoginModal] = useState(showAdminLogin);
  const [showRegisterModal, setShowRegisterModal] = useState(showRegister);
  const [showHotelDetails, setShowHotelDetails] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showHotelPanel, setShowHotelPanel] = useState(false);

  // Data States
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [favorites, setFavorites] = useState([]);
  
  // Filter States
  const [filters, setFilters] = useState({
    searchQuery: '',
    priceRange: [0, 50000],
    amenities: [],
    starRating: [],
    sortBy: 'price'
  });

  // Hotel Storage Hook
  const {
    hotels,
    pendingHotels,
    loading: hotelStorageLoading,
    error: hotelStorageError,
    addHotel,
    approveHotel,
    rejectHotel,
    updateHotel,
    deleteHotel,
    refreshData
  } = useHotelStorage();

  // ==================== EFFECTS ====================

  // Initialize user session
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedRole = localStorage.getItem('userRole');

    if (savedUser && savedAuth === 'true') {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      setUserRole(savedRole);
    }

    // Load favorites
    const savedFavorites = localStorage.getItem('hotelFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Handle URL params for modals
  useEffect(() => {
    if (showAdminLogin) setShowLoginModal(true);
    if (showRegister) setShowRegisterModal(true);
  }, [showAdminLogin, showRegister]);

  // ==================== HANDLERS ====================

  /**
   * Handle successful login
   */
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setUserRole(userData.role);
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', userData.role);

    // Navigate based on role
    if (userData.role === 'admin') {
      setShowAdminPanel(true);
    } else if (userData.role === 'hotel') {
      setShowHotelPanel(true);
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setUserRole('');
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');

    setShowAdminPanel(false);
    setShowHotelPanel(false);
  };

  /**
   * Handle view hotel details
   */
  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel);
    setShowHotelDetails(true);
  };

  /**
   * Handle toggle favorite
   */
  const handleToggleFavorite = (hotelId) => {
    const newFavorites = favorites.includes(hotelId)
      ? favorites.filter(id => id !== hotelId)
      : [...favorites, hotelId];
    
    setFavorites(newFavorites);
    localStorage.setItem('hotelFavorites', JSON.stringify(newFavorites));
  };

  /**
   * Handle booking
   */
  const handleBookNow = (hotel) => {
    setSelectedHotel(hotel);
    // Open booking modal
    console.log('Book hotel:', hotel);
  };

  /**
   * Reset filters
   */
  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      priceRange: [0, 50000],
      amenities: [],
      starRating: [],
      sortBy: 'price'
    });
  };

  // ==================== COMPUTED VALUES ====================

  /**
   * Filter and sort hotels based on current filters
   */
  const filteredHotels = hotels.filter(hotel => {
    // Search filter
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        hotel.name.toLowerCase().includes(searchLower) ||
        hotel.location.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Price filter
    if (hotel.price < filters.priceRange[0] || hotel.price > filters.priceRange[1]) {
      return false;
    }

    // Star rating filter
    if (filters.starRating.length > 0 && !filters.starRating.includes(hotel.stars)) {
      return false;
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity =>
        hotel.amenities?.includes(amenity)
      );
      if (!hasAllAmenities) return false;
    }

    return true;
  }).sort((a, b) => {
    // Sort logic
    switch (filters.sortBy) {
      case 'price':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'reviews':
        return (b.reviews || 0) - (a.reviews || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Get unique amenities from all hotels
  const availableAmenities = [...new Set(hotels.flatMap(h => h.amenities || []))];

  // ==================== RENDER ====================

  if (hotelStorageLoading) {
    return <LoadingSpinner text="Loading hotels..." fullScreen />;
  }

  if (hotelStorageError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">Error loading hotels</p>
          <button 
            onClick={refreshData}
            className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Hotels</h1>
              <p className="text-gray-600 mt-1">
                {filteredHotels.length} hotels available
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">
                    Welcome, {currentUser?.name}
                  </span>
                  {userRole === 'admin' && (
                    <button
                      onClick={() => setShowAdminPanel(true)}
                      className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                    >
                      Admin Panel
                    </button>
                  )}
                  {userRole === 'hotel' && (
                    <button
                      onClick={() => setShowHotelPanel(true)}
                      className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                    >
                      My Hotels
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                  >
                    Register Hotel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Filters Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <HotelFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableAmenities={availableAmenities}
              onReset={handleResetFilters}
              hotelCount={filteredHotels.length}
            />
          </div>

          {/* Hotels Grid */}
          <div className="col-span-12 lg:col-span-9">
            {filteredHotels.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500 text-lg">No hotels found matching your criteria</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHotels.map(hotel => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onViewDetails={handleViewDetails}
                    onBookNow={handleBookNow}
                    isFavorite={favorites.includes(hotel.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* Login Modal */}
      <AdminLogin
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        defaultRole="hotel"
      />

      {/* Registration Modal */}
      {/* <HotelRegistration
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      /> */}

      {/* Hotel Details Modal */}
      {/* <HotelDetailsModal
        isOpen={showHotelDetails}
        hotel={selectedHotel}
        onClose={() => setShowHotelDetails(false)}
        onBookNow={handleBookNow}
      /> */}

      {/* Admin Panel */}
      {/* <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        pendingHotels={pendingHotels}
        onApprove={approveHotel}
        onReject={rejectHotel}
      /> */}

      {/* Hotel Management Panel */}
      {/* <HotelManagementPanel
        isOpen={showHotelPanel}
        onClose={() => setShowHotelPanel(false)}
        currentUser={currentUser}
        userHotels={hotels.filter(h => h.submittedBy === currentUser?.id)}
        onAddHotel={() => console.log('Add hotel')}
      /> */}
    </motion.div>
  );
};

export default Hotels;
