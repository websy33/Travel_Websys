import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaHeart, FaChevronDown, FaShoppingBag, FaUmbrellaBeach, FaRegCalendarAlt, FaUser, FaChild, FaHotel, FaUtensils, FaWallet, FaPlus, FaMinus, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import { GiDesert, GiPalmTree, GiGoldBar, GiModernCity, GiPearlNecklace, GiSailboat, GiSandsOfTime } from 'react-icons/gi';
import { RiHotelFill, RiVipCrownFill } from 'react-icons/ri';
import { BiDrink, BiHappyHeartEyes } from 'react-icons/bi';
import emailjs from '@emailjs/browser';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Initialize EmailJS with your public key
emailjs.init('37pN2ThzFwwhwk7ai');

const Dubai = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeGalleryFilter, setActiveGalleryFilter] = useState('all');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const formRef = useRef();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    arrivalDate: '',
    departureDate: '',
    adults: 1,
    kids: 0,
    kidsAges: '',
    hotelCategory: '3',
    mealsIncluded: 'yes',
    budget: '',
    package: '',
    message: '',
    specialRequests: []
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
    const specialRequestsText = formData.specialRequests.length > 0 
      ? formData.specialRequests.map(id => 
          specialRequestOptions.find(opt => opt.id === id)?.label).join(', ') 
      : 'None';
    
    const paymentInfo = paymentId ? `Payment ID: ${paymentId}` : paymentMethod;
    const fullMessage = `${formData.message}\n\nSpecial Requests: ${specialRequestsText}\n\nPayment Method: ${paymentInfo}`;
    
    try {
      const result = await emailjs.send(
        'service_ov629rm',
        'template_jr1dnto',
        {
          package_name: selectedPackage?.title || formData.package,
          destination: "Dubai",
          package_price: selectedPackage?.price || 'Custom Package',
          duration: selectedPackage?.duration || 'Custom Duration',
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
        description: `Dubai Tour Package - ${selectedPackage?.title || formData.package}`,
        image: "https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png",
        handler: function (response) {
          console.log('Payment successful:', response);
          
          // Send success email with payment ID
          sendBookingEmail('Online Payment Successful', response.razorpay_payment_id)
            .then(() => {
              console.log('Payment success email sent');
              // Show success message
              setSubmitSuccess(true);
              setTimeout(() => {
                setSubmitSuccess(false);
                setIsModalOpen(false);
                resetForm();
              }, 3000);
            })
            .catch(err => {
              console.error('Failed to send success email:', err);
              // Still show success but warn about email
              alert('Payment successful! However, we could not send the confirmation email. Please note your Payment ID: ' + response.razorpay_payment_id);
              setSubmitSuccess(true);
              setTimeout(() => {
                setSubmitSuccess(false);
                setIsModalOpen(false);
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
          package: selectedPackage?.title || formData.package,
          destination: "Dubai",
          booking_reference: `DUBAI-${Date.now()}`,
          customer_email: formData.email
        },
        theme: {
          color: "#F59E0B"
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
      adults: 1,
      kids: 0,
      kidsAges: '',
      hotelCategory: '3',
      mealsIncluded: 'yes',
      budget: '',
      package: '',
      message: '',
      specialRequests: []
    });
    setFormErrors({});
  };

  // Special request options
  const specialRequestOptions = [
    { id: 'cake', label: 'Birthday/Anniversary Cake' },
    { id: 'candlelight', label: 'Candlelight Dinner' },
    { id: 'honeymoon', label: 'Honeymoon Decorations' },
    { id: 'photoshoot', label: 'Professional Photoshoot' },
    { id: 'spa', label: 'Spa Treatment' },
    { id: 'guide', label: 'Private Guide' }
  ];

  const packages = [
    {
      id: 1,
      title: "Ultimate Luxury Escape",
      duration: "5 Days / 4 Nights",
      price: "₹89,999",
      rating: 4.9,
      image: "/images/dubai1.jpeg",
      type: "luxury",
      highlights: [
        "Stay at Burj Al Arab",
        "Private butler service",
        "Helicopter city tour",
        "Gold cappuccino experience",
        "Limosine transfers"
      ],
      icon: <GiGoldBar className="text-2xl text-amber-500" />,
      bgGradient: "from-amber-600 to-amber-800"
    },
    {
      id: 2,
      title: "Desert Safari Adventure",
      duration: "4 Days / 3 Nights",
      price: "₹54,999",
      rating: 4.8,
      image: "/images/dubai2.jpeg",
      type: "adventure",
      highlights: [
        "Dune bashing in 4x4",
        "Camel riding at sunset",
        "Bedouin-style camp dinner",
        "Falconry demonstration",
        "Sandboarding experience"
      ],
      icon: <GiDesert className="text-2xl text-orange-600" />,
      bgGradient: "from-orange-600 to-amber-800"
    },
    {
      id: 3,
      title: "Family Fun Package",
      duration: "6 Days / 5 Nights",
      price: "₹72,999",
      rating: 4.7,
      image: "/images/dubai5.jpeg",
      type: "family",
      highlights: [
        "Dubai Parks & Resorts tickets",
        "Aquaventure Waterpark access",
        "IMG Worlds of Adventure",
        "Desert safari with kid-friendly activities",
        "Burj Khalifa 'At the Top' tickets"
      ],
      icon: <RiHotelFill className="text-2xl text-blue-500" />,
      bgGradient: "from-blue-600 to-cyan-600"
    },
    {
      id: 4,
      title: "Romantic Getaway",
      duration: "5 Days / 4 Nights",
      price: "₹82,999",
      rating: 4.9,
      image: "/images/dubai6.jpeg",
      type: "honeymoon",
      highlights: [
        "Private beach dinner at sunset",
        "Couple's spa treatment",
        "Yacht cruise with champagne",
        "Hot air balloon ride at dawn",
        "Fountain view room at Palace Downtown"
      ],
      icon: <FaHeart className="text-2xl text-rose-500" />,
      bgGradient: "from-rose-600 to-pink-600"
    },
    {
      id: 5,
      title: "Shopping & Leisure",
      duration: "5 Days / 4 Nights",
      price: "₹65,999",
      rating: 4.7,
      image: "/images/dubai3.jpeg",
      type: "shopping",
      highlights: [
        "Personal shopping assistant",
        "Gold Souk tour",
        "Dubai Mall VIP access",
        "Tax-free shopping benefits",
        "Private transfers between malls"
      ],
      icon: <FaShoppingBag className="text-2xl text-purple-500" />,
      bgGradient: "from-purple-600 to-indigo-600"
    },
    {
      id: 6,
      title: "Iconic Dubai Experience",
      duration: "7 Days / 6 Nights",
      price: "₹95,999",
      rating: 4.9,
      image: "/images/dubai4.jpeg",
      type: "premium",
      highlights: [
        "Burj Khalifa 148th floor access",
        "Palm Jumeirah helicopter tour",
        "Dinner at At.mosphere (world's highest restaurant)",
        "Skydiving over Palm Jumeirah",
        "Exclusive access to Dubai Frame"
      ],
      icon: <GiModernCity className="text-2xl text-gray-600" />,
      bgGradient: "from-gray-600 to-gray-800"
    }
  ];

  const dubaiGallery = [
    {
      image: "/images/dubai1.jpeg",
      title: "Burj Al Arab Luxury",
      category: "luxury"
    },
    {
      image: "/images/dubai2.jpeg",
      title: "Desert Safari Adventure",
      category: "adventure"
    },
    {
      image: "/images/dubai3.jpeg",
      title: "Shopping Extravaganza",
      category: "shopping"
    },
    {
      image: "/images/dubai4.jpeg",
      title: "Burj Khalifa View",
      category: "premium"
    },
    {
      image: "/images/dubai5.jpeg",
      title: "Family Fun at Aquaventure",
      category: "family"
    },
    {
      image: "/images/dubai6.jpeg",
      title: "Romantic Beach Dinner",
      category: "honeymoon"
    }
  ];

  const filteredPackages = activeTab === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.type === activeTab);

  const filteredGallery = activeGalleryFilter === 'all' 
    ? dubaiGallery 
    : dubaiGallery.filter(item => item.category === activeGalleryFilter);

  const togglePackage = (id) => {
    setExpandedPackage(expandedPackage === id ? null : id);
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

  const handleSpecialRequestChange = (id) => {
    setFormData(prev => {
      if (prev.specialRequests.includes(id)) {
        return {
          ...prev,
          specialRequests: prev.specialRequests.filter(item => item !== id)
        };
      } else {
        return {
          ...prev,
          specialRequests: [...prev.specialRequests, id]
        };
      }
    });
  };

  const incrementCount = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.min(prev[field] + 1, field === 'adults' ? 50 : 20)
    }));
  };

  const decrementCount = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(prev[field] - 1, field === 'adults' ? 1 : 0)
    }));
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
    
    setIsLoading(true);
    
    try {
      // Send email for booking request
      await sendBookingEmail('Booking Request');
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsModalOpen(false);
        resetForm();
      }, 3000);
    } catch (err) {
      console.log('FAILED...', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

  const openBookingModal = (packageTitle = '') => {
    const pkg = packages.find(p => p.title === packageTitle) || null;
    setSelectedPackage(pkg);
    setFormData(prev => ({
      ...prev,
      package: packageTitle
    }));
    setFormErrors({});
    setShowPaymentError(false);
    setIsModalOpen(true);
    setSubmitSuccess(false);
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-amber-50">
      {/* Hero Section */}
      <div className="relative h-screen max-h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/dubai1.jpeg"
            alt="Dubai Skyline" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-amber-900/50"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-sm font-semibold py-2 px-6 rounded-full mb-6 border border-white/30">
              <GiModernCity className="mr-2" /> CITY OF GOLD
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif tracking-tight"
          >
            <span className="text-amber-200">Dubai</span> Luxury <span className="text-white">Escapes</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-amber-100 max-w-2xl mx-auto mb-8 font-medium"
          >
            Where modern marvels meet Arabian hospitality in the desert metropolis
          </motion.p>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="text-amber-200 text-5xl animate-pulse mb-8"
          >
            <GiGoldBar />
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-amber-600 to-gray-600 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all flex items-center"
            onClick={() => openBookingModal()}
          >
            <RiVipCrownFill className="mr-2" /> Book Your VIP Experience
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-12 left-0 right-0 flex justify-center"
          >
            <div className="animate-bounce text-white text-2xl">
              <FaChevronDown />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Luxury Features Ribbon */}
      <div className="bg-gradient-to-r from-amber-600 to-gray-600 py-8 px-6 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {[
              { icon: <FaHeart className="text-2xl" />, text: "Romantic Getaways" },
              { icon: <GiGoldBar className="text-2xl" />, text: "Luxury Experiences" },
              { icon: <GiDesert className="text-2xl" />, text: "Desert Adventures" },
              { icon: <FaShoppingBag className="text-2xl" />, text: "Shopping Extravaganza" },
              { icon: <RiHotelFill className="text-2xl" />, text: "5-Star Accommodations" },
              { icon: <GiSailboat className="text-2xl" />, text: "Private Yacht Cruises" },
              { icon: <BiDrink className="text-2xl" />, text: "VIP Nightlife Access" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                  {item.icon}
                </div>
                <span className="text-sm md:text-base font-medium">{item.text}</span>
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
          <div className="inline-flex items-center bg-gradient-to-r from-amber-600 to-gray-600 text-white text-xs font-semibold py-2 px-4 rounded-full mb-4">
            <GiSandsOfTime className="mr-2" /> EXCLUSIVE PACKAGES
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4 font-serif">Dubai Experience Packages</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover Dubai's wonders with our exclusive packages featuring luxury touches
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
          {['all', 'luxury', 'adventure', 'family', 'honeymoon', 'shopping', 'premium'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-3 rounded-full text-sm font-medium capitalize transition-all ${activeTab === tab 
                ? 'bg-gradient-to-r from-amber-600 to-gray-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'}`}
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
                  className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ${isExpanded ? 'ring-2 ring-amber-500' : ''}`}
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
                        <span className={`bg-gradient-to-r ${pkg.bgGradient} text-white text-xs px-3 py-1 rounded-full`}>{pkg.price}</span>
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
                        <GiPalmTree className="mr-2" />
                        <span className="text-sm">{pkg.duration}</span>
                      </div>
                      <button
                        onClick={() => togglePackage(pkg.id)}
                        className="text-amber-600 font-medium hover:text-amber-700 transition-colors flex items-center text-sm"
                      >
                        {isExpanded ? 'Show Less' : 'View Details'} 
                        <FaChevronDown className={`ml-2 text-amber-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
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
                          <div className="pt-4 border-t border-amber-100">
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                              <GiGoldBar className="text-amber-500 mr-2" /> Experience Highlights:
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
                                  <span className="text-amber-500 mr-2">✓</span>
                                  <span className="text-gray-600">{highlight}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full mt-4 bg-gradient-to-r ${pkg.bgGradient} hover:from-amber-700 hover:to-gray-700 text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all`}
                      onClick={() => openBookingModal(pkg.title)}
                    >
                      Book This Dubai Experience
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
            <div className="text-amber-500 text-6xl mb-4">
              <GiModernCity />
            </div>
            <h3 className="text-2xl font-medium text-gray-700 mb-2">No experiences found in this category</h3>
            <p className="text-gray-500 mb-6">Contact us to customize your perfect Dubai getaway</p>
            <button 
              className="bg-gradient-to-r from-amber-600 to-gray-600 text-white px-8 py-3 rounded-full font-bold hover:from-amber-700 hover:to-gray-700 transition-all shadow-lg"
              onClick={() => openBookingModal()}
            >
              Plan Your Dubai Trip
            </button>
          </motion.div>
        )}
      </div>

      {/* Dubai Gallery Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-gradient-to-r from-amber-600 to-gray-600 text-white text-xs font-semibold py-2 px-4 rounded-full mb-4">
              <BiHappyHeartEyes className="mr-2" /> VISUAL JOURNEY
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4 font-serif">Discover Dubai's Wonders</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Immerse yourself in the breathtaking beauty of Dubai through our curated visual collection
            </p>
          </motion.div>

          {/* Gallery Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['all', 'luxury', 'adventure', 'family', 'honeymoon', 'shopping', 'premium'].map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setActiveGalleryFilter(filter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-xs font-medium capitalize transition-all ${activeGalleryFilter === filter 
                  ? 'bg-gradient-to-r from-amber-600 to-gray-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'}`}
              >
                {filter === 'all' ? 'All' : filter}
              </motion.button>
            ))}
          </div>

          {/* Enhanced Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 h-80"
                whileHover={{ y: -5 }}
              >
                {/* Image with Parallax Effect */}
                <motion.div 
                  className="w-full h-full"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {item.category.toUpperCase()}
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="transform translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-xl font-bold mb-1">{item.title}</h3>
                    <div className="h-px w-0 bg-amber-400 group-hover:w-16 transition-all duration-500 mb-2" />
                    <p className="text-amber-100 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      Click to view more details
                    </p>
                  </div>
                  
                  {/* Hidden Details that appear on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-sm">
                    <button 
                      className="bg-gradient-to-r from-amber-600 to-gray-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all flex items-center"
                      onClick={() => openBookingModal(item.title)}
                    >
                      <FaRegCalendarAlt className="mr-2" /> Book This Experience
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Gallery CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <button 
              className="bg-gradient-to-r from-amber-600 to-gray-600 text-white px-8 py-3 rounded-full font-bold hover:from-amber-700 hover:to-gray-700 transition-all shadow-lg flex items-center mx-auto"
              onClick={() => openBookingModal()}
            >
              Start Your Dubai Adventure
              <FaChevronDown className="ml-2 text-sm" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Luxury Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-amber-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-gradient-to-r from-amber-600 to-gray-600 text-white text-xs font-semibold py-2 px-4 rounded-full mb-4">
              <RiVipCrownFill className="mr-2" /> SIGNATURE LUXURY
            </div>
            <h2 className="text-4xl font-bold text-amber-200 mb-4 font-serif">Dubai's Signature Luxury</h2>
            <p className="text-lg text-amber-100 max-w-2xl mx-auto">
              Experience the pinnacle of opulence with our exclusive services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Private Desert Retreats",
                description: "Exclusive Bedouin-style camps with personal chefs and entertainment",
                icon: <GiDesert className="text-4xl text-amber-300" />,
                bg: "bg-gradient-to-br from-amber-900/30 to-gray-900/30"
              },
              {
                title: "Gold Spa Experiences",
                description: "24K gold facials and diamond-dust treatments at world-class spas",
                icon: <GiGoldBar className="text-4xl text-amber-300" />,
                bg: "bg-gradient-to-br from-gray-900/30 to-amber-900/30"
              },
              {
                title: "VIP Shopping Concierge",
                description: "Personal shoppers and after-hours access to luxury boutiques",
                icon: <GiPearlNecklace className="text-4xl text-amber-300" />,
                bg: "bg-gradient-to-br from-amber-900/30 to-gray-900/30"
              },
              {
                title: "Private Beach Access",
                description: "Exclusive beach clubs with cabana service and champagne",
                icon: <FaUmbrellaBeach className="text-4xl text-amber-300" />,
                bg: "bg-gradient-to-br from-gray-900/30 to-amber-900/30"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-8 rounded-xl border border-amber-800/50 ${feature.bg} backdrop-blur-sm hover:backdrop-blur-md transition-all`}
              >
                <div className="mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-amber-200 mb-3">{feature.title}</h3>
                <p className="text-amber-100">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-600 to-gray-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-xs font-semibold py-2 px-4 rounded-full mb-6 border border-white/30">
              <GiModernCity className="mr-2" /> BEGIN YOUR JOURNEY
            </div>
            <h2 className="text-4xl font-bold mb-6 font-serif">Ready for Your Dubai Adventure?</h2>
            <p className="text-xl text-amber-100 mb-8">
              Let us craft your perfect luxury experience in the City of Gold
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-amber-700 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-amber-50 transition-all flex items-center justify-center"
                onClick={() => openBookingModal()}
              >
                <RiVipCrownFill className="mr-2" /> Book Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-white/10 transition-all flex items-center justify-center"
                onClick={() => openBookingModal()}
              >
                <GiGoldBar className="mr-2" /> Customize Your Trip
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => !isLoading && closeBookingModal()}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {submitSuccess ? (
                <div className="p-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center h-full flex flex-col items-center justify-center py-10"
                  >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
                      <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">Booking Request Sent!</h3>
                    <p className="text-gray-600 mb-8 text-lg">We've received your request for <span className="font-semibold">{formData.package}</span>. Our travel expert will contact you within 24 hours to confirm your booking.</p>
                    <button
                      onClick={closeBookingModal}
                      className="bg-gradient-to-r from-amber-600 to-gray-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-lg"
                    >
                      Close
                    </button>
                  </motion.div>
                </div>
              ) : (
                <>
                  {/* Modal Header with Gradient Background */}
                  <div className="bg-gradient-to-r from-amber-600 to-gray-600 p-6 rounded-t-xl text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-bold font-serif">Book Your Dubai Experience</h3>
                        {formData.package && (
                          <p className="text-amber-100 mt-1 flex items-center">
                            <RiVipCrownFill className="mr-2" /> Package: {formData.package}
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={closeBookingModal}
                        className={`text-white hover:text-amber-200 p-1 rounded-full hover:bg-white/10 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                        disabled={isLoading}
                      >
                        <FaTimes className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  {/* Form Content */}
                  <div className="p-6">
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

                    <form ref={formRef} onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        {/* Personal Information Section */}
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaUser className="text-amber-600 mr-2" /> Personal Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div id="name">
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FaUser />
                                </div>
                                <input
                                  type="text"
                                  id="name"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white ${
                                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  required
                                  placeholder="Your full name"
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

                            <div id="email">
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                  </svg>
                                </div>
                                <input
                                  type="email"
                                  id="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white ${
                                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  required
                                  placeholder="your@email.com"
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

                            <div id="phone">
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                  </svg>
                                </div>
                                <input
                                  type="tel"
                                  id="phone"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white ${
                                    formErrors.phone ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  required
                                  placeholder="+91 1234567890"
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
                        </div>

                        {/* Travel Dates Section */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaRegCalendarAlt className="text-blue-600 mr-2" /> Travel Dates
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div id="arrivalDate">
                              <label htmlFor="arrivalDate" className="block text-sm font-medium text-gray-700 mb-1">Arrival Date *</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FaRegCalendarAlt />
                                </div>
                                <DatePicker
                                  selected={formData.arrivalDate}
                                  onChange={(date) => handleDateChange(date, 'arrivalDate')}
                                  selectsStart
                                  startDate={formData.arrivalDate}
                                  endDate={formData.departureDate}
                                  minDate={new Date()}
                                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
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
                              <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">Departure Date *</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FaRegCalendarAlt />
                                </div>
                                <DatePicker
                                  selected={formData.departureDate}
                                  onChange={(date) => handleDateChange(date, 'departureDate')}
                                  selectsEnd
                                  startDate={formData.arrivalDate}
                                  endDate={formData.departureDate}
                                  minDate={formData.arrivalDate || new Date()}
                                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
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
                        </div>

                        {/* Travel Party Section */}
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaUser className="text-purple-600 mr-2" /> Travel Party
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div id="adults">
                              <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">Adults *</label>
                              <div className={`flex items-center border rounded-lg overflow-hidden ${
                                formErrors.adults ? 'border-red-500' : 'border-gray-300'
                              }`}>
                                <button
                                  type="button"
                                  onClick={() => decrementCount('adults')}
                                  className="px-3 py-3 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                >
                                  <FaMinus />
                                </button>
                                <input
                                  type="number"
                                  id="adults"
                                  name="adults"
                                  value={formData.adults}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 text-center border-0 focus:ring-0"
                                  min="1"
                                  max="50"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => incrementCount('adults')}
                                  className="px-3 py-3 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
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
                              <label htmlFor="kids" className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => decrementCount('kids')}
                                  className="px-3 py-3 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                >
                                  <FaMinus />
                                </button>
                                <input
                                  type="number"
                                  id="kids"
                                  name="kids"
                                  value={formData.kids}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 text-center border-0 focus:ring-0"
                                  min="0"
                                  max="20"
                                />
                                <button
                                  type="button"
                                  onClick={() => incrementCount('kids')}
                                  className="px-3 py-3 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            </div>

                            {formData.kids > 0 && (
                              <div className="md:col-span-2" id="kidsAges">
                                <label htmlFor="kidsAges" className="block text-sm font-medium text-gray-700 mb-1">Children Ages *</label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FaChild />
                                  </div>
                                  <input
                                    type="text"
                                    id="kidsAges"
                                    name="kidsAges"
                                    value={formData.kidsAges}
                                    onChange={handleInputChange}
                                    placeholder="Ages separated by commas (e.g., 5, 8)"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white ${
                                      formErrors.kidsAges ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required={formData.kids > 0}
                                  />
                                  {formErrors.kidsAges && (
                                    <div className="absolute right-3 top-3 text-red-500">
                                      <FaExclamationCircle />
                                    </div>
                                  )}
                                </div>
                                {formErrors.kidsAges && (
                                  <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <FaExclamationCircle className="mr-1" /> {formErrors.kidsAges}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Accommodation Preferences */}
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaHotel className="text-green-600 mr-2" /> Accommodation Preferences
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="hotelCategory" className="block text-sm font-medium text-gray-700 mb-1">Hotel Category *</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FaHotel />
                                </div>
                                <select
                                  id="hotelCategory"
                                  name="hotelCategory"
                                  value={formData.hotelCategory}
                                  onChange={handleInputChange}
                                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white appearance-none"
                                  required
                                >
                                  <option value="3">3 Star</option>
                                  <option value="4">4 Star</option>
                                  <option value="5">5 Star</option>
                                  <option value="luxury">Luxury (5+ Star)</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                  <FaChevronDown className="h-4 w-4" />
                                </div>
                              </div>
                            </div>

                            <div>
                              <label htmlFor="mealsIncluded" className="block text-sm font-medium text-gray-700 mb-1">Meals Included *</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FaUtensils />
                                </div>
                                <select
                                  id="mealsIncluded"
                                  name="mealsIncluded"
                                  value={formData.mealsIncluded}
                                  onChange={handleInputChange}
                                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white appearance-none"
                                  required
                                >
                                  <option value="yes">Yes, include meals</option>
                                  <option value="no">No, we'll arrange separately</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                  <FaChevronDown className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Budget & Special Requests */}
                        <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FaWallet className="text-rose-600 mr-2" /> Budget & Preferences
                          </h4>
                          <div className="space-y-4">
                            <div id="budget">
                              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Budget (per person) *</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FaWallet />
                                </div>
                                <input
                                  type="text"
                                  id="budget"
                                  name="budget"
                                  value={formData.budget}
                                  onChange={handleInputChange}
                                  placeholder="e.g., ₹50,000 - ₹75,000"
                                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white ${
                                    formErrors.budget ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                  required
                                />
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

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                {specialRequestOptions.map(option => (
                                  <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={formData.specialRequests.includes(option.id)}
                                      onChange={() => handleSpecialRequestChange(option.id)}
                                      className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.specialRequests.includes(option.id) ? 'bg-amber-500 border-amber-500' : 'border-gray-300'}`}>
                                      {formData.specialRequests.includes(option.id) && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                      )}
                                    </div>
                                    <span className="text-gray-700 text-sm">{option.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Additional Requests</label>
                              <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white"
                                placeholder="Any other special requirements or preferences"
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Form Footer */}
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isLoading}
                          className={`w-full py-5 px-6 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all text-lg ${
                            isLoading
                              ? 'bg-gray-400'
                              : 'bg-gradient-to-r from-amber-600 to-gray-600 hover:from-amber-700 hover:to-gray-700'
                          }`}
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            'Confirm Booking Request'
                          )}
                        </motion.button>
                        
                        {/* Payment Button */}
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isProcessing || !razorpayLoaded}
                          className={`w-full py-5 px-6 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all text-lg ${
                            isProcessing || !razorpayLoaded ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'
                          }`}
                          onClick={paymentHandler}
                        >
                          {!razorpayLoaded ? 'Loading Payment...' : isProcessing ? 'Processing...' : 'Pay Now'}
                        </motion.button>
                      </div>
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        By submitting this form, you agree to our <a href="#" className="text-amber-600 hover:underline">Terms of Service</a> and <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a>
                      </p>
                    </form>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dubai;