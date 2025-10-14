import React, { useState, useEffect } from 'react';
import { 
  FaTrain, FaExchangeAlt, FaCalendarAlt, FaUser, FaSearch, 
  FaPhone, FaEnvelope, FaUserTie, FaStar, FaCheck, 
  FaMapMarkerAlt, FaUsers, FaRegSmileWink, FaArrowRight, 
  FaPaperPlane, FaArrowLeft, FaHeart, FaGlobeAmericas, 
  FaUmbrellaBeach, FaCity, FaMountain, FaQuoteRight, 
  FaChevronDown, FaChevronUp, FaPlus, FaMinus, FaTrash, 
  FaShieldAlt, FaGift, FaMoneyBillWave, FaHotel, FaSuitcase, 
  FaWifi, FaUtensils, FaHeadset, FaCalculator, FaTimes
} from 'react-icons/fa';
import { IoRocketSharp, IoTrain } from 'react-icons/io5';
import { GiEarthAmerica, GiRailway } from 'react-icons/gi';
import { BsClockHistory, BsTrainFront } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import emailjs from '@emailjs/browser';

// Image URLs
const Manali = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRszBbmcya3FF5OaCFeYTTnt28A2VFwPbaTvWh4mrgfj18vKReAxqZNcfkssi752feoPRw&usqp=CAU";
const Rishikesh = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7FFmLyredaOlQxG66UYwNA7m4GHQijW1asA&s";
const Shatabdi = "https://th-i.thgim.com/public/incoming/tiqeka/article69037742.ece/alternates/FREE_1200/Linke-Hofmann-Busch%20LHB%20coach.jpg";
const Rajdhani = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjvEEgK4fy09rvncMIB4Af-Dv4SsDpDJ3JUA&s";
const Duronto = "https://www.jagranimages.com/images/newimg/01062022/01_06_2022-duronto_exp_coaches_22762989.webp";
const VandeBharat = "https://metrorailnews.in/wp-content/uploads/2025/04/P14GXF.jpg";

// Initialize emailjs
emailjs.init('127OFHb2IQq0zSiFJ');

