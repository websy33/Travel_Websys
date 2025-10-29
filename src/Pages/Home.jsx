import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaPlane, FaHotel, FaRegStar, 
  FaArrowRight, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, 
  FaCalendarAlt, FaUserFriends, FaTimes, FaSearch, FaQuoteLeft,
  FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaHeart,
  FaWhatsapp
} from 'react-icons/fa';
import { FaUser, FaEnvelope, FaPhone, FaComment } from 'react-icons/fa';
import { FaGlobe, FaUmbrellaBeach, FaStar } from 'react-icons/fa';
import { FiMessageSquare } from 'react-icons/fi';
import { IoIosFlash, IoMdHeart } from 'react-icons/io';
import { GiSuitcase } from 'react-icons/gi';
import emailjs from '@emailjs/browser';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion, AnimatePresence } from 'framer-motion';

// Initialize EmailJS
emailjs.init("37pN2ThzFwwhwk7ai");

// Enhanced animations
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const slideInLeft = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const slideInRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

// Search Form Component (Reusable)
function SearchForm({ onSearch, primaryColor = 'bg-pink-600', primaryHoverColor = 'hover:bg-pink-700', primaryBorderColor = 'border-pink-600' }) {
  const [selectedDestination, setSelectedDestination] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const destinations = [
    { id: 'all', name: 'All Destinations' },
    { id: 'kashmir', name: 'Kashmir' },
    { id: 'goa', name: 'Goa' },
    { id: 'bali', name: 'Bali' },
    { id: 'maldives', name: 'Maldives' },
    { id: 'darjeeling', name: 'Darjeeling' },
    { id: 'dubai', name: 'Dubai' },
    { id: 'europe', name: 'Europe' },
    { id: 'thailand', name: 'Thailand' }
  ];

  // Custom date format function
  const formatDateDisplay = (date) => {
    if (!date) return '';
    const day = date.getDate();
    const month = date.toLocaleString('en', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({
      destination: selectedDestination,
      startDate,
      endDate
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        delay: 0.3
      }}
      className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border-t-4 border-pink-600 mx-4"
      whileHover={{
        y: -5,
        transition: { duration: 0.3 }
      }}
    >
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 text-center"
      >
        Where would you like to go?
      </motion.h3>
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: FaMapMarkerAlt,
            element: (
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 appearance-none text-sm md:text-base"
              >
                {destinations.map(dest => (
                  <option key={dest.id} value={dest.id}>{dest.name}</option>
                ))}
              </select>
            )
          },
          {
            icon: FaCalendarAlt,
            element: (
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Travel Dates"
                className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm md:text-base"
                dateFormat="d MMM yyyy"
                showPopperArrow={false}
                isClearable
                customInput={<input
                  value={startDate ? formatDateDisplay(startDate) : ''}
                  readOnly
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm md:text-base bg-white cursor-pointer" />} />
            )
          },
          {
            icon: FaUserFriends,
            element: (
              <select className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 appearance-none text-sm md:text-base">
                <option>Travelers</option>
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>Family (2+2)</option>
                <option>Group (5+)</option>
              </select>
            )
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <item.icon className="text-gray-400 h-4 w-4" />
            </div>
            {item.element}
          </motion.div>
        ))}

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 md:px-6 py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center text-sm md:text-base col-span-1 sm:col-span-2 md:col-span-1"
        >
          Search Packages
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FaArrowRight className="ml-2 h-4 w-4" />
          </motion.span>
        </motion.button>
      </form>
    </motion.div>
  );
}

