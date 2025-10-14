import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiStar, FiFilter, FiChevronDown, FiX, FiMapPin, 
  FiWifi, FiCoffee, FiDroplet, FiHeart, FiClock, 
  FiUsers, FiCalendar, FiZap, FiEdit, FiSave, FiMail,
  FiCreditCard, FiPhone, FiLock, FiUser, FiSearch,
  FiCheck, FiDollarSign, FiHome, FiUmbrella, FiTv,
  FiChevronLeft, FiChevronRight, FiArrowRight,
  FiLogIn, FiLogOut, FiSettings, FiPlus, FiTrash2,
  FiUserPlus, FiEye, FiEyeOff, FiInfo, FiShield,
  FiImage, FiCamera, FiUpload, FiCheckCircle,
  FiAlertCircle, FiClock as FiPending, FiBriefcase,
  FiTrendingUp, FiDollarSign as FiDollar, FiPackage,
  FiAward, FiFeather, FiMap, FiNavigation, FiMinus,
  FiDownload, FiUpload as FiUploadCloud
} from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';

// Fixed color animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
  </div>
);

// Image placeholder component
const ImagePlaceholder = ({ className = "" }) => (
  <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`}>
    <div className="flex items-center justify-center h-full">
      <FiHome className="text-gray-400 text-2xl" />
    </div>
  </div>
);

// Custom lazy image component with error handling
const LazyImage = ({ src, alt, className, onLoad, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
    console.warn(`Failed to load image: ${src}`);
  };

  const imageSrc = src && src.trim() !== '' ? src : null;

  return (
    <div className={`relative ${className}`}>
      {isLoading && <ImagePlaceholder className={className} />}
      {(error || !imageSrc) ? (
        <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
          <FiHome className="text-gray-400 text-2xl" />
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
};

// Enhanced amenity icons
const amenityIcons = {
  'Free WiFi': <FiWifi className="mr-2 text-rose-500 text-lg" />,
  'Pool': <FiDroplet className="mr-2 text-rose-500 text-lg" />,
  'Spa': <FiHeart className="mr-2 text-rose-500 text-lg" />,
  'Restaurant': <FiCoffee className="mr-2 text-rose-500 text-lg" />,
  'Parking': <FiHome className="mr-2 text-rose-500 text-lg" />,
  'Beachfront': <FiUmbrella className="mr-2 text-rose-500 text-lg" />,
  'Bar': <FiCoffee className="mr-2 text-rose-500 text-lg" />,
  'Fitness Center': <FiZap className="mr-2 text-rose-500 text-lg" />,
  'Room Service': <FiCheck className="mr-2 text-rose-500 text-lg" />,
  'Business Center': <FiEdit className="mr-2 text-rose-500 text-lg" />,
  'TV': <FiTv className="mr-2 text-rose-500 text-lg" />,
  'Air conditioning': <FiZap className="mr-2 text-rose-500 text-lg" />,
  'Minibar': <FiCoffee className="mr-2 text-rose-500 text-lg" />,
  'Safe': <FiLock className="mr-2 text-rose-500 text-lg" />,
  'Work desk': <FiEdit className="mr-2 text-rose-500 text-lg" />,
  'Balcony': <FiHome className="mr-2 text-rose-500 text-lg" />,
  'Sea view': <FiMapPin className="mr-2 text-rose-500 text-lg" />,
  'Lake view': <FiMapPin className="mr-2 text-rose-500 text-lg" />,
  'Private pool': <FiDroplet className="mr-2 text-rose-500 text-lg" />,
  'Butler service': <FiUser className="mr-2 text-rose-500 text-lg" />,
  'Jacuzzi': <FiDroplet className="mr-2 text-rose-500 text-lg" />,
  'Dining table': <FiCoffee className="mr-2 text-rose-500 text-lg" />,
  'Premium toiletries': <FiCheck className="mr-2 text-rose-500 text-lg" />,
  'Separate living area': <FiHome className="mr-2 text-rose-500 text-lg" />,
  'Club lounge access': <FiStar className="mr-2 text-rose-500 text-lg" />,
  'Private terrace': <FiHome className="mr-2 text-rose-500 text-lg" />,
  'Personal butler': <FiUser className="mr-2 text-rose-500 text-lg" />,
  'Dining room': <FiCoffee className="mr-2 text-rose-500 text-lg" />,
  'Study': <FiEdit className="mr-2 text-rose-500 text-lg" />,
  'Yoga Classes': <FiHeart className="mr-2 text-rose-500 text-lg" />,
  'Boat Ride': <FiDroplet className="mr-2 text-rose-500 text-lg" />,
  'Concierge': <FiUser className="mr-2 text-rose-500 text-lg" />,
  'Airport Shuttle': <FiHome className="mr-2 text-rose-500 text-lg" />
};

// Enhanced Availability Calendar Component
const AvailabilityCalendar = ({ room, onAvailabilityUpdate, isEditable = false }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availabilityData, setAvailabilityData] = useState({});
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  // Initialize availability data with persistence
  useEffect(() => {
    if (room && room.availabilityData && Object.keys(room.availabilityData).length > 0) {
      setAvailabilityData(room.availabilityData);
    } else {
      const defaultData = {};
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        defaultData[dateString] = {
          available: true,
          totalRooms: room?.totalRooms || 10,
          bookedRooms: 0,
          price: room?.price || 0
        };
      }
      setAvailabilityData(defaultData);
      
      if (onAvailabilityUpdate) {
        onAvailabilityUpdate(defaultData);
      }
    }
  }, [room, onAvailabilityUpdate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    const startingDay = firstDay.getDay();
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const updateAvailability = (date, field, value) => {
    if (!isEditable) return;
    
    const dateString = date.toISOString().split('T')[0];
    const updatedData = {
      ...availabilityData,
      [dateString]: {
        ...availabilityData[dateString],
        [field]: value
      }
    };
    
    setAvailabilityData(updatedData);
    
    if (onAvailabilityUpdate) {
      onAvailabilityUpdate(updatedData);
    }
  };

  const handleDateClick = (date, event) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return;
    
    setSelectedDate(date);
    
    if (isEditable) {
      const rect = event.target.getBoundingClientRect();
      setPopupPosition({
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY
      });
      setShowDatePopup(true);
    } else {
      const rect = event.target.getBoundingClientRect();
      setPopupPosition({
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY
      });
      setShowDatePopup(true);
    }
  };

  const getDayClass = (date) => {
    if (!date) return '';
    
    const dateString = date.toISOString().split('T')[0];
    const dayData = availabilityData[dateString];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let classes = 'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ';
    
    if (date < today) {
      classes += 'bg-gray-100 text-gray-400 cursor-not-allowed ';
    } else if (dayData) {
      const availableRooms = dayData.totalRooms - dayData.bookedRooms;
      
      if (!dayData.available || availableRooms === 0) {
        classes += 'bg-red-500 text-white hover:bg-red-600 ';
      } else if (availableRooms > 0) {
        classes += 'bg-green-500 text-white hover:bg-green-600 ';
      } else {
        classes += 'bg-gray-200 text-gray-600 hover:bg-gray-300 ';
      }
      
      if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
        classes += 'ring-2 ring-blue-500 ring-offset-2 shadow-lg transform scale-105 ';
      }
    } else {
      classes += 'bg-gray-200 text-gray-600 hover:bg-gray-300 ';
    }
    
    if (isEditable && date >= today) {
      classes += 'cursor-pointer hover:shadow-md ';
    } else if (date >= today) {
      classes += 'cursor-pointer hover:shadow-md ';
    }
    
    return classes;
  };

  const getDayTooltip = (date) => {
    if (!date) return '';
    
    const dateString = date.toISOString().split('T')[0];
    const dayData = availabilityData[dateString];
    
    if (!dayData) return 'No data available';
    
    const availableRooms = dayData.totalRooms - dayData.bookedRooms;
    
    if (!dayData.available) {
      return 'Not available for booking';
    }
    
    if (availableRooms === 0) {
      return 'All rooms booked';
    }
    
    return `${availableRooms} rooms available - ₹${dayData.price || 0}`;
  };

  const getMonthYearString = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Availability Calendar</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiChevronLeft size={20} />
          </button>
          <span className="font-medium text-gray-700 min-w-[140px] text-center">
            {getMonthYearString(currentMonth)}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Available Rooms</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Booked/Sold Out</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-400 rounded"></div>
          <span>Past Date</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        {days.map((date, index) => (
          <div key={index} className="text-center">
            {date ? (
              <motion.button
                onClick={(e) => handleDateClick(date, e)}
                className={getDayClass(date)}
                disabled={date < new Date().setHours(0,0,0,0)}
                title={getDayTooltip(date)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {date.getDate()}
              </motion.button>
            ) : (
              <div className="w-10 h-10"></div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showDatePopup && selectedDate && (
          <motion.div 
            className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDatePopup(false)}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 max-w-sm mx-4"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'fixed',
                left: `${popupPosition.x}px`,
                top: `${popupPosition.y}px`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-800">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h4>
                <button 
                  onClick={() => setShowDatePopup(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              {(() => {
                const dateString = selectedDate.toISOString().split('T')[0];
                const dayData = availabilityData[dateString] || {
                  available: true,
                  totalRooms: room?.totalRooms || 10,
                  bookedRooms: 0,
                  price: room?.price || 0
                };
                const availableRooms = dayData.totalRooms - dayData.bookedRooms;

                return (
                  <div className="space-y-4">
                    <div className={`p-3 rounded-lg ${
                      !dayData.available || availableRooms === 0
                        ? 'bg-red-50 border border-red-200' 
                        : 'bg-green-50 border border-green-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className={`font-bold ${
                          !dayData.available || availableRooms === 0
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}>
                          {!dayData.available || availableRooms === 0 ? 'Not Available' : 'Available'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="text-blue-600 text-sm font-medium">Total Rooms</div>
                        <div className="text-2xl font-bold text-blue-700">{dayData.totalRooms}</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="text-green-600 text-sm font-medium">Available</div>
                        <div className="text-2xl font-bold text-green-700">{availableRooms}</div>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <div className="text-amber-600 text-sm font-medium">Booked Rooms</div>
                      <div className="text-2xl font-bold text-amber-700">{dayData.bookedRooms}</div>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <div className="text-purple-600 text-sm font-medium">Price per Night</div>
                      <div className="text-2xl font-bold text-purple-700">
                        ₹{(dayData.price || 0).toLocaleString()}
                      </div>
                    </div>

                    {isEditable && (
                      <div className="space-y-3 pt-4 border-t border-gray-200">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Rooms
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={dayData.totalRooms}
                            onChange={(e) => updateAvailability(selectedDate, 'totalRooms', parseInt(e.target.value) || 0)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Booked Rooms
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={dayData.totalRooms}
                            value={dayData.bookedRooms}
                            onChange={(e) => updateAvailability(selectedDate, 'bookedRooms', parseInt(e.target.value) || 0)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (₹)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={dayData.price || 0}
                            onChange={(e) => updateAvailability(selectedDate, 'price', parseInt(e.target.value) || 0)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="available"
                            checked={dayData.available}
                            onChange={(e) => updateAvailability(selectedDate, 'available', e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="available" className="text-sm font-medium text-gray-700">
                            Available for booking
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isEditable && (
        <motion.div 
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="font-semibold text-blue-800 mb-3">Quick Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <motion.button
              onClick={() => {
                const today = new Date();
                const updates = {};
                for (let i = 0; i < 30; i++) {
                  const date = new Date(today);
                  date.setDate(today.getDate() + i);
                  const dateString = date.toISOString().split('T')[0];
                  updates[dateString] = {
                    ...availabilityData[dateString],
                    available: true,
                    bookedRooms: 0
                  };
                }
                const updatedData = { ...availabilityData, ...updates };
                setAvailabilityData(updatedData);
                onAvailabilityUpdate?.(updatedData);
              }}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiCheckCircle size={16} />
              <span>Open Next 30 Days</span>
            </motion.button>
            
            <motion.button
              onClick={() => {
                const today = new Date();
                const updates = {};
                for (let i = 0; i < 7; i++) {
                  const date = new Date(today);
                  date.setDate(today.getDate() + i);
                  const dateString = date.toISOString().split('T')[0];
                  updates[dateString] = {
                    ...availabilityData[dateString],
                    available: false
                  };
                }
                const updatedData = { ...availabilityData, ...updates };
                setAvailabilityData(updatedData);
                onAvailabilityUpdate?.(updatedData);
              }}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiX size={16} />
              <span>Close Next 7 Days</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Bulk Availability Editor Component
const BulkAvailabilityEditor = ({ room, onBulkUpdate }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 86400000));
  const [totalRooms, setTotalRooms] = useState(room?.totalRooms || 10);
  const [price, setPrice] = useState(room?.price || 0);
  const [availability, setAvailability] = useState(true);

  const handleBulkUpdate = () => {
    const updates = {};
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      updates[dateString] = {
        totalRooms: totalRooms,
        bookedRooms: availability ? 0 : totalRooms,
        price: price,
        available: availability
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    onBulkUpdate(updates);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Bulk Availability Update</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            minDate={new Date()}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            minDate={startDate}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Rooms</label>
          <input
            type="number"
            value={totalRooms}
            onChange={(e) => setTotalRooms(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value === 'true')}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          >
            <option value={true}>Available</option>
            <option value={false}>Not Available</option>
          </select>
        </div>
      </div>
      <button
        onClick={handleBulkUpdate}
        className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Apply to Selected Dates
      </button>
    </div>
  );
};

// Form Step Component
const FormStep = ({ number, title, description, isActive, isCompleted, onClick }) => (
  <motion.div 
    className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
      isActive 
        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg' 
        : isCompleted
        ? 'bg-green-50 border border-green-200 text-green-700'
        : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
      isActive 
        ? 'bg-white text-rose-600' 
        : isCompleted
        ? 'bg-green-500 text-white'
        : 'bg-gray-300 text-gray-600'
    }`}>
      {isCompleted ? <FiCheck size={20} /> : number}
    </div>
    <div className="flex-1">
      <h3 className={`font-bold text-lg ${
        isActive ? 'text-white' : isCompleted ? 'text-green-800' : 'text-gray-800'
      }`}>
        {title}
      </h3>
      <p className={`text-sm ${isActive ? 'text-rose-100' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
        {description}
      </p>
    </div>
    {isCompleted && (
      <FiCheckCircle className="text-green-500 flex-shrink-0" size={20} />
    )}
  </motion.div>
);

// Image Upload Component with Validation - WEBP Only
const ImageUploadWithPreview = ({ 
  image, 
  onImageChange, 
  onImageRemove, 
  title, 
  description,
  required = false,
  aspectRatio = "16/9"
}) => {
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const validateImage = (file) => {
    const validTypes = ['image/webp']; // Only WEBP allowed
    if (!validTypes.includes(file.type)) {
      return 'Please select a WEBP image only';
    }

    if (file.size > 100 * 1024) {
      return 'Image size must be less than 100KB';
    }

    return '';
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validationError = validateImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 150 || img.height < 150) {
          setError('Image dimensions must be at least 150x150 pixels');
          return;
        }
        onImageChange(e.target.result);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const validationError = validateImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 150 || img.height < 150) {
          setError('Image dimensions must be at least 150x150 pixels');
          return;
        }
        onImageChange(e.target.result);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {title} {required && <span className="text-rose-500">*</span>}
        </label>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
      </div>

      {image ? (
        <div className="relative group">
          <div 
            className="rounded-xl overflow-hidden border-2 border-green-200 bg-green-50"
            style={{ aspectRatio }}
          >
            <img 
              src={image} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
              <motion.button
                type="button"
                onClick={() => document.getElementById('image-upload').click()}
                className="bg-white text-rose-600 p-2 rounded-full shadow-lg hover:bg-rose-50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiCamera size={16} />
              </motion.button>
              <motion.button
                type="button"
                onClick={onImageRemove}
                className="bg-white text-red-600 p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiTrash2 size={16} />
              </motion.button>
            </div>
          </div>
          <div className="mt-2 flex items-center text-green-600 text-sm">
            <FiCheckCircle className="mr-1" size={16} />
            <span>Image uploaded successfully ({(image.length / 1024).toFixed(1)}KB)</span>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            isDragging 
              ? 'border-rose-400 bg-rose-50' 
              : error 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 bg-gray-50 hover:border-rose-400 hover:bg-rose-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('image-upload').click()}
        >
          <input
            id="image-upload"
            type="file"
            accept="image/webp" // Only WEBP accepted
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="space-y-3">
            <div className={`p-3 rounded-full inline-flex ${
              error ? 'bg-red-100 text-red-600' : 'bg-rose-100 text-rose-600'
            }`}>
              <FiUpload size={24} />
            </div>
            <div>
              <p className="font-medium text-gray-800">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-600 mt-1">
                WEBP only (Max 100KB, Min 150x150px) {/* Updated text */}
              </p>
            </div>
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center">
                <FiCheck className="mr-1" size={12} />
                <span>Min 150px</span>
              </div>
              <div className="flex items-center">
                <FiCheck className="mr-1" size={12} />
                <span>Max 100KB</span>
              </div>
              <div className="flex items-center">
                <FiCheck className="mr-1" size={12} />
                <span>WEBP format</span> {/* Updated text */}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <motion.div 
          className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FiAlertCircle size={16} />
          <span className="text-sm font-medium">{error}</span>
        </motion.div>
      )}
    </div>
  );
};

// Enhanced Input Field Component
const EnhancedInput = ({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder, 
  required = false,
  icon: Icon,
  error,
  description,
  ...props 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-800">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {description && (
      <p className="text-sm text-gray-600 -mt-1">{description}</p>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon size={18} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
          Icon ? 'pl-10' : 'pl-3'
        } ${
          error 
            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
            : 'border-gray-200 bg-white focus:border-rose-500 focus:ring-rose-200'
        }`}
        {...props}
      />
    </div>
    {error && (
      <motion.p 
        className="text-red-600 text-sm flex items-center space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <FiAlertCircle size={14} />
        <span>{error}</span>
      </motion.p>
    )}
  </div>
);

// Enhanced Textarea Component
const EnhancedTextarea = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  rows = 4,
  error,
  description,
  ...props 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-800">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {description && (
      <p className="text-sm text-gray-600 -mt-1">{description}</p>
    )}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full p-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 resize-none ${
        error 
          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
          : 'border-gray-200 bg-white focus:border-rose-500 focus:ring-rose-200'
      }`}
      {...props}
    />
    {error && (
      <motion.p 
        className="text-red-600 text-sm flex items-center space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <FiAlertCircle size={14} />
        <span>{error}</span>
      </motion.p>
    )}
  </div>
);

// Hotel Card Component
const HotelCard = React.memo(({ hotel, index, onImageLoad, onHotelClick }) => {
  const hotelName = hotel?.name || 'Unknown Hotel';
  const hotelLocation = hotel?.location || 'Location not specified';
  const hotelDescription = hotel?.description || 'No description available';
  const hotelPrice = typeof hotel?.price === 'number' ? hotel.price : 0;
  const hotelTaxes = typeof hotel?.taxes === 'number' ? hotel.taxes : 0;
  const hotelRating = typeof hotel?.rating === 'number' ? hotel.rating : 0;
  const hotelReviews = typeof hotel?.reviews === 'number' ? hotel.reviews : 0;
  const hotelStars = typeof hotel?.stars === 'number' ? hotel.stars : 4;
  
  const hotelImage = hotel?.image && hotel.image.trim() !== '' 
    ? hotel.image 
    : '/placeholder-hotel.jpg';
  
  const hotelAmenities = Array.isArray(hotel?.amenities) ? hotel.amenities : [];

  return (
    <motion.div 
      key={hotel.id} 
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-rose-50"
      onClick={() => onHotelClick(hotel)}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex flex-col md:flex-row h-full">
        <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
          <LazyImage 
            src={hotelImage} 
            alt={hotelName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onLoad={() => onImageLoad(hotel.id)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full flex items-center shadow-sm">
            <FiStar className="text-amber-400 fill-current mr-1" />
            <span className="font-medium">{hotelRating}</span>
          </div>
          <div className="absolute bottom-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
            {hotelStars} Star Luxury
          </div>
        </div>
        
        <div className="p-6 md:w-3/5 flex flex-col">
          <div className="flex-grow">
            <div className="flex justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{hotelName}</h3>
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="mr-2 text-rose-500" size={16} />
                  <span>{hotelLocation}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-sm">({hotelReviews} reviews)</div>
              </div>
            </div>
            
            <div className="my-5">
              <p className="text-gray-600 line-clamp-2">{hotelDescription}</p>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {hotelAmenities.slice(0, 4).map(amenity => (
                <motion.span 
                  key={amenity} 
                  className="flex items-center text-sm bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full border border-rose-100"
                  whileHover={{ scale: 1.05 }}
                >
                  {amenityIcons[amenity] || <FiCheck className="mr-1" />}
                  {amenity}
                </motion.span>
              ))}
              {hotelAmenities.length > 4 && (
                <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200">
                  +{hotelAmenities.length - 4} more
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-end">
            <div>
              <p className="text-gray-500 text-sm">Starting from</p>
              <p className="text-3xl font-bold text-gray-800">₹{hotelPrice.toLocaleString()}</p>
              <p className="text-gray-500 text-xs">+ ₹{hotelTaxes.toLocaleString()} taxes & fees</p>
            </div>
            <motion.button 
              className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onHotelClick(hotel);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View Details</span>
              <FiChevronDown className="ml-1 transform group-hover:translate-y-0.5 transition-transform" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const Hotels = ({ showAdminLogin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sortBy, setSortBy] = useState('price');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 86400000));
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(showAdminLogin);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showHotelPanel, setShowHotelPanel] = useState(false);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [showAvailabilityManager, setShowAvailabilityManager] = useState(false);
  const [selectedRoomForAvailability, setSelectedRoomForAvailability] = useState(null);
  const [emailForm, setEmailForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [emailSent, setEmailSent] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [visibleHotels, setVisibleHotels] = useState(6);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [bookingStep, setBookingStep] = useState(1); // 1: Select dates, 2: Guest info, 3: Payment
  const loadMoreRef = useRef(null);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    role: 'hotel'
  });

  // Hotel registration form state
  const [hotelRegisterForm, setHotelRegisterForm] = useState({
    hotelName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    gstNumber: '',
    panNumber: ''
  });

  // Available amenities for selection
  const availableAmenities = [
    'Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Parking', 'Beachfront',
    'Bar', 'Fitness Center', 'Room Service', 'Business Center', 'TV',
    'Air conditioning', 'Minibar', 'Safe', 'Work desk', 'Balcony',
    'Sea view', 'Lake view', 'Private pool', 'Butler service', 'Jacuzzi',
    'Dining table', 'Premium toiletries', 'Separate living area',
    'Club lounge access', 'Private terrace', 'Personal butler',
    'Dining room', 'Study', 'Yoga Classes', 'Boat Ride', 'Concierge',
    'Airport Shuttle'
  ];

  // Hotel form state for hotels
  const [hotelForm, setHotelForm] = useState({
    name: '',
    location: '',
    rating: 4.5,
    reviews: 0,
    stars: 4,
    price: 0,
    taxes: 0,
    image: '',
    description: '',
    amenities: [],
    rooms: [{
      id: Date.now(),
      type: 'Standard Room',
      price: 0,
      size: '',
      beds: '',
      amenities: [],
      maxOccupancy: 2,
      availability: true,
      totalRooms: 10,
      availabilityData: {},
      images: ['']
    }],
    policies: {
      checkIn: '2:00 PM',
      checkOut: '12:00 PM',
      cancellation: 'Free cancellation up to 72 hours before arrival',
      pets: 'Not allowed',
      payment: 'Credit card or cash accepted',
      children: 'Children under 12 stay free with parents'
    },
    nearbyAttractions: [''],
    specialFeatures: [''],
    contact: {
      phone: '',
      email: ''
    },
    status: 'pending',
    submittedBy: '',
    submissionDate: new Date().toISOString(),
    hotelId: ''
  });

  // Initialize state with localStorage data
  const [hotels, setHotels] = useState(() => {
    const saved = localStorage.getItem('kashmirStays_hotels');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Hotel Dal View',
        location: 'Boulevard Road, Srinagar, Jammu and Kashmir 190001',
        rating: 4.5,
        reviews: 892,
        stars: 4,
        price: 30000,
        taxes: 1200,
        image: "/images/Dalview.webp",
        description: 'Nestled along the picturesque Boulevard Road overlooking Dal Lake, Hotel Dal View offers breathtaking views of the Himalayan mountains and direct access to the famous shikara rides. This charming property combines traditional Kashmiri architecture with modern comforts.',
        amenities: [
          'Free WiFi', 
          'Lake View', 
          'Restaurant', 
          'Garden', 
          '24-Hour Front Desk', 
          'Room Service', 
          'Laundry Service', 
          'Travel Desk', 
          'Parking', 
          'Doctor on Call'
        ],
        rooms: [
          { 
            id: 101, 
            type: 'Premium Room', 
            price: 32000, 
            size: '300 sq ft', 
            beds: '1 King Bed',
            amenities: [
              'Heating', 
              'TV', 
              'Tea/Coffee Maker', 
              'Balcony', 
              'Bathroom Amenities'
            ], 
            maxOccupancy: 2,
            availability: true,
            totalRooms: 15,
            availabilityData: {
              '2024-12-25': { totalRooms: 15, bookedRooms: 15, price: 45000, available: false },
              '2024-12-26': { totalRooms: 15, bookedRooms: 12, price: 45000, available: true },
              '2024-12-27': { totalRooms: 15, bookedRooms: 8, price: 42000, available: true },
            },
            images: [
              "/images/Premium Room.webp",
              "/images/Dalview.jpeg"
            ]
          }
        ],
        policies: {
          checkIn: '12:00 PM',
          checkOut: '11:00 AM',
          cancellation: 'Free cancellation up to 72 hours before arrival',
          pets: 'Not allowed',
          payment: 'Credit card or cash accepted',
          children: 'Children under 12 stay free with parents'
        },
        nearbyAttractions: [
          'Dal Lake (on property)',
          'Mughal Gardens (3 km)',
          'Shankaracharya Temple (5 km)',
          'Hazratbal Shrine (4 km)',
          'Old City Markets (6 km)',
          'Pari Mahal (7 km)'
        ],
        specialFeatures: [
          'Authentic Kashmiri Wazwan Cuisine',
          'Shikara Pickup from Hotel Dock',
          'Cultural Evenings with Folk Music',
          'Houseboat Stay Packages Available',
          'Guided Local Tours'
        ],
        contact: {
          phone: '+91 194-245-1234',
          email: 'info@hoteldalview.com'
        },
        status: 'approved',
        submittedBy: 'Hotel Dal View',
        submissionDate: new Date('2024-01-01').toISOString(),
        hotelId: 'hoteldalview'
      }
    ];
  });

  // Pending hotels for admin approval
  const [pendingHotels, setPendingHotels] = useState(() => {
    const saved = localStorage.getItem('kashmirStays_pendingHotels');
    return saved ? JSON.parse(saved) : [];
  });

  // Hotel users (hotel management accounts)
  const [hotelUsers, setHotelUsers] = useState(() => {
    const saved = localStorage.getItem('kashmirStays_hotelUsers');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1,
        hotelName: 'Hotel Dal View',
        ownerName: 'Rajesh Kumar',
        email: 'hoteldalview@example.com', 
        password: 'hotel123', 
        role: 'hotel',
        phone: '+91 9876543210',
        address: 'Boulevard Road, Srinagar',
        city: 'Srinagar',
        pincode: '190001',
        gstNumber: 'GSTIN123456789',
        panNumber: 'ABCDE1234F',
        hotels: [1],
        registrationDate: new Date('2024-01-01').toISOString()
      }
    ];
  });

  // Admin user
  const [adminUser] = useState({
    id: 999,
    name: 'Admin User',
    email: 'admin@traveligo.com', 
    password: 'admin123', 
    role: 'admin'
  });

  // Form steps configuration
  const formSteps = [
    {
      number: 1,
      title: "Basic Information",
      description: "Hotel name, location, and basic details",
      fields: ['name', 'location', 'stars', 'rating', 'price', 'taxes', 'description', 'image']
    },
    {
      number: 2,
      title: "Amenities & Facilities",
      description: "Select available amenities and features",
      fields: ['amenities']
    },
    {
      number: 3,
      title: "Room Configuration",
      description: "Add and configure room types",
      fields: ['rooms']
    },
    {
      number: 4,
      title: "Policies & Contact",
      description: "Set policies and contact information",
      fields: ['policies', 'contact']
    },
    {
      number: 5,
      title: "Additional Details",
      description: "Nearby attractions and special features",
      fields: ['nearbyAttractions', 'specialFeatures']
    }
  ];

  // Handle admin login modal when accessing via direct admin route
  useEffect(() => {
    if (showAdminLogin || location.pathname === '/hotels-admin') {
      setShowLoginModal(true);
    }
  }, [showAdminLogin, location.pathname]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('kashmirStays_hotels', JSON.stringify(hotels));
  }, [hotels]);

  useEffect(() => {
    localStorage.setItem('kashmirStays_pendingHotels', JSON.stringify(pendingHotels));
  }, [pendingHotels]);

  useEffect(() => {
    localStorage.setItem('kashmirStays_hotelUsers', JSON.stringify(hotelUsers));
  }, [hotelUsers]);

  // Load user authentication state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedRole = localStorage.getItem('userRole');
    
    if (savedUser && savedAuth === 'true') {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
        setUserRole(savedRole);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
      }
    }

    // Initialize EmailJS
    try {
      emailjs.init("37pN2ThzFwwhwk7ai");
    } catch (error) {
      console.warn('EmailJS initialization failed:', error);
    }
  }, []);

  // Data Export/Import Functions
  const exportHotelData = () => {
    const data = {
      hotels,
      pendingHotels,
      hotelUsers,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `kashmir-stays-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importHotelData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.hotels) {
          setHotels(data.hotels);
        }
        
        if (data.pendingHotels) {
          setPendingHotels(data.pendingHotels);
        }
        
        if (data.hotelUsers) {
          setHotelUsers(data.hotelUsers);
        }
        
        alert('Data imported successfully!');
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  // Enhanced Room Availability Management
  const updateHotelRoomAvailability = (hotelId, roomId, availabilityData) => {
    setHotels(prev => {
      const updatedHotels = prev.map(hotel => {
        if (hotel.id === hotelId) {
          const updatedRooms = hotel.rooms.map(room => {
            if (room.id === roomId) {
              return { 
                ...room, 
                availabilityData: {
                  ...room.availabilityData,
                  ...availabilityData
                }
              };
            }
            return room;
          });
          return { ...hotel, rooms: updatedRooms };
        }
        return hotel;
      });
      
      return updatedHotels;
    });
  };

  const handleBulkRoomUpdate = (hotelId, roomId, updates) => {
    setHotels(prev => {
      const updatedHotels = prev.map(hotel => {
        if (hotel.id === hotelId) {
          const updatedRooms = hotel.rooms.map(room => {
            if (room.id === roomId) {
              return {
                ...room,
                availabilityData: {
                  ...room.availabilityData,
                  ...updates
                }
              };
            }
            return room;
          });
          return { ...hotel, rooms: updatedRooms };
        }
        return hotel;
      });
      return updatedHotels;
    });
  };

  // Handle logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    setCurrentUser(null);
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    
    setShowAdminPanel(false);
    setShowHotelPanel(false);
    setShowHotelForm(false);
  };

  // Form validation functions
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!hotelForm.name.trim()) errors.name = 'Hotel name is required';
      if (!hotelForm.location.trim()) errors.location = 'Location is required';
      if (!hotelForm.price || hotelForm.price <= 0) errors.price = 'Valid price is required';
      if (!hotelForm.description.trim()) errors.description = 'Description is required';
      if (!hotelForm.image) errors.image = 'Hotel image is required';
      if (!hotelForm.stars || hotelForm.stars < 3) errors.stars = 'Star rating is required';
    }

    if (step === 2) {
      if (hotelForm.amenities.length === 0) errors.amenities = 'Select at least one amenity';
    }

    if (step === 3) {
      hotelForm.rooms.forEach((room, index) => {
        if (!room.type || !room.type.trim()) {
          errors[`room_${index}_type`] = 'Room type is required';
        }
        if (!room.price || room.price <= 0) {
          errors[`room_${index}_price`] = 'Valid room price is required';
        }
        if (!room.maxOccupancy || room.maxOccupancy <= 0) {
          errors[`room_${index}_occupancy`] = 'Valid occupancy is required';
        }
        if (!room.totalRooms || room.totalRooms <= 0) {
          errors[`room_${index}_totalRooms`] = 'Total rooms count is required';
        }
      });
    }

    if (step === 4) {
      if (!hotelForm.contact.phone.trim()) errors.phone = 'Contact phone is required';
      if (!hotelForm.contact.email.trim()) errors.email = 'Contact email is required';
      if (!hotelForm.policies.checkIn.trim()) errors.checkIn = 'Check-in time is required';
      if (!hotelForm.policies.checkOut.trim()) errors.checkOut = 'Check-out time is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, formSteps.length));
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Handle step click
  const handleStepClick = (stepNumber) => {
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  // Calculate form completion percentage
  const calculateCompletion = () => {
    const totalFields = formSteps.flatMap(step => step.fields).length;
    const completedFields = formSteps
      .slice(0, currentStep - 1)
      .flatMap(step => step.fields)
      .length;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreHotels();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [visibleHotels, hotels]);

  // Calculate number of nights
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diffTime = Math.abs(checkOutDate - checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculate total price
  const calculateTotal = () => {
    if (!selectedRoom) return 0;
    const nights = calculateNights();
    const roomPrice = selectedRoom.price * nights;
    const taxes = selectedHotel.taxes * nights;
    return roomPrice + taxes;
  };

  // Open hotel details modal
  const openHotelDetails = (hotel) => {
    setSelectedHotel(hotel);
    setSelectedRoom(null);
    setCurrentImageIndex(0);
    setActiveTab('details');
    setShowModal(true);
    setPaymentSuccess(false);
    setBookingStep(1);
  };

  // Close all modals
  const closeModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
    setEmailSent(false);
    setShowAvailabilityManager(false);
    setSelectedRoomForAvailability(null);
    setPaymentSuccess(false);
    setBookingStep(1);
  };

  // Handle input change for booking form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle login form input change
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle hotel registration form change
  const handleHotelRegisterChange = (e) => {
    const { name, value } = e.target;
    setHotelRegisterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle hotel form input change
  const handleHotelFormChange = (e) => {
    const { name, value } = e.target;
    setFormErrors(prev => ({ ...prev, [name]: '' }));
    setHotelForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle hotel contact change
  const handleHotelContactChange = (field, value) => {
    setFormErrors(prev => ({ ...prev, [field]: '' }));
    setHotelForm(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  // Handle hotel policy change
  const handleHotelPolicyChange = (field, value) => {
    setFormErrors(prev => ({ ...prev, [field]: '' }));
    setHotelForm(prev => ({
      ...prev,
      policies: {
        ...prev.policies,
        [field]: value
      }
    }));
  };

  // Handle amenities selection
  const handleAmenityToggle = (amenity) => {
    setFormErrors(prev => ({ ...prev, amenities: '' }));
    setHotelForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Handle room form changes
  const handleRoomChange = (index, field, value) => {
    setFormErrors(prev => ({ ...prev, [`room_${index}_${field}`]: '' }));
    const updatedRooms = [...hotelForm.rooms];
    updatedRooms[index][field] = value;
    setHotelForm(prev => ({
      ...prev,
      rooms: updatedRooms
    }));
  };

  // Handle room availability data update
  const handleRoomAvailabilityUpdate = (roomIndex, availabilityData) => {
    const updatedRooms = [...hotelForm.rooms];
    updatedRooms[roomIndex].availabilityData = availabilityData;
    setHotelForm(prev => ({
      ...prev,
      rooms: updatedRooms
    }));
  };

  // Handle room amenity toggle
  const handleRoomAmenityToggle = (roomIndex, amenity) => {
    const updatedRooms = [...hotelForm.rooms];
    const roomAmenities = updatedRooms[roomIndex].amenities;
    
    if (roomAmenities.includes(amenity)) {
      updatedRooms[roomIndex].amenities = roomAmenities.filter(a => a !== amenity);
    } else {
      updatedRooms[roomIndex].amenities = [...roomAmenities, amenity];
    }
    
    setHotelForm(prev => ({
      ...prev,
      rooms: updatedRooms
    }));
  };

  // Add new room
  const addNewRoom = () => {
    setHotelForm(prev => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        {
          id: Date.now() + Math.random(),
          type: 'Standard Room',
          price: 0,
          size: '',
          beds: '',
          amenities: [],
          maxOccupancy: 2,
          availability: true,
          totalRooms: 10,
          availabilityData: {},
          images: ['']
        }
      ]
    }));
  };

  // Remove room
  const removeRoom = (index) => {
    if (hotelForm.rooms.length > 1) {
      const updatedRooms = [...hotelForm.rooms];
      updatedRooms.splice(index, 1);
      setHotelForm(prev => ({
        ...prev,
        rooms: updatedRooms
      }));
    }
  };

  // Add new nearby attraction
  const addNearbyAttraction = () => {
    setHotelForm(prev => ({
      ...prev,
      nearbyAttractions: [...prev.nearbyAttractions, '']
    }));
  };

  // Handle nearby attraction change
  const handleNearbyAttractionChange = (index, value) => {
    const updatedAttractions = [...hotelForm.nearbyAttractions];
    updatedAttractions[index] = value;
    setHotelForm(prev => ({
      ...prev,
      nearbyAttractions: updatedAttractions
    }));
  };

  // Remove nearby attraction
  const removeNearbyAttraction = (index) => {
    if (hotelForm.nearbyAttractions.length > 1) {
      const updatedAttractions = [...hotelForm.nearbyAttractions];
      updatedAttractions.splice(index, 1);
      setHotelForm(prev => ({
        ...prev,
        nearbyAttractions: updatedAttractions
      }));
    }
  };

  // Add new special feature
  const addSpecialFeature = () => {
    setHotelForm(prev => ({
      ...prev,
      specialFeatures: [...prev.specialFeatures, '']
    }));
  };

  // Handle special feature change
  const handleSpecialFeatureChange = (index, value) => {
    const updatedFeatures = [...hotelForm.specialFeatures];
    updatedFeatures[index] = value;
    setHotelForm(prev => ({
      ...prev,
      specialFeatures: updatedFeatures
    }));
  };

  // Remove special feature
  const removeSpecialFeature = (index) => {
    if (hotelForm.specialFeatures.length > 1) {
      const updatedFeatures = [...hotelForm.specialFeatures];
      updatedFeatures.splice(index, 1);
      setHotelForm(prev => ({
        ...prev,
        specialFeatures: updatedFeatures
      }));
    }
  };

  // Image upload handlers with validation
  const handleImageUpload = (imageData) => {
    setFormErrors(prev => ({ ...prev, image: '' }));
    setHotelForm(prev => ({
      ...prev,
      image: imageData
    }));
  };

  const handleImageRemove = () => {
    setHotelForm(prev => ({
      ...prev,
      image: ''
    }));
  };

  const handleRoomImageUpload = (roomIndex, imageIndex, imageData) => {
    const updatedRooms = [...hotelForm.rooms];
    if (!updatedRooms[roomIndex].images) {
      updatedRooms[roomIndex].images = [''];
    }
    updatedRooms[roomIndex].images[imageIndex] = imageData;
    setHotelForm(prev => ({
      ...prev,
      rooms: updatedRooms
    }));
  };

  const handleRoomImageRemove = (roomIndex, imageIndex) => {
    const updatedRooms = [...hotelForm.rooms];
    if (updatedRooms[roomIndex].images.length > 1) {
      updatedRooms[roomIndex].images.splice(imageIndex, 1);
    } else {
      updatedRooms[roomIndex].images[imageIndex] = '';
    }
    setHotelForm(prev => ({
      ...prev,
      rooms: updatedRooms
    }));
  };

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Check admin login
    if (loginForm.role === 'admin' && 
        loginForm.email === adminUser.email && 
        loginForm.password === adminUser.password) {
      setIsAuthenticated(true);
      setUserRole('admin');
      setCurrentUser(adminUser);
      setShowLoginModal(false);
      
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'admin');
      
      setLoginForm({
        email: '',
        password: '',
        role: 'hotel'
      });
      return;
    }

    // Check hotel login
    const hotelUser = hotelUsers.find(
      u => u.email === loginForm.email && 
           u.password === loginForm.password && 
           loginForm.role === 'hotel'
    );

    if (hotelUser) {
      setIsAuthenticated(true);
      setUserRole('hotel');
      setCurrentUser(hotelUser);
      setShowLoginModal(false);
      
      localStorage.setItem('currentUser', JSON.stringify(hotelUser));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'hotel');
      
      setLoginForm({
        email: '',
        password: '',
        role: 'hotel'
      });
    } else {
      alert('Invalid credentials or role mismatch');
    }
  };

  // Handle hotel registration
  const handleHotelRegister = (e) => {
    e.preventDefault();
    
    if (hotelRegisterForm.password !== hotelRegisterForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    const existingHotel = hotelUsers.find(u => u.email === hotelRegisterForm.email);
    if (existingHotel) {
      alert('Hotel with this email already exists!');
      return;
    }
    
    const newHotelUser = {
      id: Date.now(),
      hotelName: hotelRegisterForm.hotelName,
      ownerName: hotelRegisterForm.ownerName,
      email: hotelRegisterForm.email,
      password: hotelRegisterForm.password,
      role: 'hotel',
      phone: hotelRegisterForm.phone,
      address: hotelRegisterForm.address,
      city: hotelRegisterForm.city,
      pincode: hotelRegisterForm.pincode,
      gstNumber: hotelRegisterForm.gstNumber,
      panNumber: hotelRegisterForm.panNumber,
      hotels: [],
      registrationDate: new Date().toISOString()
    };
    
    setHotelUsers(prev => [...prev, newHotelUser]);
    
    setIsAuthenticated(true);
    setUserRole('hotel');
    setCurrentUser(newHotelUser);
    setShowRegisterModal(false);
    
    localStorage.setItem('currentUser', JSON.stringify(newHotelUser));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', 'hotel');
    
    setHotelRegisterForm({
      hotelName: '',
      ownerName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      city: '',
      pincode: '',
      gstNumber: '',
      panNumber: ''
    });
    
    alert('Hotel registration successful! You can now add your hotel properties.');
  };

  // Submit new hotel property (for hotels) - Goes to pending approval
  const submitNewHotel = (e) => {
    e.preventDefault();
    
    for (let step = 1; step <= formSteps.length; step++) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        alert(`Please fix the errors in ${formSteps[step-1].title} section`);
        return;
      }
    }

    const newHotel = {
      id: Date.now(),
      name: hotelForm.name,
      location: hotelForm.location,
      rating: parseFloat(hotelForm.rating) || 4.0,
      reviews: parseInt(hotelForm.reviews) || 0,
      stars: parseInt(hotelForm.stars) || 4,
      price: parseInt(hotelForm.price) || 0,
      taxes: parseInt(hotelForm.taxes) || 0,
      image: hotelForm.image || "/placeholder-hotel.jpg",
      description: hotelForm.description || "A wonderful hotel with great amenities.",
      amenities: Array.isArray(hotelForm.amenities) ? hotelForm.amenities : [],
      rooms: hotelForm.rooms.map(room => ({
        id: room.id || Date.now() + Math.random(),
        type: room.type || 'Standard Room',
        price: parseInt(room.price) || 0,
        size: room.size || '',
        beds: room.beds || '',
        amenities: Array.isArray(room.amenities) ? room.amenities : [],
        maxOccupancy: parseInt(room.maxOccupancy) || 2,
        availability: room.availability !== false,
        totalRooms: parseInt(room.totalRooms) || 10,
        availabilityData: room.availabilityData || {},
        images: Array.isArray(room.images) ? room.images.filter(img => img && img.trim() !== '') : ['']
      })),
      policies: {
        checkIn: hotelForm.policies?.checkIn || '2:00 PM',
        checkOut: hotelForm.policies?.checkOut || '12:00 PM',
        cancellation: hotelForm.policies?.cancellation || 'Free cancellation up to 72 hours before arrival',
        pets: hotelForm.policies?.pets || 'Not allowed',
        payment: hotelForm.policies?.payment || 'Credit card or cash accepted',
        children: hotelForm.policies?.children || 'Children under 12 stay free with parents'
      },
      nearbyAttractions: Array.isArray(hotelForm.nearbyAttractions) 
        ? hotelForm.nearbyAttractions.filter(attr => attr && attr.trim() !== '')
        : [''],
      specialFeatures: Array.isArray(hotelForm.specialFeatures)
        ? hotelForm.specialFeatures.filter(feature => feature && feature.trim() !== '')
        : [''],
      contact: {
        phone: hotelForm.contact?.phone || '',
        email: hotelForm.contact?.email || ''
      },
      status: 'pending',
      submittedBy: currentUser?.hotelName || 'Unknown Hotel',
      submissionDate: new Date().toISOString(),
      hotelId: currentUser?.id || ''
    };

    setPendingHotels(prev => [...prev, newHotel]);
    
    if (currentUser) {
      const updatedHotelUsers = hotelUsers.map(user => 
        user.id === currentUser.id 
          ? { ...user, hotels: [...user.hotels, newHotel.id] }
          : user
      );
      setHotelUsers(updatedHotelUsers);
      setCurrentUser({ ...currentUser, hotels: [...currentUser.hotels, newHotel.id] });
    }

    setHotelForm({
      name: '',
      location: '',
      rating: 4.5,
      reviews: 0,
      stars: 4,
      price: 0,
      taxes: 0,
      image: '',
      description: '',
      amenities: [],
      rooms: [{
        id: Date.now(),
        type: 'Standard Room',
        price: 0,
        size: '',
        beds: '',
        amenities: [],
        maxOccupancy: 2,
        availability: true,
        totalRooms: 10,
        availabilityData: {},
        images: ['']
      }],
      policies: {
        checkIn: '2:00 PM',
        checkOut: '12:00 PM',
        cancellation: 'Free cancellation up to 72 hours before arrival',
        pets: 'Not allowed',
        payment: 'Credit card or cash accepted',
        children: 'Children under 12 stay free with parents'
      },
      nearbyAttractions: [''],
      specialFeatures: [''],
      contact: {
        phone: '',
        email: ''
      },
      status: 'pending',
      submittedBy: '',
      submissionDate: new Date().toISOString(),
      hotelId: ''
    });

    setCurrentStep(1);
    setFormErrors({});

    setShowHotelForm(false);
    alert('Hotel property submitted successfully! It is now pending admin approval.');
  };

  // Admin approve hotel
  const approveHotel = (hotelId) => {
    const hotelToApprove = pendingHotels.find(hotel => hotel.id === hotelId);
    if (hotelToApprove) {
      setHotels(prev => [...prev, { ...hotelToApprove, status: 'approved' }]);
      setPendingHotels(prev => prev.filter(hotel => hotel.id !== hotelId));
      alert('Hotel approved successfully!');
    }
  };

  // Admin reject hotel
  const rejectHotel = (hotelId) => {
    if (window.confirm('Are you sure you want to reject this hotel submission?')) {
      setPendingHotels(prev => prev.filter(hotel => hotel.id !== hotelId));
      alert('Hotel rejected successfully!');
    }
  };

  // Delete hotel (for admin)
  const deleteHotel = (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      setHotels(prev => prev.filter(hotel => hotel.id !== hotelId));
    }
  };

  // Get hotels managed by current hotel user
  const getCurrentUserHotels = () => {
    if (!currentUser || currentUser.role !== 'hotel') return [];
    return hotels.filter(hotel => hotel.hotelId === currentUser.id);
  };

  // Get pending hotels for current hotel user
  const getCurrentUserPendingHotels = () => {
    if (!currentUser || currentUser.role !== 'hotel') return [];
    return pendingHotels.filter(hotel => hotel.hotelId === currentUser.id);
  };

  // Open availability manager
  const openAvailabilityManager = (hotel, room) => {
    setSelectedHotel(hotel);
    setSelectedRoomForAvailability(room);
    setShowAvailabilityManager(true);
  };

  // Send booking email - UPDATED with proper EmailJS integration
  const sendBookingEmail = async (paymentMethod = 'Cash', paymentId = null) => {
    setLoading(true);
    
    try {
      const templateParams = {
        hotel_name: selectedHotel.name,
        room_type: selectedRoom.type,
        check_in: checkInDate.toLocaleDateString(),
        check_out: checkOutDate.toLocaleDateString(),
        nights: calculateNights(),
        room_price: selectedRoom.price,
        taxes: selectedHotel.taxes,
        total_price: calculateTotal(),
        customer_name: emailForm.name,
        customer_email: emailForm.email,
        customer_phone: emailForm.phone,
        special_requests: emailForm.specialRequests || 'No special requests',
        booking_date: new Date().toLocaleDateString(),
        payment_method: paymentMethod,
        payment_id: paymentId || 'N/A',
        booking_reference: `HOTEL-${Date.now()}`
      };

      console.log('Sending email with params:', templateParams);

      const result = await emailjs.send(
        'service_ov629rm',
        'template_jr1dnto',
        templateParams,
        '37pN2ThzFwwhwk7ai'
      );

      console.log('Email sent successfully:', result);
      setEmailSent(true);
      setLoading(false);
      
      // Reset form after successful submission
      setTimeout(() => {
        setShowModal(false);
        setEmailSent(false);
        setEmailForm({
          name: '',
          email: '',
          phone: '',
          specialRequests: ''
        });
        setPaymentSuccess(false);
        setBookingStep(1);
      }, 3000);
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send booking confirmation. Please try again or contact support.');
      setLoading(false);
    }
  };

  // Razorpay Payment Integration
  const handleRazorpayPayment = async () => {
    if (!emailForm.name || !emailForm.email || !emailForm.phone) {
      alert('Please fill in all required customer details before proceeding to payment.');
      return;
    }

    setPaymentLoading(true);

    try {
      const amount = calculateTotal() * 100;
      const currency = "INR";
      const bookingReference = `HOTEL-${Date.now()}`;
      
      if (!window.Razorpay) {
        throw new Error('Razorpay payment gateway not available');
      }
      
      const options = {
        key: "rzp_test_8O5v6zQ6T6W6X2", // Test key - replace with your live key in production
        amount: amount,
        currency: currency,
        name: "KashmirStays",
        description: `Hotel Booking - ${selectedHotel.name} - ${selectedRoom.type}`,
        image: "https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png",
        handler: async function (response) {
          console.log('Payment successful:', response);
          
          await sendBookingEmail('Razorpay', response.razorpay_payment_id);
          setPaymentSuccess(true);
          setPaymentLoading(false);
        },
        prefill: {
          name: emailForm.name,
          email: emailForm.email,
          contact: emailForm.phone.replace(/\D/g, '')
        },
        notes: {
          hotel: selectedHotel.name,
          room_type: selectedRoom.type,
          booking_reference: bookingReference,
          customer_email: emailForm.email
        },
        theme: {
          color: "#EC4899"
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      
      rzp1.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        let errorMessage = 'Payment failed. Please try again.';
        
        if (response.error && response.error.description) {
          errorMessage = `Payment failed: ${response.error.description}`;
        }
        
        alert(errorMessage);
        setPaymentLoading(false);
      });
      
      rzp1.open();
      
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  // Handle cash payment
  const handleCashPayment = async () => {
    if (!emailForm.name || !emailForm.email || !emailForm.phone) {
      alert('Please fill in all required customer details before confirming booking.');
      return;
    }

    setPaymentLoading(true);
    await sendBookingEmail('Cash');
    setPaymentLoading(false);
  };

  // Handle booking form submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailForm.name || !emailForm.email || !emailForm.phone) {
      alert('Please fill in all required fields: Name, Email, and Phone.');
      return;
    }

    setLoading(true);
    await sendBookingEmail('Cash');
    setLoading(false);
  };

  // Filter hotels based on search query, amenities, and price range
  const filteredHotels = hotels.filter(hotel => {
    if (!hotel || typeof hotel !== 'object') return false;
    
    const matchesSearch = 
      (hotel.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (hotel.location?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesAmenities = selectedAmenities.length === 0 || 
      selectedAmenities.every(amenity => 
        Array.isArray(hotel.amenities) && hotel.amenities.includes(amenity)
      );
    
    const hotelPrice = typeof hotel.price === 'number' ? hotel.price : 0;
    const matchesPrice = hotelPrice >= priceRange[0] && hotelPrice <= priceRange[1];
    
    return matchesSearch && matchesAmenities && matchesPrice;
  });

  // Sort hotels
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    if (sortBy === 'price') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return 0;
  });

  // Lazy loaded hotels
  const displayedHotels = sortedHotels.slice(0, visibleHotels);

  // Load more hotels for lazy loading
  const loadMoreHotels = useCallback(() => {
    if (visibleHotels < sortedHotels.length) {
      setVisibleHotels(prev => Math.min(prev + 6, sortedHotels.length));
    }
  }, [visibleHotels, sortedHotels.length]);

  // Track image load
  const handleImageLoad = useCallback((hotelId) => {
    setImagesLoaded(prev => ({
      ...prev,
      [hotelId]: true
    }));
  }, []);

  // Next image in gallery
  const nextImage = () => {
    if (selectedHotel && selectedHotel.rooms && selectedHotel.rooms[0]?.images && selectedHotel.rooms[0].images.length > currentImageIndex + 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Previous image in gallery
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Switch to register modal
  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  // Switch to login modal
  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: FiPending },
      approved: { color: 'bg-green-100 text-green-800 border-green-200', icon: FiCheckCircle },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: FiAlertCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="mr-1" size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Booking Steps Component
  const BookingSteps = () => (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            bookingStep >= step 
              ? 'bg-rose-600 border-rose-600 text-white' 
              : 'border-gray-300 text-gray-500'
          }`}>
            {bookingStep > step ? <FiCheck size={18} /> : step}
          </div>
          <div className={`ml-2 text-sm font-medium ${
            bookingStep >= step ? 'text-rose-600' : 'text-gray-500'
          }`}>
            {step === 1 && 'Select Dates'}
            {step === 2 && 'Guest Info'}
            {step === 3 && 'Payment'}
          </div>
          {step < 3 && (
            <div className={`mx-4 w-12 h-0.5 ${
              bookingStep > step ? 'bg-rose-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-rose-50 to-white custom-scrollbar"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.header 
        className="bg-white shadow-sm border-b border-rose-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-rose-600 text-white p-2 rounded-lg">
                <FiHome size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">KashmirStays</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-rose-50 px-4 py-2 rounded-full">
                    <div className="bg-rose-100 text-rose-600 p-1.5 rounded-full">
                      {userRole === 'admin' ? <FiSettings size={16} /> : <FiBriefcase size={16} />}
                    </div>
                    <span className="text-rose-700 font-medium">
                      {userRole === 'admin' ? 'Admin' : currentUser?.hotelName}
                    </span>
                    <span className="text-rose-600 text-sm capitalize">({userRole})</span>
                  </div>
                  
                  {userRole === 'hotel' && (
                    <>
                      <motion.button
                        className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        onClick={() => setShowHotelForm(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiPlus size={18} />
                        <span>Add Property</span>
                      </motion.button>
                      
                      <motion.button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        onClick={() => setShowHotelPanel(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiBriefcase size={18} />
                        <span>My Hotels</span>
                      </motion.button>
                    </>
                  )}
                  
                  {userRole === 'admin' && (
                    <motion.button
                      className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      onClick={() => setShowAdminPanel(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiSettings size={18} />
                      <span>Admin Panel</span>
                    </motion.button>
                  )}
                  
                  <motion.button
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiLogOut size={18} />
                    <span>Logout</span>
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <motion.button
                    className="bg-white hover:bg-gray-50 text-rose-600 border border-rose-600 px-6 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
                    onClick={() => setShowRegisterModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiUserPlus size={18} />
                    <span>Hotel Register</span>
                  </motion.button>
                  
                  {/* Login button hidden - Access via direct URL: /hotels-admin */}
                  {/* <motion.button
                    className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow-md"
                    onClick={() => setShowLoginModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiLogIn size={18} />
                    <span>Login</span>
                  </motion.button> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Hero Section */}
      <motion.div 
        className="relative h-96 overflow-hidden bg-gradient-to-r from-rose-600 to-rose-800 flex items-center justify-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-rose-900/70 to-rose-800/60"></div>
        <motion.div 
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">Discover Kashmir's Finest Stays</h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto drop-shadow-md">
            Experience world-class hospitality amidst breathtaking Himalayan landscapes
          </p>
          <motion.div 
            className="bg-white/20 backdrop-blur-sm p-4 rounded-xl inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-center space-x-2 text-white">
              <FiMapPin className="text-rose-200" />
              <span className="font-medium">Srinagar • Gulmarg • Pahalgam • Sonamarg</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 -mt-20 relative z-20">
        {/* Search and Filter Card */}
        <motion.div 
          className="bg-white rounded-xl shadow-xl p-6 mb-8 transform transition-all duration-300 hover:shadow-2xl border border-rose-100"
          variants={itemVariants}
          whileHover={{ y: -5 }}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-rose-400" />
              </div>
              <input
                type="text"
                placeholder="Search hotels by name or location..."
                className="w-full p-3 pl-10 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <motion.button 
              className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              onClick={() => setShowFilters(!showFilters)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiFilter />
              <span>Filters</span>
              <FiChevronDown className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </motion.button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-md mb-4 border border-rose-100"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="font-medium mb-3 text-gray-800 text-lg">Sort By</h3>
                    <select 
                      className="w-full p-3 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none focus:border-transparent shadow-sm"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="price">Price (Low to High)</option>
                      <option value="price-desc">Price (High to Low)</option>
                      <option value="rating">Rating</option>
                      <option value="name">Name</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3 text-gray-800 text-lg">Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Pool', 'Spa', 'Free WiFi', 'Restaurant', 'Parking', 'Fitness Center'].map(amenity => (
                        <motion.label 
                          key={amenity} 
                          className="flex items-center space-x-2"
                          whileHover={{ scale: 1.05 }}
                        >
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-rose-600 rounded focus:ring-rose-500 border-gray-300"
                            checked={selectedAmenities.includes(amenity)}
                            onChange={() => {
                              if (selectedAmenities.includes(amenity)) {
                                setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                              } else {
                                setSelectedAmenities([...selectedAmenities, amenity]);
                              }
                            }}
                          />
                          <span className="text-gray-700">{amenity}</span>
                        </motion.label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3 text-gray-800 text-lg">Price Range (₹)</h3>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full p-3 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none focus:border-transparent shadow-sm"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full p-3 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none focus:border-transparent shadow-sm"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])}
                      />
                    </div>
                    <div className="mt-3">
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-rose-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Header */}
        <motion.div 
          className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center"
          variants={itemVariants}
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {sortedHotels.length} {sortedHotels.length === 1 ? 'Luxury Hotel' : 'Luxury Hotels'} Found
            </h2>
            <p className="text-gray-600">
              {sortedHotels.length > 0 ? 'Handpicked selections for your perfect stay' : 'Try adjusting your filters to find more options'}
            </p>
          </div>
          <motion.div 
            className="mt-4 md:mt-0 bg-rose-100 text-rose-800 px-4 py-2 rounded-full text-sm font-medium"
            whileHover={{ scale: 1.05 }}
          >
            Showing {Math.min(displayedHotels.length, visibleHotels)} of {sortedHotels.length}
          </motion.div>
        </motion.div>

        {/* Hotel Listing with Lazy Loading */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
        >
          <Suspense fallback={<LoadingSpinner />}>
            {displayedHotels.map((hotel, index) => (
              <HotelCard 
                key={hotel.id} 
                hotel={hotel} 
                index={index}
                onImageLoad={handleImageLoad}
                onHotelClick={openHotelDetails}
              />
            ))}
          </Suspense>
        </motion.div>

        {/* Load More Trigger */}
        {visibleHotels < sortedHotels.length && (
          <div ref={loadMoreRef} className="flex justify-center mt-12">
            <motion.button
              className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              onClick={loadMoreHotels}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Load More Hotels</span>
              <FiChevronDown className="animate-bounce" />
            </motion.button>
          </div>
        )}

        {/* Loading More Indicator */}
        {visibleHotels < sortedHotels.length && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600"></div>
          </div>
        )}

        {/* No Results Message */}
        {sortedHotels.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-rose-50 p-8 rounded-2xl border border-rose-100 max-w-md mx-auto">
              <div className="bg-rose-100 text-rose-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiSearch size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No hotels found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters to find more options.</p>
              <motion.button 
                className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-lg transition-colors"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedAmenities([]);
                  setPriceRange([0, 50000]);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset Filters
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Hotel Registration Modal */}
        <AnimatePresence>
          {showRegisterModal && (
            <motion.div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Hotel Registration</h2>
                    <button 
                      onClick={() => setShowRegisterModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleHotelRegister} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hotel Name *
                        </label>
                        <input
                          type="text"
                          name="hotelName"
                          required
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                          value={hotelRegisterForm.hotelName}
                          onChange={handleHotelRegisterChange}
                          placeholder="Your hotel name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Owner Name *
                        </label>
                        <input
                          type="text"
                          name="ownerName"
                          required
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                          value={hotelRegisterForm.ownerName}
                          onChange={handleHotelRegisterChange}
                          placeholder="Owner's full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                          value={hotelRegisterForm.email}
                          onChange={handleHotelRegisterChange}
                          placeholder="hotel@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                          value={hotelRegisterForm.phone}
                          onChange={handleHotelRegisterChange}
                          placeholder="+91 1234567890"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none pr-10 transition-all"
                            value={hotelRegisterForm.password}
                            onChange={handleHotelRegisterChange}
                            placeholder="Create a password"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          required
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                          value={hotelRegisterForm.confirmPassword}
                          onChange={handleHotelRegisterChange}
                          placeholder="Confirm your password"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          required
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                          value={hotelRegisterForm.address}
                          onChange={handleHotelRegisterChange}
                          placeholder="Full hotel address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                          value={hotelRegisterForm.city}
                          onChange={handleHotelRegisterChange}
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          required
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                          value={hotelRegisterForm.pincode}
                          onChange={handleHotelRegisterChange}
                          placeholder="Pincode"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GST Number
                        </label>
                        <input
                          type="text"
                          name="gstNumber"
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                          value={hotelRegisterForm.gstNumber}
                          onChange={handleHotelRegisterChange}
                          placeholder="GSTIN number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PAN Number
                        </label>
                        <input
                          type="text"
                          name="panNumber"
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                          value={hotelRegisterForm.panNumber}
                          onChange={handleHotelRegisterChange}
                          placeholder="PAN number"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white py-3.5 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center mt-6"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiBriefcase className="mr-2" size={18} />
                      <span>Register Hotel Account</span>
                    </motion.button>
 {/* This is done by ms in order to remove the direct login button from hotel reg. form not the direct login button that is differnet... */}
                    {/* <div className="mt-4 text-center">
                      <p className="text-gray-600">
                        Already have an account?{' '}
                        <button
                          type="button"
                          className="text-rose-600 hover:text-rose-700 font-medium transition-colors"
                          onClick={switchToLogin}
                        >
                          Login here
                        </button>
                      </p>
                    </div> */}
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Modal */}
        <AnimatePresence>
          {showLoginModal && (
            <motion.div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Login to KashmirStays</h2>
                    <button 
                      onClick={() => setShowLoginModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                        value={loginForm.email}
                        onChange={handleLoginChange}
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          required
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none pr-10 transition-all"
                          value={loginForm.password}
                          onChange={handleLoginChange}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Login As</label>
                      <select
                        name="role"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
                        value={loginForm.role}
                        onChange={handleLoginChange}
                      >
                        <option value="hotel">Hotel</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <motion.button
                      type="submit"
                      className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white py-3.5 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center mt-4"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiLogIn className="mr-2" size={18} />
                      <span>Login to Account</span>
                    </motion.button>

                    <div className="mt-4 text-center">
                      <p className="text-gray-600">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          className="text-rose-600 hover:text-rose-700 font-medium transition-colors"
                          onClick={switchToRegister}
                        >
                          Register your hotel
                        </button>
                      </p>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hotel Property Submission Form */}
        <AnimatePresence>
          {showHotelForm && (
            <motion.div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-auto shadow-2xl"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Add New Hotel Property</h2>
                      <p className="text-gray-600 mt-2">Fill in the details to list your property on KashmirStays (Pending Admin Approval)</p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowHotelForm(false);
                        setCurrentStep(1);
                        setFormErrors({});
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Step {currentStep} of {formSteps.length}: {formSteps[currentStep-1].title}
                      </h3>
                      <span className="text-rose-600 font-bold">{calculateCompletion()}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div 
                        className="bg-gradient-to-r from-rose-500 to-pink-500 h-3 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: `${calculateCompletion()}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Form Steps Navigation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {formSteps.map((step) => (
                      <FormStep
                        key={step.number}
                        number={step.number}
                        title={step.title}
                        description={step.description}
                        isActive={currentStep === step.number}
                        isCompleted={currentStep > step.number}
                        onClick={() => handleStepClick(step.number)}
                      />
                    ))}
                  </div>

                  <form onSubmit={submitNewHotel} className="space-y-8">
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                      <motion.div 
                        className="bg-gradient-to-r from-rose-50 to-pink-50 p-8 rounded-2xl border border-rose-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex items-center space-x-3 mb-8">
                          <div className="bg-rose-100 text-rose-600 p-3 rounded-xl">
                            <FiHome size={28} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800">Basic Information</h3>
                            <p className="text-gray-600">Essential details about your property</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <EnhancedInput
                              label="Hotel Name"
                              value={hotelForm.name}
                              onChange={handleHotelFormChange}
                              name="name"
                              placeholder="Enter your hotel name"
                              required
                              icon={FiAward}
                              error={formErrors.name}
                              description="The official name of your hotel property"
                            />

                            <EnhancedInput
                              label="Location"
                              value={hotelForm.location}
                              onChange={handleHotelFormChange}
                              name="location"
                              placeholder="Full address with city and state"
                              required
                              icon={FiMapPin}
                              error={formErrors.location}
                              description="Complete address for easy guest navigation"
                            />

                            <div className="grid grid-cols-2 gap-6">
                              <EnhancedInput
                                label="Star Rating"
                                type="number"
                                value={hotelForm.stars}
                                onChange={handleHotelFormChange}
                                name="stars"
                                placeholder="4"
                                min="3"
                                max="5"
                                required
                                icon={FiStar}
                                error={formErrors.stars}
                                description="Hotel classification (3-5 stars)"
                              />

                              <EnhancedInput
                                label="Guest Rating"
                                type="number"
                                step="0.1"
                                value={hotelForm.rating}
                                onChange={handleHotelFormChange}
                                name="rating"
                                placeholder="4.5"
                                min="0"
                                max="5"
                                icon={FiTrendingUp}
                                description="Average guest rating out of 5"
                              />
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                              <EnhancedInput
                                label="Starting Price (₹)"
                                type="number"
                                value={hotelForm.price}
                                onChange={handleHotelFormChange}
                                name="price"
                                placeholder="5000"
                                required
                                icon={FiDollarSign}
                                error={formErrors.price}
                                description="Starting price per night"
                              />

                              <EnhancedInput
                                label="Taxes & Fees (₹)"
                                type="number"
                                value={hotelForm.taxes}
                                onChange={handleHotelFormChange}
                                name="taxes"
                                placeholder="500"
                                icon={FiCreditCard}
                                description="Additional taxes and fees"
                              />
                            </div>
                          </div>

                          <div className="space-y-6">
                            <ImageUploadWithPreview
                              image={hotelForm.image}
                              onImageChange={handleImageUpload}
                              onImageRemove={handleImageRemove}
                              title="Hotel Main Image"
                              description="Upload a high-quality image that represents your hotel (Min 150x150px, Max 100KB)"
                              required
                              aspectRatio="16/9"
                            />

                            <EnhancedTextarea
                              label="Hotel Description"
                              value={hotelForm.description}
                              onChange={handleHotelFormChange}
                              name="description"
                              placeholder="Describe your hotel's unique features, ambiance, services, and what makes it special..."
                              rows={8}
                              required
                              error={formErrors.description}
                              description="Detailed description highlighting key features and experiences"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Amenities & Facilities */}
                    {currentStep === 2 && (
                      <motion.div 
                        className="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 rounded-2xl border border-blue-100"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex items-center space-x-3 mb-8">
                          <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                            <FiStar size={28} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800">Amenities & Facilities</h3>
                            <p className="text-gray-600">Select amenities available at your property</p>
                          </div>
                        </div>

                        {formErrors.amenities && (
                          <motion.div 
                            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="flex items-center space-x-2 text-red-700">
                              <FiAlertCircle size={20} />
                              <span className="font-medium">{formErrors.amenities}</span>
                            </div>
                          </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {availableAmenities.map(amenity => (
                            <motion.label 
                              key={amenity} 
                              className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                hotelForm.amenities.includes(amenity)
                                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <input
                                type="checkbox"
                                className="hidden"
                                checked={hotelForm.amenities.includes(amenity)}
                                onChange={() => handleAmenityToggle(amenity)}
                              />
                              <div className={`flex items-center space-x-3 ${
                                hotelForm.amenities.includes(amenity) ? 'text-white' : 'text-blue-500'
                              }`}>
                                {amenityIcons[amenity] || <FiCheck size={20} />}
                                <span className="font-medium">{amenity}</span>
                              </div>
                            </motion.label>
                          ))}
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="flex items-center space-x-2 text-blue-700">
                            <FiInfo size={18} />
                            <span className="font-medium">Selected {hotelForm.amenities.length} amenities</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Room Configuration */}
                    {currentStep === 3 && (
                      <motion.div 
                        className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center space-x-3">
                            <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                              <FiUser size={28} />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-800">Room Management</h3>
                              <p className="text-gray-600">Add and configure room types</p>
                            </div>
                          </div>
                          <motion.button
                            type="button"
                            onClick={addNewRoom}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors shadow-lg hover:shadow-xl"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FiPlus size={20} />
                            <span>Add Room Type</span>
                          </motion.button>
                        </div>

                        {hotelForm.rooms.map((room, roomIndex) => (
                          <motion.div 
                            key={room.id} 
                            className="bg-white p-8 rounded-2xl border-2 border-green-200 mb-8 last:mb-0 shadow-lg"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: roomIndex * 0.1 }}
                          >
                            <div className="flex justify-between items-center mb-6">
                              <h4 className="font-bold text-gray-800 text-xl">Room Type {roomIndex + 1}</h4>
                              {hotelForm.rooms.length > 1 && (
                                <motion.button
                                  type="button"
                                  onClick={() => removeRoom(roomIndex)}
                                  className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-2 transition-colors bg-red-50 px-4 py-2 rounded-lg"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <FiTrash2 size={16} />
                                  <span>Remove Room</span>
                                </motion.button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              <div className="space-y-6">
                                <EnhancedInput
                                  label="Room Type Name"
                                  value={room.type}
                                  onChange={(e) => handleRoomChange(roomIndex, 'type', e.target.value)}
                                  placeholder="e.g., Deluxe Room, Executive Suite"
                                  required
                                  icon={FiFeather}
                                  error={formErrors[`room_${roomIndex}_type`]}
                                  description="Name that describes this room type"
                                />

                                <div className="grid grid-cols-2 gap-6">
                                  <EnhancedInput
                                    label="Price per Night (₹)"
                                    type="number"
                                    value={room.price}
                                    onChange={(e) => handleRoomChange(roomIndex, 'price', e.target.value)}
                                    placeholder="5000"
                                    required
                                    icon={FiDollarSign}
                                    error={formErrors[`room_${roomIndex}_price`]}
                                  />

                                  <EnhancedInput
                                    label="Max Occupancy"
                                    type="number"
                                    value={room.maxOccupancy}
                                    onChange={(e) => handleRoomChange(roomIndex, 'maxOccupancy', e.target.value)}
                                    placeholder="2"
                                    required
                                    icon={FiUsers}
                                    error={formErrors[`room_${roomIndex}_occupancy`]}
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                  <EnhancedInput
                                    label="Room Size"
                                    value={room.size}
                                    onChange={(e) => handleRoomChange(roomIndex, 'size', e.target.value)}
                                    placeholder="300 sq ft"
                                    icon={FiHome}
                                  />

                                  <EnhancedInput
                                    label="Bed Configuration"
                                    value={room.beds}
                                    onChange={(e) => handleRoomChange(roomIndex, 'beds', e.target.value)}
                                    placeholder="1 King Bed"
                                    icon={FiUser}
                                  />
                                </div>

                                <EnhancedInput
                                  label="Total Rooms Available"
                                  type="number"
                                  value={room.totalRooms}
                                  onChange={(e) => handleRoomChange(roomIndex, 'totalRooms', e.target.value)}
                                  placeholder="10"
                                  required
                                  icon={FiHome}
                                  error={formErrors[`room_${roomIndex}_totalRooms`]}
                                  description="Total number of rooms of this type in your hotel"
                                />

                                <div>
                                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                                    Room Amenities
                                  </label>
                                  <div className="grid grid-cols-2 gap-3">
                                    {availableAmenities.slice(0, 12).map(amenity => (
                                      <label key={amenity} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 cursor-pointer transition-colors">
                                        <input
                                          type="checkbox"
                                          className="h-4 w-4 text-green-600 rounded focus:ring-green-500"
                                          checked={room.amenities.includes(amenity)}
                                          onChange={() => handleRoomAmenityToggle(roomIndex, amenity)}
                                        />
                                        <span className="text-gray-700 text-sm">{amenity}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-6">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                                    Room Availability
                                  </label>
                                  <select
                                    className="w-full p-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    value={room.availability}
                                    onChange={(e) => handleRoomChange(roomIndex, 'availability', e.target.value === 'true')}
                                  >
                                    <option value={true}>Available for Booking</option>
                                    <option value={false}>Temporarily Unavailable</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                                    Room Images
                                  </label>
                                  <div className="space-y-4">
                                    {room.images.map((image, imageIndex) => (
                                      <ImageUploadWithPreview
                                        key={imageIndex}
                                        image={image}
                                        onImageChange={(imageData) => handleRoomImageUpload(roomIndex, imageIndex, imageData)}
                                        onImageRemove={() => handleRoomImageRemove(roomIndex, imageIndex)}
                                        title={`Room Image ${imageIndex + 1}`}
                                        description="Upload room interior photos (Min 150x150px, Max 100KB)"
                                        aspectRatio="4/3"
                                      />
                                    ))}
                                    <motion.button
                                      type="button"
                                      onClick={() => {
                                        const updatedImages = [...room.images, ''];
                                        handleRoomChange(roomIndex, 'images', updatedImages);
                                      }}
                                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:text-green-600 hover:border-green-400 transition-all duration-300 flex items-center justify-center space-x-2"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <FiPlus size={20} />
                                      <span>Add Another Room Image</span>
                                    </motion.button>
                                  </div>
                                </div>

                                {/* Availability Calendar Integration */}
                                <div>
                                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                                    Room Availability Calendar
                                  </label>
                                  <AvailabilityCalendar
                                    room={room}
                                    onAvailabilityUpdate={(availabilityData) => handleRoomAvailabilityUpdate(roomIndex, availabilityData)}
                                    isEditable={true}
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                  

                    {/* Step 4: Policies & Contact */}
                    {currentStep === 4 && (
                      <motion.div 
                        className="bg-gradient-to-r from-purple-50 to-violet-50 p-8 rounded-2xl border border-purple-100"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex items-center space-x-3 mb-8">
                          <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                            <FiCreditCard size={28} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800">Policies & Contact</h3>
                            <p className="text-gray-600">Set hotel policies and contact information</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <h4 className="text-lg font-bold text-gray-800 mb-4">Contact Information</h4>
                            
                            <EnhancedInput
                              label="Contact Phone"
                              value={hotelForm.contact.phone}
                              onChange={(e) => handleHotelContactChange('phone', e.target.value)}
                              placeholder="+91 1234567890"
                              required
                              icon={FiPhone}
                              error={formErrors.phone}
                              description="Primary contact number for guests"
                            />

                            <EnhancedInput
                              label="Contact Email"
                              type="email"
                              value={hotelForm.contact.email}
                              onChange={(e) => handleHotelContactChange('email', e.target.value)}
                              placeholder="contact@hotel.com"
                              required
                              icon={FiMail}
                              error={formErrors.email}
                              description="Official email address for inquiries"
                            />
                          </div>

                          <div className="space-y-6">
                            <h4 className="text-lg font-bold text-gray-800 mb-4">Hotel Policies</h4>

                            <EnhancedInput
                              label="Check-in Time"
                              value={hotelForm.policies.checkIn}
                              onChange={(e) => handleHotelPolicyChange('checkIn', e.target.value)}
                              placeholder="2:00 PM"
                              required
                              icon={FiClock}
                              error={formErrors.checkIn}
                              description="Standard check-in time"
                            />

                            <EnhancedInput
                              label="Check-out Time"
                              value={hotelForm.policies.checkOut}
                              onChange={(e) => handleHotelPolicyChange('checkOut', e.target.value)}
                              placeholder="12:00 PM"
                              required
                              icon={FiClock}
                              error={formErrors.checkOut}
                              description="Standard check-out time"
                            />

                            <EnhancedInput
                              label="Pet Policy"
                              value={hotelForm.policies.pets}
                              onChange={(e) => handleHotelPolicyChange('pets', e.target.value)}
                              placeholder="Pets not allowed"
                              icon={FiUser}
                              description="Policy regarding pets"
                            />

                            <EnhancedTextarea
                              label="Cancellation Policy"
                              value={hotelForm.policies.cancellation}
                              onChange={(e) => handleHotelPolicyChange('cancellation', e.target.value)}
                              placeholder="Free cancellation up to 72 hours before arrival..."
                              rows={3}
                              description="Clear cancellation policy for guests"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 5: Additional Details */}
                    {currentStep === 5 && (
                      <motion.div 
                        className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex items-center space-x-3 mb-8">
                          <div className="bg-amber-100 text-amber-600 p-3 rounded-xl">
                            <FiMap size={28} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800">Additional Information</h3>
                            <p className="text-gray-600">Nearby attractions and special features</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-bold text-gray-800">Nearby Attractions</h4>
                              <motion.button
                                type="button"
                                onClick={addNearbyAttraction}
                                className="text-amber-600 hover:text-amber-700 text-sm flex items-center space-x-2 transition-colors bg-amber-50 px-4 py-2 rounded-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FiPlus size={16} />
                                <span>Add Attraction</span>
                              </motion.button>
                            </div>

                            <div className="space-y-4">
                              {hotelForm.nearbyAttractions.map((attraction, index) => (
                                <div key={index} className="flex space-x-3 items-start">
                                  <EnhancedInput
                                    value={attraction}
                                    onChange={(e) => handleNearbyAttractionChange(index, e.target.value)}
                                    placeholder="e.g., Dal Lake (2 km away)"
                                    icon={FiNavigation}
                                  />
                                  {hotelForm.nearbyAttractions.length > 1 && (
                                    <motion.button
                                      type="button"
                                      onClick={() => removeNearbyAttraction(index)}
                                      className="mt-2 px-3 text-red-600 hover:text-red-700 transition-colors"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <FiTrash2 size={18} />
                                    </motion.button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-bold text-gray-800">Special Features</h4>
                              <motion.button
                                type="button"
                                onClick={addSpecialFeature}
                                className="text-amber-600 hover:text-amber-700 text-sm flex items-center space-x-2 transition-colors bg-amber-50 px-4 py-2 rounded-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FiPlus size={16} />
                                <span>Add Feature</span>
                              </motion.button>
                            </div>

                            <div className="space-y-4">
                              {hotelForm.specialFeatures.map((feature, index) => (
                                <div key={index} className="flex space-x-3 items-start">
                                  <EnhancedInput
                                    value={feature}
                                    onChange={(e) => handleSpecialFeatureChange(index, e.target.value)}
                                    placeholder="e.g., Traditional Kashmiri Cuisine"
                                    icon={FiAward}
                                  />
                                  {hotelForm.specialFeatures.length > 1 && (
                                    <motion.button
                                      type="button"
                                      onClick={() => removeSpecialFeature(index)}
                                      className="mt-2 px-3 text-red-600 hover:text-red-700 transition-colors"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <FiTrash2 size={18} />
                                    </motion.button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    <motion.div
                      className="flex justify-between items-center pt-8 border-t border-gray-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.button
                        type="button"
                        onClick={handlePrevStep}
                        disabled={currentStep === 1}
                        className={`px-8 py-4 rounded-xl flex items-center space-x-2 transition-all ${
                          currentStep === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-500 text-white hover:bg-gray-600 shadow-lg hover:shadow-xl'
                        }`}
                        whileHover={currentStep !== 1 ? { scale: 1.05 } : {}}
                        whileTap={currentStep !== 1 ? { scale: 0.95 } : {}}
                      >
                        <FiChevronLeft size={20} />
                        <span>Previous</span>
                      </motion.button>

                      {currentStep < formSteps.length ? (
                        <motion.button
                          type="button"
                          onClick={handleNextStep}
                          className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>Next Step</span>
                          <FiChevronRight size={20} />
                        </motion.button>
                      ) : (
                        <motion.button
                          type="submit"
                          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiSave size={20} />
                          <span>Submit for Approval</span>
                        </motion.button>
                      )}
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hotel Management Panel */}
        <AnimatePresence>
          {showHotelPanel && (
            <motion.div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-auto shadow-2xl"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Hotel Management Panel</h2>
                      <p className="text-gray-600">Manage your hotel properties and view performance</p>
                    </div>
                    <button 
                      onClick={() => setShowHotelPanel(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Approved Hotels</p>
                          <p className="text-2xl font-bold text-gray-800">{getCurrentUserHotels().length}</p>
                        </div>
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                          <FiCheckCircle size={24} />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-amber-600 text-sm font-medium">Pending Approval</p>
                          <p className="text-2xl font-bold text-gray-800">{getCurrentUserPendingHotels().length}</p>
                        </div>
                        <div className="bg-amber-100 text-amber-600 p-3 rounded-full">
                          <FiPending size={24} />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 text-sm font-medium">Total Revenue</p>
                          <p className="text-2xl font-bold text-gray-800">
                            ₹{getCurrentUserHotels().reduce((sum, hotel) => sum + hotel.price, 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-green-100 text-green-600 p-3 rounded-full">
                          <FiDollar size={24} />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Approved Hotels */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FiCheckCircle className="mr-2 text-green-500" />
                      Approved Hotels ({getCurrentUserHotels().length})
                    </h3>
                    
                    {getCurrentUserHotels().length === 0 ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                        <FiPackage className="mx-auto text-green-500 mb-2" size={32} />
                        <p className="text-green-800">No approved hotels yet</p>
                        <p className="text-green-600 text-sm mt-1">Submit your first hotel property to get started</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {getCurrentUserHotels().map(hotel => (
                          <motion.div 
                            key={hotel.id}
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                            whileHover={{ y: -5 }}
                          >
                            <div className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="font-bold text-xl text-gray-800">{hotel.name}</h4>
                                  <p className="text-gray-600 mt-1">{hotel.location}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-rose-600 font-bold text-xl">₹{hotel.price.toLocaleString()}</p>
                                  <StatusBadge status={hotel.status} />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {hotel.rooms.map(room => (
                                  <div key={room.id} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-3">
                                      <h5 className="font-semibold text-gray-800">{room.type}</h5>
                                      <span className="text-rose-600 font-bold">₹{room.price.toLocaleString()}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                      <div>Total Rooms: {room.totalRooms}</div>
                                      <div>Max Occupancy: {room.maxOccupancy}</div>
                                    </div>
                                    <motion.button
                                      onClick={() => openAvailabilityManager(hotel, room)}
                                      className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <FiCalendar size={16} />
                                      <span>Manage Availability</span>
                                    </motion.button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pending Hotels */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FiPending className="mr-2 text-yellow-500" />
                      Pending Approval ({getCurrentUserPendingHotels().length})
                    </h3>
                    
                    {getCurrentUserPendingHotels().length === 0 ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <FiCheckCircle className="mx-auto text-yellow-500 mb-2" size={32} />
                        <p className="text-yellow-800">No pending approvals</p>
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 font-medium text-gray-700">
                          <div>Hotel Name</div>
                          <div>Location</div>
                          <div>Status</div>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {getCurrentUserPendingHotels().map(hotel => (
                            <div key={hotel.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 items-center">
                              <div className="font-medium">{hotel.name}</div>
                              <div className="text-gray-600">{hotel.location}</div>
                              <div>
                                <StatusBadge status={hotel.status} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-center bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">
                      Need help? Contact support at support@kashmirstays.com
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Availability Manager Modal */}
        <AnimatePresence>
          {showAvailabilityManager && selectedHotel && selectedRoomForAvailability && (
            <motion.div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-auto shadow-2xl"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Availability Manager</h2>
                      <p className="text-gray-600">
                        Manage room availability for {selectedRoomForAvailability.type} at {selectedHotel.name}
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowAvailabilityManager(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Room Summary */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Room Type</p>
                          <p className="text-lg font-semibold text-gray-800">{selectedRoomForAvailability.type}</p>
                        </div>
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Total Rooms</p>
                          <p className="text-lg font-semibold text-gray-800">{selectedRoomForAvailability.totalRooms}</p>
                        </div>
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Base Price</p>
                          <p className="text-lg font-semibold text-gray-800">₹{selectedRoomForAvailability.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-blue-600 text-sm font-medium">Max Occupancy</p>
                          <p className="text-lg font-semibold text-gray-800">{selectedRoomForAvailability.maxOccupancy}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bulk Availability Editor */}
                    <BulkAvailabilityEditor
                      room={selectedRoomForAvailability}
                      onBulkUpdate={(updates) => {
                        handleBulkRoomUpdate(selectedHotel.id, selectedRoomForAvailability.id, updates);
                      }}
                    />

                    {/* Calendar */}
                    <AvailabilityCalendar
                      room={selectedRoomForAvailability}
                      onAvailabilityUpdate={(availabilityData) => {
                        updateHotelRoomAvailability(selectedHotel.id, selectedRoomForAvailability.id, availabilityData);
                      }}
                      isEditable={true}
                    />

                    {/* Quick Actions */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.button
                          onClick={() => {
                            const today = new Date();
                            const updates = {};
                            for (let i = 0; i < 30; i++) {
                              const date = new Date(today);
                              date.setDate(today.getDate() + i);
                              const dateString = date.toISOString().split('T')[0];
                              updates[dateString] = {
                                totalRooms: selectedRoomForAvailability.totalRooms,
                                bookedRooms: 0,
                                price: selectedRoomForAvailability.price,
                                available: true
                              };
                            }
                            handleBulkRoomUpdate(selectedHotel.id, selectedRoomForAvailability.id, updates);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiCheckCircle size={18} />
                          <span>Open Next 30 Days</span>
                        </motion.button>

                        <motion.button
                          onClick={() => {
                            const today = new Date();
                            const updates = {};
                            for (let i = 0; i < 7; i++) {
                              const date = new Date(today);
                              date.setDate(today.getDate() + i);
                              const dateString = date.toISOString().split('T')[0];
                              updates[dateString] = {
                                totalRooms: selectedRoomForAvailability.totalRooms,
                                bookedRooms: selectedRoomForAvailability.totalRooms,
                                price: selectedRoomForAvailability.price,
                                available: false
                              };
                            }
                            handleBulkRoomUpdate(selectedHotel.id, selectedRoomForAvailability.id, updates);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiX size={18} />
                          <span>Close Next 7 Days</span>
                        </motion.button>

                        <motion.button
                          onClick={() => {
                            const today = new Date();
                            const updates = {};
                            for (let i = 0; i < 14; i++) {
                              const date = new Date(today);
                              date.setDate(today.getDate() + i);
                              const dateString = date.toISOString().split('T')[0];
                              updates[dateString] = {
                                totalRooms: selectedRoomForAvailability.totalRooms,
                                bookedRooms: 0,
                                price: Math.round(selectedRoomForAvailability.price * 1.2),
                                available: true
                              };
                            }
                            handleBulkRoomUpdate(selectedHotel.id, selectedRoomForAvailability.id, updates);
                          }}
                          className="bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiTrendingUp size={18} />
                          <span>+20% Price Next 14 Days</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Panel Modal */}
        <AnimatePresence>
          {showAdminPanel && (
            <motion.div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-auto shadow-2xl"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
                    <button 
                      onClick={() => setShowAdminPanel(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  {/* Data Management Tools */}
                  <div className="flex space-x-4 mb-6">
                    <motion.button
                      onClick={exportHotelData}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiDownload size={16} />
                      <span>Export Data</span>
                    </motion.button>
                    
                    <label className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer">
                      <FiUploadCloud size={16} />
                      <span>Import Data</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={importHotelData}
                        className="hidden"
                      />
                    </label>
                    
                    <motion.button
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiTrash2 size={16} />
                      <span>Clear Data</span>
                    </motion.button>
                  </div>

                  {/* Pending Hotels Section */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FiPending className="mr-2 text-yellow-500" />
                      Pending Hotel Approvals ({pendingHotels.length})
                    </h3>
                    
                    {pendingHotels.length === 0 ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <FiCheckCircle className="mx-auto text-yellow-500 mb-2" size={32} />
                        <p className="text-yellow-800">No pending hotel submissions</p>
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-medium text-gray-700">
                          <div className="col-span-3">Hotel Name</div>
                          <div className="col-span-3">Location</div>
                          <div className="col-span-2">Submitted By</div>
                          <div className="col-span-2">Date</div>
                          <div className="col-span-2">Actions</div>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {pendingHotels.map(hotel => (
                            <div key={hotel.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                              <div className="col-span-3 font-medium">{hotel.name}</div>
                              <div className="col-span-3 text-gray-600">{hotel.location}</div>
                              <div className="col-span-2 text-gray-600">{hotel.submittedBy}</div>
                              <div className="col-span-2 text-gray-600 text-sm">
                                {new Date(hotel.submissionDate).toLocaleDateString()}
                              </div>
                              <div className="col-span-2 flex space-x-2">
                                <motion.button
                                  onClick={() => approveHotel(hotel.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center space-x-2 text-sm"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <FiCheckCircle size={14} />
                                  <span>Approve</span>
                                </motion.button>
                                <motion.button
                                  onClick={() => rejectHotel(hotel.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg flex items-center space-x-2 text-sm"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <FiX size={14} />
                                  <span>Reject</span>
                                </motion.button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Approved Hotels Section */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FiCheckCircle className="mr-2 text-green-500" />
                      Approved Hotels ({hotels.length})
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-medium text-gray-700">
                        <div className="col-span-3">Hotel Name</div>
                        <div className="col-span-3">Location</div>
                        <div className="col-span-2">Price</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Actions</div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {hotels.map(hotel => (
                          <div key={hotel.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                            <div className="col-span-3 font-medium">{hotel.name}</div>
                            <div className="col-span-3 text-gray-600">{hotel.location}</div>
                            <div className="col-span-2 text-rose-600 font-semibold">₹{hotel.price.toLocaleString()}</div>
                            <div className="col-span-2">
                              <StatusBadge status={hotel.status} />
                            </div>
                            <div className="col-span-2">
                              <motion.button
                                onClick={() => deleteHotel(hotel.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg flex items-center space-x-2 text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FiTrash2 size={14} />
                                <span>Delete</span>
                              </motion.button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hotel Users Section */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FiUsers className="mr-2 text-blue-500" />
                      Registered Hotels ({hotelUsers.length})
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-medium text-gray-700">
                        <div className="col-span-3">Hotel Name</div>
                        <div className="col-span-3">Owner</div>
                        <div className="col-span-3">Email</div>
                        <div className="col-span-3">Properties</div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {hotelUsers.map(user => (
                          <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                            <div className="col-span-3 font-medium">{user.hotelName}</div>
                            <div className="col-span-3 text-gray-600">{user.ownerName}</div>
                            <div className="col-span-3 text-gray-600">{user.email}</div>
                            <div className="col-span-3 text-gray-600">
                              {user.hotels.length} properties
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-center bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">
                      Total Approved Hotels: {hotels.length} | Pending Approvals: {pendingHotels.length} | Registered Hotels: {hotelUsers.length}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hotel Details Modal with Enhanced Booking */}
        <AnimatePresence>
          {showModal && selectedHotel && (
            <motion.div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-auto shadow-2xl relative"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.button 
                  onClick={closeModal} 
                  className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX size={24} />
                </motion.button>
                
                <div className="p-8">
                  {/* Hotel Header */}
                  <div className="flex flex-col lg:flex-row gap-8 mb-8">
                    <div className="lg:w-1/2">
                      <div className="relative h-80 rounded-2xl overflow-hidden">
                        <LazyImage 
                          src={selectedHotel.image} 
                          alt={selectedHotel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex items-center shadow-sm">
                          <FiStar className="text-amber-400 fill-current mr-1" />
                          <span className="font-medium">{selectedHotel.rating}</span>
                        </div>
                        <div className="absolute bottom-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                          {selectedHotel.stars} Star Luxury
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:w-1/2">
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedHotel.name}</h1>
                      <div className="flex items-center text-gray-600 mb-4">
                        <FiMapPin className="mr-2 text-rose-500" />
                        <span>{selectedHotel.location}</span>
                      </div>
                      
                      <p className="text-gray-700 mb-6">{selectedHotel.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-rose-50 p-4 rounded-xl">
                          <div className="text-rose-600 text-sm font-medium">Starting Price</div>
                          <div className="text-2xl font-bold text-gray-800">₹{selectedHotel.price.toLocaleString()}</div>
                          <div className="text-gray-500 text-xs">per night</div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl">
                          <div className="text-blue-600 text-sm font-medium">Taxes & Fees</div>
                          <div className="text-2xl font-bold text-gray-800">₹{selectedHotel.taxes.toLocaleString()}</div>
                          <div className="text-gray-500 text-xs">per night</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedHotel.amenities.slice(0, 6).map(amenity => (
                          <span key={amenity} className="flex items-center bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
                            {amenityIcons[amenity] || <FiCheck className="mr-1" />}
                            {amenity}
                          </span>
                        ))}
                        {selectedHotel.amenities.length > 6 && (
                          <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
                            +{selectedHotel.amenities.length - 6} more
                          </span>
                        )}
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                          onClick={() => {
                            setActiveTab('booking');
                            setSelectedRoom(selectedHotel.rooms[0]);
                            setBookingStep(1);
                          }}
                          className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiCalendar className="text-white" size={24} />
                          <span>Book Now</span>
                        </motion.button>
                        
                        <motion.button
                          onClick={() => {
                            setActiveTab('booking');
                            setSelectedRoom(selectedHotel.rooms[0]);
                            setBookingStep(3); // Skip to payment step
                          }}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiCreditCard className="text-white" size={24} />
                          <span>Pay Now</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200 mb-6">
                    <div className="flex space-x-8">
                      {['details', 'rooms', 'policies', 'location', 'booking'].map(tab => (
                        <button
                          key={tab}
                          onClick={() => {
                            setActiveTab(tab);
                            if (tab === 'booking') {
                              setBookingStep(1);
                            }
                          }}
                          className={`pb-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                            activeTab === tab
                              ? 'border-rose-500 text-rose-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[400px]">
                    {/* Details Tab */}
                    {activeTab === 'details' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-4">Hotel Overview</h3>
                          <p className="text-gray-700 leading-relaxed">{selectedHotel.description}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-4">Amenities & Facilities</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedHotel.amenities.map(amenity => (
                              <div key={amenity} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                {amenityIcons[amenity] || <FiCheck className="text-green-500" />}
                                <span className="text-gray-700">{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Rooms Tab */}
                    {activeTab === 'rooms' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        {selectedHotel.rooms.map(room => (
                          <div key={room.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col lg:flex-row gap-6">
                              <div className="lg:w-1/3">
                                {room.images && room.images[0] && (
                                  <LazyImage 
                                    src={room.images[0]} 
                                    alt={room.type}
                                    className="w-full h-48 object-cover rounded-lg"
                                  />
                                )}
                              </div>
                              
                              <div className="lg:w-2/3">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h4 className="text-xl font-bold text-gray-800">{room.type}</h4>
                                    <p className="text-gray-600 mt-1">{room.size} • {room.beds}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-rose-600">₹{room.price.toLocaleString()}</p>
                                    <p className="text-gray-500 text-sm">per night</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <FiUsers className="mr-2 text-rose-500" />
                                    <span>Max {room.maxOccupancy} guests</span>
                                  </div>
                                  <div className="flex items-center">
                                    <FiHome className="mr-2 text-rose-500" />
                                    <span>{room.totalRooms} rooms available</span>
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {room.amenities.slice(0, 4).map(amenity => (
                                    <span key={amenity} className="bg-rose-50 text-rose-700 px-2 py-1 rounded text-xs">
                                      {amenity}
                                    </span>
                                  ))}
                                  {room.amenities.length > 4 && (
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                      +{room.amenities.length - 4} more
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <motion.button
                                    onClick={() => {
                                      setSelectedRoom(room);
                                      setActiveTab('booking');
                                      setBookingStep(1);
                                    }}
                                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <FiCalendar className="mr-2" />
                                    <span>Book This Room</span>
                                  </motion.button>
                                  
                                  <motion.button
                                    onClick={() => {
                                      setSelectedRoom(room);
                                      setActiveTab('booking');
                                      setBookingStep(3); // Skip to payment
                                    }}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <FiCreditCard className="mr-2" />
                                    <span>Pay Now</span>
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {/* Policies Tab */}
                    {activeTab === 'policies' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-blue-50 p-6 rounded-xl">
                            <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                              <FiClock className="mr-2 text-blue-500" />
                              Check-in & Check-out
                            </h4>
                            <div className="space-y-2 text-gray-700">
                              <div className="flex justify-between">
                                <span>Check-in:</span>
                                <span className="font-medium">{selectedHotel.policies.checkIn}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Check-out:</span>
                                <span className="font-medium">{selectedHotel.policies.checkOut}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-green-50 p-6 rounded-xl">
                            <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                              <FiUser className="mr-2 text-green-500" />
                              Children & Pets
                            </h4>
                            <div className="space-y-2 text-gray-700">
                              <div>{selectedHotel.policies.children}</div>
                              <div>{selectedHotel.policies.pets}</div>
                            </div>
                          </div>
                          
                          <div className="bg-amber-50 p-6 rounded-xl md:col-span-2">
                            <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                              <FiCreditCard className="mr-2 text-amber-500" />
                              Cancellation Policy
                            </h4>
                            <p className="text-gray-700">{selectedHotel.policies.cancellation}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Location Tab */}
                    {activeTab === 'location' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-4">Location & Attractions</h3>
                          <div className="bg-gray-50 p-6 rounded-xl">
                            <div className="flex items-start space-x-3 mb-4">
                              <FiMapPin className="text-rose-500 mt-1 flex-shrink-0" />
                              <div>
                                <h4 className="font-semibold text-gray-800">Hotel Address</h4>
                                <p className="text-gray-700">{selectedHotel.location}</p>
                              </div>
                            </div>
                            
                            {selectedHotel.contact && (
                              <div className="flex items-start space-x-3">
                                <FiPhone className="text-rose-500 mt-1 flex-shrink-0" />
                                <div>
                                  <h4 className="font-semibold text-gray-800">Contact</h4>
                                  <p className="text-gray-700">{selectedHotel.contact.phone}</p>
                                  <p className="text-gray-700">{selectedHotel.contact.email}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-4">Nearby Attractions</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedHotel.nearbyAttractions.map((attraction, index) => (
                              <div key={index} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
                                <FiNavigation className="text-rose-500 flex-shrink-0" />
                                <span className="text-gray-700">{attraction}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Enhanced Booking Tab */}
                    {activeTab === 'booking' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        {paymentSuccess ? (
                          <div className="text-center py-12">
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 max-w-md mx-auto">
                              <FiCheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                              <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
                              <p className="text-gray-600 mb-4">
                                Thank you for your booking. A confirmation email has been sent to {emailForm.email}.
                              </p>
                              <motion.button
                                onClick={closeModal}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Close
                              </motion.button>
                            </div>
                          </div>
                        ) : emailSent ? (
                          <div className="text-center py-12">
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 max-w-md mx-auto">
                              <FiCheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                              <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Request Sent!</h3>
                              <p className="text-gray-600 mb-4">
                                We've received your booking request and will contact you shortly to confirm.
                              </p>
                              <motion.button
                                onClick={closeModal}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Close
                              </motion.button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <BookingSteps />

                            {/* Step 1: Select Dates & Room */}
                            {bookingStep === 1 && (
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                              >
                                <h3 className="text-2xl font-bold text-gray-800">Select Your Stay</h3>
                                
                                {/* Room Selection */}
                                <div className="bg-rose-50 p-6 rounded-xl">
                                  <h4 className="font-bold text-gray-800 mb-4">Select Room Type</h4>
                                  <div className="space-y-4">
                                    {selectedHotel.rooms.map(room => (
                                      <motion.div
                                        key={room.id}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                          selectedRoom?.id === room.id
                                            ? 'border-rose-500 bg-white shadow-lg'
                                            : 'border-gray-200 bg-white hover:border-rose-300'
                                        }`}
                                        onClick={() => setSelectedRoom(room)}
                                        whileHover={{ scale: 1.02 }}
                                      >
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <h5 className="font-semibold text-gray-800">{room.type}</h5>
                                            <p className="text-gray-600 text-sm">{room.size} • {room.beds}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-rose-600 font-bold text-xl">₹{room.price.toLocaleString()}</p>
                                            <p className="text-gray-500 text-sm">per night</p>
                                          </div>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>

                                {/* Date Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
                                    <DatePicker
                                      selected={checkInDate}
                                      onChange={setCheckInDate}
                                      minDate={new Date()}
                                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
                                    <DatePicker
                                      selected={checkOutDate}
                                      onChange={setCheckOutDate}
                                      minDate={checkInDate}
                                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>

                                {/* Booking Summary */}
                                {selectedRoom && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white border border-gray-200 rounded-xl p-6"
                                  >
                                    <h4 className="font-bold text-gray-800 mb-4">Booking Summary</h4>
                                    <div className="space-y-3">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Room Price</span>
                                        <span className="font-medium">₹{selectedRoom.price.toLocaleString()} x {calculateNights()} nights</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Taxes & Fees</span>
                                        <span className="font-medium">₹{selectedHotel.taxes.toLocaleString()} x {calculateNights()} nights</span>
                                      </div>
                                      <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between text-lg font-bold">
                                          <span>Total Amount</span>
                                          <span className="text-rose-600">₹{calculateTotal().toLocaleString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4">
                                  <motion.button
                                    onClick={() => setBookingStep(2)}
                                    disabled={!selectedRoom}
                                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-xl font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                                    whileHover={selectedRoom ? { scale: 1.02 } : {}}
                                    whileTap={selectedRoom ? { scale: 0.98 } : {}}
                                  >
                                    <span>Continue to Guest Information</span>
                                    <FiArrowRight size={20} />
                                  </motion.button>
                                  
                                  <motion.button
                                    onClick={() => setBookingStep(3)}
                                    disabled={!selectedRoom}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                                    whileHover={selectedRoom ? { scale: 1.02 } : {}}
                                    whileTap={selectedRoom ? { scale: 0.98 } : {}}
                                  >
                                    <FiCreditCard size={20} />
                                    <span>Skip to Payment</span>
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}

                            {/* Step 2: Guest Information */}
                            {bookingStep === 2 && (
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                              >
                                <h3 className="text-2xl font-bold text-gray-800">Guest Information</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <EnhancedInput
                                    label="Full Name"
                                    value={emailForm.name}
                                    onChange={handleInputChange}
                                    name="name"
                                    placeholder="Enter your full name"
                                    required
                                    icon={FiUser}
                                  />

                                  <EnhancedInput
                                    label="Email Address"
                                    type="email"
                                    value={emailForm.email}
                                    onChange={handleInputChange}
                                    name="email"
                                    placeholder="your@email.com"
                                    required
                                    icon={FiMail}
                                  />

                                  <EnhancedInput
                                    label="Phone Number"
                                    value={emailForm.phone}
                                    onChange={handleInputChange}
                                    name="phone"
                                    placeholder="+91 1234567890"
                                    required
                                    icon={FiPhone}
                                  />

                                  <div className="md:col-span-2">
                                    <EnhancedTextarea
                                      label="Special Requests"
                                      value={emailForm.specialRequests}
                                      onChange={handleInputChange}
                                      name="specialRequests"
                                      placeholder="Any special requests or requirements..."
                                      rows={3}
                                    />
                                  </div>
                                </div>

                                <div className="flex space-x-4">
                                  <motion.button
                                    onClick={() => setBookingStep(1)}
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center space-x-3"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <FiChevronLeft size={20} />
                                    <span>Back</span>
                                  </motion.button>

                                  <motion.button
                                    onClick={() => setBookingStep(3)}
                                    disabled={!emailForm.name || !emailForm.email || !emailForm.phone}
                                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                                    whileHover={emailForm.name && emailForm.email && emailForm.phone ? { scale: 1.02 } : {}}
                                    whileTap={emailForm.name && emailForm.email && emailForm.phone ? { scale: 0.98 } : {}}
                                  >
                                    <span>Continue to Payment</span>
                                    <FiArrowRight size={20} />
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}

                            {/* Step 3: Payment */}
                            {bookingStep === 3 && (
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                              >
                                <h3 className="text-2xl font-bold text-gray-800">Payment</h3>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                  {/* Payment Options */}
                                  <div className="space-y-6">
                                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                                      <h4 className="font-bold text-gray-800 mb-4">Choose Payment Method</h4>
                                      
                                      <div className="space-y-4">
                                        <motion.button
                                          onClick={handleRazorpayPayment}
                                          disabled={paymentLoading}
                                          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg transition-colors flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                          whileHover={!paymentLoading ? { scale: 1.02 } : {}}
                                          whileTap={!paymentLoading ? { scale: 0.98 } : {}}
                                        >
                                          {paymentLoading ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                          ) : (
                                            <>
                                              <FiCreditCard size={24} />
                                              <span>Pay with Razorpay</span>
                                            </>
                                          )}
                                        </motion.button>

                                        <motion.button
                                          onClick={handleCashPayment}
                                          disabled={paymentLoading}
                                          className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-lg transition-colors flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                          whileHover={!paymentLoading ? { scale: 1.02 } : {}}
                                          whileTap={!paymentLoading ? { scale: 0.98 } : {}}
                                        >
                                          {paymentLoading ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                          ) : (
                                            <>
                                              <FiDollarSign size={24} />
                                              <span>Pay at Hotel</span>
                                            </>
                                          )}
                                        </motion.button>
                                      </div>

                                      <div className="mt-4 text-center">
                                        <p className="text-xs text-gray-500">
                                          Secure payment powered by Razorpay. Your data is safe with us.
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex space-x-4">
                                      <motion.button
                                        onClick={() => setBookingStep(2)}
                                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        <FiChevronLeft size={18} />
                                        <span>Back</span>
                                      </motion.button>
                                    </div>
                                  </div>

                                  {/* Final Booking Summary */}
                                  <div className="bg-gray-50 p-6 rounded-xl h-fit">
                                    <h4 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h4>
                                    
                                    <div className="space-y-4">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h5 className="font-semibold text-gray-800">{selectedRoom.type}</h5>
                                          <p className="text-gray-600 text-sm">{selectedHotel.name}</p>
                                        </div>
                                        <span className="text-rose-600 font-bold">₹{selectedRoom.price.toLocaleString()}/night</span>
                                      </div>
                                      
                                      <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                          <span>Check-in</span>
                                          <span className="font-medium">{checkInDate.toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Check-out</span>
                                          <span className="font-medium">{checkOutDate.toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Duration</span>
                                          <span className="font-medium">{calculateNights()} nights</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Guests</span>
                                          <span className="font-medium">{selectedRoom.maxOccupancy} guests max</span>
                                        </div>
                                      </div>

                                      <div className="border-t border-gray-200 pt-4 space-y-2">
                                        <div className="flex justify-between text-gray-600">
                                          <span>Room Charges</span>
                                          <span>₹{(selectedRoom.price * calculateNights()).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                          <span>Taxes & Fees</span>
                                          <span>₹{(selectedHotel.taxes * calculateNights()).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t border-gray-200">
                                          <span>Total Amount</span>
                                          <span className="text-rose-600">₹{calculateTotal().toLocaleString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence> 
      </div>
    </motion.div>
  );
};

export default Hotels;   