const Trains = () => {
  // State for train search
  const [tripType, setTripType] = useState('ONE_WAY');
  const [fromCity, setFromCity] = useState('Delhi');
  const [toCity, setToCity] = useState('Mumbai');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date(new Date().setDate(new Date().getDate() + 7)));
  const [passengerCount, setPassengerCount] = useState(1);
  const [classType, setClassType] = useState('AC_2_TIER');
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [selectedFare, setSelectedFare] = useState('REGULAR');

  // State for train results
  const [trains, setTrains] = useState([]);
  const [loadingTrains, setLoadingTrains] = useState(false);
  const [trainError, setTrainError] = useState('');
  const [showTrainResults, setShowTrainResults] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    trainTypes: [],
    departureTime: [],
    duration: 'any'
  });

  // State for booking form
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [requestData, setRequestData] = useState({
    name: '',
    email: '',
    phone: '',
    tripType: 'ONE_WAY',
    trips: [],
    passengers: 1,
    classType: 'AC_2_TIER',
    specialRequests: ''
  });

  // State for multi-city trips
  const [multiCityTrips, setMultiCityTrips] = useState([
    { from: 'Delhi', to: 'Mumbai', departureDate: new Date() },
    { from: 'Mumbai', to: 'Chennai', departureDate: new Date(new Date().setDate(new Date().getDate() + 3)) }
  ]);

  // UI state
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Cities data
  const cities = [
    'Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Hyderabad', 'Kolkata', 
    'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow', 'Bhopal', 'Patna',
    'Bhubaneswar', 'Guwahati', 'Thiruvananthapuram', 'Chandigarh',
    'Amritsar', 'Varanasi', 'Nagpur', 'Indore', 'Visakhapatnam'
  ];

  const classTypes = [
    { code: 'AC_FIRST_CLASS', name: 'AC First Class', icon: <FaTrain className="text-blue-400" /> },
    { code: 'AC_2_TIER', name: 'AC 2 Tier', icon: <FaTrain className="text-purple-400" /> },
    { code: 'AC_3_TIER', name: 'AC 3 Tier', icon: <FaTrain className="text-green-400" /> },
    { code: 'SLEEPER', name: 'Sleeper', icon: <FaTrain className="text-yellow-400" /> },
    { code: 'SECOND_SITTING', name: 'Second Sitting', icon: <FaTrain className="text-red-400" /> }
  ];

  const fareTypes = [
    { code: 'REGULAR', name: 'Regular', description: 'Standard fares with no restrictions', icon: <FaMoneyBillWave className="text-blue-500" /> },
    { code: 'STUDENT', name: 'Student', description: 'Extra discounts for students', icon: <FaUser className="text-green-500" /> },
    { code: 'SENIOR_CITIZEN', name: 'Senior Citizen', description: 'Special senior discounts', icon: <FaUserTie className="text-purple-500" /> },
    { code: 'MILITARY', name: 'Military', description: 'Discounts for armed forces', icon: <FaShieldAlt className="text-red-500" /> }
  ];

  const features = [
    {
      icon: <IoTrain className="text-blue-500 text-3xl sm:text-4xl" />,
      title: "10,000+ Daily Trains",
      description: "Access to trains from all major routes across India",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: <FaUserTie className="text-purple-500 text-3xl sm:text-4xl" />,
      title: "Best Price Guarantee",
    
      description: "We guarantee the best prices for your train journeys",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: <FaHeadset className="text-pink-500 text-3xl sm:text-4xl" />,
      title: "24/7 Customer Support",
      description: "Dedicated support team available round the clock",
      color: "from-pink-400 to-pink-600"
    }
  ];

  const trainAmenities = [
    { icon: <FaWifi className="text-blue-500 text-xl" />, name: "WiFi (Select Trains)", color: "bg-blue-100 text-blue-600" },
    { icon: <FaUtensils className="text-amber-500 text-xl" />, name: "Food Service", color: "bg-amber-100 text-amber-600" },
    { icon: <FaSuitcase className="text-purple-500 text-xl" />, name: "Luggage Space", color: "bg-purple-100 text-purple-600" },
    { icon: <FaHotel className="text-green-500 text-xl" />, name: "Bedding (AC Classes)", color: "bg-green-100 text-green-600" },
    { icon: <FaHeadset className="text-pink-500 text-xl" />, name: "Entertainment", color: "bg-pink-100 text-pink-600" },
    { icon: <FaGift className="text-red-500 text-xl" />, name: "Loyalty Rewards", color: "bg-red-100 text-red-600" }
  ];

  const trainDetails = [
    {
      type: 'SHATABDI',
      name: 'Shatabdi Express',
      image: Shatabdi,
      features: ['High-speed', 'Meals included', 'Comfortable seating', 'Limited stops'],
      priceRange: '₹500 - ₹5,000',
      classes: 'Chair Car/Executive',
      color: "border-blue-200 hover:border-blue-300"
    },
    {
      type: 'RAJDHANI',
      name: 'Rajdhani Express',
      image: Rajdhani,
      features: ['Premium service', 'Meals included', 'Bedding provided', 'Overnight journeys'],
      priceRange: '₹1,200 - ₹8,000',
      classes: 'AC 1/2/3 Tier',
      color: "border-purple-200 hover:border-purple-300"
    },
    {
      type: 'DURONTO',
      name: 'Duronto Express',
      image: Duronto,
      features: ['Non-stop', 'Meals included', 'Quick transit', 'Limited stops'],
      priceRange: '₹900 - ₹6,000',
      classes: 'AC/Sleeper',
      color: "border-green-200 hover:border-green-300"
    },
    {
      type: 'VANDE_BHARAT',
      name: 'Vande Bharat',
      image: VandeBharat,
      features: ['Semi-high speed', 'Modern amenities', 'Onboard entertainment', 'Comfortable seating'],
      priceRange: '₹1,500 - ₹10,000',
      classes: 'Executive/Chair Car',
      color: "border-yellow-200 hover:border-yellow-300"
    }
  ];

  const popularDestinations = [
    { 
      name: 'Manali', 
      icon: <FaMountain className="text-amber-400" />,
      image: Manali,
      price: '₹1,299',
      distance: '550 km',
      duration: '12 hours'
    },
    { 
      name: 'Rishikesh', 
      icon: <FaGlobeAmericas className="text-emerald-400" />,
      image: Rishikesh,
      price: '₹750',
      distance: '240 km',
      duration: '5 hours'
    }
  ];

  // Effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  // Helper functions
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Multi-city trip handlers
  const addTripSegment = () => {
    if (multiCityTrips.length >= 6) return; // Limit to 6 segments
    setMultiCityTrips([
      ...multiCityTrips,
      {
        from: 'Delhi',
        to: 'Mumbai',
        departureDate: new Date(new Date().setDate(new Date().getDate() + multiCityTrips.length * 3))
      }
    ]);
  };

  const removeTripSegment = (index) => {
    if (multiCityTrips.length <= 2) return; // Keep at least 2 segments
    const newTrips = [...multiCityTrips];
    newTrips.splice(index, 1);
    setMultiCityTrips(newTrips);
  };

  const updateTripSegment = (index, field, value) => {
    const newTrips = [...multiCityTrips];
    newTrips[index] = { ...newTrips[index], [field]: value };
    
    // If updating origin/destination, swap if they're the same as next/previous
    if (field === 'from' || field === 'to') {
      if (index > 0 && newTrips[index].from === newTrips[index - 1].to) {
        // Swap with previous destination
        const temp = newTrips[index].from;
        newTrips[index].from = newTrips[index].to;
        newTrips[index].to = temp;
      } else if (index < newTrips.length - 1 && newTrips[index].to === newTrips[index + 1].from) {
        // Swap with next origin
        const temp = newTrips[index].to;
        newTrips[index].to = newTrips[index].from;
        newTrips[index].from = temp;
      }
    }
    
    setMultiCityTrips(newTrips);
  };

  // Event handlers
  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handlePassengerCountChange = (count) => {
    setPassengerCount(Math.max(1, Math.min(6, count)));
  };

  const handleClassTypeChange = (type) => {
    setClassType(type);
    setShowClassDropdown(false);
  };

  const handleDateChange = (date, isReturn = false) => {
    if (isReturn) {
      setReturnDate(date);
    } else {
      setDepartureDate(date);
    }
  };

  const sendEmail = async (formData) => {
    try {
      let tripsInfo = '';
      if (formData.tripType === 'MULTI_CITY') {
        tripsInfo = formData.trips.map((trip, index) => 
          `Trip ${index + 1}: ${trip.from} to ${trip.to} on ${trip.departureDate}`
        ).join('\n');
      } else {
        tripsInfo = `From: ${formData.trips[0].from} to ${formData.trips[0].to} on ${formData.trips[0].departureDate}`;
        if (formData.tripType === 'ROUND_TRIP') {
          tripsInfo += `\nReturn: ${formData.trips[1].from} to ${formData.trips[1].to} on ${formData.trips[1].departureDate}`;
        }
      }

      const templateParams = {
        to_name: 'Train Booking Team',
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        trip_type: formData.tripType,
        passengers: formData.passengers,
        class_type: formData.classType,
        trips_info: tripsInfo,
        special_requests: formData.specialRequests || 'None',
        reply_to: formData.email
      };

      await emailjs.send(
        'service_9jzlq6q',
        'template_mwwf2lg',
        templateParams,
        '127OFHb2IQq0zSiFJ'
      );

      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    if (!requestData.name || !requestData.email || !requestData.phone) {
      setFormError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    let tripsData = [];
    if (tripType === 'MULTI_CITY') {
      tripsData = multiCityTrips.map(trip => ({
        from: trip.from,
        to: trip.to,
        departureDate: formatDate(trip.departureDate)
      }));
    } else {
      tripsData = [{
        from: fromCity,
        to: toCity,
        departureDate: formatDate(departureDate)
      }];
      if (tripType === 'ROUND_TRIP') {
        tripsData.push({
          from: toCity,
          to: fromCity,
          departureDate: formatDate(returnDate)
        });
      }
    }

    const formData = {
      ...requestData,
      tripType,
      trips: tripsData,
      passengers: passengerCount,
      classType
    };

    try {
      const emailSent = await sendEmail(formData);
      
      if (!emailSent) {
        throw new Error('Failed to send email');
      }
      
      console.log('Form data submitted:', formData);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowRequestForm(false);
        setSubmitSuccess(false);
        setRequestData({
          name: '',
          email: '',
          phone: '',
          tripType: 'ONE_WAY',
          trips: [],
          passengers: 1,
          classType: 'AC_2_TIER',
          specialRequests: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Failed to submit request:', error);
      setFormError('Failed to submit request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Animation variants
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  const featureVariants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full opacity-10 animate-float-delay"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-48 bg-purple-100 rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-pink-100 rounded-full opacity-10 animate-float-delay-2"></div>
        <div className="absolute top-1/5 right-1/5 w-32 h-32 bg-indigo-100 rounded-full opacity-10 animate-float-delay-3"></div>
        <div className="absolute bottom-1/5 right-1/4 w-48 h-48 bg-teal-100 rounded-full opacity-10 animate-float-delay-4"></div>
      </div>

      {/* Header with Scrolling Effect */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <GiRailway className="text-blue-500 text-2xl sm:text-3xl mr-2" />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RailJourney
            </span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Trains</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Deals</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
          </nav>
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all">
            Sign In
          </button>
        </div>
      </motion.header>

      {/* Search Section */}
      <motion.div 
        id="booking-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 relative overflow-hidden z-20 mx-4 sm:mx-6 rounded-xl"
      >
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
            <FaTrain className="text-blue-500 mr-2 sm:mr-3 text-lg sm:text-xl" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Book Your Train
            </span>
          </h2>
        </div>
        
        {/* Trip Type Tabs */}
        <div className="flex border-b-2 border-gray-200 mb-6 sm:mb-8 overflow-x-auto">
          {['ONE_WAY', 'ROUND_TRIP', 'MULTI_CITY'].map((type) => (
            <motion.button
              key={type}
              whileTap={{ scale: 0.95 }}
              className={`pb-3 px-3 sm:px-4 font-medium text-sm sm:text-base md:text-lg whitespace-nowrap relative ${
                tripType === type ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
              }`}
              onClick={() => setTripType(type)}
            >
              {type === 'ONE_WAY' ? 'One Way' : type === 'ROUND_TRIP' ? 'Round Trip' : 'Multi City'}
              {tripType === type && (
                <motion.div 
                  layoutId="underline"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Search Form */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6"
        >
          {/* From City */}
          <motion.div 
            variants={itemVariants}
            className="bg-gray-50 p-3 sm:p-4 hover:border-blue-400 transition-colors relative overflow-hidden rounded-xl border border-gray-200"
          >
            <label className="block text-xs sm:text-sm font-bold text-blue-600 mb-1 sm:mb-2 items-center whitespace-nowrap overflow-hidden text-ellipsis">
              <FaMapMarkerAlt className="text-blue-400 mr-1 sm:mr-2 inline" />
              FROM STATION
            </label>
            <div className="flex items-center">
              <select 
                className="w-full outline-none font-bold text-gray-900 bg-transparent text-sm sm:text-base md:text-lg whitespace-nowrap overflow-hidden text-ellipsis"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Swap Button */}
          <motion.div 
            className="flex items-center justify-center col-span-1 sm:col-span-2 lg:col-span-1"
            variants={itemVariants}
          >
            <motion.button 
              onClick={handleSwapCities}
              className="bg-gray-100 p-2 sm:p-3 rounded-full hover:bg-gray-200 transition-colors shadow-md border border-gray-200"
              aria-label="Swap cities"
              whileHover={{ rotate: 180, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaExchangeAlt className="text-blue-500 text-sm sm:text-base" />
            </motion.button>
          </motion.div>

          {/* To City */}
          <motion.div 
            variants={itemVariants}
            className="bg-gray-50 p-3 sm:p-4 hover:border-blue-400 transition-colors relative overflow-hidden rounded-xl border border-gray-200"
          >
            <label className="block text-xs sm:text-sm font-bold text-blue-600 mb-1 sm:mb-2 items-center whitespace-nowrap overflow-hidden text-ellipsis">
              <FaMapMarkerAlt className="text-blue-400 mr-1 sm:mr-2 inline" />
              TO STATION
            </label>
            <div className="flex items-center">
              <select 
                className="w-full outline-none font-bold text-gray-900 bg-transparent text-sm sm:text-base md:text-lg whitespace-nowrap overflow-hidden text-ellipsis"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Departure Date */}
          <motion.div 
            variants={itemVariants}
            className="bg-gray-50 p-3 sm:p-4 hover:border-blue-400 transition-colors relative rounded-xl border border-gray-200"
          >
            <label className="block text-xs sm:text-sm font-bold text-blue-600 mb-1 sm:mb-2 items-center whitespace-nowrap overflow-hidden text-ellipsis">
              <FaCalendarAlt className="text-blue-400 mr-1 sm:mr-2 inline" />
              DEPARTURE DATE
            </label>
            <div className="flex items-center">
              <DatePicker
                selected={departureDate}
                onChange={(date) => handleDateChange(date)}
                minDate={new Date()}
                dateFormat="d MMM yyyy"
                className="w-full outline-none font-bold text-gray-900 bg-transparent text-sm sm:text-base md:text-lg cursor-pointer"
              />
            </div>
          </motion.div>

          {/* Return Date */}
          {tripType === 'ROUND_TRIP' && (
            <motion.div 
              variants={itemVariants}
              className="bg-gray-50 p-3 sm:p-4 hover:border-blue-400 transition-colors relative rounded-xl border border-gray-200"
            >
              <label className="block text-xs sm:text-sm font-bold text-blue-600 mb-1 sm:mb-2 items-center whitespace-nowrap overflow-hidden text-ellipsis">
                <FaCalendarAlt className="text-blue-400 mr-1 sm:mr-2 inline" />
                RETURN DATE
              </label>
              <div className="flex items-center">
                <DatePicker
                  selected={returnDate}
                  onChange={(date) => handleDateChange(date, true)}
                  minDate={departureDate}
                  dateFormat="d MMM yyyy"
                  className="w-full outline-none font-bold text-gray-900 bg-transparent text-sm sm:text-base md:text-lg cursor-pointer"
                />
              </div>
            </motion.div>
          )}

          {/* Travelers & Class */}
          <motion.div 
            variants={itemVariants}
            className="bg-gray-50 p-3 sm:p-4 hover:border-blue-400 transition-colors relative rounded-xl border border-gray-200"
          >
            <label className="block text-xs sm:text-sm font-bold text-blue-600 mb-1 sm:mb-2">PASSENGERS & CLASS</label>
            <div className="relative">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
              >
                <div className="flex items-center">
                  <FaUser className="text-blue-400 mr-2" />
                  <span className="font-bold text-gray-900">
                    {passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'}
                  </span>
                </div>
                {showPassengerDropdown ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </div>
              <div className="text-sm text-gray-700 mt-1 flex items-center justify-between cursor-pointer"
                   onClick={() => setShowClassDropdown(!showClassDropdown)}>
                <span>{classTypes.find(c => c.code === classType)?.name || classType}</span>
                {showClassDropdown ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </div>

              {/* Passenger Dropdown */}
              {showPassengerDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Passengers</span>
                    <div className="flex items-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePassengerCountChange(passengerCount - 1);
                        }}
                        disabled={passengerCount <= 1}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="mx-3 font-medium">{passengerCount}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePassengerCountChange(passengerCount + 1);
                        }}
                        disabled={passengerCount >= 6}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPassengerDropdown(false)}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors mt-4"
                  >
                    Done
                  </button>
                </motion.div>
              )}

              {/* Class Dropdown */}
              {showClassDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 p-3"
                >
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {classTypes.map((type) => (
                      <div 
                        key={type.code}
                        className={`p-3 rounded-lg cursor-pointer flex items-center ${classType === type.code ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClassTypeChange(type.code);
                        }}
                      >
                        <div className="mr-3">
                          {type.icon}
                        </div>
                        <span>{type.name}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setShowClassDropdown(false)}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors mt-3"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Multi-City Trip Segments */}
        {tripType === 'MULTI_CITY' && (
          <motion.div 
            className="col-span-full mt-4 space-y-4"
            variants={containerVariants}
          >
            {multiCityTrips.map((trip, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100"
              >
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <h3 className="font-medium text-gray-700">Train Segment</h3>
                  {multiCityTrips.length > 2 && (
                    <button 
                      onClick={() => removeTripSegment(index)}
                      className="ml-auto text-red-500 hover:text-red-700"
                      aria-label="Remove segment"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  )}
                </div>
                
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* From */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <label className="block text-xs font-bold text-blue-600 mb-1">
                      FROM
                    </label>
                    <select 
                      className="w-full outline-none font-bold text-gray-900 bg-transparent text-sm"
                      value={trip.from}
                      onChange={(e) => updateTripSegment(index, 'from', e.target.value)}
                    >
                      {cities.map(city => (
                        <option key={`${index}-${city}`} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* To */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <label className="block text-xs font-bold text-blue-600 mb-1">
                      TO
                    </label>
                    <select 
                      className="w-full outline-none font-bold text-gray-900 bg-transparent text-sm"
                      value={trip.to}
                      onChange={(e) => updateTripSegment(index, 'to', e.target.value)}
                    >
                      {cities.map(city => (
                        <option key={`${index}-${city}-dest`} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Date */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <label className="block text-xs font-bold text-blue-600 mb-1">
                      DATE
                    </label>
                    <DatePicker
                      selected={trip.departureDate}
                      onChange={(date) => updateTripSegment(index, 'departureDate', date)}
                      minDate={index === 0 ? new Date() : multiCityTrips[index - 1].departureDate}
                      dateFormat="d MMM yyyy"
                      className="w-full outline-none font-bold text-gray-900 bg-transparent text-sm cursor-pointer"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
            
            <motion.button
              onClick={addTripSegment}
              disabled={multiCityTrips.length >= 6}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaPlus className="mr-2" />
              Add Another Train
            </motion.button>
          </motion.div>
        )}

        {/* Special Fare Options */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6"
        >
          {fareTypes.map((fare, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`border-2 rounded-xl p-3 sm:p-4 transition-all cursor-pointer flex items-start ${
                selectedFare === fare.code ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
              }`}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedFare(fare.code)}
            >
              <div className={`p-2 rounded-full mr-3 ${selectedFare === fare.code ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                {fare.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{fare.name}</h3>
                <p className="text-gray-600 text-sm">{fare.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search Button */}
        <motion.div 
          className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button 
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center text-sm sm:text-base md:text-lg relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowRequestForm(true);
              setRequestData(prev => ({
                ...prev,
                passengers: passengerCount,
                classType: classType
              }));
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative z-10 flex items-center">
              <FaSearch className="mr-2 sm:mr-3" />
              SEARCH TRAINS
            </span>
          </motion.button>
          
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start">
              <FaCheck className="text-green-500 mr-1 sm:mr-2 text-sm" />
              <span className="text-gray-600 font-medium text-xs sm:text-sm whitespace-nowrap">Best Price Guarantee</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start">
              <FaCheck className="text-green-500 mr-1 sm:mr-2 text-sm" />
              <span className="text-gray-600 font-medium text-xs sm:text-sm whitespace-nowrap">No Booking Fees</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Train Types Section */}
      <motion.section 
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
        className="mb-12 sm:mb-16"
      >
        <motion.h2 
          variants={cardVariants}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-gray-800"
        >
          Popular <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Train Types</span>
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {trainDetails.map((train, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 ${train.color}`}
              whileHover={{ y: -10 }}
            >
              <div className="h-48 sm:h-56 overflow-hidden relative">
                <img 
                  src={train.image} 
                  alt={train.type} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{train.name}</h3>
                  <p className="text-white/90 text-sm">{train.priceRange}</p>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="mb-4">
                  <div className="flex items-center text-gray-600 mb-1">
                    <BsTrainFront className="mr-2 text-blue-500" />
                    <span className="font-medium">{train.classes}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-bold text-gray-700 mb-2">Features:</h4>
                  <ul className="space-y-2">
                    {train.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <FaCheck className="text-green-500 mr-2 text-xs" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-2 sm:py-3 px-4 rounded-lg mt-6 shadow hover:shadow-md transition-all"
                  onClick={() => {
                    setShowRequestForm(true);
                    setRequestData(prev => ({
                      ...prev,
                      classType: train.type,
                      specialRequests: `Interested in ${train.name} train`
                    }));
                  }}
                >
                  Book {train.name}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Train Amenities */}
      <motion.section 
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
        className="mb-12 sm:mb-16"
      >
        <motion.h2 
          variants={cardVariants}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-gray-800"
        >
          Train <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Amenities</span>
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {trainAmenities.map((amenity, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 text-center ${amenity.color}`}
              whileHover={{ y: -5 }}
            >
              <div className="bg-white p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                {amenity.icon}
              </div>
              <h3 className="font-bold text-sm sm:text-base">{amenity.name}</h3>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Hero Section */}
      <motion.div 
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
        className="relative rounded-3xl p-6 sm:p-8 md:p-12 mb-12 sm:mb-16 overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full mb-6 sm:mb-8 shadow-lg border border-white/20"
          >
            <FaHeart className="mr-2 text-pink-300 animate-pulse text-sm sm:text-base" />
            <span className="text-xs sm:text-sm font-bold text-white drop-shadow-md">TRENDING NOW</span>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-8 sm:mb-10 lg:mb-0">
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
                style={{
                  background: 'linear-gradient(to right, #fde047, #f97316)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                Discover India by Rail
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 font-medium max-w-lg"
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}
              >
                Find the perfect train for your next journey with our exclusive deals and personalized service
              </motion.p>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-3 sm:gap-4"
              >
                {[
                  { 
                    icon: <IoRocketSharp className="mr-2 text-xl sm:text-2xl animate-bounce" style={{ color: '#fde047' }} />, 
                    text: "Best Prices",
                    bg: "bg-gradient-to-r from-yellow-400 to-yellow-500"
                  },
                  { 
                    icon: <FaUserTie className="mr-2 text-xl sm:text-2xl" style={{ color: '#a5b4fc' }} />, 
                    text: "Expert Support",
                    bg: "bg-gradient-to-r from-indigo-400 to-indigo-500"
                  },
                  { 
                    icon: <FaStar className="mr-2 text-xl sm:text-2xl" style={{ color: '#f472b6' }} />, 
                    text: "Exclusive Deals",
                    bg: "bg-gradient-to-r from-pink-400 to-pink-500"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`flex items-center ${item.bg} px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer group`}
                    whileHover={{ y: -5, scale: 1.05 }}
                    style={{
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <div className="group-hover:animate-pulse">
                      {item.icon}
                    </div>
                    <span className="font-bold text-white text-sm sm:text-base md:text-lg">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            <div className="lg:w-1/2 lg:pl-8 xl:pl-12 mt-8 lg:mt-0">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border-2 border-white/20"
              >
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Why Choose Us?</h3>
                
                <div className="space-y-4 sm:space-y-6">
                  {[
                    {
                      icon: <IoTrain className="text-lg sm:text-xl" style={{ color: '#93c5fd' }} />,
                      title: "10,000+ Daily Trains",
                      description: "Access to trains from all major routes across India",
                      color: "text-blue-300"
                    },
                    {
                      icon: <FaUserTie className="text-lg sm:text-xl" style={{ color: '#c4b5fd' }} />,
                      title: "Best Price Guarantee",
                      description: "We guarantee the best prices for your train journeys",
                      color: "text-purple-300"
                    },
                    {
                      icon: <FaHeadset className="text-lg sm:text-xl" style={{ color: '#f9a8d4' }} />,
                      title: "24/7 Customer Support",
                      description: "Dedicated support team available round the clock",
                      color: "text-pink-300"
                    }
                  ].map((feature, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start"
                      whileHover={{ x: 5 }}
                    >
                      <div className={`p-2 sm:p-3 rounded-lg bg-white/20 mr-3 sm:mr-4 ${feature.color}`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className={`font-bold text-base sm:text-lg mb-1 ${feature.color}`}>{feature.title}</h4>
                        <p className="text-white/80 text-sm sm:text-base">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-bold py-3 sm:py-4 px-6 rounded-xl mt-6 sm:mt-8 shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                  style={{
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                  onClick={() => setShowRequestForm(true)}
                >
                  <FaPaperPlane className="mr-2 sm:mr-3" />
                  <span className="text-sm sm:text-base">Book Your Journey</span>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Carousel */}
      <motion.section 
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.2 }}
        className="mb-12 sm:mb-16"
      >
        <motion.div 
          variants={cardVariants}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-6 sm:p-8 shadow-lg border border-white"
        >
          <div className="relative h-40 sm:h-48 overflow-hidden rounded-xl">
            <AnimatePresence mode="wait">
              {features.map((feature, index) => (
                activeFeature === index && (
                  <motion.div
                    key={index}
                    variants={featureVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 p-4 sm:p-6 flex items-center rounded-xl bg-gradient-to-r ${feature.color} bg-clip-border`}
                  >
                    <div className="flex items-start">
                      <div className="p-3 sm:p-4 bg-white/30 backdrop-blur-sm rounded-xl shadow-sm mr-4 sm:mr-6">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-white/90 text-sm sm:text-base">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${activeFeature === index ? 'bg-blue-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Request Form Modal */}
      <AnimatePresence>
        {showRequestForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {submitSuccess ? 'Request Sent!' : 'Request Train Details'}
                  </h3>
                  <button 
                    onClick={() => setShowRequestForm(false)}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>

                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaCheck className="text-green-500 text-3xl" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h4>
                    <p className="text-gray-600 mb-6">Your train request has been received. Our travel expert will contact you shortly.</p>
                    <button
                      onClick={() => setShowRequestForm(false)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <>
                    {formError && (
                      <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {formError}
                      </div>
                    )}

                    <form onSubmit={handleRequestSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                          <input
                            type="text"
                            name="name"
                            value={requestData.name}
                            onChange={handleInputChange}
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                          <input
                            type="email"
                            name="email"
                            value={requestData.email}
                            onChange={handleInputChange}
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                          <input
                            type="tel"
                            name="phone"
                            value={requestData.phone}
                            onChange={handleInputChange}
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                          <select
                            name="tripType"
                            value={requestData.tripType}
                            onChange={handleInputChange}
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                          >
                            <option value="ONE_WAY">One Way</option>
                            <option value="ROUND_TRIP">Round Trip</option>
                            <option value="MULTI_CITY">Multi City</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Class Type</label>
                          <select
                            name="classType"
                            value={requestData.classType}
                            onChange={handleInputChange}
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                          >
                            {classTypes.map(type => (
                              <option key={type.code} value={type.code}>{type.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                          <input
                            type="number"
                            name="passengers"
                            value={requestData.passengers}
                            onChange={handleInputChange}
                            min="1"
                            max="6"
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                          <textarea
                            name="specialRequests"
                            value={requestData.specialRequests}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                            placeholder="Any special requirements or preferences..."
                          ></textarea>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow hover:shadow-lg transition-all mt-6 flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="mr-2" />
                            Submit Request
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Trains;