// Search Results Component
const SearchResults = ({ results, onViewDetails, onBookNow }) => {
  if (results.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 bg-white rounded-lg shadow-md mt-6 mx-4"
      >
        <motion.p 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-gray-500 text-lg"
        >
          No packages found matching your search criteria.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mt-2"
        >
          Try adjusting your search filters.
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-8 bg-white rounded-lg shadow-md p-6 mx-4"
    >
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl md:text-2xl font-bold text-gray-800 mb-6"
      >
        Search Results ({results.length} packages found)
      </motion.h3>
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {results.map((pkg, index) => (
          <motion.div 
            key={pkg.id}
            variants={fadeInUp}
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3 }
            }}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <motion.div 
              className="h-48 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
            </motion.div>
            <div className="p-4">
              <h4 className="font-bold text-lg mb-2">{pkg.title}</h4>
              <p className="text-gray-600 mb-2">{pkg.destination}</p>
              <p className="text-pink-600 font-bold mb-4">{pkg.price}</p>
              <div className="flex justify-between">
                <motion.button 
                  whileHover={{ 
                    scale: 1.05,
                    color: "#ec4899"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onViewDetails(pkg)}
                  className="text-pink-600 hover:text-pink-700 font-medium text-sm"
                >
                  View Details
                </motion.button>
                <motion.button 
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 5px 15px -3px rgba(236, 72, 153, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onBookNow(pkg)}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-3 md:px-4 py-2 rounded text-sm"
                >
                  Book Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

// Enhanced WhatsApp Chat Component with Auto Message
const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showNotification, setShowNotification] = useState(true);
  const [hasBeenClosed, setHasBeenClosed] = useState(false);

  const phoneNumber = '+919796337997';

  // Auto-open WhatsApp after 10 seconds only if not previously closed
  useEffect(() => {
    if (hasBeenClosed) return;
    
    const timer = setTimeout(() => {
      if (!isOpen) {
        setIsOpen(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isOpen, hasBeenClosed]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setMessage('');
    setIsOpen(false);
    setHasBeenClosed(true);
  };

  const handleQuickMessage = (quickMessage) => {
    const encodedMessage = encodeURIComponent(quickMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    setHasBeenClosed(true);
  };

  const autoMessage = "Hello Traveligo! 🌍✈️ I'm interested in your amazing travel packages. Can you help me plan my dream vacation?";

  const handleClose = () => {
    setIsOpen(false);
    setShowNotification(false);
    setHasBeenClosed(true);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
      {/* Notification Bubble */}
      <AnimatePresence>
        {showNotification && !isOpen && !hasBeenClosed && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full shadow-lg"
          >
            New
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Notification */}
      <AnimatePresence>
        {showNotification && !isOpen && !hasBeenClosed && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute right-12 md:right-16 bottom-0 bg-white rounded-xl shadow-2xl p-3 w-72 md:w-80 border border-green-200"
          >
            <div className="flex items-start space-x-2 md:space-x-3">
              <motion.div 
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="bg-green-100 p-1.5 md:p-2 rounded-full flex-shrink-0"
              >
                <FaWhatsapp className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm md:text-base">Traveligo Support</h4>
                <p className="text-pink-600 text-xs md:text-sm mt-1">Hi! 👋 Ready to plan your dream vacation?</p>
                <div className="flex space-x-2 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleQuickMessage(autoMessage);
                      setShowNotification(false);
                    }}
                    className="flex-1 bg-green-600 text-white py-1.5 px-2 md:py-2 md:px-3 rounded-lg text-xs md:text-sm font-medium"
                  >
                    Start Chat
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowNotification(false);
                      setHasBeenClosed(true);
                    }}
                    className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                  >
                    <FaTimes className="h-3 w-3 md:h-4 md:w-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Button */}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 100 }}
            className="w-72 md:w-80 bg-white rounded-t-xl shadow-2xl flex flex-col border border-green-200"
          >
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-3 md:p-4 rounded-t-xl flex justify-between items-center">
              <div className="flex items-center">
                <motion.div 
                  animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/20 p-1.5 md:p-2 rounded-full mr-2 md:mr-3"
                >
                  <FaWhatsapp className="h-4 w-4 md:h-5 md:w-5" />
                </motion.div>
                <div>
                  <h3 className=" text-white font-bold text-sm md:text-base">Traveligo Support</h3>
                  <p className="text-white text-xs md:text-sm">Typically replies instantly</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="text-white hover:text-green-200"
              >
                <FaTimes className="h-3 w-3 md:h-4 md:w-4" />
              </motion.button>
            </div>
            
            <div className="flex-1 p-3 md:p-4 bg-gray-50 max-h-64 md:max-h-80 overflow-y-auto">
              <div className="space-y-2 md:space-y-3">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-green-100 border border-green-200 rounded-lg p-2 md:p-3 text-xs md:text-sm text-gray-700"
                >
                  <p className="font-medium">Hi! 👋 Welcome to Traveligo!</p>
                  <p className="mt-1">I'm here to help you plan your dream vacation. Choose an option below or type your message:</p>
                </motion.div>
                
                <div className="space-y-1.5 md:space-y-2">
                  {[
                    { emoji: "💼", text: "Get package information", message: "Hello! I'd like to get more information about your travel packages" },
                    { emoji: "📅", text: "Booking assistance", message: "Hi, I need help with my booking and have some questions" },
                    { emoji: "✈️", text: "Custom travel plan", message: "Hello! I have a custom travel request for my dream vacation" },
                    { emoji: "💰", text: "Special offers & deals", message: "Hi! Can you tell me about current special offers and deals?" }
                  ].map((item, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.02, 
                        x: 5,
                        backgroundColor: "rgba(34, 197, 94, 0.1)"
                      }}
                      onClick={() => handleQuickMessage(item.message)}
                      className="w-full text-left bg-white border border-gray-200 rounded-lg p-2 md:p-3 hover:bg-gray-50 transition-colors text-xs md:text-sm"
                    >
                      <span className="mr-2">{item.emoji}</span>
                      {item.text}
                    </motion.button>
                  ))}
                </div>

                {/* Auto Message Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)"
                  }}
                  onClick={() => handleQuickMessage(autoMessage)}
                  className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white rounded-lg p-2 md:p-3 font-medium text-xs md:text-sm shadow-lg hover:shadow-xl transition-all"
                >
                  🎉 Plan My Dream Vacation!
                </motion.button>
              </div>
            </div>
            
            <div className="p-2 md:p-3 border-t bg-white">
              <div className="flex space-x-1.5 md:space-x-2">
                <motion.input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-2 md:px-3 py-1.5 md:py-2 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-xs md:text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="bg-green-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center flex-shrink-0"
                >
                  <FaWhatsapp className="h-3 w-3 md:h-4 md:w-4" />
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-1.5 md:mt-2 text-center">
                Click to start conversation on WhatsApp
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ 
              scale: 1.1, 
              rotate: [0, -10, 10, 0],
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsOpen(true);
              setShowNotification(false);
            }}
            className="bg-green-600 text-white p-3 md:p-4 rounded-full shadow-2xl hover:bg-green-700 transition-colors flex items-center justify-center relative"
            animate={{
              scale: hasBeenClosed ? 1 : [1, 1.1, 1],
            }}
            transition={{
              duration: hasBeenClosed ? 0 : 2,
              repeat: hasBeenClosed ? 0 : Infinity,
              repeatType: "reverse"
            }}
          >
            <FaWhatsapp className="h-4 w-4 md:h-5 md:w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simplified Contact Popup Component
const ContactPopup = ({ onClose }) => {
  const initiateCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const initiateWhatsApp = (message = '') => {
    const phoneNumber = '+919796337997';
    const encodedMessage = encodeURIComponent(message || 'Hi, I would like to get more information about travel packages');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-2xl max-w-md w-full mx-4"
      >
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h3 className="text-xl font-bold text-gray-900">Contact Us</h3>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="h-5 w-5" />
          </motion.button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <motion.h4 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-gray-900 text-center"
            >
              Contact Our Team
            </motion.h4>
            
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 gap-4"
            >
              {[
                { icon: FaPhone, bg: "bg-pink-100", color: "text-pink-600", title: "Sales & Bookings", number: "+91 9796337997", type: "call" },
                { icon: FaPhone, bg: "bg-pink-100", color: "text-pink-600", title: "Customer Support", number: "+91 9796337997", type: "call" },
                { icon: FaWhatsapp, bg: "bg-green-100", color: "text-green-600", title: "WhatsApp Support", number: "+91 9796337997", type: "whatsapp" },
                { icon: FaEnvelope, bg: "bg-pink-100", color: "text-pink-600", title: "Email Support", email: "info@traveligo.com", type: "email" }
              ].map((contact, index) => (
                <motion.button
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ 
                    scale: 1.02,
                    y: -2
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (contact.type === 'call') {
                      initiateCall(contact.number);
                    } else if (contact.type === 'whatsapp') {
                      initiateWhatsApp();
                    } else if (contact.type === 'email') {
                      window.location.href = `mailto:${contact.email}`;
                    }
                  }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className={`${contact.bg} p-3 rounded-full mr-4`}
                    >
                      <contact.icon className={`${contact.color} h-4 w-4`} />
                    </motion.div>
                    <div>
                      <h5 className="font-bold text-sm md:text-base">{contact.title}</h5>
                      <p className="text-gray-600 text-xs md:text-sm">{contact.number || contact.email}</p>
                    </div>
                  </div>
                  <span className={`${contact.type === 'whatsapp' ? 'text-green-600' : 'text-pink-600'} font-medium text-sm md:text-base`}>
                    {contact.type === 'email' ? 'Email Now' : contact.type === 'whatsapp' ? 'Chat Now' : 'Call Now'}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showQuotesForm, setShowQuotesForm] = useState(false);
  const [showNotifyForm, setShowNotifyForm] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    arrivalDate: '',
    departureDate: '',
    adults: '1',
    kids: '',
    kidsAges: '',
    hotelCategory: '3',
    mealsIncluded: 'yes',
    budget: '',
    package: '',
    message: ''
  });
  const [quotesFormData, setQuotesFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'General Inquiry',
    message: ''
  });
  const [notifyFormData, setNotifyFormData] = useState({
    name: '',
    email: '',
    interests: [],
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [quotesFormSubmitted, setQuotesFormSubmitted] = useState(false);
  const [notifyFormSubmitted, setNotifyFormSubmitted] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [likedVideos, setLikedVideos] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  
  // Video testimonials state
  const [videoStates, setVideoStates] = useState([
    { isPlaying: false, isMuted: false, progress: 0 },
    { isPlaying: false, isMuted: false, progress: 0 },
    { isPlaying: false, isMuted: false, progress: 0 },
    { isPlaying: false, isMuted: false, progress: 0 },
    { isPlaying: false, isMuted: false, progress: 0 },
    { isPlaying: false, isMuted: false, progress: 0 }
  ]);
  const videoRefs = useRef([]);
  const quotesFormRef = useRef();

  // Destinations for dropdown
  const destinations = [
    { id: 'all', name: 'All Destinations' },
    { id: 'kashmir', name: 'Kashmir' },
    { id: 'goa', name: 'Goa' },
    { id: 'bali', name: 'Bali' },
    { id: 'maldives', name: 'Maldives' },
    { id: 'darjeeling', name: 'Darjeeling' },
    { id: 'dubai', name: 'Dubai' },
    { id: 'europe', name: 'Europe' },
    { id: 'thailand', name: 'Thailand' }
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Packages' },
    { id: 'luxury', name: 'Luxury' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'beach', name: 'Beach' },
    { id: 'international', name: 'International' }
  ];

  // Video testimonials data
  const videoTestimonials = [
    {
      id: 1,
      name: 'Ishaan Khatter',
      role: 'Bollywood Actor',
      content: '/videos/ishan.mp4',
      thumbnail: '/images/ishan.webp',
    },
    {
      id: 2,
      name: 'Kanika Mann',
      role: 'Artist',
      content: '/videos/kanikaman.mp4',
      thumbnail: '/images/kanikamann.webp',
    },
    {
      id: 3,
      name: 'Rashmeet Kaur',
      role: 'Singer',
      content: '/videos/Rashmika.mp4',
      thumbnail: '/images/Rahmeet.webp',
    },
    {
      id: 4,
      name: 'Dr Raza',
      role: 'Doctor',
      content: '/videos/raza.mp4',
      thumbnail: '/images/raza.webp',
    },
  ];

  // Women's Solo Trip Videos
  const soloTripVideos = [
    {
      id: 5,
      name: 'Ms Debashree Mukerjee',
      role: 'Solo Traveler',
      content: '/videos/Debashree.mp4',
      thumbnail: '/images/Debashree.webp',
      destination: 'Kashmir Solo Trip',
    },
  ];

  // Group Trip Videos
  const groupTripVideos = [
    {
      id: 6,
      name: 'Group Adventure',
      role: 'Group Trip',
      content: '/videos/Group.mp4',
      thumbnail: '/images/group.webp'
    }
  ];

  // Featured destinations carousel
  const featuredDestinations = [
    {
      id: 1,
      title: 'Maldives Paradise',
      image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1800&q=80',
      description: 'Crystal clear waters and private villas',
      price: '₹89,999',
      packageId: 1 
    },
    {
      id: 2,
      title: 'Bali Adventure Tour',
      image: '/images/Bali1.webp',
      description: 'Majestic Mountains & Cozy Chalets - A Serene Bali Escape',
      price: '₹1,12,999',
      packageId: 6
    },
    {
      id: 3,
      title: "Darjeeling Dreams",
      image: '/images/darjeeling2.webp',
      description: "Romantic getaway in the misty hills of tea gardens",
      price: "₹32,999",
      packageId: 5
    },
    {
      id: 4,
      title: 'Jannat-E-Kashmir',
      image: '/images/kashmir.webp',
      description: 'Heaven on Earth with breathtaking valleys',
      price: '₹97,499',
      packageId: 9
    }
  ];

  // Trending cities data
  const trendingCities = [
    {
      id: 1,
      name: 'Srinagar',
      image: '/images/kashmir.webp',
      price: '₹12,999',
      slug: 'kashmir'
    },
    {
      id: 2,
      name: 'Goa',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      price: '₹9,999',
      slug: 'goa'
    },
    {
      id: 3,
      name: 'Bali',
      image: '/images/Bali1.webp',
      price: '₹32,999',
      slug: 'bali'
    },
    {
      id: 4,
      name: 'Maldives',
      image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      price: '₹49,999',
      slug: 'maldives'
    },
    {
      id: 5,
      name: 'Darjeeling',
      image: '/images/darjeeling2.webp',
      price: '₹14,999',
      slug: 'GangtokDargelling'
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      quote: "Our Kashmir tour with Traveligo was magical! The houseboat stay on Dal Lake and the Shikara ride at sunset were unforgettable. The team took care of every detail, making it a stress-free vacation.",
      name: "Mrs Rana Nazar",
      location: "Kashmir, May 2023",
      rating: 5,
      image: "/images/Client3.webp",
      destinationImage: "/images/kashmir.webp"
    },
    {    
      id: 2,
      quote: "The Gulmarg gondola ride was the highlight of our Kashmir trip. Traveligo's local guide knew all the best spots for photography and helped us avoid the crowds. Perfect winter getaway!",
      name: "Mr Nihal",
      location: "Gulmarg, January 2023",
      rating: 5,
      image: "/images/Client4.jpeg",
      destinationImage: "/images/Gulmarg.webp"
    },
    {
      id: 3,
      quote: "Pahalgam through Traveligo was like stepping into paradise. The Betaab Valley visit and the stay at a cozy cottage were perfect. Their attention to detail made all the difference in our experience.",
      name: "Mr Kiran",
      location: "Pahalgam, July 2023",
      rating: 5,
      image: "/images/Client1.jpeg",
      destinationImage: "/images/pahalgam.jpeg"
    }
  ];

  // Holiday packages data (all packages included) - Added Mauritius package
  const holidayPackages = [
   
{
id: 11,
title: 'Golden Triangle Explorer',
destination: '6D/5N in Delhi, Agra & Jaipur',
duration: '6 Days',
price: '₹34,999',
originalPrice: '₹44,999',
discount: '22%',
image: 'https://entiretravel.imgix.net/getmedia/61a0d879-0e6d-491d-bf5a-0b7192100e8c/Golden-Triangle-2.jpg?auto=format',
highlights: ['Taj Mahal Visit', 'Historic Forts & Palaces', 'Cultural Experiences'],
itinerary: [
{ day: 1, title: 'Arrival in Delhi', description: 'Arrive in Delhi, transfer to hotel. Evening free to relax or explore local markets.' },
{ day: 2, title: 'Delhi Sightseeing', description: 'Full-day tour of Old & New Delhi including Red Fort, Qutub Minar, India Gate, and Lotus Temple.' },
{ day: 3, title: 'Delhi to Agra', description: 'Drive to Agra. Visit Agra Fort and Mehtab Bagh for a sunset view of Taj Mahal.' },
{ day: 4, title: 'Agra to Jaipur', description: 'Sunrise visit to Taj Mahal. Drive to Jaipur via Fatehpur Sikri. Check-in and relax.' },
{ day: 5, title: 'Jaipur Exploration', description: 'Visit Amber Fort, City Palace, Jantar Mantar, and Hawa Mahal. Enjoy a cultural dinner.' },
{ day: 6, title: 'Departure', description: 'Visit local markets for souvenirs, then transfer to Delhi airport for departure.' }
],
inclusions: ['5 nights hotel accommodation (3-star)', 'Daily breakfast', 'All transfers & sightseeing by private AC vehicle', 'Entrance fees to monuments', 'English speaking guide'],
exclusions: ['Airfare', 'Travel insurance', 'Lunch & Dinner', 'Personal expenses', 'Any other expenses not mentioned'],
tag: 'Cultural Heritage',
category: 'cultural',
destinationId: 'golden-triangle'
},
    {
      id: 1,
      title: 'Maldives Honeymoon Package',
      destination: '5D/4N in Maldives',
      duration: '5 Days',
      price: '₹59,999',
      originalPrice: '₹89,999',
      discount: '33%',
      image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      highlights: ['Overwater Villa', 'All Meals Included', 'Sunset Cruise'],
      itinerary: [
        { day: 1, title: 'Arrival in Maldives', description: 'Private transfer to your overwater villa. Welcome drinks and briefing.' },
        { day: 2, title: 'Island Exploration', description: 'Guided tour of local islands and snorkeling in the house reef.' },
        { day: 3, title: 'Sunset Cruise', description: 'Private sunset cruise with champagne and canapes.' },
        { day: 4, title: 'Spa Day', description: 'Couples spa treatment and private beach dinner.' },
        { day: 5, title: 'Departure', description: 'Transfer to airport with farewell gifts.' }
      ],
      inclusions: ['4 nights in overwater villa', 'All meals (breakfast, lunch, dinner)', 'Return airport transfers', 'Sunset cruise', 'Complimentary spa session'],
      exclusions: ['Airfare', 'Travel insurance', 'Personal expenses', 'Optional activities'],
      tag: 'Romantic Getaway',
      category: 'luxury',
      destinationId: 'maldives'
    },
    {
  "id": 15,
  "title": "Magical Thailand for Families",
  "destination": "7D/6N Fun-Filled Family Holiday",
  "duration": "7 Days",
  "price": "₹89,999",
  "originalPrice": "₹1,09,999",
  "discount": "19%",
  "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx-kuvR62jxgkmihXiKMkWipj7-mhUxoegwg&s",
  "highlights": [
    "Safari World Bangkok with Marine Park",
    "Cartoon Network Amazone Waterpark",
    "Elephant Sanctuary ethical encounter",
    "Fun and safe beach time in Hua Hin",
    "Interactive cultural activities for kids"
  ],
  "itinerary": [
    { "day": 1, "title": "Arrival in Bangkok", "description": "Airport transfer. Check into family-friendly hotel. Relax by the pool." },
    { "day": 2, "title": "Animal Adventure Day", "description": "Full day at Safari World Bangkok to see animals and enjoy live shows." },
    { "day": 3, "title": "Waterpark Fun", "description": "Transfer to Pattaya. Spend the day at Cartoon Network Amazone Waterpark." },
    { "day": 4, "title": "Ethical Elephant Day", "description": "Visit an ethical elephant sanctuary to feed and bathe elephants (no riding)." },
    { "day": 5, "title": "Beach Transfer", "description": "Transfer to the calm beaches of Hua Hin. Build sandcastles and swim." },
    { "day": 6, "title": "Cicada Market", "description": "Visit the family-friendly Cicada Market with arts, crafts, and live music." },
    { "day": 7, "title": "Departure", "description": "Transfer back to Bangkok airport for your flight home." }
  ],
  "inclusions": [
    "6 nights accommodation in family rooms (3-4* hotels with pool)",
    "Daily breakfast",
    "All entrance fees to parks and sanctuaries",
    "All transfers in private AC vehicle with child seats available",
    "English speaking guide experienced with families"
  ],
  "exclusions": [
    "International airfare",
    "Visa fees",
    "Lunch & dinner",
    "Personal expenses & souvenirs",
    "Optional activities"
  ],
  "tag": "Family Fun",
  "category": "international",
  "destinationId": "thailand"
},

{
    "id": 6,
    title: "Bali Tropical Escape",
    destination: "5D/4N in Bali",
    duration: "5 Days",
    price: "₹32,999",
    originalPrice: "₹45,999",
    discount: "28%",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    highlights: ["Beach Relaxation", "Temple Visits", "Spa Treatment"],
    itinerary: [
      { "day": 1, "title": "Arrival in Bali", "description": "Airport pickup and transfer to Kuta hotel." },
      { "day": 2, "title": "Beach Day", "description": "Relax at Kuta Beach and enjoy sunset at Jimbaran Bay." },
      { "day": 3, "title": "Temple Tour", "description": "Visit Uluwatu Temple and Tanah Lot Temple." },
      { "day": 4, "title": "Spa & Relaxation", "description": "Traditional Balinese spa treatment and leisure time." },
      { "day": 5, "title": "Departure", "description": "Transfer to airport with farewell gifts." }
    ],
    inclusions: ["4 nights accommodation", "Daily breakfast", "All tours mentioned", "English speaking guide", "Entrance fees"],
    exclusions: ["Airfare", "Travel insurance", "Personal expenses", "Optional activities", "Lunch and dinner unless specified"],
    tag: "Relaxation",
    category: "leisure",
    destinationId: "bali"
  },
    {
  id: 2,
  title: 'Maldives Island Romance Package',
  destination: '6D/5N in Maldives',
  duration: '6 Days',
  price: '₹74,999',
  originalPrice: '₹1,09,999',
  discount: '32%',
  image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  highlights: ['Beachfront Bungalow', 'Private Sandbank Dinner', 'Dolphin Watching'],
  itinerary: [
    { day: 1, title: 'Arrival & Check-in', description: 'Speedboat transfer to the resort. Check into your beachfront bungalow and enjoy a welcome fruit basket.' },
    { day: 2, title: 'Dolphin Safari', description: 'Evening boat trip to watch playful dolphins in their natural habitat.' },
    { day: 3, title: 'Private Sandbank Experience', description: 'A romantic lunch set up on a secluded, pristine sandbank just for you.' },
    { day: 4, title: 'Maldivian Cooking Class', description: 'Learn to cook traditional Maldivian dishes together in a fun, interactive session.' },
    { day: 5, title: 'Reef Snorkeling', description: 'Guided snorkeling tour to explore the vibrant coral reefs and tropical fish.' },
    { day: 6, title: 'Departure', description: 'Enjoy a final breakfast before your transfer to the airport.' }
  ],
  inclusions: ['5 nights in a beachfront bungalow', 'Half-board plan (breakfast & dinner)', 'Return speedboat transfers', 'Dolphin watching excursion', 'Sandbank picnic lunch'],
  exclusions: ['Airfare', 'Lunch (except on sandbank day)', 'Premium beverages', 'Spa treatments'],
  tag: 'Island Escape',
  category: 'luxury',
  destinationId: 'maldives'
},
 {
      id: 3,
      title: 'European Explorer',
      destination: '10D/9N in Europe',
      duration: '10 Days',
      price: '₹1,25,999',
      originalPrice: '₹1,59,999',
      discount: '21%',
      image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      highlights: ['4 Countries', 'Guided Tours', 'Breakfast Included'],
      itinerary: [
        { day: 1, title: 'Arrival in Paris', description: 'Transfer to hotel. Evening Seine River cruise.' },
        { day: 2, title: 'Paris Sightseeing', description: 'Eiffel Tower, Louvre Museum, and Champs-Élysées.' },
        { day: 3, title: 'Travel to Brussels', description: 'Train to Brussels. Grand Place and Atomium visit.' },
        { day: 4, title: 'Amsterdam Tour', description: 'Canal cruise, Anne Frank House, and Van Gogh Museum.' },
        { day: 5, title: 'Cologne & Rhine Valley', description: 'Cologne Cathedral and Rhine River cruise.' },
        { day: 6, title: 'Heidelberg & Black Forest', description: 'Heidelberg Castle and Black Forest drive.' },
        { day: 7, title: 'Swiss Alps', description: 'Jungfraujoch excursion with breathtaking alpine views.' },
        { day: 8, title: 'Lucerne & Zurich', description: 'Chapel Bridge and Lion Monument in Lucerne.' },
        { day: 9, title: 'Return to Paris', description: 'Free day for shopping and last-minute sightseeing.' },
        { day: 10, title: 'Departure', description: 'Transfer to airport for return flight.' }
      ],
      inclusions: ['9 nights accommodation', 'Daily breakfast', 'Transport between cities', 'Guided tours as per itinerary', 'Entrance fees to mentioned attractions'],
      exclusions: ['Airfare', 'Travel insurance', 'Personal expenses', 'Optional activities', 'Lunch and dinner unless specified', 'Visa fees'],
      tag: 'Best Seller',
      category: 'cultural',
      destinationId: 'europe'
    },
    {
  "id": 1,
  "title": "Tropical Bliss",
  "destination": "8D/7N in Thailand & Bali",
  "duration": "8 Days",
  "price": "₹84,999",
  "originalPrice": "₹1,09,999",
  "discount": "23%",
  "image": "https://images.unsplash.com/photo-1534008897995-27a23e859048?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  "highlights": ["Island Hopping", "Spa Experience", "All Meals Included"],
  "itinerary": [
    { "day": 1, "title": "Arrival in Phuket", "description": "Transfer to resort. Relax on Patong Beach." },
    { "day": 2, "title": "Phi Phi Islands Tour", "description": "Speedboat tour to Maya Bay, Monkey Beach, and snorkeling." },
    { "day": 3, "title": "Phang Nga Bay", "description": "Canoeing through mangrove forests and James Bond Island." },
    { "day": 4, "title": "Fly to Bali", "description": "Transfer to Ubud. Evening traditional dance performance." },
    { "day": 5, "title": "Ubud Culture", "description": "Tegallalang Rice Terraces, Sacred Monkey Forest, and art market." },
    { "day": 6, "title": "Bali Beaches", "description": "Day trip to Uluwatu Temple and Jimbaran Bay seafood dinner." },
    { "day": 7, "title": "Free Day", "description": "Optional spa treatments, cooking class, or more beach time." },
    { "day": 8, "title": "Departure", "description": "Transfer to airport for return flight." }
  ],
  "inclusions": ["7 nights accommodation", "All meals", "Domestic flight (Phuket to Bali)", "All tours and transfers as per itinerary", "Entrance fees"],
  "exclusions": ["International airfare", "Travel insurance", "Alcoholic beverages", "Personal expenses", "Visa fees"],
  "tag": "Popular",
  "category": "beach",
  "destinationId": "southeast-asia"
},
{
  id: 3,
  title: 'Maldives All-Inclusive Escape',
  destination: '4D/3N in Maldives',
  duration: '4 Days',
  price: '₹49,999',
  originalPrice: '₹74,999',
  discount: '33%',
  image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  highlights: ['True All-Inclusive', 'Water Sports', 'Unlimited Dining'],
  itinerary: [
    { day: 1, title: 'Arrival in Paradise', description: 'Seaplane transfer offering breathtaking aerial views. Check-in to your all-inclusive package.' },
    { day: 2, title: 'Adventure Day', description: 'Enjoy non-motorized water sports like kayaking and paddleboarding. Evening live music at the bar.' },
    { day: 3, title: 'Relaxation & Indulgence', description: 'Lounge by the infinity pool, savor cocktails, and enjoy a themed dinner buffet.' },
    { day: 4, title: 'Last Memories', description: 'One last dip in the ocean before your seaplane flight back to the airport.' }
  ],
  inclusions: ['3 nights in a deluxe room', 'Full board with unlimited premium drinks', 'Return seaplane transfers', 'Non-motorized water sports', 'Access to all resort facilities'],
  exclusions: ['Airfare', 'Motorized water sports', 'Spa services', 'Off-site excursions'],
  tag: 'All-Inclusive',
  category: 'luxury',
  destinationId: 'maldives'
},
{
  id: 4,
  title: 'Maldives Adventure & Relaxation',
  destination: '7D/6N in Maldives',
  duration: '7 Days',
  price: '₹99,999',
  originalPrice: '₹1,39,999',
  discount: '29%',
  image: "https://q-xx.bstatic.com/xdata/images/hotel/max1000/152645581.jpg?k=c4da23b7ee42cfb5df77c76102932ec2874e76e5159ef55ff0ae5575cb89a298&o=",
  highlights: ['Snorkeling with Manta Rays', 'Fishing Trip', 'Overwater Spa'],
  itinerary: [
    { day: 1, title: 'Welcome to the Resort', description: 'Speedboat transfer and check-in. Orientation tour of the resort.' },
    { day: 2, title: 'Local Culture Tour', description: 'Visit a nearby local island to learn about Maldivian culture and traditions.' },
    { day: 3, title: 'Big Game Fishing', description: 'Early morning fishing trip to try and catch tuna, snapper, and other big game fish.' },
    { day: 4, title: 'Manta Ray Snorkeling', description: 'Guided excursion to a known manta ray cleaning station for an unforgettable snorkel.' },
    { day: 5, title: 'Ultimate Relaxation', description: 'A full day to enjoy the overwater spa, yoga session, and the resort’s pools.' },
    { day: 6, title: 'Farewell Dinner', description: 'A private, romantic dinner on the beach under the stars.' },
    { day: 7, title: 'Journey Home', description: 'Transfer to the airport with memories of a lifetime.' }
  ],
  inclusions: ['6 nights in a garden villa with pool', 'Breakfast included daily', 'Return speedboat transfers', 'Fishing trip & manta ray snorkeling excursion', 'Cultural island visit'],
  exclusions: ['Airfare', 'Lunch & dinner (except farewell dinner)', 'Spa treatments', 'Diving courses'],
  tag: 'Adventure',
  category: 'luxury',
  destinationId: 'maldives'
},
{
  id: 5,
  title: 'Maldives Ultimate Luxury Retreat',
  destination: '5D/4N in Maldives',
  duration: '5 Days',
  price: '₹1,49,999',
  originalPrice: '₹2,24,999',
  discount: '33%',
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMxuPom-zN_tL-B6L3xLeklL8pUUpO0Tqg_NxTR6ezy27xpcMYFB_EgXa7wOYXtkpONR0&usqp=CAU',
  highlights: ['Private Pool Residence', 'Personal Butler', 'In-Villa Dining'],
  itinerary: [
    { day: 1, title: 'VIP Arrival', description: 'Priority seaplane transfer. Personal butler greets you and escorts you to your stunning overwater residence with private pool.' },
    { day: 2, title: 'Yacht Charter', description: 'Private half-day charter on a luxury yacht for snorkeling and swimming in complete privacy.' },
    { day: 3, title: 'Gourmet Experience', description: 'In-villa private chef dinner experience tailored to your preferences.' },
    { day: 4, title: 'Exclusive Wellness', description: 'A full suite of bespoke couples spa treatments in an overwater treatment room.' },
    { day: 5, title: 'Departure in Style', description: 'Private seaplane transfer back to the international airport.' }
  ],
  inclusions: ['4 nights in an overwater residence with private pool', '24/7 dedicated butler service', 'Return private seaplane transfers', 'Private yacht charter (3 hours)', 'Gourmet in-villa dining experience once'],
  exclusions: ['Airfare', 'Most meals (besides specified experience)', 'Premium alcohol', 'Additional excursions'],
  tag: 'Ultimate Luxury',
  category: 'luxury',
  destinationId: 'maldives'
},
   
  
  {
    "id": 7,
    "title": "Bali Adventure Package",
    "destination": "7D/6N in Bali",
    "duration": "7 Days",
    "price": "₹42,999",
    "originalPrice": "₹59,999",
    "discount": "28%",
    "image": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "highlights": ["Private Tours", "Water Sports", "Cultural Shows"],
    "itinerary": [
      { "day": 1, "title": "Arrival in Bali", "description": "Airport pickup and transfer to Ubud hotel." },
      { "day": 2, "title": "Ubud Exploration", "description": "Sacred Monkey Forest, Tegalalang Rice Terrace, and traditional dance performance." },
      { "day": 3, "title": "Adventure Day", "description": "White water rafting and ATV ride through jungle trails." },
      { "day": 4, "title": "Nusa Penida Trip", "description": "Full-day excursion to Kelingking Beach and Angel's Billabong." },
      { "day": 5, "title": "Water Sports", "description": "Snorkeling, banana boat, and parasailing at Tanjung Benoa." },
      { "day": 6, "title": "Cultural Day", "description": "Visit Besakih Temple and traditional Balinese cooking class." },
      { "day": 7, "title": "Departure", "description": "Transfer to airport with farewell gifts." }
    ],
    "inclusions": ["6 nights accommodation", "Daily breakfast", "All tours and activities mentioned", "English speaking guide", "Entrance fees"],
    "exclusions": ["Airfare", "Travel insurance", "Personal expenses", "Optional activities", "Lunch and dinner unless specified"],
    "tag": "Adventure",
    "category": "adventure",
    "destinationId": "bali"
  },
  {
    "id": 8,
    "title": "Bali Luxury Retreat",
    "destination": "6D/5N in Bali",
    "duration": "6 Days",
    "price": "₹89,999",
    "originalPrice": "₹119,999",
    "discount": "25%",
    "image": "https://magazine.compareretreats.com/wp-content/uploads/2019/02/svarga-loka-bali.jpg",
    "highlights": ["5-Star Accommodation", "Private Pool Villa", "Fine Dining"],
    "itinerary": [
      { "day": 1, "title": "Arrival in Bali", "description": "Luxury airport pickup and transfer to Seminyak private villa." },
      { "day": 2, "title": "Luxury Spa Day", "description": "Premium spa treatments and private beach club access." },
      { "day": 3, "title": "Gourmet Experience", "description": "Fine dining at renowned restaurants and cocktail classes." },
      { "day": 4, "title": "Private Yacht Tour", "description": "Exclusive yacht trip to nearby islands with gourmet lunch." },
      { "day": 5, "title": "Cultural Luxury", "description": "Private guided tour of temples and traditional arts performance." },
      { "day": 6, "title": "Departure", "description": "Luxury transfer to airport with premium farewell gifts." }
    ],
    "inclusions": ["5 nights luxury accommodation", "All meals included", "Private guide and driver", "All activities mentioned", "Premium spa treatments"],
    "exclusions": ["Airfare", "Travel insurance", "Personal shopping expenses", "Optional premium activities"],
    "tag": "Luxury",
    "category": "luxury",
    "destinationId": "bali"
  },
  {
    "id": 4,
    "title": "Bali Honeymoon Special",
    "destination": "8D/7N in Bali",
    "duration": "8 Days",
    "price": "₹67,999",
    "originalPrice": "₹89,999",
    "discount": "24%",
    "image": "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "highlights": ["Romantic Dinners", "Private Pool", "Couple Spa"],
    "itinerary": [
      { "day": 1, "title": "Arrival in Bali", "description": "Romantic airport pickup with flowers and transfer to Ubud." },
      { "day": 2, "title": "Romantic Ubud", "description": "Private tour of rice terraces and romantic dinner." },
      { "day": 3, "title": "Beach Escape", "description": "Transfer to Seminyak for beach time and sunset cocktails." },
      { "day": 4, "title": "Island Paradise", "description": "Day trip to Nusa Dua for private beach experience." },
      { "day": 5, "title": "Luxury Spa Day", "description": "Couple spa treatment and relaxation." },
      { "day": 6, "title": "Cultural Connection", "description": "Visit temples and traditional markets together." },
      { "day": 7, "title": "Romantic Farewell", "description": "Private dinner on the beach with cultural performance." },
      { "day": 8, "title": "Departure", "description": "Transfer to airport with special honeymoon gifts." }
    ],
    "inclusions": ["7 nights romantic accommodation", "Daily breakfast", "Romantic dinners", "Couple spa treatment", "All transfers"],
    "exclusions": ["Airfare", "Travel insurance", "Personal expenses", "Additional activities"],
    "tag": "Honeymoon",
    "category": "romance",
    "destinationId": "bali"
  },
  {
    "id": 5,
    "title": "Bali Cultural Immersion",
    "destination": "7D/6N in Bali",
    "duration": "7 Days",
    "price": "₹38,999",
    "originalPrice": "₹52,999",
    "discount": "26%",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYIwGLycIBRKIpEJl0IW5udGZgnYjcV6gXDA&s",
    "highlights": ["Temple Visits", "Traditional Crafts", "Local Cuisine"],
    "itinerary": [
      { "day": 1, "title": "Arrival in Bali", "description": "Airport pickup and transfer to cultural center in Ubud." },
      { "day": 2, "title": "Temple Exploration", "description": "Visit Besakih Temple, Uluwatu Temple and Tanah Lot." },
      { "day": 3, "title": "Artisan Villages", "description": "Tour of traditional craft villages: silver, batik and wood carving." },
      { "day": 4, "title": "Rice Terrace Experience", "description": "Visit Jatiluwih Rice Terraces and learn about subak irrigation system." },
      { "day": 5, "title": "Culinary Journey", "description": "Balinese cooking class and local market visit." },
      { "day": 6, "title": "Traditional Arts", "description": "Watch traditional dance performances and visit art museums." },
      { "day": 7, "title": "Departure", "description": "Transfer to airport with cultural souvenir gifts." }
    ],
    "inclusions": ["6 nights accommodation", "Daily breakfast", "All cultural tours", "English speaking guide", "Entrance fees"],
    "exclusions": ["Airfare", "Travel insurance", "Personal expenses", "Optional activities", "Lunch and dinner unless specified"],
    "tag": "Cultural",
    "category": "cultural",
    "destinationId": "bali"
  },

   
{
  "id": 2,
  "title": "Desert Dreams",
  "destination": "6D/5N in Dubai & Abu Dhabi",
  "duration": "6 Days",
  "price": "₹79,499",
  "originalPrice": "₹99,999",
  "discount": "21%",
  "image": "https://en3fsvfda7w.exactdn.com/wp-content/uploads/2021/02/Desert-Dreams-3.jpg?strip=all&lossy=1&quality=80&webp=85&ssl=1",
  "highlights": ["Desert Safari", "Luxury Hotel Stays", "Dhow Cruise Dinner"],
  "itinerary": [
    { "day": 1, "title": "Arrival in Dubai", "description": "Transfer to hotel. Evening at leisure at Dubai Marina." },
    { "day": 2, "title": "Modern Dubai", "description": "Burj Khalifa 'At the Top', Dubai Mall, and Fountain show." },
    { "day": 3, "title": "Desert Adventure", "description": "Dune bashing, camel riding, henna painting, and BBQ dinner at desert camp." },
    { "day": 4, "title": "Abu Dhabi Day Trip", "description": "Visit Sheikh Zayed Mosque, Louvre Abu Dhabi, and Yas Island." },
    { "day": 5, "title": "Old Dubai & Souks", "description": "Abra ride across Dubai Creek, Gold Souk, and Spice Souk." },
    { "day": 6, "title": "Departure", "description": "Last-minute shopping at Mall of the Emirates before airport transfer." }
  ],
  "inclusions": ["5 nights in 4-star hotels", "Daily breakfast", "Desert safari with dinner", "City tours with entrance fees", "All transfers"],
  "exclusions": ["International airfare", "Lunch and dinner (except desert safari)", "Visa charges", "Personal expenses", "Travel insurance"],
  "tag": "Luxury",
  "category": "adventure",
  "destinationId": "uae"
},
{
  "id": 4,
  "title": "Kiwi Adventure",
  "destination": "9D/8N in New Zealand South Island",
  "duration": "9 Days",
  "price": "₹2,15,000",
  "originalPrice": "₹2,55,000",
  "discount": "16%",
  "image": "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  "highlights": ["Milford Sound Cruise", "Adventure Activities", "Self-Drive Journey"],
  "itinerary": [
    { "day": 1, "title": "Arrival in Christchurch", "description": "Pick up rental car. Explore the Botanic Gardens." },
    { "day": 2, "title": "To Lake Tekapo", "description": "Drive to Lake Tekapo. Visit Church of the Good Shepherd and stargaze." },
    { "day": 3, "title": "Queenstown", "description": "Drive to Queenstown. Experience the Skyline Gondola and Luge." },
    { "day": 4, "title": "Adventure Day", "description": "Choose from bungy jumping, jet boating, or a scenic hike." },
    { "day": 5, "title": "Milford Sound", "description": "Fullday trip to Milford Sound with nature cruise."},
    { "day": 6, "title": "To Franz Josef", "description": "Scenic drive up the West Coast to Franz Josef Glacier." },
    { "day": 7, "title": "Glacier Experience", "description": "Helicopter hike on Franz Josef Glacier or scenic flight." },
    { "day": 8, "title": "Return to Christchurch", "description": "Tranzalpine train journey (scenic option). Farewell dinner." },
    { "day": 9, "title": "Departure", "description": "Return rental car and fly out." }
  ],
  "inclusions": ["8 nights accommodation", "Rental car for duration", "Milford Sound cruise", "Tranzalpine train ticket", "Pre-paid activity vouchers"],
  "exclusions": ["International airfare", "Fuel for rental car", "Adventure activities (optional)", "Travel insurance", "Meals unless specified"],
  "tag": "Adventure",
  "category": "nature",
  "destinationId": "new-zealand"
},
{
  "id": 5,
  "title": "Land of the Rising Sun",
  "destination": "10D/9N in Japan",
  "duration": "10 Days",
  "price": "₹2,89,999",
  "originalPrice": "₹3,40,000",
  "discount": "15%",
  "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  "highlights": ["Bullet Train Experience", "Traditional Ryokan Stay", "Cultural Workshops"],
  "itinerary": [
    { "day": 1, "title": "Arrival in Tokyo", "description": "Transfer to hotel. Explore Shinjuku area in the evening." },
    { "day": 2, "title": "Tokyo Exploration", "description": "Senso-ji Temple, Shibuya Crossing, and Harajuku." },
    { "day": 3, "title": "Mt. Fuji & Hakone", "description": "Day trip to see Mt. Fuji, Lake Ashi cruise, and Owakudani Valley." },
    { "day": 4, "title": "To Kyoto by Bullet Train", "description": "Travel to Kyoto. Visit Fushimi Inari Shrine with its thousands of torii gates." },
    { "day": 5, "title": "Kyoto's Heritage", "description": "Kinkaku-ji (Golden Pavilion), Arashiyama Bamboo Grove, and Gion district." },
    { "day": 6, "title": "Nara Day Trip", "description": "Visit Todai-ji Temple and feed the deer in Nara Park." },
    { "day": 7, "title": "Hiroshima & Miyajima", "description": "Peace Memorial Park and Itsukushima Shrine (floating torii gate)." },
    { "day": 8, "title": "Osaka Food Tour", "description": "Travel to Osaka. Explore Dotonbori and try local street food." },
    { "day": 9, "title": "Return to Tokyo", "description": "Free day for last-minute shopping in Akihabara or Ginza." },
    { "day": 10, "title": "Departure", "description": "Transfer to Narita/Haneda Airport for your flight home." }
  ],
  "inclusions": ["9 nights accommodation", "7-Day Japan Rail Pass", "Daily breakfast", "Guided tours in Tokyo and Kyoto", "Entrance fees to listed sites"],
  "exclusions": ["International airfare", "Most lunches and dinners", "Travel insurance", "Local transport not covered by JR Pass", "Visa fees if applicable"],
  "tag": "Cultural",
  "category": "cultural",
  "destinationId": "japan"
},
{
  "id": 6,
  "title": "Mystical Egypt",
  "destination": "8D/7N Cairo, Nile Cruise & Luxor",
  "duration": "8 Days",
  "price": "₹1,45,500",
  "originalPrice": "₹1,79,999",
  "discount": "19%",
  "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYErQ-t6mKkWP9IActD1NWfRhB14T7g4P8hw&s",
  "highlights": ["Nile Cruise", "Expert Egyptologist Guide", "Sound & Light Show"],
  "itinerary": [
    { "day": 1, "title": "Arrival in Cairo", "description": "Meet and greet at airport. Transfer to hotel." },
    { "day": 2, "title": "Pyramids of Giza", "description": "See the Great Pyramids, Sphinx, and Solar Boat Museum. Evening Sound & Light show." },
    { "day": 3, "title": "Egyptian Museum & Bazaar", "description": "Explore the Egyptian Museum. Shop at Khan el-Khalili Bazaar." },
    { "day": 4, "title": "Fly to Aswan", "description": "Board Nile Cruise. Visit the High Dam and Philae Temple." },
    { "day": 5, "title": "Kom Ombo & Edfu", "description": "Sail to Kom Ombo to see the unique double temple. Continue to Edfu Temple." },
    { "day": 6, "title": "Valley of the Kings", "description": "Disembark in Luxor. Explore Valley of the Kings, Hatshepsut Temple, and Colossi of Memnon." },
    { "day": 7, "title": "Karnak & Return to Cairo", "description": "Visit Karnak Temple. Fly back to Cairo for farewell dinner." },
    { "day": 8, "title": "Departure", "description": "Final transfer to Cairo International Airport." }
  ],
  "inclusions": ["3 nights Cairo hotel", "4 nights Nile Cruise (full board)", "Domestic flights (Cairo-Aswan, Luxor-Cairo)", "All tours with expert guide", "All entrance fees"],
  "exclusions": ["International airfare", "Egypt entry visa", "Gratuities (tips)", "Personal expenses", "Travel insurance"],
  "tag": "History",
  "category": "historical",
  "destinationId": "egypt"
},
    {
      id: 4,
      title: 'Dubai Extravaganza',
      destination: '6D/5N in Dubai',
      duration: '6 Days',
      price: '₹67,999',
      originalPrice: '₹89,999',
      discount: '24%',
      image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      highlights: ['Burj Khalifa Visit', 'Desert Safari', 'Luxury Hotel Stay'],
      itinerary: [
        { day: 1, title: 'Arrival in Dubai', description: 'Airport pickup and transfer to luxury hotel. Evening at leisure.' },
        { day: 2, title: 'City Tour', description: 'Visit Burj Khalifa, Dubai Mall, and Palm Jumeirah.' },
        { day: 3, title: 'Desert Safari', description: 'Dune bashing, camel ride, and desert camp with dinner.' },
        { day: 4, title: 'Abu Dhabi Excursion', description: 'Visit Sheikh Zayed Mosque and Ferrari World.' },
        { day: 5, title: 'Leisure Day', description: 'Free day for shopping or optional activities like skydiving.' },
        { day: 6, title: 'Departure', description: 'Transfer to airport with farewell gifts.' }
      ],
      inclusions: ['5 nights in 5-star hotel', 'Daily breakfast', 'City tour with guide', 'Desert safari with dinner', 'Abu Dhabi excursion'],
      exclusions: ['Airfare', 'Travel insurance', 'Personal expenses', 'Optional activities', 'Lunch and dinner unless specified'],
      tag: 'Luxury',
      category: 'luxury',
      destinationId: 'dubai'
    },
    
  {
    "id": 1,
    "title": "Maldives Paradise",
    "destination": "5D/4N in Maldives",
    "duration": "5 Days",
    "price": "₹89,999",
    "originalPrice": "₹1,19,999",
    "discount": "25%",
    "image": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "highlights": ["Overwater Villa Stay", "Snorkeling Adventure", "Sunset Cruise"],
    "itinerary": [
      { "day": 1, "title": "Arrival in Maldives", "description": "Speedboat transfer to resort. Check-in and leisure time." },
      { "day": 2, "title": "Coral Reef Exploration", "description": "Snorkeling trip to vibrant coral reefs with marine life viewing." },
      { "day": 3, "title": "Island Hopping", "description": "Visit local islands and experience Maldivian culture." },
      { "day": 4, "title": "Relaxation & Spa", "description": "Free day to enjoy resort amenities or optional spa treatments." },
      { "day": 5, "title": "Departure", "description": "Last moments at the beach before transfer to airport." }
    ],
    "inclusions": ["4 nights in overwater villa", "All meals included", "Snorkeling equipment", "Island hopping tour", "Airport transfers"],
    "exclusions": ["International airfare", "Alcohol beverages", "Spa treatments", "Travel insurance", "Personal expenses"],
    "tag": "Luxury",
    "category": "luxury",
    "destinationId": "maldives"
  },
  {
    "id": 2,
    "title": "European Discovery",
    "destination": "10D/9N in Europe",
    "duration": "10 Days",
    "price": "₹1,49,999",
    "originalPrice": "₹1,99,999",
    "discount": "25%",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRrIOaU43cfiv_vj1YIEwXcCdnVy2YRCu53Q&s",
    "highlights": ["Eiffel Tower Visit", "Swiss Alps Excursion", "Venice Gondola Ride"],
    "itinerary": [
      { "day": 1, "title": "Arrival in Paris", "description": "Airport transfer and hotel check-in. Evening Seine River cruise." },
      { "day": 2, "title": "Paris City Tour", "description": "Visit Eiffel Tower, Louvre Museum, and Champs-Élysées." },
      { "day": 3, "title": "Travel to Switzerland", "description": "Scenic train journey to Interlaken. Check-in and relax." },
      { "day": 4, "title": "Swiss Alps Adventure", "description": "Cable car ride to Jungfraujoch - Top of Europe." },
      { "day": 5, "title": "Travel to Venice", "description": "Transfer to Italy. Evening at leisure." },
      { "day": 6, "title": "Venice Exploration", "description": "Gondola ride, St. Mark's Square, and Doge's Palace visit." },
      { "day": 7, "title": "Travel to Rome", "description": "Transfer to Rome. Evening food tour." },
      { "day": 8, "title": "Roman Heritage", "description": "Colosseum, Vatican City, and Trevi Fountain tour." },
      { "day": 9, "title": "Free Day in Rome", "description": "Shopping and optional activities or relaxation." },
      { "day": 10, "title": "Departure", "description": "Transfer to airport for return flight." }
    ],
    "inclusions": ["9 nights accommodation", "Daily breakfast", "All inter-city transfers", "Guided tours", "Entrance fees to monuments"],
    "exclusions": ["International airfare", "Lunch and dinner", "Travel insurance", "Personal expenses", "Visa fees"],
    "tag": "Premium",
    "category": "europe",
    "destinationId": "europe"
  },
  {
    "id": 3,
    "title": "Bali Retreat",
    "destination": "7D/6N in Bali",
    "duration": "7 Days",
    "price": "₹49,999",
    "originalPrice": "₹64,999",
    "discount": "23%",
    "image": "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "highlights": ["Ubud Cultural Experience", "Beach Relaxation", "Temple Tours"],
    "itinerary": [
      { "day": 1, "title": "Arrival in Bali", "description": "Airport pickup and transfer to hotel in Seminyak. Evening free." },
      { "day": 2, "title": "South Bali Tour", "description": "Visit Uluwatu Temple, Jimbaran Bay, and enjoy seafood dinner." },
      { "day": 3, "title": "Ubud Cultural Day", "description": "Tegalalang Rice Terraces, Ubud Monkey Forest, and traditional dance performance." },
      { "day": 4, "title": "Sacred Temples", "description": "Visit Besakih Mother Temple and Tirta Empul Water Temple." },
      { "day": 5, "title": "Volcano Adventure", "description": "Sunrise at Mount Batur with breakfast cooked by volcanic steam." },
      { "day": 6, "title": "Leisure Day", "description": "Free for spa treatments, shopping, or beach time." },
      { "day": 7, "title": "Departure", "description": "Last minute shopping before airport transfer." }
    ],
    "inclusions": ["6 nights accommodation", "Daily breakfast", "All transfers and tours", "Entrance fees", "English speaking guide"],
    "exclusions": ["Airfare", "Lunch and dinner", "Travel insurance", "Personal expenses", "Visa fees"],
    "tag": "Popular",
    "category": "asia",
    "destinationId": "bali"
  },
  {
    "id": 4,
    "title": "Dubai Extravaganza",
    "destination": "6D/5N in Dubai",
    "duration": "6 Days",
    "price": "₹67,999",
    "originalPrice": "₹89,999",
    "discount": "24%",
    "image": "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "highlights": ["Burj Khalifa Visit", "Desert Safari", "Luxury Hotel Stay"],
    "itinerary": [
      { "day": 1, "title": "Arrival in Dubai", "description": "Airport pickup and transfer to luxury hotel. Evening at leisure." },
      { "day": 2, "title": "City Tour", "description": "Visit Burj Khalifa, Dubai Mall, and Palm Jumeirah." },
      { "day": 3, "title": "Desert Safari", "description": "Dune bashing, camel ride, and desert camp with dinner." },
      { "day": 4, "title": "Abu Dhabi Excursion", "description": "Visit Sheikh Zayed Mosque and Ferrari World." },
      { "day": 5, "title": "Leisure Day", "description": "Free day for shopping or optional activities like skydiving." },
      { "day": 6, "title": "Departure", "description": "Transfer to airport with farewell gifts." }
    ],
    "inclusions": ["5 nights in 5-star hotel", "Daily breakfast", "City tour with guide", "Desert safari with dinner", "Abu Dhabi excursion"],
    "exclusions": ["Airfare", "Travel insurance", "Personal expenses", "Optional activities", "Lunch and dinner unless specified"],
    "tag": "Luxury",
    "category": "luxury",
    "destinationId": "dubai"
  },
  {
    "id": 5,
    "title": "Thai Experience",
    "destination": "6D/5N in Thailand",
    "duration": "6 Days",
    "price": "₹39,999",
    "originalPrice": "₹52,999",
    "discount": "25%",
    "image": "https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "highlights": ["Bangkok Temples", "Pattaya Beach", "Floating Market"],
    "itinerary": [
      { "day": 1, "title": "Arrival in Bangkok", "description": "Airport transfer and hotel check-in. Evening free for exploration." },
      { "day": 2, "title": "Bangkok City Tour", "description": "Visit Grand Palace, Wat Pho, and Wat Arun. Evening market visit." },
      { "day": 3, "title": "Floating Market", "description": "Visit Damnoen Saduak Floating Market and railway market." },
      { "day": 4, "title": "Transfer to Pattaya", "description": "Beach time and visit to Sanctuary of Truth." },
      { "day": 5, "title": "Island Cruise", "description": "Coral Island tour with water activities and seafood lunch." },
      { "day": 6, "title": "Departure", "description": "Transfer to Bangkok airport for return flight." }
    ],
    "inclusions": ["5 nights accommodation", "Daily breakfast", "All sightseeing tours", "Entrance fees", "English speaking guide"],
    "exclusions": ["Airfare", "Lunch and dinner", "Travel insurance", "Personal expenses", "Visa fees"],
    "tag": "Value",
    "category": "asia",
    "destinationId": "thailand"
  },

    {
      id: 5,
      title: 'Darjeeling Dreams',
      destination: '5D/4N in Darjeeling',
      duration: '5 Days',
      price: '₹78,999',
      originalPrice: '₹99,999',
      discount: '21%',
      image: '/images/darjeeling2.webp',
      highlights: ['Eiffel Tower Dinner', 'Seine River Cruise', 'Louvre Museum'],
      itinerary: [
        { day: 1, title: 'Arrival in Paris', description: 'Transfer to boutique hotel. Evening Seine River cruise.' },
        { day: 2, title: 'Paris Highlights', description: 'Eiffel Tower, Arc de Triomphe, and Champs-Élysées.' },
        { day: 3, title: 'Art & Culture', description: 'Louvre Museum and Musée d\'Orsay with skip-the-line access.' },
        { day: 4, title: 'Versailles Day Trip', description: 'Guided tour of Palace of Versailles and gardens.' },
        { day: 5, title: 'Departure', description: 'Free morning for last-minute shopping before airport transfer.' }
      ],
      inclusions: ['4 nights in boutique hotel', 'Daily breakfast', 'Seine River cruise', 'Eiffel Tower summit access', 'Versailles day trip'],
      exclusions: ['Airfare', 'Travel insurance', 'Personal expenses', 'Optional activities', 'Lunch and dinner unless specified'],
      tag: 'Romantic',
      category: 'luxury',
      destinationId: 'darjeeling'
    },
    {
  id: 51,
  title: 'Heritage Darjeeling',
  destination: '4D/3N in Darjeeling',
  duration: '4 Days',
  price: '₹24,999',
  originalPrice: '₹29,999',
  discount: '17%',
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFxG0o50I7x-FTLFVYg-x3dAg-n-50xW1vag&s',
  highlights: ['Toy Train Joyride', 'Tea Estate Tour', 'Sunrise at Tiger Hill'],
  itinerary: [
    { day: 1, title: 'Arrival & Local Exploration', description: 'Arrive in Darjeeling, transfer to hotel. Evening stroll through Chowrasta Mall Road.' },
    { day: 2, title: 'Classic Darjeeling Sightseeing', description: 'Pre-dawn trip to Tiger Hill for sunrise over Kanchenjunga. Visit Ghoom Monastery, Batasia Loop, and take a joyride on the Darjeeling Himalayan Railway (Toy Train).' },
    { day: 3, title: 'Tea & History', description: 'Guided tour of a colonial-era tea estate. Visit the Himalayan Mountaineering Institute and the Padmaja Naidu Himalayan Zoological Park.' },
    { day: 4, title: 'Departure', description: 'Free time for souvenir shopping before departure.' }
  ],
  inclusions: ['3 nights in a 3-star heritage hotel', 'Daily breakfast', 'All local transfers and toy train ride', 'Entrance fees to monuments and parks'],
  exclusions: ['Airfare/Train to Darjeeling', 'Travel insurance', 'Lunch and dinner', 'Personal expenses'],
  tag: 'Cultural',
  category: 'standard',
  destinationId: 'darjeeling'
},
{
  id: 52,
  title: 'The Tea Connoisseur\'s Escape',
  destination: '5D/4N in Darjeeling & Glenburn',
  duration: '5 Days',
  price: '₹1,25,000',
  originalPrice: '₹1,45,000',
  discount: '14%',
  image: 'https://assets.zeezest.com/blogs/PROD_Horizontal-2_1715320288445_thumb_500.jpeg',
  highlights: ['Stay at a Luxury Tea Estate Bungalow', 'Private Tea Tasting Session', 'Sunset Picnic with Panoramic Views'],
  itinerary: [
    { day: 1, title: 'Arrival in Grand Style', description: 'Private car transfer from Bagdogra to a luxury tea estate resort. Evening welcome with a speciality tea cocktail.' },
    { day: 2, title: 'Immersion in Tea', description: 'Private guided walk through the tea gardens. Exclusive tea plucking and processing demonstration followed by a curated private tea tasting session with an expert.' },
    { day: 3, title: 'Riverside Picnic & Local Crafts', description: 'Morning excursion to a nearby river for a private gourmet picnic. Afternoon visit to a local artisan market.' },
    { day: 4, title: 'A Day of Leisure & Panoramic Views', description: 'Sunrise yoga session with mountain views. Day at leisure to enjoy the spa or library. Farewell sunset champagne picnic.' },
    { day: 5, title: 'Departure', description: 'Leisurely breakfast followed by transfer to the airport.' }
  ],
  inclusions: ['4 nights in a luxury tea estate boutique hotel', 'All meals (gourmet dining)', 'Private car with chauffeur', 'All experiences (tea tasting, picnic, yoga)', 'Butler service'],
  exclusions: ['Airfare', 'Travel insurance', 'Premium alcoholic beverages', 'Spa treatments'],
  tag: 'Luxury',
  category: 'luxury',
  destinationId: 'darjeeling'
},
{
  id: 53,
  title: 'Mountain Family Adventure',
  destination: '6D/5N in Darjeeling & Kalimpong',
  duration: '6 Days',
  price: '₹67,500',
  originalPrice: '₹79,000',
  discount: '15%',
  image: 'https://cdn.adventure-life.com/26/95/27/iStock-1187709038/1300x820.webp',
  highlights: ['River Rafting on Teesta', 'Nature Trail & Ziplining', 'Visit to Orchid Sanctuary'],
  itinerary: [
    { day: 1, title: 'Arrival in Darjeeling', description: 'Transfer to a family-friendly resort. Evening at leisure to acclimatize.' },
    { day: 2, title: 'Darjeeling for Kids', description: 'Visit the Zoo, Tibetan Refugee Self-Help Center, and enjoy a fun toy train ride.' },
    { day: 3, title: 'Journey to Kalimpong', description: 'Scenic drive to Kalimpong. Visit Deolo Hill, Nature Interpretation Centre, and a flower nursery.' },
    { day: 4, title: 'Adventure Day', description: 'Gentle river rafting on the Teesta River. Afternoon of ziplining and adventure activities at a local park.' },
    { day: 5, title: 'Cable Car & Monasteries', description: 'Experience the Durpin Dhara Monastery ropeway. Visit the famous Thongsa Gompa monastery. Drive back to Darjeeling.' },
    { day: 6, title: 'Departure', description: 'Transfer to Bagdogra Airport with a stop for souvenir shopping.' }
  ],
  inclusions: ['5 nights in family suites', 'Daily breakfast and dinner', 'All adventure activity fees', 'All transfers and sightseeing in a private vehicle'],
  exclusions: ['Airfare', 'Travel insurance', 'Lunch', 'Personal expenses', 'Any activity not mentioned'],
  tag: 'Family',
  category: 'adventure',
  destinationId: 'darjeeling'
},
{
  id: 54,
  title: 'Romantic Mountain Serenade',
  destination: '5D/4N in Darjeeling',
  duration: '5 Days',
  price: '₹58,999',
  originalPrice: '₹68,000',
  discount: '13%',
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsDHpGAXrlkoRJis6MtkFy0KkqwCKWerGX6PaIvFExNiupNYUYBFKkRM7vJwXykTHUZuc&usqp=CAU',
  highlights: ['Private Candlelit Dinner', 'Sunrise at Tiger Hill', 'Couple\'s Spa Treatment'],
  itinerary: [
    { day: 1, title: 'A Romantic Arrival', description: 'Arrival transfer with flower bouquet. Check into a premium room with a Kanchenjunga view. Evening with a private bonfire.' },
    { day: 2, title: 'Magic of the Mountains', description: 'Early morning trip to Tiger Hill for a breathtaking sunrise. Afternoon visit to the peaceful Japanese Temple and Peace Pagoda.' },
    { day: 3, title: 'Tea Gardens & Intimate Moments', description: 'Private tour of a secluded tea garden. Enjoy a couples\' tea tasting session. Evening reserved for a special private candlelit dinner on the terrace.' },
    { day: 4, title: 'Pampering & Strolls', description: 'Morning couple’s aromatherapy massage at the spa. Free afternoon to explore the Mall Road and hold hands on a horse ride.' },
    { day: 5, title: 'Farewell with a Promise', description: 'Leisurely breakfast followed by a transfer to the airport.' }
  ],
  inclusions: ['4 nights in a luxury boutique hotel', 'Daily breakfast', 'Private candlelit dinner once', 'Couple’s spa session', 'All transfers in a private cab'],
  exclusions: ['Airfare', 'Travel insurance', 'Lunch and other dinners', 'Personal expenses', 'Horse riding charges'],
  tag: 'Honeymoon',
  category: 'romantic',
  destinationId: 'darjeeling'
},
{
  id: 55,
  title: 'The Himalayan Backpacker',
  destination: '5D/4N in Darjeeling',
  duration: '5 Days',
  price: '₹12,500',
  originalPrice: '₹14,500',
  discount: '14%',
  image: 'https://media.istockphoto.com/id/1416018492/photo/teenager-indian-girl-hiking-on-mountain-with-backpack-in-manali-himachal-pradesh-india-female.jpg?s=612x612&w=0&k=20&c=swephOf1AFzLbd6Ycn43KMicLCvjy-HysY7PQSMsU0Q=',
  highlights: ['Hostel Stay with Travelers', 'Hidden Viewpoints', 'Local Food Crawl'],
  itinerary: [
    { day: 1, title: 'Arrival & Check-in', description: 'Shared transfer from NJP to a popular hostel in Darjeeling. Evening meet & greet with fellow travelers.' },
    { day: 2, title: 'Budget Sightseeing Day', description: 'Shared jeep to Tiger Hill for sunrise. Explore Batasia Loop and Ghoom Monastery by foot and local taxi.' },
    { day: 3, title: 'Tea & Trekking', description: 'Self-guided walk through tea gardens. Optional short trek to nearby viewpoints. Evening exploring the local market and food stalls.' },
    { day: 4, title: 'Cultural Immersion', description: 'Visit the Zoo (HZP) and the Tibetan Refugee Center. Experience the joy of the toy train from the town station.' },
    { day: 5, title: 'Departure', description: 'Shared transfer back to NJP Railway Station.' }
  ],
  inclusions: ['4 nights in a dormitory bed at a boutique hostel', 'Shared transfers from NJP to Darjeeling return', 'One toy train ticket', 'Welcome drink'],
  exclusions: ['All meals', 'Airfare/Train to NJP', 'Travel insurance', 'Entrance fees', 'Local taxi fares', 'Any personal expenses'],
  tag: 'Backpacking',
  category: 'budget',
  destinationId: 'darjeeling'
},
    {
      id: 6,
      title: 'Swiss Delight Package',
      destination: '7D/6N in Switzerland',
      duration: '7 Days',
      price: '₹1,34,999',
      originalPrice: '₹1,59,999',
      discount: '16%',
      image: 'https://d3r8gwkgo0io6y.cloudfront.net/upload/EB/france-paris-city--1.jpg',
      highlights: ['Jungfraujoch Excursion', 'Swiss Pass', 'Lucerne & Interlaken'],
      itinerary: [
        { day: 1, title: 'Arrival in Zurich', description: 'Transfer to Lucerne. Orientation walk of the old town.' },
        { day: 2, title: 'Lucerne Exploration', description: 'Chapel Bridge, Lion Monument, and lake cruise.' },
        { day: 3, title: 'Interlaken', description: 'Travel to Interlaken with free time for optional activities.' },
        { day: 4, title: 'Jungfraujoch', description: 'Excursion to "Top of Europe" with breathtaking views.' },
        { day: 5, title: 'Bern & Gruyères', description: 'Visit Swiss capital and cheese factory in Gruyères.' },
        { day: 6, title: 'Zurich', description: 'Return to Zurich for shopping and sightseeing.' },
        { day: 7, title: 'Departure', description: 'Transfer to airport for return flight.' }
      ],
      inclusions: ['6 nights accommodation', 'Daily breakfast', 'Swiss Travel Pass', 'Jungfraujoch excursion', 'All train transfers'],
      exclusions: ['Airfare', 'Travel insurance', 'Personal expenses', 'Optional activities', 'Lunch and dinner unless specified'],
      tag: 'Best Seller',
      category: 'luxury',
      destinationId: 'europe'
    },
    {
  "id": 5,
  "title": "Swiss & Paris Escape",
  "destination": "8D/7N in Switzerland & France",
  "duration": "8 Days",
  "price": "₹1,49,999",
  "originalPrice": "₹1,74,999",
  "discount": "14%",
  "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnhJ0mWEe6DU7VZKir0dPg2OO9g6vcJ3WrJQ&s",
  "highlights": ["Eiffel Tower in Paris", "Jungfraujoch Excursion", "High-Speed TGV Train"],
  "itinerary": [
    { "day": 1, "title": "Arrival in Paris", "description": "Transfer to hotel. Evening Seine River Cruise." },
    { "day": 2, "title": "Paris City Tour", "description": "Visit Eiffel Tower (2nd level), Champs-Élysées, and Arc de Triomphe." },
    { "day": 3, "title": "Louvre & Montmartre", "description": "Explore the Louvre Museum and the artistic district of Montmartre." },
    { "day": 4, "title": "Travel to Lucerne", "description": "Take a high-speed TGV train from Paris to Basel, then transfer to Lucerne." },
    { "day": 5, "title": "Lucerne & Mt. Pilatus", "description": "Explore Lucerne and take the cogwheel railway to the summit of Mt. Pilatus." },
    { "day": 6, "title": "Jungfraujoch Excursion", "description": "Full-day trip to the 'Top of Europe' from Interlaken." },
    { "day": 7, "title": "Zurich & Departure Prep", "description": "Travel to Zurich for last-minute shopping and sightseeing." },
    { "day": 8, "title": "Departure from Zurich", "description": "Transfer to Zurich airport for your return flight." }
  ],
  "inclusions": ["7 nights accommodation", "Daily breakfast", "Eiffel Tower entry", "Seine River Cruise", "TGV train ticket (Paris-Basel)", "Jungfraujoch excursion", "All intercity transfers"],
  "exclusions": ["Airfare (multi-city entry may be required)", "Travel insurance", "Lunch and dinner", "Personal expenses", "Swiss Travel Pass"],
  "tag": "Combo Deal",
  "category": "standard",
  "destinationId": "europe"
},
    {
      id: 7,
      title: 'Goa Beach Retreat',
      destination: '4D/3N in Goa',
      duration: '4 Days',
      price: '₹24,999',
      originalPrice: '₹34,999',
      discount: '29%',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      highlights: ['Beachfront Resort', 'Water Sports', 'Nightlife'],
      itinerary: [
        { day: 1, title: 'Arrival in Goa', description: 'Transfer to beachfront resort. Evening at leisure.' },
        { day: 2, title: 'North Goa Tour', description: 'Visit beaches, forts, and local markets.' },
        { day: 3, title: 'Water Sports', description: 'Enjoy various water activities at Calangute Beach.' },
        { day: 4, title: 'Departure', description: 'Transfer to airport with farewell gifts.' }
      ],
      inclusions: ['3 nights in beachfront resort', 'Daily breakfast', 'North Goa sightseeing', 'Water sports activities'],
      exclusions: ['Airfare', 'Travel insurance', 'Personal expenses', 'Optional activities', 'Lunch and dinner unless specified'],
      tag: 'Beach Holiday',
      category: 'beach',
      destinationId: 'goa'
    },
    {
  id: 8,
  title: 'Goa Heritage Explorer',
  destination: '4D/3N in Goa',
  duration: '4 Days',
  price: '₹21,999',
  originalPrice: '₹29,999',
  discount: '27%',
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLM9rRa8BrAjdmP38XI3fL1ISLoBqR1oCbbg&s',
  highlights: ['UNESCO Heritage Sites', 'Spice Plantation Tour', 'Traditional Goan Dinner'],
  itinerary: [
    { day: 1, title: 'Arrival & Old Goa', description: 'Check-in to a heritage-themed hotel. Visit Basilica of Bom Jesus and Se Cathedral.' },
    { day: 2, title: 'Spices & Local Life', description: 'Tour a organic spice plantation. Evening cruise on the Mandovi River.' },
    { day: 3, title: 'Fontainhas & Temples', description: 'Explore the Latin Quarter of Fontainhas. Visit the Mangueshi Temple.' },
    { day: 4, title: 'Departure', description: 'Transfer to airport after breakfast.' }
  ],
  inclusions: ['3 nights heritage hotel stay', 'Daily breakfast', 'Spice plantation tour with lunch', 'Heritage sightseeing tours'],
  exclusions: ['Airfare', 'Travel insurance', 'Personal expenses', 'Optional activities', 'Dinner unless specified'],
  tag: 'Cultural Experience',
  category: 'cultural',
  destinationId: 'goa'
},
{
  id: 9,
  title: 'Goa Luxury Spa Escape',
  destination: '5D/4N in Goa',
  duration: '5 Days',
  price: '₹49,999',
  originalPrice: '₹64,999',
  discount: '23%',
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  highlights: ['5-Star Luxury Resort', 'Couples Spa Treatments', 'Private Candlelight Dinner'],
  itinerary: [
    { day: 1, title: 'Luxury Arrival', description: 'Private transfer to a 5-star beach resort. Evening at leisure to enjoy resort amenities.' },
    { day: 2, title: 'Pampering & Relaxation', description: 'Enjoy a curated couples spa package. Relax by the infinity pool.' },
    { day: 3, title: 'South Goa Serenity', description: 'Leisurely tour of secluded beaches of South Goa like Palolem and Agonda.' },
    { day: 4, title: 'Culinary Delights', description: 'Sunset cruise followed by a private candlelight dinner on the beach.' },
    { day: 5, title: 'Departure', description: 'Check-out with a farewell gift hamper.' }
  ],
  inclusions: ['4 nights in 5-star resort', 'All meals included', 'Couples spa treatment (60 mins)', 'Private dinner setup', 'Sunset cruise'],
  exclusions: ['Airfare', 'Travel insurance', 'Premium alcoholic beverages', 'Personal shopping'],
  tag: 'Luxury Holiday',
  category: 'luxury',
  destinationId: 'goa'
},
{
  id: 10,
  title: 'Goa Backpacker Buzz',
  destination: '6D/5N in Goa',
  duration: '6 Days',
  price: '₹12,499',
  originalPrice: '₹16,999',
  discount: '26%',
  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  highlights: ['Hostel Stays', 'Pub Crawls', 'Flea Market Visit'],
  itinerary: [
    { day: 1, title: 'Check-in & Meetup', description: 'Check into a popular hostel. Welcome drinks and group meetup in the evening.' },
    { day: 2, title: 'Beach Hopping North', description: 'Visit Anjuna, Vagator, and Chapora Fort. Evening pub crawl.' },
    { day: 3, title: 'Saturday Night Market', description: 'Day at leisure. Evening visit to the famous Anjuna Flea Market.' },
    { day: 4, title: 'South Goa Chill', description: 'Trip to Palolem Beach for a relaxed day. Optional dolphin spotting.' },
    { day: 5, title: 'Adventure Day', description: 'Choose between water sports, waterfall trek, or exploring Old Goa.' },
    { day: 6, title: 'Farewell', description: 'Check out and exchange socials!' }
  ],
  inclusions: ['5 nights in dormitory hostel', 'Welcome drinks', 'One pub crawl night', 'Guided beach hopping tour'],
  exclusions: ['Airfare', 'Travel insurance', 'Most meals', 'Personal expenses', 'Optional activity costs'],
  tag: 'Budget Adventure',
  category: 'adventure',
  destinationId: 'goa'
},
{
  id: 11,
  title: 'Goa Family Fiesta',
  destination: '5D/4N in Goa',
  duration: '5 Days',
  price: '₹37,999',
  originalPrice: '₹47,999',
  discount: '21%',
  image: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  highlights: ['Kid-Friendly Resort', 'Dolphin Spotting', 'Interactive Activities'],
  itinerary: [
    { day: 1, title: 'Arrival & Settle In', description: 'Transfer to a family-friendly resort with a kids\' pool. Evening at leisure.' },
    { day: 2, title: 'Dolphins & Spices', description: 'Morning boat trip for dolphin spotting. Visit a spice plantation with elephant bath/show.' },
    { day: 3, title: 'Beach Fun & Games', description: 'Day at Calangute Beach with safe water sports. Build sandcastles and relax.' },
    { day: 4, title: 'Cultural for Kids', description: 'Visit the Naval Aviation Museum. Enjoy a traditional Goan cultural show in the evening.' },
    { day: 5, title: 'Departure', description: 'Check-out and transfer to the airport.' }
  ],
  inclusions: ['4 nights in family resort', 'Daily breakfast and dinner', 'Dolphin spotting trip', 'Spice plantation tour entry', 'All mentioned sightseeing'],
  exclusions: ['Airfare', 'Travel insurance', 'Lunch', 'Personal expenses', 'Specific water sports costs'],
  tag: 'Family Holiday',
  category: 'family',
  destinationId: 'goa'
},
{
  id: 12,
  title: 'Goa Rains & Rejuvenation',
  destination: '5D/4N in Goa',
  duration: '5 Days',
  price: '₹28,999',
  originalPrice: '₹39,999',
  discount: '28%',
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFy3FSeHaOIsllC6hPawS7Hl626gjK2rKAbg&s',
  highlights: ['Ayurvedic Treatments', 'Monsoon Landscapes', 'Yoga & Meditation'],
  itinerary: [
    { day: 1, title: 'Arrival in Paradise', description: 'Transfer to a serene eco-resort. Welcome herbal drink and consultation with an Ayurvedic doctor.' },
    { day: 2, title: 'Detox & Rejuvenate', description: 'Morning yoga session. Begin personalized Ayurvedic treatments. Enjoy the monsoon showers.' },
    { day: 3, title: 'Waterfall Wonder', description: 'Visit the stunning Dudhsagar Waterfalls (subject to accessibility). Nature walk in the lush greenery.' },
    { day: 4, title: 'Inner Peace', description: 'Guided meditation session. More relaxing therapies. Cooking class for healthy Goan cuisine.' },
    { day: 5, title: 'Departure', description: 'Final healthy breakfast and transfer out with a wellness kit.' }
  ],
  inclusions: ['4 nights in eco-resort', 'All vegetarian/vegan meals', 'Daily yoga & meditation', 'Ayurvedic consultation & treatments', 'Dudhsagar trip (if accessible)'],
  exclusions: ['Airfare', 'Travel insurance', 'Personal expenses', 'Any additional therapies'],
  tag: 'Wellness Retreat',
  category: 'wellness',
  destinationId: 'goa'
},
    {
      id: 8,
      title: 'Kerala Backwaters',
      destination: '5D/4N in Kerala',
      duration: '5 Days',
      price: '₹35,999',
      originalPrice: '₹49,999',
      discount: '28%',
      image:'/images/kerla.webp',
      highlights: ['Houseboat Stay', 'Ayurvedic Spa', 'Cultural Shows'],
      itinerary: [
        { day: 1, title: 'Arrival in Cochin', description: 'Transfer to hotel. Evening city tour.' },
        { day: 2, title: 'Alleppey Backwaters', description: 'Overnight stay in traditional houseboat.' },
        { day: 3, title: 'Kumarakom', description: 'Visit bird sanctuary and enjoy ayurvedic massage.' },
        { day: 4, title: 'Thekkady', description: 'Spice plantation tour and cultural dance performance.' },
        { day: 5, title: 'Departure', description: 'Transfer to airport with farewell gifts.' }
      ],
      inclusions: ['4 nights accommodation (1 in houseboat)', 'Daily meals', 'All sightseeing tours', 'Ayurvedic massage session'],
      exclusions: ['Airfare', 'Travel insurance', 'Personal expenses', 'Optional activities'],
      tag: 'Cultural Experience',
      category: 'cultural',
      destinationId: 'kerala'
    },
    {
  id: 85,
  title: 'Kerala Quick Escape',
  destination: '4D/3N in Kerala',
  duration: '4 Days',
  price: '₹19,999',
  originalPrice: '₹26,499',
  discount: '24%',
  image:'https://www.sostravelhouse.com/public/uploads/images/summernote/67ea890128875.webp',
  highlights: ['Alleppey Houseboat Day Cruise', 'City Tour of Cochin', 'Spice Market Visit'],
  itinerary: [
    { day: 1, title: 'Arrival in Cochin', description: 'Transfer to hotel. Half-day city tour covering Fort Cochin and Marine Drive.' },
    { day: 2, title: 'Alleppey Backwaters (Day Cruise)', description: 'Full-day shared houseboat cruise through the backwaters including lunch. Return to Cochin in the evening.' },
    { day: 3, title: 'Thekkady Day Trip', description: 'Guided day trip to Thekkady. Spice plantation tour and optional boat ride on Periyar Lake (own expense).' },
    { day: 4, title: 'Departure', description: 'Transfer to airport after breakfast.' }
  ],
  inclusions: ['3 nights accommodation in Cochin', 'Daily breakfast', 'Full-day backwater cruise with lunch', 'Cochin city tour', 'Thekkady spice plantation tour with transfers'],
  exclusions: ['Airfare', 'Travel insurance', 'Lunch & Dinner (except on cruise day)', 'Entrance fees for Periyar Lake', 'Personal expenses'],
  tag: 'Budget Friendly',
  category: 'budget',
  destinationId: 'kerala'
},
    {
      id: 9,
      title: "Jannat-E-Kashmir",
      destination: "6D/5N in Kashmir",
      duration: "6 Days",
      price: "₹13,500",
      originalPrice: "₹18,500",
      discount: "27%",
      image: "/images/kashmir.webp",
      highlights: [
        "Shikara Ride on Dal Lake",
        "Gulmarg Gondola Ride",
        "Pahalgam Valley Exploration",
        "Sonmarg Glacier Visit",
        "Mughal Gardens Tour"
      ],
      itinerary: [
        { day: 1, title: "Arrival in Srinagar", description: "Transfer to hotel. Visit Mughal Gardens & Hazratbal Shrine." },
        { day: 2, title: "Gulmarg Excursion", description: "Cable car ride (optional) & Drung Waterfall visit." },
        { day: 3, title: "Pahalgam Tour", description: "Explore Betaab Valley, Chandanwari & Aru Valley." },
        { day: 4, title: "Houseboat Experience", description: "Check into houseboat. Sunset Shikara ride on Dal Lake." },
        { day: 5, title: "Sonmarg Day Trip", description: "Visit Thajiwas Glacier & Zojila Pass." },
        { day: 6, title: "Departure", description: "Transfer to Srinagar airport." }
      ],
      inclusions: [
        "5 nights accommodation (3* hotels + houseboat)",
        "Daily breakfast & dinner (MAP Plan)",
        "All transfers in private sedan",
        "1-hour Shikara ride",
        "Driver charges & toll taxes"
      ],
      exclusions: [
        "Gondola ticket (Phase 2)",
        "Pony rides/union taxis",
        "Lunch & personal expenses",
        "Travel insurance",
        "Airfare"
      ],
      tag: "Nature Lover",
      category: "cultural",
      destinationId: "kashmir"
    },
    {
  "id": 13,
  "title": "Kashmir Winter Wonderland",
  "destination": "6D/5N Snow Experience",
  "duration": "6 Days",
  "price": "₹16,800",
  "originalPrice": "₹20,800",
  "discount": "19%",
  "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0mQq2Gu8Km8j6-LOWMV1FIhegfJWwAMjl1Q&s",
  "highlights": [
    "Sledging & Snow Play in Gulmarg",
    "Frozen Dal Lake Views",
    "Snow-Clad Sonmarg Visit",
    "Stay in Heated Hotels/Cottages",
    "Warm Kahwa Tea Tasting"
  ],
  "itinerary": [
    { "day": 1, "title": "Arrival in a Snowy Srinagar", "description": "Transfer to hotel. Enjoy the chilly weather." },
    { "day": 2, "title": "Ski Capital Gulmarg", "description": "Full day in Gulmarg. Enjoy snow activities (at own cost)." },
    { "day": 3, "title": "Pahalgam's Winter Charm", "description": "Drive to Pahalgam. Witness the snow-covered valleys." },
    { "day": 4, "title": "Sonmarg - Meadow of Gold & Snow", "description": "Day trip to Sonmarg. Experience heavy snowfall and frozen landscapes." },
    { "day": 5, "title": "Srinagar's Winter Delights", "description": "Shikara ride (if lake not frozen). Visit indoor markets. Warm Kahwa tea." },
    { "day": 6, "title": "Departure", "description": "Transfer to airport, possibly on snowy roads." }
  ],
  "inclusions": [
    "5 nights in heated hotels (3* equivalent)",
    "Daily Breakfast & Dinner (Warming meals)",
    "All transfers in a 4x4 vehicle (For snow safety)",
    "Shikara ride (Subject to weather conditions)",
    "Hot water bags & extra blankets in car"
  ],
  "exclusions": [
    "Skiing/Gondola charges",
    "Snow boots & gear rental",
    "Lunch & personal expenses",
    "Travel insurance (Highly recommended)",
    "Airfare (Prone to delays in winter)"
  ],
  "tag": "Winter Special",
  "category": "seasonal",
  "destinationId": "kashmir"
},
    {
      id: 10,
      title: "Amazing Thailand",
      destination: "6D/5N in Thailand",
      duration: "6 Days",
      price: "₹54,999",
      originalPrice: "₹74,999",
      discount: "28%",
      image: "/images/thailand.webp",
      highlights: [
        "Bangkok City Tour",
        "Pattaya Beach Experience",
        "Coral Island Cruise",
        "Sanctuary of Truth Visit",
        "Floating Market Tour"
      ],
      itinerary: [
        { day: 1, title: "Arrival in Bangkok", description: "Airport transfer. Evening at leisure." },
        { day: 2, title: "Bangkok Sightseeing", description: "Visit Grand Palace, Wat Pho, and Wat Arun." },
        { day: 3, title: "Bangkok to Pattaya", description: "Transfer to Pattaya. Visit Sanctuary of Truth." },
        { day: 4, title: "Coral Island Tour", description: "Speedboat to Koh Larn. Snorkeling & water sports." },
        { day: 5, title: "Floating Market", description: "Visit Damnoen Saduak Floating Market. Return to Bangkok." },
        { day: 6, title: "Departure", description: "Transfer to Bangkok airport." }
      ],
      inclusions: [
        "5 nights accommodation (3* hotels)",
        "Daily breakfast",
        "All transfers in private AC vehicle",
        "Bangkok city tour with guide",
        "Coral Island speedboat transfer"
      ],
      exclusions: [
        "International airfare",
        "Visa fees",
        "Lunch & dinner",
        "Personal expenses",
        "Optional tours"
      ],
      tag: "Beach Lover",
      category: "international",
      destinationId: "thailand"
    },
    {
  "id": 11,
  "title": "Ancient Kingdoms of Thailand",
  "destination": "8D/7N Cultural Tour of Thailand",
  "duration": "8 Days",
  "price": "₹69,999",
  "originalPrice": "₹89,999",
  "discount": "23%",
  "image": "https://www.ancient-origins.net/sites/default/files/field/image/Sukhothai-Kingdom.jpg",
  "highlights": [
    "Explore Ayutthaya Historical Park",
    "Visit the iconic White Temple (Wat Rong Khun) in Chiang Rai",
    "Meet hill tribes in Chiang Mai",
    "Attend a traditional Khantoke dinner show",
    "Meditate with monks at a Doi Suthep temple"
  ],
  "itinerary": [
    { "day": 1, "title": "Arrival in Bangkok", "description": "Airport transfer. Evening visit to Asiatique the Riverfront." },
    { "day": 2, "title": "Bangkok's Sacred Sites", "description": "In-depth tour of Grand Palace, Emerald Buddha, and Wat Pho." },
    { "day": 3, "title": "Ayutthaya Day Trip", "description": "Explore the ancient ruins and summer palace of Bang Pa-In." },
    { "day": 4, "title": "Fly to Chiang Mai", "description": "Transfer to hotel. Evening free to explore Night Bazaar." },
    { "day": 5, "title": "Chiang Mai Culture", "description": "Visit Doi Suthep, Hmong hill tribe village, and enjoy a Khantoke dinner." },
    { "day": 6, "title": "Chiang Rai Excursion", "description": "Full-day trip to the White Temple and Blue Temple." },
    { "day": 7, "title": "Flight to Bangkok", "description": "Free day for last-minute shopping or optional spa treatment." },
    { "day": 8, "title": "Departure", "description": "Transfer to Bangkok airport for your flight home." }
  ],
  "inclusions": [
    "7 nights accommodation (3-4* heritage style hotels)",
    "Daily breakfast",
    "All internal flights (Bangkok-Chiang Mai-Bangkok)",
    "All transfers and tours in private AC vehicle",
    "English speaking guide for all tours",
    "Entrance fees to all monuments"
  ],
  "exclusions": [
    "International airfare",
    "Visa fees",
    "Lunch & dinner (except Khantoke dinner)",
    "Personal expenses",
    "Optional tours"
  ],
  "tag": "Culture Buff",
  "category": "international",
  "destinationId": "thailand"
},
{
  "id": 12,
  "title": "Paradise Islands: Phuket & Krabi",
  "destination": "7D/6N Island Hopping Tour",
  "duration": "7 Days",
  "price": "₹62,499",
  "originalPrice": "₹82,499",
  "discount": "25%",
  "image": "https://cdn1.tripoto.com/media/filter/tst/img/1524784/Image/1579090570_phuketandkrabi.jpg.webp",
  "highlights": [
    "Phi Phi Islands speedboat tour",
    "James Bond Island canoeing",
    "Snorkeling in the crystal waters of Maya Bay",
    "Sunset viewing at Phuket's Promthep Cape",
    "Relaxing on Railay Beach"
  ],
  "itinerary": [
    { "day": 1, "title": "Arrival in Phuket", "description": "Airport transfer. Check-in and free time at Patong Beach." },
    { "day": 2, "title": "Phi Phi Islands Tour", "description": "Full-day speedboat trip to Maya Bay, Monkey Beach, and Pileh Lagoon." },
    { "day": 3, "title": "Phang Nga Bay & James Bond Island", "description": "Sea canoeing in mangrove caves and visiting the iconic limestone karst." },
    { "day": 4, "title": "Transfer to Krabi", "description": "Scenic transfer by road and ferry. Evening at Ao Nang Beach." },
    { "day": 5, "title": "4 Islands Tour", "description": "Speedboat tour to Phra Nang Cave, Tup Island, Chicken Island, and Poda Island." },
    { "day": 6, "title": "Free Day in Krabi", "description": "Optional activities: rock climbing, tiger cave temple, or spa day." },
    { "day": 7, "title": "Departure", "description": "Transfer from Krabi to Phuket Airport (HKT) for departure." }
  ],
  "inclusions": [
    "6 nights accommodation (beachfront 3* resorts)",
    "Daily breakfast",
    "All transfers including Phuket-Krabi ferry",
    "Shared speedboat tours to Phi Phi and 4 Islands",
    "National park fees",
    "Snorkeling equipment"
  ],
  "exclusions": [
    "International airfare (to Phuket)",
    "Visa fees",
    "Lunch & dinner",
    "Optional tours and activities",
    "Personal expenses"
  ],
  "tag": "Island Paradise",
  "category": "international",
  "destinationId": "thailand"
},
{
  "id": 13,
  "title": "Signature Thailand in Luxury",
  "destination": "6D/5N Premium All-Inclusive",
  "duration": "6 Days",
  "price": "₹1,24,999",
  "originalPrice": "₹1,49,999",
  "discount": "17%",
  "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl0aqAqeyrJiK3K9FwbX1X37NLEt2flwoBBw&s",
  "highlights": [
    "5-Star Luxury Accommodation",
    "Private long-tail boat tour of Bangkok canals",
    "Gourmet dining experiences including a Michelin-starred meal",
    "Private car with driver throughout",
    "Exclusive spa treatment for two"
  ],
  "itinerary": [
    { "day": 1, "title": "Arrival in Style", "description": "Luxury airport transfer. Check-in at 5* hotel. Evening champagne welcome." },
    { "day": 2, "title": "Private Bangkok Tour", "description": "Private long-tail boat tour, exclusive guided tour of Grand Palace. Dinner at a Michelin-starred restaurant." },
    { "day": 3, "title": "Artisanal Thailand", "description": "Private tour of Jim Thompson House. Thai cooking class with a master chef. Evening at leisure." },
    { "day": 4, "title": "Pattaya Retreat", "description": "Private transfer to a luxury beachfront resort in Pattaya. Evening free to enjoy resort amenities." },
    { "day": 5, "title": "Private Island Charter", "description": "Private speedboat charter to Coral Island for a personalized beach day with picnic lunch." },
    { "day": 6, "title": "Departure", "description": "Leisurely breakfast. Private transfer to Bangkok airport." }
  ],
  "inclusions": [
    "5 nights in 5-star luxury hotels (Mandarin Oriental, Anantara, etc.)",
    "All meals included (Breakfast, Lunch, Dinner) with one gourmet dinner",
    "Private transfers and tours in a luxury vehicle",
    "Private English-speaking guide",
    "One 60-minute spa treatment per person",
    "All entrance fees and activities as mentioned"
  ],
  "exclusions": [
    "International airfare",
    "Visa fees",
    "Premium alcoholic beverages",
    "Personal butler gratuities",
    "Anything not mentioned in inclusions"
  ],
  "tag": "Luxury",
  "category": "international",
  "destinationId": "thailand"
},
{
  "id": 14,
  "title": "A Taste of Thailand",
  "destination": "6D/5N Culinary Tour",
  "duration": "6 Days",
  "price": "₹57,999",
  "originalPrice": "₹72,999",
  "discount": "21%",
  "image": "https://tb-static.uber.com/prod/enhanced-images/image-touchup-v1/b30e98339136d753da80315e0f327964/11ea93693c85de4e809c6a008a8909a8.jpeg",
  "highlights": [
    "Street Food Tour of Chinatown (Bangkok)",
    "Authentic Thai Cooking Class in Chiang Mai",
    "Dining on the iconic Bangkok Dinner Cruise",
    "Visiting a local organic farm",
    "Tasting traditional Khanom Jeen noodles"
  ],
  "itinerary": [
    { "day": 1, "title": "Arrival in Bangkok", "description": "Airport transfer. Evening street food tour of Yaowarat (Chinatown)." },
    { "day": 2, "title": "Markets and Cooking", "description": "Visit a local wet market. Half-day Thai cooking class. Evening dinner cruise on Chao Phraya River." },
    { "day": 3, "title": "Fly to Chiang Mai", "description": "Transfer to hotel. Evening tour of Chiang Mai Night Market for local snacks." },
    { "day": 4, "title": "Farm to Table Experience", "description": "Visit an organic farm. Cook and enjoy a meal using fresh ingredients. Free evening." },
    { "day": 5, "title": "Local Food Exploration", "description": "Visit a local village to see traditional food preparation. Return to Bangkok by flight." },
    { "day": 6, "title": "Departure", "description": "Last-minute souvenir shopping for spices. Transfer to airport." }
  ],
  "inclusions": [
    "5 nights accommodation (boutique hotels)",
    "Daily breakfast and all meals mentioned in the itinerary",
    "All cooking classes and market tours",
    "All transfers and domestic flights",
    "English-speaking food guide"
  ],
  "exclusions": [
    "International airfare",
    "Visa fees",
    "Additional meals and drinks",
    "Personal expenses",
    "Optional tours"
  ],
  "tag": "Foodie's Delight",
  "category": "international",
  "destinationId": "thailand"
},
  ];

  // Upcoming Packages Data
  const upcomingPackages = [
    {
      id: 17,
      title: 'Kashmir Paradise Tour',
      destination: '7D/6N in Kashmir',
      duration: '7 Days',
      price: '₹49,999',
      originalPrice: '₹64,999',
      discount: '23%',
      image: '/images/kashmir.webp',
      highlights: [
        'Shikara Ride on Dal Lake',
        'Gondola Ride in Gulmarg',
        'Pahalgam Valley Exploration',
        'Stay in Houseboat',
        'Mughal Gardens Visit'
      ],
      itinerary: [
        { 
          day: 1, 
          title: 'Arrival in Srinagar', 
          description: 'Transfer to hotel. Evening Shikara ride on Dal Lake during sunset.' 
        },
        { 
          day: 2, 
          title: 'Srinagar Sightseeing', 
          description: 'Visit Mughal Gardens (Shalimar Bagh, Nishat Bagh), Hazratbal Shrine, and local markets.' 
        },
        { 
          day: 3, 
          title: 'Gulmarg Excursion', 
          description: 'Gondola cable car ride (Phase 1 or 2 depending on weather), visit Alpather Lake and golf course.' 
        },
        { 
          day: 4, 
          title: 'Pahalgam Exploration', 
          description: 'Visit Betaab Valley, Aru Valley, and Chandanwari (gateway to Amarnath Yatra).' 
        },
        { 
          day: 5, 
          title: 'Sonmarg Day Trip', 
          description: 'Visit Thajiwas Glacier (pony ride available) and enjoy mountain views.' 
        },
        { 
          day: 6, 
          title: 'Houseboat Experience', 
          description: 'Check into traditional houseboat. Leisure day with optional activities like walnut wood carving demo.' 
        },
        { 
          day: 7, 
          title: 'Departure', 
          description: 'Transfer to Srinagar airport with farewell gifts.' 
        }
      ],
      inclusions: [
        '6 nights accommodation (3-star hotels + 1 night houseboat)',
        'Daily breakfast and dinner (MAP Plan)',
        'All transfers in private vehicle (Sedan for 2-3 pax, Innova for 4-6 pax)',
        'Shikara ride on Dal Lake (1 hour)',
        'Gulmarg Gondola ticket (Phase 1)',
        'Driver charges, toll taxes and parking'
      ],
      exclusions: [
        'Airfare to/from Srinagar',
        'Gondola ticket (Phase 2)',
        'Pony rides in Sonmarg/Pahalgam',
        'Lunch and personal expenses',
        'Travel insurance',
        'Anything not mentioned in inclusions'
      ],
      tag: 'Best Seller',
      category: 'cultural',
      launchDate: '2024-03-01',
      bestSeason: 'April to October',
      specialNotes: 'Warm clothing recommended even in summer months. Package can be customized for winter snow experience.'
    },
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === featuredDestinations.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Video progress tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setVideoStates(prevStates => {
        return prevStates.map((state, index) => {
          const video = videoRefs.current[index];
          if (!video) return state;
          
          const newProgress = video.duration > 0 
            ? (video.currentTime / video.duration) * 100 
            : 0;
            
          return {
            ...state,
            progress: newProgress
          };
        });
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  // Color variables
  const primaryColor = 'bg-pink-600';
  const primaryHoverColor = 'hover:bg-pink-700';
  const primaryTextColor = 'text-pink-600';
  const primaryBorderColor = 'border-pink-600';
  const primaryBgLight = 'bg-pink-50';

  // Video controls
  const togglePlay = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;
    
    if (video.paused) {
      video.play();
      setVideoStates(prevStates => {
        const newStates = [...prevStates];
        newStates[index] = { ...newStates[index], isPlaying: true };
        return newStates;
      });
    } else {
      video.pause();
      setVideoStates(prevStates => {
        const newStates = [...prevStates];
        newStates[index] = { ...newStates[index], isPlaying: false };
        return newStates;
      });
    }
  };

  const toggleMute = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;
    
    video.muted = !video.muted;
    setVideoStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index] = { ...newStates[index], isMuted: video.muted };
      return newStates;
    });
  };

  const handleVideoHover = (index, isHovering) => {
    const video = videoRefs.current[index];
    if (!video) return;
    
    if (isHovering && !videoStates[index].isPlaying) {
      video.currentTime = 0;
      video.play();
      setVideoStates(prevStates => {
        const newStates = [...prevStates];
        newStates[index] = { ...newStates[index], isPlaying: true };
        return newStates;
      });
    } else if (!isHovering && videoStates[index].isPlaying) {
      video.pause();
      setVideoStates(prevStates => {
        const newStates = [...prevStates];
        newStates[index] = { ...newStates[index], isPlaying: false };
        return newStates;
      });
    }
  };

  const toggleLike = (videoId) => {
    if (likedVideos.includes(videoId)) {
      setLikedVideos(likedVideos.filter(id => id !== videoId));
    } else {
      setLikedVideos([...likedVideos, videoId]);
    }
  };

  // Carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === featuredDestinations.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? featuredDestinations.length - 1 : prev - 1));
  };

  // Testimonial navigation
  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  // Package filtering
  const filteredPackages = holidayPackages.filter(pkg => {
    const matchesCategory = activeCategory === 'all' || pkg.category === activeCategory;
    const matchesDestination = selectedDestination === '' || pkg.destinationId === selectedDestination;
    const matchesSearch = searchQuery === '' || 
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesDestination && matchesSearch;
  });
  
  const displayedPackages = showAllPackages 
    ? filteredPackages 
    : filteredPackages.slice(0, 6);

  const displayedUpcomingPackages = showAllUpcoming
    ? upcomingPackages
    : upcomingPackages.slice(0, 3);

  // Handle package viewing
  const handleViewDetails = (pkg) => {
    setSelectedPackage(pkg);
    setShowDetailsModal(true);
  };

  // Handle booking
  const handleBookNow = (pkg) => {
    setSelectedPackage(pkg);
    setFormData(prev => ({
      ...prev,
      package: pkg.title
    }));
    setShowBookingForm(true);
    setPaymentError('');
  };

  // Handle search
  const handleSearch = (searchCriteria) => {
    const { destination, startDate, endDate } = searchCriteria;
    
    // Filter packages based on search criteria
    const results = holidayPackages.filter(pkg => {
      const matchesDestination = !destination || pkg.destinationId === destination;
      return matchesDestination;
    });
    
    setSearchResults(results);
    setShowSearchResults(true);
    
    // Scroll to search results
    setTimeout(() => {
      const resultsElement = document.getElementById('search-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear payment error when user starts filling form
    if (paymentError) setPaymentError('');
  };

  const handleQuotesInputChange = (e) => {
    const { name, value } = e.target;
    setQuotesFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotifyInputChange = (e) => {
    const { name, value } = e.target;
    setNotifyFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (interest) => {
    setNotifyFormData(prev => {
      const interests = [...prev.interests];
      const index = interests.indexOf(interest);
      
      if (index === -1) {
        interests.push(interest);
      } else {
        interests.splice(index, 1);
      }
      
      return {
        ...prev,
        interests
      };
    });
  };

  // Handle search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSearchActive(e.target.value.length > 0);
  };

  // Handle destination change
  const handleDestinationChange = (e) => {
    setSelectedDestination(e.target.value);
  };

  // Submit booking form - FIXED Phone Number Issue
  const handleSubmit = async (e, isPaymentFlow = false) => {
    e.preventDefault();
    
    try {
      // Format dates for better display in email
      const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };

      // Prepare template parameters - FIXED phone field name
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone_number: formData.phone, // Changed from 'phone' to 'phone_number'
        package_name: selectedPackage?.title || 'Not specified',
        package_price: selectedPackage?.price || 'Not specified',
        destination: selectedPackage?.destination || 'Not specified',
        duration: selectedPackage?.duration || 'Not specified',
        arrival_date: formatDate(formData.arrivalDate),
        departure_date: formatDate(formData.departureDate),
        adults: formData.adults,
        kids: formData.kids || '0',
        kids_ages: formData.kidsAges || 'Not specified',
        hotel_category: `${formData.hotelCategory} Star`,
        meals_included: formData.mealsIncluded,
        budget: formData.budget || 'Not specified',
        message: formData.message || 'No special requests',
        payment_status: isPaymentFlow ? 'PENDING_PAYMENT' : 'BOOKING_REQUEST',
        subject: `New Booking Request - ${selectedPackage?.title || 'Travel Package'}`
      };

      console.log('Sending email with params:', templateParams);

      // Send to EmailJS
      const emailResponse = await emailjs.send(
        'service_ov629rm',
        'template_jr1dnto',
        templateParams,
        '37pN2ThzFwwhwk7ai'
      );

      console.log('Email sent successfully!', emailResponse.status, emailResponse.text);
      
      if (!isPaymentFlow) {
        setFormSubmitted(true);
        alert('Booking request sent successfully! We will contact you shortly.');
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormSubmitted(false);
          setShowBookingForm(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            arrivalDate: '',
            departureDate: '',
            adults: '1',
            kids: '',
            kidsAges: '',
            hotelCategory: '3',
            mealsIncluded: 'yes',
            budget: '',
            package: '',
            message: ''
          });
        }, 3000);
      }
      
      return true;
    } catch (error) {
      console.error('FAILED to send email:', error);
      if (!isPaymentFlow) {
        alert(`Failed to send booking request. Please try again later. Error: ${error.text || error.message}`);
      }
      return false;
    }
  };

  // Submit quotes form - FIXED Phone Number Issue
  const handleQuotesSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const templateParams = {
        from_name: quotesFormData.name,
        from_email: quotesFormData.email,
        phone_number: quotesFormData.phone, // Changed from 'phone' to 'phone_number'
        interest: quotesFormData.interest,
        message: quotesFormData.message || 'No additional message',
        subject: 'New Travel Quote Request'
      };

      console.log('Sending quote request:', templateParams);

      const emailResponse = await emailjs.send(
        'service_ov629rm',
        'template_jr1dnto',
        templateParams,
        '37pN2ThzFwwhwk7ai'
      );

      console.log('Quote email sent successfully!', emailResponse.status, emailResponse.text);
      
      setQuotesFormSubmitted(true);
      alert('Enquiry sent successfully! We will contact you shortly.');
      
      // Reset form after successful submission
      setTimeout(() => {
        setQuotesFormSubmitted(false);
        setShowQuotesForm(false);
        setQuotesFormData({
          name: '',
          email: '',
          phone: '',
          interest: 'General Inquiry',
          message: ''
        });
      }, 3000);
    } catch (error) {
      console.error('FAILED to send quote request:', error);
      alert(`Failed to send enquiry. Please try again later. Error: ${error.text || error.message}`);
    }
  };

  // Submit notify form
  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    
    try {
      const templateParams = {
        from_name: notifyFormData.name,
        from_email: notifyFormData.email,
        phone_number: 'Not provided', // Added phone field for consistency
        interests: notifyFormData.interests.join(', ') || 'No specific interests',
        message: notifyFormData.message || 'No additional message',
        subject: 'New Package Notification Request'
      };

      console.log('Sending notification request:', templateParams);

      const emailResponse = await emailjs.send(
        'service_ov629rm',
        'template_jr1dnto',
        templateParams,
        '37pN2ThzFwwhwk7ai'
      );

      console.log('Notification email sent successfully!', emailResponse.status, emailResponse.text);
      
      setNotifyFormSubmitted(true);
      alert('Notification request submitted successfully!');
      
      // Reset form after successful submission
      setTimeout(() => {
        setNotifyFormSubmitted(false);
        setShowNotifyForm(false);
        setNotifyFormData({
          name: '',
          email: '',
          interests: [],
          message: ''
        });
      }, 3000);
    } catch (error) {
      console.error('FAILED to send notification request:', error);
      alert(`Failed to submit notification request. Please try again later. Error: ${error.text || error.message}`);
    }
  };

  // Payment handler function
  const paymentHandler = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.arrivalDate || !formData.departureDate) {
      setPaymentError('Please fill all required fields before proceeding to payment.');
      return;
    }

    setPaymentError('');
    
    try {
      // First send the booking data via email
      const emailSent = await handleSubmit(e, true);
      
      if (!emailSent) {
        alert('Failed to process booking. Please try again.');
        return;
      }

      // For demo purposes - in production, integrate with actual payment gateway
      alert('Booking request submitted successfully! Our team will contact you for payment processing.');
      setShowBookingForm(false);
      
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment initialization failed. Please try again.");
    }
  };

  return (
    <div className="bg-white">
      {/* Search Bar */}
      <AnimatePresence>
        {searchActive && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 bg-white shadow-md z-50"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
              <motion.input
                type="text"
                placeholder="Search destinations, packages, cities..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                value={searchQuery}
                onChange={handleSearchChange}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              />
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchActive(false)}
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Button (floating) */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setSearchActive(true)}
        className={`fixed bottom-20 right-4 md:bottom-25 md:right-8 ${primaryColor} text-white p-3 md:p-4 rounded-full shadow-lg z-40 transition-all duration-300 ${searchActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <FaSearch className="h-4 w-4 md:h-5 md:w-5" />
      </motion.button>

      {/* Contact Button (floating) */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowContactPopup(true)}
        className={`fixed bottom-32 right-4 md:bottom-40 md:right-8 ${primaryColor} text-white p-3 md:p-4 rounded-full shadow-lg z-40 transition-all duration-300`}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <FaPhone className="h-4 w-4 md:h-5 md:w-5" />
      </motion.button>

      {/* Featured Destinations Carousel */}
      <section className="relative">
        <div className="relative h-[70vh] md:h-screen max-h-[800px] overflow-hidden">
          {featuredDestinations.map((dest, index) => (
            <motion.div 
              key={dest.id}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === currentSlide ? 1 : 0,
                scale: index === currentSlide ? 1 : 1.1
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className={`absolute inset-0 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <motion.img 
                src={dest.image} 
                alt={dest.title} 
                className="w-full h-full object-cover"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end pb-32 md:pb-40 px-4 md:px-8`}>
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="max-w-3xl"
                >
                  <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className={`${primaryColor} text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-bold mb-3 md:mb-4 inline-block`}
                  >
                    Featured Destination
                  </motion.span>
                  <motion.h3 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4"
                  >
                    {dest.title}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="text-lg md:text-xl text-gray-200 mb-4 md:mb-6"
                  >
                    {dest.description}
                  </motion.p>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex items-center mb-4 md:mb-6"
                  >
                    <span className="text-white font-medium text-sm md:text-base">{dest.price} per person</span>
                  </motion.div>
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-white hover:bg-gray-100 ${primaryTextColor} px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-colors duration-200 inline-flex items-center shadow-lg hover:shadow-xl mb-20 md:mb-0`}
                    onClick={() => {
                      // Scroll to holiday packages section
                      const packagesSection = document.getElementById('holiday-packages');
                      if (packagesSection) {
                        packagesSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Explore 
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FaArrowRight className="ml-2 md:ml-3 h-4 w-4" />
                    </motion.span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ))}
          
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.5)" }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="absolute left-2 md:left-8 top-1/2 transform -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 bg-white/30 text-white p-2 md:p-4 rounded-full hover:bg-white/50 transition-colors duration-200 shadow-lg"
          >
            <FaChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.5)" }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="absolute right-2 md:right-8 top-1/2 transform -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 bg-white/30 text-white p-2 md:p-4 rounded-full hover:bg-white/50 transition-colors duration-200 shadow-lg"
          >
            <FaChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </motion.button>
          
          <div className="absolute bottom-32 md:bottom-40 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3 z-10">
            {featuredDestinations.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 md:w-4 md:h-4 rounded-full transition-all ${index === currentSlide ? 'bg-white w-4 md:w-6' : 'bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Search Form - Moved Below with better mobile spacing */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10 w-full max-w-6xl px-4">
          <div className="mb-4 md:mb-0">
            <SearchForm onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      {showSearchResults && (
        <section id="search-results" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchResults 
              results={searchResults} 
              onViewDetails={handleViewDetails}
              onBookNow={handleBookNow}
            />
          </div>
        </section>
      )}
      
      {/* Spacing for mobile view between slide and search sections */}
      <div className="h-16 md:h-20 lg:h-24"></div>

      {/* Additional spacing for mobile */}
      <div className="h-8 md:h-12"></div>
      
      {/* Trending Cities Section with Links */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`${primaryTextColor} font-semibold text-sm md:text-base`}
            >
              POPULAR DESTINATIONS
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-4xl font-bold text-gray-900 mt-2 md:mt-3"
            >
              Trending Cities To Visit
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-3 md:mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Discover the most popular destinations loved by travelers worldwide
            </motion.p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6"
          >
            {trendingCities.map((city, index) => (
              <motion.div 
                key={city.id}
                variants={fadeInUp}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-48 md:h-64"
              >
                <motion.img 
                  src={city.image} 
                  alt={city.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  whileHover={{ scale: 1.1 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-4 md:p-6">
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-lg md:text-xl font-bold text-white"
                  >
                    {city.name}
                  </motion.h3>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-between items-center mt-1 md:mt-2"
                  >
                    <span className="text-white font-medium text-sm md:text-base">From {city.price}</span>
                    <motion.button 
                      whileHover={{ scale: 1.2 }}
                      className="text-white hover:text-pink-300 transition-colors"
                    >
                      <IoMdHeart className="h-4 w-4 md:h-5 md:w-5" />
                    </motion.button>
                  </motion.div>
                </div>
                <Link 
                  to={`/${city.slug}`}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity duration-300"
                >
                  <motion.span 
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1 }}
                    className={`bg-white ${primaryTextColor} px-4 md:px-6 py-1.5 md:py-2 rounded-lg font-medium shadow-md hover:bg-pink-50 transition-colors text-sm md:text-base`}
                  >
                    Explore Packages
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

       {/* Premium Travel Quote Section */}
      <section className="py-20 relative overflow-hidden min-h-[600px]">
        {/* Background Image with Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
            filter: "brightness(0.8)"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-pink-700/40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full">
          <div className="flex flex-col lg:flex-row items-center h-full">
            {/* Content Section - Left Side */}
            <div className="text-white p-8 lg:w-1/2 lg:pr-16">
              <h1 className="text-5xl font-bold mb-8 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-300">
                  World Tour Packages
                </span>
              </h1>
              
              <div className="space-y-8">
                <div className="flex items-start transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex-shrink-0 bg-white/30 p-3 rounded-full mr-4 backdrop-blur-sm">
                    <FaGlobe className="h-5 w-5 text-pink-200" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white drop-shadow-lg">200+ International Destinations</h3>
                    <p className="text-pink-100 mt-2 text-lg">Explore the world's most breathtaking locations</p>
                  </div>
                </div>
                
                <div className="flex items-start transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex-shrink-0 bg-white/30 p-3 rounded-full mr-4 backdrop-blur-sm">
                    <FaHotel className="h-5 w-5 text-pink-200" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white drop-shadow-lg">Luxury Accommodations</h3>
                    <p className="text-pink-100 mt-2 text-lg">Stay at the finest hotels and resorts worldwide</p>
                  </div>
                </div>
                
                <div className="flex items-start transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex-shrink-0 bg-white/30 p-3 rounded-full mr-4 backdrop-blur-sm">
                    <FaUmbrellaBeach className="h-5 w-5 text-pink-200" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white drop-shadow-lg">Custom Experiences</h3>
                    <p className="text-pink-100 mt-2 text-lg">Tailored itineraries for your dream vacation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Form - Right Side (Shifted Right) */}
            <div className="w-full lg:w-[480px] px-4 mt-8 lg:mt-0 lg:ml-20">
              <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/20 p-8 transform hover:shadow-3xl transition-all duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Get Free Quotes
                  </h2>
                  <p className="text-gray-600 mt-3 text-base">Let our travel experts craft your perfect vacation</p>
                </div>
                
                <form ref={quotesFormRef} onSubmit={handleQuotesSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      value={quotesFormData.name}
                      onChange={handleQuotesInputChange}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={quotesFormData.email}
                      onChange={handleQuotesInputChange}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="Your email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={quotesFormData.phone}
                      onChange={handleQuotesInputChange}
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="Your phone"
                      required
                    />
                  </div>
                  
                  {quotesFormSubmitted ? (
                    <div className="bg-green-100 text-green-700 p-3 rounded-lg text-center">
                      Thank you! We've received your inquiry and will contact you shortly.
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                    >
                      GET FREE QUOTE →
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Holiday Packages Section */}
      <section id="holiday-packages" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className={`${primaryTextColor} font-semibold`}>TRAVEL PACKAGES</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3">Amazing Holiday Packages</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked experiences tailored to your travel style
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setShowAllPackages(false);
                }}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${activeCategory === category.id ? `${primaryColor} text-white` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {displayedPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPackages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-pink-100"
                >
                  <div className={`absolute top-4 right-4 z-10 ${primaryColor} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                    {pkg.tag}
                  </div>
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/90 text-pink-600 px-3 py-1 rounded-lg text-sm font-bold flex items-center">
                      <IoIosFlash className="mr-1 h-4 w-4" /> {pkg.discount} OFF
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">{pkg.title}</h3>
                    <p className="text-gray-600 mb-4 flex items-center">
                      <GiSuitcase className="mr-2 text-pink-500 h-4 w-4" /> {pkg.destination}
                    </p>
                    
                    <div className="flex items-center mb-4 text-gray-600">
                      <FaCalendarAlt className="mr-2 text-pink-500 h-4 w-4" />
                      <span>{pkg.duration}</span>
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {pkg.highlights.slice(0, 3).map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-pink-600">{pkg.price}</span>
                        <span className="ml-2 text-sm text-gray-500 line-through">{pkg.originalPrice}</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewDetails(pkg)}
                          className="border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleBookNow(pkg)}
                          className={`${primaryColor} ${primaryHoverColor} text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200`}
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No packages found matching your search.</p>
            </div>
          )}

          {filteredPackages.length > 6 && (
            <div className="text-center mt-12">
              <button 
                className={`border-2 ${primaryBorderColor} ${primaryTextColor} hover:${primaryColor} hover:text-white px-8 py-3 rounded-lg font-bold transition-colors duration-200`}
                onClick={() => setShowAllPackages(!showAllPackages)}
              >
                {showAllPackages ? 'Show Less' : 'View All Packages'}
              </button>
            </div>
          )}
        </div>
      </section>
      {/* Upcoming Packages Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-pink-600 font-semibold text-sm md:text-base"
            >
              COMING SOON
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-4xl font-bold text-gray-900 mt-2 md:mt-3"
            >
              Upcoming Travel Packages
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mt-3 md:mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Exciting new destinations we're launching soon - get early bird discounts!
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {displayedUpcomingPackages.map((pkg, index) => (
              <motion.div 
                key={pkg.id} 
                variants={fadeInUp}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-pink-200"
              >
                <motion.div 
                  className="absolute top-3 md:top-4 right-3 md:right-4 z-10 bg-pink-600 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold"
                  whileHover={{ scale: 1.1 }}
                >
                  {pkg.tag}
                </motion.div>
                <div className="h-48 md:h-64 overflow-hidden relative">
                  <motion.img 
                    src={pkg.image} 
                    alt={pkg.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                  <motion.div 
                    className="absolute bottom-3 md:bottom-4 left-3 md:left-4 bg-white/90 text-pink-600 px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-bold flex items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <IoIosFlash className="mr-1 h-3 w-3 md:h-4 md:w-4" /> Launching 01 Oct 2025
                  </motion.div>
                </div>
                <div className="p-4 md:p-6">
                  <motion.h3 
                    whileHover={{ color: "#ec4899" }}
                    className="text-lg md:text-xl font-bold text-gray-900 mb-2 transition-colors"
                  >
                    {pkg.title}
                  </motion.h3>
                  <p className="text-gray-600 mb-3 md:mb-4 flex items-center text-sm md:text-base">
                    <GiSuitcase className="mr-2 text-pink-500 h-3 w-3 md:h-4 md:w-4" /> {pkg.destination}
                  </p>
                  
                  <div className="flex items-center mb-3 md:mb-4 text-gray-600 text-sm md:text-base">
                    <FaCalendarAlt className="mr-2 text-pink-500 h-3 w-3 md:h-4 md:w-4" />
                    <span>{pkg.duration}</span>
                  </div>
                  
                  <ul className="space-y-1.5 md:space-y-2 mb-4 md:mb-6">
                    {pkg.highlights.slice(0, 3).map((highlight, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start text-sm md:text-base"
                      >
                        <motion.svg 
                          className="h-3 w-3 md:h-4 md:w-4 text-pink-500 mr-2 mt-0.5 flex-shrink-0" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          whileHover={{ scale: 1.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </motion.svg>
                        <span className="text-gray-700">{highlight}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xl md:text-2xl font-bold text-pink-600">{pkg.price}</span>
                      <span className="ml-1 md:ml-2 text-xs md:text-sm text-gray-500 line-through">{pkg.originalPrice}</span>
                      </div>
                    <motion.button 
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 5px 15px -3px rgba(236, 72, 153, 0.3)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setShowNotifyForm(true);
                      }}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-colors duration-200 text-xs md:text-sm"
                    >
                      Get Early Access
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-8 md:mt-12"
          >
            <motion.button 
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "#ec4899",
                color: "white"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifyForm(true)}
              className="border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-bold transition-colors duration-200 text-sm md:text-base"
            >
              Notify Me About New Packages
            </motion.button>
            {upcomingPackages.length > 3 && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                className="ml-3 md:ml-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-bold transition-colors duration-200 text-sm md:text-base"
              >
                {showAllUpcoming ? 'Show Less' : 'View All Upcoming'}
              </motion.button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className={`${primaryTextColor} font-semibold text-sm md:text-base`}
            >
              WHY CHOOSE US
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-4xl font-bold text-gray-900 mt-2 md:mt-3"
            >
              We Make Travel Easy
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mt-3 md:mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Everything you need for a perfect trip in one place
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          >
            {[
              {
                icon: (
                  <svg className="h-4 w-4 md:h-5 md:w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                ),
                title: "Best Price Guarantee",
                description: "We guarantee the best prices for all our packages. Found a better deal? We'll match it!"
              },
              {
                icon: (
                  <svg className="h-4 w-4 md:h-5 md:w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Trusted & Safe",
                description: "Your safety and satisfaction are our top priorities. Travel with confidence."
              },
              {
                icon: (
                  <svg className="h-4 w-4 md:h-5 md:w-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: "24/7 Support",
                description: "Our travel experts are available round the clock to assist you anytime, anywhere."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                whileHover={{ 
                  y: -5,
                  scale: 1.02
                }}
                className="bg-white p-6 md:p-8 rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <motion.div 
                  className="bg-pink-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4"
            >
              Video Testimonials
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Watch our travelers share their unforgettable experiences
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
          >
            {videoTestimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                variants={scaleIn}
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -1, 1, 0]
                }}
                className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl aspect-[9/16] group"
                onMouseEnter={() => handleVideoHover(index, true)}
                onMouseLeave={() => handleVideoHover(index, false)}
              >
                <video
                  ref={el => videoRefs.current[index] = el}
                  src={testimonial.content}
                  loop
                  muted={videoStates[index].isMuted}
                  className="w-full h-full object-cover"
                  playsInline
                  preload="metadata"
                  poster={testimonial.thumbnail}
                />
                
                {/* Video overlay with gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent flex flex-col justify-between p-3 md:p-6`}>
                  {/* Top info */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm md:text-xl text-white">{testimonial.name}</h3>
                      <p className="text-xs md:text-sm text-white/80">{testimonial.role}</p>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(testimonial.id);
                      }}
                      className={`p-1.5 md:p-2 rounded-full ${likedVideos.includes(testimonial.id) ? 'bg-pink-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'} transition-colors`}
                    >
                      <FaHeart className="h-3 w-3 md:h-4 md:w-4" />
                    </motion.button>
                  </div>
                  
                  {/* Center play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => togglePlay(index)}
                      className={`p-3 md:p-5 rounded-full ${videoStates[index].isPlaying ? 'bg-white/30' : 'bg-white/20'} hover:bg-white/40 backdrop-blur-md shadow-lg transform group-hover:scale-110 transition-transform`}
                    >
                      {videoStates[index].isPlaying ? (
                        <FaPause className="text-white text-base md:text-xl h-3 w-3 md:h-4 md:w-4" />
                      ) : (
                        <FaPlay className="text-white text-base md:text-xl h-3 w-3 md:h-4 md:w-4" />
                      )}
                    </motion.button>
                  </div>
                  
                  {/* Bottom controls */}
                  <div className="flex flex-col gap-2 md:gap-3">
                    <div className="w-full bg-white/30 rounded-full h-1 md:h-1.5 overflow-hidden">
                      <motion.div
                        className="bg-white h-1 md:h-1.5 rounded-full"
                        style={{ width: `${videoStates[index].progress}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${videoStates[index].progress}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMute(index);
                        }}
                        className="p-1.5 md:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        {videoStates[index].isMuted ? (
                          <FaVolumeMute className="text-white h-3 w-3 md:h-4 md:w-4" />
                        ) : (
                          <FaVolumeUp className="text-white h-3 w-3 md:h-4 md:w-4" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {/* Play indicator */}
                {!videoStates[index].isPlaying && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-2 md:top-4 right-2 md:right-4 bg-black/70 text-white text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full flex items-center gap-1"
                  >
                    <FaPlay size={8} /> PLAY
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-8 md:mt-12"
          >
            <motion.button 
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              className={`${primaryColor} ${primaryHoverColor} text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-bold transition-colors duration-200 inline-flex items-center text-sm md:text-base`}
            >
              View More Testimonials 
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Women's Solo Trip Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4"
            >
              Women's Solo Trip Experiences
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Safe and empowering travel experiences designed exclusively for women
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
          >
            {soloTripVideos.map((testimonial, index) => {
              const videoIndex = index + videoTestimonials.length; // Offset index
              return (
                <motion.div 
                  key={testimonial.id}
                  variants={scaleIn}
                  whileHover={{ 
                    scale: 1.05,
                    rotate: [0, -1, 1, 0]
                  }}
                  className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl aspect-[9/16] group"
                  onMouseEnter={() => handleVideoHover(videoIndex, true)}
                  onMouseLeave={() => handleVideoHover(videoIndex, false)}
                >
                  <video
                    ref={el => videoRefs.current[videoIndex] = el}
                    src={testimonial.content}
                    loop
                    muted={videoStates[videoIndex].isMuted}
                    className="w-full h-full object-cover"
                    playsInline
                    preload="metadata"
                    poster={testimonial.thumbnail}
                  />
                  
                  {/* Video overlay with gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent flex flex-col justify-between p-3 md:p-6`}>
                    {/* Top info */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm md:text-xl text-white">{testimonial.name}</h3>
                        <p className="text-xs md:text-sm text-white/80">{testimonial.role}</p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(testimonial.id);
                        }}
                        className={`p-1.5 md:p-2 rounded-full ${likedVideos.includes(testimonial.id) ? 'bg-pink-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'} transition-colors`}
                      >
                        <FaHeart className="h-3 w-3 md:h-4 md:w-4" />
                      </motion.button>
                    </div>
                    
                    {/* Bottom controls */}
                    <div className="flex flex-col gap-2 md:gap-3">
                      <div className="w-full bg-white/30 rounded-full h-1 md:h-1.5 overflow-hidden">
                        <motion.div
                          className="bg-white h-1 md:h-1.5 rounded-full"
                          style={{ width: `${videoStates[videoIndex].progress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${videoStates[videoIndex].progress}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => togglePlay(videoIndex)}
                          className={`p-2 md:p-3 rounded-full ${videoStates[videoIndex].isPlaying ? 'bg-white/30' : 'bg-white/20'} hover:bg-white/40 backdrop-blur-md shadow-lg`}
                        >
                          {videoStates[videoIndex].isPlaying ? (
                            <FaPause className="text-white h-3 w-3 md:h-4 md:w-4" />
                          ) : (
                            <FaPlay className="text-white h-3 w-3 md:h-4 md:w-4" />
                          )}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute(videoIndex);
                          }}
                          className="p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        >
                          {videoStates[videoIndex].isMuted ? (
                            <FaVolumeMute className="text-white h-3 w-3 md:h-4 md:w-4" />
                          ) : (
                            <FaVolumeUp className="text-white h-3 w-3 md:h-4 md:w-4" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Play indicator */}
                  {!videoStates[videoIndex].isPlaying && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-2 md:top-4 right-2 md:right-4 bg-black/70 text-white text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full flex items-center gap-1"
                    >
                      <FaPlay size={8} /> PLAY
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-8 md:mt-12"
          >
            <motion.button 
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              className={`${primaryColor} ${primaryHoverColor} text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-bold transition-colors duration-200 inline-flex items-center text-sm md:text-base`}
            >
              Explore Women's Solo Trips 
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Group Trips Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4"
            >
              Amazing Group Trips
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Create unforgettable memories with friends and family on our curated group tours
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
          >
            {groupTripVideos.map((testimonial, index) => {
              const videoIndex = index + videoTestimonials.length + soloTripVideos.length; // Offset index
              return (
                <motion.div 
                  key={testimonial.id}
                  variants={scaleIn}
                  whileHover={{ 
                    scale: 1.05,
                    rotate: [0, -1, 1, 0]
                  }}
                  className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl aspect-[9/16] group"
                  onMouseEnter={() => handleVideoHover(videoIndex, true)}
                  onMouseLeave={() => handleVideoHover(videoIndex, false)}
                >
                  <video
                    ref={el => videoRefs.current[videoIndex] = el}
                    src={testimonial.content}
                    loop
                    muted={videoStates[videoIndex].isMuted}
                    className="w-full h-full object-cover"
                    playsInline
                    preload="metadata"
                    poster={testimonial.thumbnail}
                  />
                  
                  {/* Video overlay with gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent flex flex-col justify-between p-3 md:p-6`}>
                    {/* Top info */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm md:text-xl text-white">{testimonial.name}</h3>
                        <p className="text-xs md:text-sm text-white/80">{testimonial.role}</p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(testimonial.id);
                        }}
                        className={`p-1.5 md:p-2 rounded-full ${likedVideos.includes(testimonial.id) ? 'bg-pink-600 text-white' : 'bg-white/20 text-white hover:bg-white/30'} transition-colors`}
                      >
                        <FaHeart className="h-3 w-3 md:h-4 md:w-4" />
                      </motion.button>
                    </div>
                    
                    {/* Bottom controls */}
                    <div className="flex flex-col gap-2 md:gap-3">
                      <div className="w-full bg-white/30 rounded-full h-1 md:h-1.5 overflow-hidden">
                        <motion.div
                          className="bg-white h-1 md:h-1.5 rounded-full"
                          style={{ width: `${videoStates[videoIndex].progress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${videoStates[videoIndex].progress}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => togglePlay(videoIndex)}
                          className={`p-2 md:p-3 rounded-full ${videoStates[videoIndex].isPlaying ? 'bg-white/30' : 'bg-white/20'} hover:bg-white/40 backdrop-blur-md shadow-lg`}
                        >
                          {videoStates[videoIndex].isPlaying ? (
                            <FaPause className="text-white h-3 w-3 md:h-4 md:w-4" />
                          ) : (
                            <FaPlay className="text-white h-3 w-3 md:h-4 md:w-4" />
                          )}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute(videoIndex);
                          }}
                          className="p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        >
                          {videoStates[videoIndex].isMuted ? (
                            <FaVolumeMute className="text-white h-3 w-3 md:h-4 md:w-4" />
                          ) : (
                            <FaVolumeUp className="text-white h-3 w-3 md:h-4 md:w-4" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Play indicator */}
                  {!videoStates[videoIndex].isPlaying && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-2 md:top-4 right-2 md:right-4 bg-black/70 text-white text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full flex items-center gap-1"
                    >
                      <FaPlay size={8} /> PLAY
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-8 md:mt-12"
          >
            <motion.button 
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              className={`${primaryColor} ${primaryHoverColor} text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-bold transition-colors duration-200 inline-flex items-center text-sm md:text-base`}
            >
              Explore Group Trips 
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <FaArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Package Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedPackage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">{selectedPackage.title}</h3>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="h-5 w-5" />
                </motion.button>
              </div>
              
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                  <div className="lg:col-span-2">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative h-60 md:h-80 rounded-xl overflow-hidden mb-4 md:mb-6"
                    >
                      <img 
                        src={selectedPackage.image} 
                        alt={selectedPackage.title} 
                        className="w-full h-full object-cover"
                      />
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="absolute bottom-3 md:bottom-4 left-3 md:left-4 bg-white/90 text-pink-600 px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-bold flex items-center"
                      >
                        <IoIosFlash className="mr-1 h-3 w-3 md:h-4 md:w-4" /> {selectedPackage.discount} OFF
                      </motion.div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mb-6 md:mb-8"
                    >
                      <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Package Highlights</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                        {selectedPackage.highlights.map((highlight, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="flex items-start bg-pink-50 p-2 md:p-3 rounded-lg text-sm md:text-base"
                          >
                            <motion.svg 
                              className="h-3 w-3 md:h-4 md:w-4 text-pink-600 mr-2 mt-0.5 flex-shrink-0" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                              whileHover={{ scale: 1.2 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </motion.svg>
                            <span className="text-gray-700">{highlight}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mb-6 md:mb-8"
                    >
                      <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Detailed Itinerary</h4>
                      <div className="space-y-3 md:space-y-4">
                        {selectedPackage.itinerary.map((day, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="bg-gray-50 p-3 md:p-4 rounded-lg"
                          >
                            <div className="flex items-start">
                              <motion.div 
                                className={`${primaryColor} text-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0 mr-3 md:mr-4 text-sm md:text-base`}
                                whileHover={{ scale: 1.1 }}
                              >
                                {day.day}
                              </motion.div>
                              <div>
                                <h5 className="font-bold text-gray-900 text-sm md:text-base">{day.title}</h5>
                                <p className="text-gray-600 mt-1 text-sm md:text-base">{day.description}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="lg:col-span-1">
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gray-50 p-4 md:p-6 rounded-xl sticky top-4"
                    >
                      <div className="mb-4 md:mb-6">
                        <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Package Summary</h4>
                        <div className="space-y-2 md:space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 text-sm md:text-base">Destination:</span>
                            <span className="font-medium text-sm md:text-base">{selectedPackage.destination}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 text-sm md:text-base">Duration:</span>
                            <span className="font-medium text-sm md:text-base">{selectedPackage.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 text-sm md:text-base">Category:</span>
                            <span className="font-medium text-sm md:text-base capitalize">{selectedPackage.category}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4 md:mb-6">
                        <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Price Details</h4>
                        <div className="space-y-2 md:space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 text-sm md:text-base">Package Price:</span>
                            <span className="text-pink-600 font-bold text-lg md:text-xl">{selectedPackage.price}</span>
                          </div>
                          <div className="flex justify-between text-gray-500 text-xs md:text-sm">
                            <span>Original Price:</span>
                            <span className="line-through">{selectedPackage.originalPrice}</span>
                          </div>
                          <div className="flex justify-between text-gray-500 text-xs md:text-sm">
                            <span>You Save:</span>
                            <span className="text-green-600">{selectedPackage.discount}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4 md:mb-6">
                        <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Inclusions</h4>
                        <ul className="space-y-1.5 md:space-y-2">
                          {selectedPackage.inclusions.map((item, index) => (
                            <motion.li 
                              key={index}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 + index * 0.1 }}
                              className="flex items-start text-sm md:text-base"
                            >
                              <motion.svg 
                                className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                                whileHover={{ scale: 1.2 }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </motion.svg>
                              <span className="text-gray-700">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-4 md:mb-6">
                        <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Exclusions</h4>
                        <ul className="space-y-1.5 md:space-y-2">
                          {selectedPackage.exclusions.map((item, index) => (
                            <motion.li 
                              key={index}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              className="flex items-start text-sm md:text-base"
                            >
                              <motion.svg 
                                className="h-3 w-3 md:h-4 md:w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                                whileHover={{ scale: 1.2 }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </motion.svg>
                              <span className="text-gray-700">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      
                      <motion.button 
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full ${primaryColor} ${primaryHoverColor} text-white py-2.5 md:py-3 rounded-lg font-bold transition-colors duration-200 text-sm md:text-base`}
                        onClick={() => {
                          setShowDetailsModal(false);
                          handleBookNow(selectedPackage);
                        }}
                      >
                        Book Now
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {showBookingForm && selectedPackage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Book {selectedPackage.title}</h3>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="h-5 w-5" />
                </motion.button>
              </div>
              
              <div className="p-4 md:p-6">
                {formSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 md:py-8"
                  >
                    <motion.svg 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="h-12 w-12 md:h-16 md:w-16 text-green-500 mx-auto mb-3 md:mb-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Booking Request Sent!</h4>
                    <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">We've received your booking request for {selectedPackage.title}. Our travel expert will contact you shortly to confirm your booking.</p>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${primaryColor} ${primaryHoverColor} text-white px-4 md:px-6 py-2 rounded-lg font-medium text-sm md:text-base`}
                      onClick={() => setShowBookingForm(false)}
                    >
                      Close
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 md:mb-6 p-3 md:p-4 bg-pink-50 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-1 md:mb-2">
                        <h4 className="font-bold text-gray-900 text-sm md:text-base">{selectedPackage.title}</h4>
                        <span className="font-bold text-pink-600 text-sm md:text-base">{selectedPackage.price}</span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600">{selectedPackage.destination} | {selectedPackage.duration}</p>
                    </motion.div>
                    
                    {paymentError && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-3 md:mb-4 p-2 md:p-3 bg-red-100 text-red-700 rounded-lg text-sm md:text-base"
                      >
                        {paymentError}
                      </motion.div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                      <motion.div 
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6"
                      >
                        {[
                          { id: 'name', label: 'Full Name *', type: 'text', required: true },
                          { id: 'email', label: 'Email *', type: 'email', required: true },
                          { id: 'phone', label: 'Phone Number *', type: 'tel', required: true },
                          { id: 'arrivalDate', label: 'Arrival Date *', type: 'date', required: true },
                          { id: 'departureDate', label: 'Departure Date *', type: 'date', required: true },
                          { id: 'adults', label: 'Number of Adults *', type: 'select', options: [1,2,3,4,5,6,7,8,9,10], required: true },
                          { id: 'kids', label: 'Number of Kids', type: 'select', options: [0,1,2,3,4,5], required: false },
                          { id: 'hotelCategory', label: 'Hotel Category *', type: 'select', options: ['3 Star', '4 Star', '5 Star', 'Luxury'], required: true },
                          { id: 'mealsIncluded', label: 'Meals Included *', type: 'select', options: ['Yes', 'No', 'Breakfast Only', 'Half Board', 'Full Board'], required: true },
                          { id: 'budget', label: 'Budget Range', type: 'select', options: ['Economy (Below ₹50,000)', 'Economy (₹50,000 - ₹1,00,000)', 'Mid-Range (₹1,00,000 - ₹2,00,000)', 'Premium (₹2,00,000 - ₹4,00,000)', 'Luxury (₹4,00,000+)'], required: false }
                        ].map((field, index) => (
                          <motion.div 
                            key={field.id}
                            variants={fadeInUp}
                          >
                            <label className="block text-gray-700 mb-1 md:mb-2 text-sm md:text-base" htmlFor={field.id}>{field.label}</label>
                            {field.type === 'select' ? (
                              <motion.select
                                id={field.id}
                                name={field.id}
                                value={formData[field.id]}
                                onChange={handleInputChange}
                                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm md:text-base"
                                required={field.required}
                                whileFocus={{ scale: 1.02 }}
                              >
                                {field.options.map(option => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </motion.select>
                            ) : field.type === 'date' ? (
                              <DatePicker
                                selected={formData[field.id] ? new Date(formData[field.id]) : null}
                                onChange={(date) => setFormData({...formData, [field.id]: date})}
                                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm md:text-base"
                                required={field.required}
                              />
                            ) : (
                              <motion.input
                                type={field.type}
                                id={field.id}
                                name={field.id}
                                value={formData[field.id]}
                                onChange={handleInputChange}
                                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm md:text-base"
                                required={field.required}
                                whileFocus={{ scale: 1.02 }}
                              />
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-4 md:mb-6"
                      >
                        <label className="block text-gray-700 mb-1 md:mb-2 text-sm md:text-base" htmlFor="message">Special Requests</label>
                        <motion.textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm md:text-base"
                          placeholder="Any special requirements or preferences..."
                          whileFocus={{ scale: 1.02 }}
                        ></motion.textarea>
                      </motion.div>
                      
                      <input type="hidden" name="package" value={selectedPackage.title} />
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
                      >
                        <motion.button
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 5px 15px -3px rgba(236, 72, 153, 0.3)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          className={`${primaryColor} ${primaryHoverColor} text-white py-2.5 md:py-3 rounded-lg font-bold transition-colors duration-200 text-sm md:text-base`}
                        >
                          Submit Booking Request
                        </motion.button>
                        <motion.button
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 5px 15px -3px rgba(34, 197, 94, 0.3)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={paymentHandler}
                          className="bg-green-600 hover:bg-green-700 text-white py-2.5 md:py-3 rounded-lg font-bold transition-colors duration-200 flex items-center justify-center text-sm md:text-base"
                        >
                          <FaPlane className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                          Pay Now
                        </motion.button>
                      </motion.div>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notify Me Modal */}
      <AnimatePresence>
        {showNotifyForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl max-w-md w-full mx-4"
            >
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">Notify Me About New Packages</h3>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotifyForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="h-5 w-5" />
                </motion.button>
              </div>
              
              <div className="p-4 md:p-6">
                {notifyFormSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 md:py-8"
                  >
                    <motion.svg 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="h-12 w-12 md:h-16 md:w-16 text-green-500 mx-auto mb-3 md:mb-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h4>
                    <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">We'll notify you as soon as new packages are available.</p>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${primaryColor} ${primaryHoverColor} text-white px-4 md:px-6 py-2 rounded-lg font-medium text-sm md:text-base`}
                      onClick={() => setShowNotifyForm(false)}
                    >
                      Close
                    </motion.button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleNotifySubmit} className="space-y-3 md:space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <label className="block text-gray-700 mb-1 md:mb-2 text-sm md:text-base" htmlFor="notify-name">Full Name *</label>
                      <motion.input
                        type="text"
                        id="notify-name"
                        name="name"
                        value={notifyFormData.name}
                        onChange={handleNotifyInputChange}
                        className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm md:text-base"
                        required
                        whileFocus={{ scale: 1.02 }}
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-gray-700 mb-1 md:mb-2 text-sm md:text-base" htmlFor="notify-email">Email *</label>
                      <motion.input
                        type="email"
                        id="notify-email"
                        name="email"
                        value={notifyFormData.email}
                        onChange={handleNotifyInputChange}
                        className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm md:text-base"
                        required
                        whileFocus={{ scale: 1.02 }}
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-gray-700 mb-2 md:mb-3 text-sm md:text-base">Interests (Select all that apply)</label>
                      <div className="space-y-1.5 md:space-y-2">
                        {categories.filter(c => c.id !== 'all').map((category, index) => (
                          <motion.div 
                            key={category.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="flex items-center"
                          >
                            <input
                              type="checkbox"
                              id={`interest-${category.id}`}
                              checked={notifyFormData.interests.includes(category.id)}
                              onChange={() => handleInterestChange(category.id)}
                              className="h-4 w-4 text-pink-600 rounded focus:ring-pink-500"
                            />
                            <label htmlFor={`interest-${category.id}`} className="ml-2 text-gray-700 text-sm md:text-base">
                              {category.name}
                            </label>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-gray-700 mb-1 md:mb-2 text-sm md:text-base" htmlFor="notify-message">Additional Message</label>
                      <motion.textarea
                        id="notify-message"
                        name="message"
                        value={notifyFormData.message}
                        onChange={handleNotifyInputChange}
                        rows="3"
                        className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm md:text-base"
                        placeholder="Any specific requirements for the packages you're interested in?"
                        whileFocus={{ scale: 1.02 }}
                      ></motion.textarea>
                    </motion.div>
                    
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 5px 15px -3px rgba(236, 72, 153, 0.3)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className={`w-full ${primaryColor} ${primaryHoverColor} text-white py-2.5 md:py-3 rounded-lg font-bold transition-colors duration-200 mt-3 md:mt-4 text-sm md:text-base`}
                    >
                      Submit Request
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Popup */}
      <AnimatePresence>
        {showContactPopup && (
          <ContactPopup onClose={() => setShowContactPopup(false)} />
        )}
      </AnimatePresence>

      {/* WhatsApp Chat */}
      <WhatsAppChat />
    </div>
  );
};

export default Home;