import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, FaHeart, FaUmbrellaBeach, FaCamera, 
  FaChevronDown, FaPhoneAlt, FaEnvelope, 
  FaUser, FaUsers, FaCommentAlt, FaExclamationCircle, 
  FaPaperPlane, FaMapMarkerAlt, FaQuoteLeft,
  FaCalendarAlt, FaImages, FaArrowLeft, FaArrowRight,
  FaPlus, FaMinus, FaTimes, FaHotel, FaUtensils, FaWallet
} from 'react-icons/fa';
import { GiBoatFishing, GiPalmTree, GiElephant, GiWaterfall, GiWaveSurfer } from 'react-icons/gi';
import { RiHotelFill, RiPlantFill, RiSailboatLine } from 'react-icons/ri';
import { MdOutlineLocalBar, MdOutlineRestaurant } from 'react-icons/md';
import emailjs from '@emailjs/browser';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Kerala = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  
  // Form state
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
      candlelightDinner: false,
      anniversaryCelebration: false,
      birthdayCelebration: false,
      honeymoonPackage: false,
      ayurvedicTreatments: false,
      culturalExperiences: false,
      photographySession: false,
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
          destination: "Kerala",
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
        description: `Kerala Tour Package - ${selectedPackage.title}`,
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
          destination: "Kerala",
          booking_reference: `KERALA-${Date.now()}`,
          customer_email: formData.email
        },
        theme: {
          color: "#10B981"
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
        candlelightDinner: false,
        anniversaryCelebration: false,
        birthdayCelebration: false,
        honeymoonPackage: false,
        ayurvedicTreatments: false,
        culturalExperiences: false,
        photographySession: false,
        other: ''
      },
      message: ''
    });
    setFormErrors({});
  };

  const galleryImages = [
    "/images/kerla.jpeg",
    "/images/karela2.jpeg",
    "/images/Karela3.jpeg",
    "/images/Kerla4.jpeg",
    "/images/Kerla5.jpeg",
    "/images/Kerla6.jpeg"
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  const openGallery = (index) => {
    setCurrentImageIndex(index);
    setShowGallery(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setShowGallery(false);
    document.body.style.overflow = 'auto';
  };

  const packages = [
    {
      id: 1,
      title: "Backwater Houseboat Cruise",
      duration: "3 Days / 2 Nights",
      price: "₹18,999",
      rating: 4.9,
      image: galleryImages[0],
      type: "backwater",
      highlights: [
        "Private houseboat with crew",
        "Traditional Kerala meals onboard",
        "Village visits along the backwaters",
        "Sunset canoe ride",
        "Bird watching excursions"
      ],
      icon: <GiBoatFishing className="text-2xl text-blue-600" />
    },
    {
      id: 2,
      title: "Ayurvedic Wellness Retreat",
      duration: "7 Days / 6 Nights",
      price: "₹32,999",
      rating: 4.8,
      image: galleryImages[1],
      type: "wellness",
      highlights: [
        "Daily Ayurvedic treatments",
        "Yoga and meditation sessions",
        "Organic vegetarian meals",
        "Doctor consultation",
        "Herbal garden tour"
      ],
      icon: <RiPlantFill className="text-2xl text-green-600" />
    },
    {
      id: 3,
      title: "Munnar Tea Estate Stay",
      duration: "4 Days / 3 Nights",
      price: "₹22,999",
      rating: 4.7,
      image: galleryImages[2],
      type: "hillstation",
      highlights: [
        "Stay in colonial tea estate bungalow",
        "Tea plantation walking tour",
        "Visit to Eravikulam National Park",
        "Sunrise at Top Station",
        "Tea tasting session"
      ],
      icon: <RiHotelFill className="text-2xl text-emerald-500" />
    },
    {
      id: 4,
      title: "Wildlife Safari Adventure",
      duration: "5 Days / 4 Nights",
      price: "₹28,999",
      rating: 4.6,
      image: galleryImages[3],
      type: "wildlife",
      highlights: [
        "Periyar Tiger Reserve boat safari",
        "Jungle night patrol experience",
        "Elephant ride through forests",
        "Spice plantation visit",
        "Bamboo rafting"
      ],
      icon: <GiElephant className="text-2xl text-amber-600" />
    },
    {
      id: 5,
      title: "Kerala Cultural Journey",
      duration: "8 Days / 7 Nights",
      price: "₹35,999",
      rating: 4.8,
      image: galleryImages[4],
      type: "cultural",
      highlights: [
        "Kathakali dance performance",
        "Traditional Kalaripayattu martial arts show",
        "Cooking class with local family",
        "Temple architecture tour",
        "Coir-making demonstration"
      ],
      icon: <FaCamera className="text-2xl text-purple-500" />
    },
    {
      id: 6,
      title: "Beach & Backwater Combo",
      duration: "6 Days / 5 Nights",
      price: "₹30,999",
      rating: 4.7,
      image: galleryImages[5],
      type: "combo",
      highlights: [
        "2 nights in beach resort",
        "2 nights in backwater houseboat",
        "Kayaking through palm-fringed canals",
        "Ayurvedic massage sessions",
        "Seafood cooking demonstration"
      ],
      icon: <FaUmbrellaBeach className="text-2xl text-teal-500" />
    }
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          className="absolute top-1/4 left-10 text-green-300 text-4xl"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <GiPalmTree />
        </motion.div>
        <motion.div 
          className="absolute top-1/3 right-20 text-blue-300 text-3xl"
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <RiSailboatLine />
        </motion.div>
      </div>

      {/* Hero Section */}
      <div className="relative h-screen max-h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/kerla.jpeg"
            alt="Kerala Backwaters" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/60 to-blue-900/50"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-sm font-semibold py-2 px-6 rounded-full mb-6 border border-white/30 shadow-lg">
              <GiBoatFishing className="mr-2 animate-pulse" /> GOD'S OWN COUNTRY
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif tracking-tight"
          >
            Kerala <span className="text-green-200">Backwaters</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-green-100 max-w-2xl mx-auto mb-8 font-medium"
          >
            Where emerald landscapes meet tranquil waters in India's tropical paradise
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
          >
            <motion.button
              onClick={() => setShowBookingForm(true)}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-green-600 px-8 py-4 rounded-full font-bold shadow-xl hover:bg-green-50 transition-all flex items-center group"
            >
              <span>Book Your Kerala Experience</span>
              <motion.span 
                className="ml-2 inline-block group-hover:translate-x-1 transition-transform"
              >
                <FaChevronDown className="transform group-hover:rotate-90 transition-transform" />
              </motion.span>
            </motion.button>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="text-green-200 text-5xl animate-pulse mt-8"
          >
            <GiPalmTree />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-12 left-0 right-0 flex justify-center"
          >
            <div className="animate-bounce text-white text-2xl">
              <FaChevronDown />
            </div>
          </motion.div>
        </div>
      </div>

      {/* About Kerala Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 relative">
              <span className="absolute -left-6 -top-2 text-green-400 text-4xl">•</span>
              Discover Kerala's Natural Wonders
            </h2>
            <p className="text-gray-600 mb-4 text-lg leading-relaxed">
              Kerala, known as "God's Own Country," is a tropical paradise of lush greenery, serene backwaters,
              and pristine beaches. This coastal state offers a perfect blend of nature, culture, and relaxation,
              with its unique network of lagoons, lakes and canals running inland from the coast.
            </p>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              From the tranquil backwaters of Alleppey to the misty hills of Munnar, from the wildlife sanctuaries
              to the golden beaches of Kovalam, Kerala promises an unforgettable experience for every traveler.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <GiBoatFishing className="text-green-500 text-2xl" />, text: "900km of backwaters", bg: "bg-green-50" },
                { icon: <RiPlantFill className="text-blue-500 text-2xl" />, text: "Ancient Ayurveda traditions", bg: "bg-blue-50" },
                { icon: <GiElephant className="text-amber-500 text-2xl" />, text: "Rich wildlife sanctuaries", bg: "bg-amber-50" },
                { icon: <MdOutlineRestaurant className="text-teal-500 text-2xl" />, text: "Authentic Kerala cuisine", bg: "bg-teal-50" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className={`flex items-center p-4 rounded-xl ${item.bg} shadow-sm border border-gray-100 transition-all`}
                >
                  <div className="mr-3 p-2 bg-white rounded-lg shadow-sm">{item.icon}</div>
                  <span className="text-gray-700 font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src="/images/kerla.jpeg" 
                alt="Kerala Backwaters" 
                className="w-full h-auto transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
            <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center text-green-600">
                <FaMapMarkerAlt className="mr-2" />
                <span className="font-medium">Alleppey Backwaters</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Packages Section */}
      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-b from-white to-green-50">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-800 mb-4 relative inline-block"
          >
            <span className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-green-400">•</span>
            Curated Kerala Experiences
            <span className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-green-400">•</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-600 max-w-2xl mx-auto text-lg"
          >
            Choose from our handpicked selection of Kerala packages tailored to different travel styles and preferences.
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {['all', 'backwater', 'wellness', 'hillstation', 'wildlife', 'cultural', 'combo'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-3 rounded-full text-sm font-medium capitalize transition-all ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
              }`}
            >
              {tab === 'all' ? 'All Experiences' : tab.replace('-', ' ')}
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
                  className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ${
                    isExpanded ? 'ring-2 ring-green-500' : ''
                  }`}
                  whileHover={{ y: -5 }}
                >
                  {/* Image with Floating Icon */}
                  <div className="relative h-60 overflow-hidden group">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-md transform group-hover:rotate-12 transition-transform">
                      {pkg.icon}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-bold text-2xl drop-shadow-md">{pkg.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                          {pkg.price}
                        </span>
                        <div className="flex items-center text-yellow-300 drop-shadow-md">
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
                        <GiWaterfall className="mr-2" />
                        <span className="text-sm">{pkg.duration}</span>
                      </div>
                      <button
                        onClick={() => togglePackage(pkg.id)}
                        className="text-green-600 font-medium hover:text-green-700 transition-colors flex items-center text-sm"
                      >
                        {isExpanded ? 'Show Less' : 'View Details'} 
                        <FaChevronDown className={`ml-2 text-green-500 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`} />
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
                          <div className="pt-4 border-t border-green-100">
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                              <GiPalmTree className="text-green-500 mr-2" /> Experience Highlights:
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
                                  <span className="text-green-500 mr-2">✓</span>
                                  <span className="text-gray-600">{highlight}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button 
                      whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(37, 99, 235, 0.3)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleBookNow(pkg)}
                      className="w-full mt-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                    >
                      <FaCalendarAlt className="mr-2" /> Book This Experience
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
            <div className="text-green-500 text-6xl mb-4">
              <GiBoatFishing />
            </div>
            <h3 className="text-2xl font-medium text-gray-700 mb-2">No experiences found in this category</h3>
            <p className="text-gray-500 mb-6">Contact us to customize your perfect Kerala journey</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBookingForm(true)}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-full font-medium hover:from-green-700 hover:to-blue-700 transition-all shadow-lg"
            >
              Plan Your Kerala Trip
            </motion.button>
          </motion.div>
        )}
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
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-blue-600 p-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-white">Book {selectedPackage.title}</h3>
              <button 
                onClick={() => setShowBookingForm(false)}
                className="text-white hover:text-green-200 transition-colors"
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
                    className={`bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg`}
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
                  
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-gray-900 text-lg">{selectedPackage.title}</h4>
                      <span className="font-bold text-green-600 text-lg">{selectedPackage.price}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2 text-green-500" />
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
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
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
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
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
                            <FaPhoneAlt className="absolute left-3 top-3 text-gray-400" />
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
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
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
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
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
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
                              className={`w-full text-center px-4 py-2 border-t border-b focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
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
                              className="w-full text-center px-4 py-2 border-t border-b border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
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
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hotelCategory">Hotel Category *</label>
                          <div className="relative">
                            <FaHotel className="absolute left-3 top-3 text-gray-400" />
                            <select
                              id="hotelCategory"
                              name="hotelCategory"
                              value={formData.hotelCategory}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              required
                            >
                              <option value="basic">Basic</option>
                              <option value="3">3 Star</option>
                              <option value="4">4 Star</option>
                              <option value="5">5 Star</option>
                              <option value="luxury">Luxury</option>
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
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                formErrors.budget ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                            >
                              <option value="">Select Budget</option>
                              <option value="economy">Economy (₹50,000 - ₹1,00,000)</option>
                              <option value="mid-range">Mid-Range (₹1,00,000 - ₹2,00,000)</option>
                              <option value="premium">Premium (₹2,00,000 - ₹4,00,000)</option>
                              <option value="luxury">Luxury (₹4,00,000+)</option>
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
                            id="candlelightDinner"
                            name="candlelightDinner"
                            checked={formData.specialRequests.candlelightDinner}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="candlelightDinner" className="ml-2 block text-sm text-gray-700">
                            Candlelight Dinner
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="anniversaryCelebration"
                            name="anniversaryCelebration"
                            checked={formData.specialRequests.anniversaryCelebration}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="anniversaryCelebration" className="ml-2 block text-sm text-gray-700">
                            Anniversary Celebration
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="birthdayCelebration"
                            name="birthdayCelebration"
                            checked={formData.specialRequests.birthdayCelebration}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="birthdayCelebration" className="ml-2 block text-sm text-gray-700">
                            Birthday Celebration
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="honeymoonPackage"
                            name="honeymoonPackage"
                            checked={formData.specialRequests.honeymoonPackage}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="honeymoonPackage" className="ml-2 block text-sm text-gray-700">
                            Honeymoon Package
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="ayurvedicTreatments"
                            name="ayurvedicTreatments"
                            checked={formData.specialRequests.ayurvedicTreatments}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="ayurvedicTreatments" className="ml-2 block text-sm text-gray-700">
                            Ayurvedic Treatments
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="culturalExperiences"
                            name="culturalExperiences"
                            checked={formData.specialRequests.culturalExperiences}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="culturalExperiences" className="ml-2 block text-sm text-gray-700">
                            Cultural Experiences
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="photographySession"
                            name="photographySession"
                            checked={formData.specialRequests.photographySession}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="photographySession" className="ml-2 block text-sm text-gray-700">
                            Photography Session
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                        className={`w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg font-bold transition-all duration-200 shadow-lg ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isProcessing ? 'Processing...' : 'Submit Booking Request'}
                      </motion.button>
                      
                      {/* Payment Button */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={isProcessing || !razorpayLoaded}
                        className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-bold transition-all duration-200 shadow-lg ${isProcessing || !razorpayLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      {/* Gallery Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-800 mb-12 relative"
          >
            <span className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-green-400">•</span>
            Kerala Gallery
            <span className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-green-400">•</span>
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => openGallery(index)}
              >
                <img 
                  src={image} 
                  alt={`Kerala ${index + 1}`} 
                  className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white text-sm font-medium flex items-center">
                    <FaImages className="mr-2" /> View
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative max-w-6xl w-full max-h-[90vh]"
            >
              <button 
                onClick={closeGallery}
                className="absolute top-4 right-4 text-white text-3xl z-10 hover:text-green-300 transition-colors"
              >
                &times;
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl z-10 hover:text-green-300 transition-colors bg-black/30 p-2 rounded-full"
              >
                <FaArrowLeft />
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl z-10 hover:text-green-300 transition-colors bg-black/30 p-2 rounded-full"
              >
                <FaArrowRight />
              </button>
              
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={galleryImages[currentImageIndex]}
                alt={`Kerala gallery ${currentImageIndex + 1}`}
                className="w-full h-full object-contain max-h-[80vh]"
              />
              
              <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
                Image {currentImageIndex + 1} of {galleryImages.length}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Why Choose Us Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-800 mb-12 relative"
          >
            <span className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-green-400">•</span>
            Why Choose Our Kerala Experiences
            <span className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-green-400">•</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Backwater Experts",
                description: "Deep knowledge of Kerala's intricate waterways and villages",
                icon: "🚤",
                color: "from-green-100 to-green-50",
                delay: 0.1
              },
              {
                title: "Authentic Ayurveda",
                description: "Genuine treatments from certified practitioners",
                icon: "🌿",
                color: "from-blue-100 to-blue-50",
                delay: 0.2
              },
              {
                title: "Eco-Conscious",
                description: "Sustainable tourism that supports local communities",
                icon: "🌎",
                color: "from-teal-100 to-teal-50",
                delay: 0.3
              },
              {
                title: "Local Connections",
                description: "Exclusive access to authentic cultural experiences",
                icon: "🤝",
                color: "from-emerald-100 to-emerald-50",
                delay: 0.4
              },
              {
                title: "Safety First",
                description: "All activities conducted with certified guides and equipment",
                icon: "🛡️",
                color: "from-amber-100 to-amber-50",
                delay: 0.5
              },
              {
                title: "24/7 Support",
                description: "Dedicated concierge available throughout your trip",
                icon: "📱",
                color: "from-cyan-100 to-cyan-50",
                delay: 0.6
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay }}
                viewport={{ once: true }}
                className={`bg-gradient-to-br ${feature.color} p-6 rounded-xl shadow-sm text-center border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2089&q=80')] bg-cover bg-center"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl mb-6"
          >
            <GiPalmTree className="inline-block animate-pulse" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6"
          >
            Ready for Your Kerala Adventure?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl mb-8 text-green-100 max-w-2xl mx-auto"
          >
            Let our travel experts craft your perfect Kerala journey with personalized recommendations.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.button
              onClick={() => setShowBookingForm(true)}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-green-600 px-8 py-4 rounded-full font-bold shadow-xl hover:bg-green-50 transition-all"
            >
              Book Your Package Now
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-white/10 transition-all"
            >
              <FaPhoneAlt className="inline mr-2" /> +91 9796337997
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Kerala;