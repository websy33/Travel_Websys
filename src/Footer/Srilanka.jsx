import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, FaHeart, FaChevronDown, FaTimes, FaCamera, FaSpa, FaUser, 
  FaEnvelope, FaPhone, FaCalendarAlt, FaUsers, FaChild, FaHotel, 
  FaUtensils, FaWallet, FaPlus, FaMinus, FaExclamationCircle,
  FaLandmark, FaTheaterMasks, FaGlobeAsia, FaMonument, FaWater, FaMountain
} from 'react-icons/fa';
import { GiMoneyStack, GiModernCity, GiElephant, GiFlowerPot } from 'react-icons/gi';
import { MdFamilyRestroom, MdBeachAccess, MdLocalDining } from 'react-icons/md';
import { BiHappyHeartEyes } from 'react-icons/bi';
import emailjs from '@emailjs/browser';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SriLanka = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    arrivalDate: '',
    departureDate: '',
    adults: 2,
    kids: 0,
    kidsAges: '',
    hotelCategory: '3',
    mealsIncluded: 'yes',
    budget: '',
    package: '',
    specialRequests: {
      wildlifeSafari: false,
      beachActivities: false,
      culturalHeritage: false,
      ayurvedicTreatments: false,
      teaPlantationTours: false,
      whaleWatching: false,
      adventureSports: false,
      photographyTours: false,
      other: ''
    },
    message: ''
  });

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          setRazorpayLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpay();
  }, []);

  // Validation function
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      errors.phone = 'Phone number is invalid';
    }
    if (!formData.arrivalDate) errors.arrivalDate = 'Arrival date is required';
    if (!formData.departureDate) errors.departureDate = 'Departure date is required';
    if (formData.arrivalDate && formData.departureDate && formData.arrivalDate >= formData.departureDate) {
      errors.departureDate = 'Departure date must be after arrival date';
    }
    if (formData.adults < 1) errors.adults = 'At least 1 adult is required';
    if (formData.kids > 0 && !formData.kidsAges.trim()) {
      errors.kidsAges = 'Kids ages are required when kids are included';
    }
    if (!formData.budget) errors.budget = 'Budget range is required';
    
    return errors;
  };

  // Function to prepare and send email
  const sendBookingEmail = async (paymentMethod = 'Booking Request', paymentId = '') => {
    // Prepare special requests text
    const specialRequestsText = Object.entries(formData.specialRequests)
      .filter(([key, value]) => value && key !== 'other')
      .map(([key]) => {
        return key.replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
      })
      .join(', ');
    
    const otherRequest = formData.specialRequests.other 
      ? `Other: ${formData.specialRequests.other}` 
      : '';
    
    const paymentInfo = paymentId ? `Payment ID: ${paymentId}` : paymentMethod;
    const fullMessage = `${formData.message}\n\nSpecial Requests: ${specialRequestsText}${otherRequest ? '\n' + otherRequest : ''}\n\nPayment Method: ${paymentInfo}`;
    
    try {
      emailjs.init('37pN2ThzFwwhwk7ai');
      
      const result = await emailjs.send(
        'service_ov629rm',
        'template_jr1dnto',
        {
          package_name: selectedPackage.title,
          destination: "Sri Lanka",
          package_price: selectedPackage.price,
          duration: selectedPackage.duration,
          from_name: formData.name,
          from_email: formData.email,
          phone_number: formData.phone,
          arrivalDate: formData.arrivalDate ? formData.arrivalDate.toDateString() : '',
          departureDate: formData.departureDate ? formData.departureDate.toDateString() : '',
          adults: formData.adults,
          kids: formData.kids || '0',
          kidsAges: formData.kidsAges || 'Not specified',
          hotelCategory: formData.hotelCategory,
          mealsIncluded: formData.mealsIncluded,
          budget: formData.budget,
          message: fullMessage,
          payment_method: paymentInfo
        }
      );
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  };

  // Updated payment handler with better error handling
  const paymentHandler = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Validate form before payment
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setShowPaymentError(true);
      setIsProcessing(false);
      
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      setTimeout(() => setShowPaymentError(false), 5000);
      return;
    }
    
    // Check if Razorpay is loaded
    if (!razorpayLoaded) {
      alert('Payment system is still loading. Please wait a moment and try again.');
      setIsProcessing(false);
      return;
    }
    
    if (!window.Razorpay) {
      alert('Payment service is unavailable. Please try the booking request option.');
      setIsProcessing(false);
      return;
    }
    
    try {
      // Direct Razorpay integration without backend
      const amount = 50000; // ₹500.00 in paise
      const currency = "INR";
      
      const options = {
        key: "rzp_live_R8Ga0PdPPfJptw", 
        amount: amount,
        currency: currency,
        name: "Traveligo",
        description: `Sri Lanka Tour Package - ${selectedPackage.title}`,
        image: "https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png",
        handler: function (response) {
          console.log('Payment successful:', response);
          
          // Send success email with payment ID
          sendBookingEmail('Online Payment Successful', response.razorpay_payment_id)
            .then(() => {
              console.log('Payment success email sent');
              // Show success message
              setFormSubmitted(true);
              setTimeout(() => {
                setFormSubmitted(false);
                setShowBookingForm(false);
                resetForm();
              }, 3000);
            })
            .catch(err => {
              console.error('Failed to send success email:', err);
              // Still show success but warn about email
              alert('Payment successful! However, we could not send the confirmation email. Please note your Payment ID: ' + response.razorpay_payment_id);
              setFormSubmitted(true);
              setTimeout(() => {
                setFormSubmitted(false);
                setShowBookingForm(false);
                resetForm();
              }, 3000);
            });
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone.replace(/\D/g, '') // Remove non-digits
        },
        notes: {
          package: selectedPackage.title,
          destination: "Sri Lanka",
          booking_reference: `SRILANKA-${Date.now()}`,
          customer_email: formData.email
        },
        theme: {
          color: "#2563EB"
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
        
        // Send failure notification email
        sendBookingEmail(`Payment Failed - ${response.error?.description || 'Unknown error'}`)
          .then(() => console.log('Payment failure email sent'))
          .catch(err => console.error('Failed to send failure email:', err));
      });
      
      rzp1.open();
      
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert("Payment initialization failed. Please try again or use the booking request option.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      arrivalDate: '',
      departureDate: '',
      adults: 2,
      kids: 0,
      kidsAges: '',
      hotelCategory: '3',
      mealsIncluded: 'yes',
      budget: '',
      package: '',
      specialRequests: {
        wildlifeSafari: false,
        beachActivities: false,
        culturalHeritage: false,
        ayurvedicTreatments: false,
        teaPlantationTours: false,
        whaleWatching: false,
        adventureSports: false,
        photographyTours: false,
        other: ''
      },
      message: ''
    });
    setFormErrors({});
  };

  const packages = [
    {
      id: 1,
      title: "Pearl of the Indian Ocean",
      duration: "8 Days / 7 Nights",
      price: "₹45,999",
      rating: 4.7,
      image: "/images/Sri2.jpeg",
      type: "popular",
      highlights: [
        "Colombo city tour and shopping",
        "Sigiriya Rock Fortress climb",
        "Kandy Temple of the Tooth",
        "Yala National Park safari",
        "Galle Fort exploration",
        "Traditional cultural show"
      ],
      icon: <FaStar className="text-2xl text-blue-600" />,
      specialFeature: "Private guided tour of Sigiriya Rock Fortress"
    },
    {
      id: 2,
      title: "Wildlife & Nature Adventure",
      duration: "7 Days / 6 Nights",
      price: "₹52,999",
      rating: 4.8,
      image: "/images/Sri3.jpg",
      type: "wildlife",
      highlights: [
        "Wilpattu National Park safari",
        "Udawalawe Elephant Transit Home",
        "Sinharaja Rainforest trek",
        "Whale watching in Mirissa",
        "Bird watching in Kumana",
        "Elephant safari experience"
      ],
      icon: <GiElephant className="text-2xl text-blue-600" />,
      specialFeature: "Early morning leopard tracking in Yala National Park"
    },
    {
      id: 3,
      title: "Cultural Triangle Tour",
      duration: "6 Days / 5 Nights",
      price: "₹38,999",
      rating: 4.6,
      image: "/images/Sri4.jpg",
      type: "cultural",
      highlights: [
        "Anuradhapura ancient city",
        "Polonnaruwa ruins tour",
        "Dambulla Cave Temple",
        "Traditional dance show",
        "Village life experience",
        "Sacred temple visits"
      ],
      icon: <FaMonument className="text-2xl text-blue-600" />,
      specialFeature: "Private meditation session at ancient monastery"
    },
    {
      id: 4,
      title: "Beach Paradise Escape",
      duration: "5 Days / 4 Nights",
      price: "₹42,999",
      rating: 4.5,
      image: "/images/Sri5.jpeg",
      type: "beach",
      highlights: [
        "Bentota beach relaxation",
        "Unawatuna beach activities",
        "Snorkeling in Hikkaduwa",
        "Sunset cruise in Negombo",
        "Ayurvedic spa treatments",
        "Water sports adventures"
      ],
      icon: <MdBeachAccess className="text-2xl text-blue-600" />,
      specialFeature: "Private beach dinner with traditional music"
    },
    {
      id: 5,
      title: "Tea Country & Highlands",
      duration: "7 Days / 6 Nights",
      price: "₹48,999",
      rating: 4.7,
      image: "/images/Sri6.jpeg",
      type: "highlands",
      highlights: [
        "Nuwara Eliya tea plantations",
        "Ella Rock hiking",
        "Train ride through hills",
        "Tea factory visit",
        "Waterfall exploration",
        "Cool climate experiences"
      ],
      icon: <FaMountain className="text-2xl text-blue-600" />,
      specialFeature: "Private tea tasting with plantation owner"
    },
    {
      id: 6,
      title: "Family Fun Package",
      duration: "9 Days / 8 Nights",
      price: "₹55,999",
      rating: 4.8,
      image: "/images/Sri7.jpeg",
      type: "family",
      highlights: [
        "Pinnawala Elephant Orphanage",
        "Turtle hatchery visit",
        "Kid-friendly beaches",
        "Cultural workshops",
        "Amusement parks",
        "Family-friendly accommodations"
      ],
      icon: <MdFamilyRestroom className="text-2xl text-blue-600" />,
      specialFeature: "Private elephant bathing experience for kids"
    }
  ];

  const sriLankaImages = [
    "/images/Sri2.jpeg",
    "/images/Sri3.jpg",
    "/images/Sri4.jpg",
    "/images/Sri5.jpeg",
    "/images/Sri6.jpeg",
    "/images/Sri7.jpeg",
    "/images/Sri8.jpeg",
    "/images/Sri9.jpeg",
  ];

  const filteredPackages = activeTab === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.type === activeTab);

  const togglePackage = (id) => {
    setExpandedPackage(expandedPackage === id ? null : id);
  };

  const handleBookNow = (pkg) => {
    setSelectedPackage(pkg);
    setFormData(prev => ({
      ...prev,
      package: pkg.title
    }));
    setFormErrors({});
    setShowPaymentError(false);
    setShowBookingForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSpecialRequestChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      specialRequests: {
        ...prev.specialRequests,
        [name]: checked
      }
    }));
  };

  const handleOtherRequestChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      specialRequests: {
        ...prev.specialRequests,
        other: value
      }
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
    
    // Clear error when user selects a date
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    // Clear departure date error if both dates are now valid
    if (field === 'arrivalDate' && formData.departureDate && date < formData.departureDate) {
      setFormErrors(prev => ({
        ...prev,
        departureDate: ''
      }));
    }
  };

  const incrementAdults = () => {
    setFormData(prev => ({
      ...prev,
      adults: prev.adults + 1
    }));
  };

  const decrementAdults = () => {
    if (formData.adults > 1) {
      setFormData(prev => ({
        ...prev,
        adults: prev.adults - 1
      }));
    }
  };

  const incrementKids = () => {
    setFormData(prev => ({
      ...prev,
      kids: prev.kids + 1
    }));
  };

  const decrementKids = () => {
    if (formData.kids > 0) {
      setFormData(prev => ({
        ...prev,
        kids: prev.kids - 1
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Send email for booking request
      await sendBookingEmail('Booking Request');
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setShowBookingForm(false);
        resetForm();
      }, 3000);
    } catch (err) {
      console.log('FAILED...', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative h-screen max-h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/Sri3.jpg" 
            alt="Sri Lanka Landscape" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-white/50"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-sm font-semibold py-2 px-6 rounded-full mb-6 border border-white/30">
              <FaGlobeAsia className="mr-2 text-blue-300" /> PEARL OF THE INDIAN OCEAN
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif"
          >
            Sri Lanka <span className="text-blue-200">Escape</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto mb-8"
          >
            The teardrop island of ancient cities, golden beaches, and wild adventures
          </motion.p>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="text-blue-200 text-5xl animate-pulse"
          >
            <FaGlobeAsia />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-12 left-0 right-0 flex justify-center"
          >
            <div className="animate-bounce text-blue-200 text-2xl">
              <FaChevronDown />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Special Features Ribbon */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 py-4 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {[
              { icon: <GiElephant className="text-xl" />, text: "Wildlife Safaris" },
              { icon: <MdBeachAccess className="text-xl" />, text: "Pristine Beaches" },
              { icon: <FaMonument className="text-xl" />, text: "Ancient Cities" },
              { icon: <FaMountain className="text-xl" />, text: "Tea Highlands" },
              { icon: <FaTheaterMasks className="text-xl" />, text: "Rich Culture" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                {item.icon}
                <span className="text-sm md:text-base">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-20">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Sri Lanka Tour Packages</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the diverse wonders of Sri Lanka with our carefully curated packages featuring authentic experiences
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {['all', 'popular', 'wildlife', 'cultural', 'beach', 'highlands', 'family'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-3 rounded-full text-sm font-medium capitalize transition-all ${activeTab === tab 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'}`}
            >
              {tab === 'all' ? 'All Packages' : tab.replace('-', ' ')}
            </motion.button>
          ))}
        </motion.div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPackages.map((pkg) => {
            const isExpanded = expandedPackage === pkg.id;
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Package Card */}
                <motion.div 
                  className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ${isExpanded ? 'ring-2 ring-blue-500' : ''}`}
                  whileHover={{ y: -5 }}
                >
                  {/* Image with Floating Icon */}
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-md">
                      {pkg.icon}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-bold text-2xl">{pkg.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">{pkg.price}</span>
                        <div className="flex items-center text-yellow-300">
                          <FaStar className="mr-1" />
                          <span className="text-white font-medium">{pkg.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center text-gray-500">
                        <FaCalendarAlt className="mr-2" />
                        <span className="text-sm">{pkg.duration}</span>
                      </div>
                      <button
                        onClick={() => togglePackage(pkg.id)}
                        className="text-blue-600 font-medium hover:text-blue-700 transition-colors flex items-center text-sm"
                      >
                        {isExpanded ? 'Show Less' : 'View Details'} 
                        <FaChevronDown className={`ml-2 text-blue-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 border-t border-blue-100">
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                              <FaStar className="text-blue-500 mr-2" /> Package Highlights:
                            </h4>
                            <ul className="space-y-3 mb-4">
                              {pkg.highlights.map((highlight, index) => (
                                <motion.li 
                                  key={index} 
                                  className="flex items-start"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <span className="text-blue-500 mr-2">✓</span>
                                  <span className="text-gray-600">{highlight}</span>
                                </motion.li>
                              ))}
                            </ul>
                            
                            {/* Special Feature */}
                            <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
                              <div className="flex items-center text-blue-700">
                                <BiHappyHeartEyes className="mr-2 text-xl" />
                                <span className="font-medium">Special Feature:</span>
                              </div>
                              <p className="mt-1 text-blue-600">{pkg.specialFeature}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                      onClick={() => handleBookNow(pkg)}
                    >
                      Book Sri Lanka Tour
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* No Packages Message */}
        {filteredPackages.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-blue-500 text-6xl mb-4">
              <FaGlobeAsia />
            </div>
            <h3 className="text-2xl font-medium text-gray-700 mb-2">No packages found in this category</h3>
            <p className="text-gray-500 mb-6">Contact us to customize your perfect Sri Lanka itinerary</p>
            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-full font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg">
              Enquire About Sri Lanka Tours
            </button>
          </motion.div>
        )}
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Book With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Sri Lanka Travel Experts",
                description: "Our team has extensive experience in Sri Lankan tourism",
                icon: "🐘",
                bg: "bg-blue-100"
              },
              {
                title: "Authentic Experiences",
                description: "Genuine local experiences with native guides",
                icon: "🏛️",
                bg: "bg-cyan-100"
              },
              {
                title: "Seamless Planning",
                description: "From wildlife safaris to beach stays - we handle it all",
                icon: "✨",
                bg: "bg-blue-100"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl shadow-sm text-center border border-gray-100 ${feature.bg}`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Sri Lanka Images Gallery */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Explore Sri Lanka's Beauty</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sriLankaImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-xl shadow-lg"
              >
                <img 
                  src={image} 
                  alt={`Sri Lanka scenery ${index + 1}`} 
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Booking Form Modal */}
      {showBookingForm && selectedPackage && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 p-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-white">Book {selectedPackage.title}</h3>
              <button 
                onClick={() => setShowBookingForm(false)}
                className="text-white hover:text-blue-200 transition-colors"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              {formSubmitted ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block mb-4"
                  >
                    <svg className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Booking Request Sent!</h4>
                  <p className="text-gray-600 mb-6">We've received your booking request for {selectedPackage.title}. Our travel expert will contact you shortly to confirm your booking.</p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-medium shadow-lg`}
                    onClick={() => setShowBookingForm(false)}
                  >
                    Close
                  </motion.button>
                </div>
              ) : (
                <>
                  {/* Payment Error Alert */}
                  {showPaymentError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <FaExclamationCircle className="text-red-500 mr-3 text-xl" />
                        <div>
                          <h4 className="font-bold text-red-800">Please fill all required fields</h4>
                          <p className="text-red-600 text-sm mt-1">Complete the form before proceeding to payment</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {!razorpayLoaded && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <FaExclamationCircle className="text-yellow-500 mr-3 text-xl" />
                        <div>
                          <h4 className="font-bold text-yellow-800">Payment System Loading</h4>
                          <p className="text-yellow-600 text-sm mt-1">Payment option will be available in a moment...</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-900 text-lg">{selectedPackage.title}</h4>
                      <span className="font-bold text-blue-600 text-lg">{selectedPackage.price}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      <span className="text-sm">{selectedPackage.duration}</span>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <div className="relative" id="name">
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Full Name *</label>
                          <div className="relative">
                            <FaUser className="absolute left-3 top-3 text-gray-400" />
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                formErrors.name ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                              placeholder="John Doe"
                            />
                            {formErrors.name && (
                              <div className="absolute right-3 top-3 text-red-500">
                                <FaExclamationCircle />
                              </div>
                            )}
                          </div>
                          {formErrors.name && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <FaExclamationCircle className="mr-1" /> {formErrors.name}
                            </p>
                          )}
                        </div>
                        
                        <div className="relative" id="email">
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email *</label>
                          <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                formErrors.email ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                              placeholder="john@example.com"
                            />
                            {formErrors.email && (
                              <div className="absolute right-3 top-3 text-red-500">
                                <FaExclamationCircle />
                              </div>
                            )}
                          </div>
                          {formErrors.email && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <FaExclamationCircle className="mr-1" /> {formErrors.email}
                            </p>
                          )}
                        </div>
                        
                        <div className="relative" id="phone">
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">Phone Number *</label>
                          <div className="relative">
                            <FaPhone className="absolute left-3 top-3 text-gray-400" />
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                formErrors.phone ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                              placeholder="+91 9876543210"
                            />
                            {formErrors.phone && (
                              <div className="absolute right-3 top-3 text-red-500">
                                <FaExclamationCircle />
                              </div>
                            )}
                          </div>
                          {formErrors.phone && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <FaExclamationCircle className="mr-1" /> {formErrors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Travel Dates */}
                      <div className="space-y-4">
                        <div id="arrivalDate">
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="arrivalDate">Arrival Date *</label>
                          <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 z-10" />
                            <DatePicker
                              selected={formData.arrivalDate}
                              onChange={(date) => handleDateChange(date, 'arrivalDate')}
                              selectsStart
                              startDate={formData.arrivalDate}
                              endDate={formData.departureDate}
                              minDate={new Date()}
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                formErrors.arrivalDate ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                              placeholderText="Select arrival date"
                            />
                            {formErrors.arrivalDate && (
                              <div className="absolute right-3 top-3 text-red-500">
                                <FaExclamationCircle />
                              </div>
                            )}
                          </div>
                          {formErrors.arrivalDate && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <FaExclamationCircle className="mr-1" /> {formErrors.arrivalDate}
                            </p>
                          )}
                        </div>
                        
                        <div id="departureDate">
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="departureDate">Departure Date *</label>
                          <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 z-10" />
                            <DatePicker
                              selected={formData.departureDate}
                              onChange={(date) => handleDateChange(date, 'departureDate')}
                              selectsEnd
                              startDate={formData.arrivalDate}
                              endDate={formData.departureDate}
                              minDate={formData.arrivalDate || new Date()}
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                formErrors.departureDate ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                              placeholderText="Select departure date"
                            />
                            {formErrors.departureDate && (
                              <div className="absolute right-3 top-3 text-red-500">
                                <FaExclamationCircle />
                              </div>
                            )}
                          </div>
                          {formErrors.departureDate && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <FaExclamationCircle className="mr-1" /> {formErrors.departureDate}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Travelers */}
                      <div className="space-y-4">
                        <div id="adults">
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="adults">Number of Adults *</label>
                          <div className="relative flex items-center">
                            <button
                              type="button"
                              onClick={decrementAdults}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-3 rounded-l-lg"
                            >
                              <FaMinus />
                            </button>
                            <input
                              type="number"
                              id="adults"
                              name="adults"
                              value={formData.adults}
                              onChange={handleInputChange}
                              min="1"
                              max="100"
                              className={`w-full text-center px-4 py-2 border-t border-b focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                formErrors.adults ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                            />
                            <button
                              type="button"
                              onClick={incrementAdults}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-3 rounded-r-lg"
                            >
                              <FaPlus />
                            </button>
                          </div>
                          {formErrors.adults && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <FaExclamationCircle className="mr-1" /> {formErrors.adults}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="kids">Number of Kids</label>
                          <div className="relative flex items-center">
                            <button
                              type="button"
                              onClick={decrementKids}
                              disabled={formData.kids === 0}
                              className={`bg-gray-200 ${formData.kids === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'} text-gray-700 font-bold py-2 px-3 rounded-l-lg`}
                            >
                              <FaMinus />
                            </button>
                            <input
                              type="number"
                              id="kids"
                              name="kids"
                              value={formData.kids}
                              onChange={handleInputChange}
                              min="0"
                              max="20"
                              className="w-full text-center px-4 py-2 border-t border-b border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              type="button"
                              onClick={incrementKids}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-3 rounded-r-lg"
                            >
                              <FaPlus />
                            </button>
                          </div>
                        </div>
                        
                        {formData.kids > 0 && (
                          <div id="kidsAges">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="kidsAges">Kids Ages (comma separated) *</label>
                            <input
                              type="text"
                              id="kidsAges"
                              name="kidsAges"
                              value={formData.kidsAges}
                              onChange={handleInputChange}
                              required={formData.kids > 0}
                              placeholder="e.g. 5, 8"
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                formErrors.kidsAges ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {formErrors.kidsAges && (
                              <p className="text-red-500 text-xs mt-1 flex items-center">
                                <FaExclamationCircle className="mr-1" /> {formErrors.kidsAges}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Accommodation */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hotelCategory">Accommodation Type *</label>
                          <div className="relative">
                            <FaHotel className="absolute left-3 top-3 text-gray-400" />
                            <select
                              id="hotelCategory"
                              name="hotelCategory"
                              value={formData.hotelCategory}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            >
                              <option value="basic">Basic Hotel</option>
                              <option value="3">3 Star Hotel</option>
                              <option value="4">4 Star Hotel</option>
                              <option value="5">5 Star Hotel</option>
                              <option value="beach-resort">Beach Resort</option>
                              <option value="eco-lodge">Eco Lodge</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="mealsIncluded">Meals Included *</label>
                          <div className="relative">
                            <FaUtensils className="absolute left-3 top-3 text-gray-400" />
                            <select
                              id="mealsIncluded"
                              name="mealsIncluded"
                              value={formData.mealsIncluded}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            >
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                              <option value="breakfast">Breakfast Only</option>
                              <option value="half-board">Half Board</option>
                              <option value="full-board">Full Board</option>
                            </select>
                          </div>
                        </div>
                        
                        <div id="budget">
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="budget">Budget Range *</label>
                          <div className="relative">
                            <FaWallet className="absolute left-3 top-3 text-gray-400" />
                            <select
                              id="budget"
                              name="budget"
                              value={formData.budget}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                formErrors.budget ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                            >
                              <option value="">Select Budget</option>
                              <option value="economy">Economy (₹40,000 - ₹80,000)</option>
                              <option value="mid-range">Mid-Range (₹80,000 - ₹1,50,000)</option>
                              <option value="premium">Premium (₹1,50,000 - ₹3,00,000)</option>
                              <option value="luxury">Luxury (₹3,00,000+)</option>
                            </select>
                            {formErrors.budget && (
                              <div className="absolute right-3 top-3 text-red-500">
                                <FaExclamationCircle />
                              </div>
                            )}
                          </div>
                          {formErrors.budget && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <FaExclamationCircle className="mr-1" /> {formErrors.budget}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Special Requests Section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Special Requests (Optional)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="wildlifeSafari"
                            name="wildlifeSafari"
                            checked={formData.specialRequests.wildlifeSafari}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="wildlifeSafari" className="ml-2 block text-sm text-gray-700">
                            Wildlife Safari Experiences
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="beachActivities"
                            name="beachActivities"
                            checked={formData.specialRequests.beachActivities}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="beachActivities" className="ml-2 block text-sm text-gray-700">
                            Beach & Water Activities
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="culturalHeritage"
                            name="culturalHeritage"
                            checked={formData.specialRequests.culturalHeritage}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="culturalHeritage" className="ml-2 block text-sm text-gray-700">
                            Cultural Heritage Tours
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="ayurvedicTreatments"
                            name="ayurvedicTreatments"
                            checked={formData.specialRequests.ayurvedicTreatments}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="ayurvedicTreatments" className="ml-2 block text-sm text-gray-700">
                            Ayurvedic Spa Treatments
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="teaPlantationTours"
                            name="teaPlantationTours"
                            checked={formData.specialRequests.teaPlantationTours}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="teaPlantationTours" className="ml-2 block text-sm text-gray-700">
                            Tea Plantation Tours
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="whaleWatching"
                            name="whaleWatching"
                            checked={formData.specialRequests.whaleWatching}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="whaleWatching" className="ml-2 block text-sm text-gray-700">
                            Whale Watching Tours
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="adventureSports"
                            name="adventureSports"
                            checked={formData.specialRequests.adventureSports}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="adventureSports" className="ml-2 block text-sm text-gray-700">
                            Adventure Sports
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="photographyTours"
                            name="photographyTours"
                            checked={formData.specialRequests.photographyTours}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="photographyTours" className="ml-2 block text-sm text-gray-700">
                            Photography Tours
                          </label>
                        </div>
                      </div>
                      
                      {/* Other Special Requests */}
                      <div className="mt-4">
                        <label htmlFor="otherRequests" className="block text-sm font-medium text-gray-700 mb-1">
                          Other Special Requests
                        </label>
                        <textarea
                          id="otherRequests"
                          name="other"
                          value={formData.specialRequests.other}
                          onChange={handleOtherRequestChange}
                          rows="2"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Any other special requirements or preferences"
                        ></textarea>
                      </div>
                    </div>
                    
                    {/* Additional Message */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="message">Additional Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any other information you'd like to share about your trip"
                      ></textarea>
                    </div>
                    
                    <input type="hidden" name="package" value={selectedPackage.title} />
                    
                    {/* Two-column button layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={isProcessing}
                        className={`w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-lg font-bold transition-all duration-200 shadow-lg ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isProcessing ? 'Processing...' : 'Submit Booking Request'}
                      </motion.button>
                      
                      {/* Payment Button */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={isProcessing || !razorpayLoaded}
                        className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-lg font-bold transition-all duration-200 shadow-lg ${isProcessing || !razorpayLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={paymentHandler}
                      >
                        {!razorpayLoaded ? 'Loading Payment...' : isProcessing ? 'Processing...' : 'Pay Now'}
                      </motion.button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SriLanka;