import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, FaCalendarAlt, FaHome, FaPrayingHands, FaUtensils, 
  FaChevronDown, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaPlus, FaMinus, FaPlaceOfWorship, FaMountain, FaLeaf, FaUmbrellaBeach,
  FaUser, FaWallet, FaHotel, FaExclamationCircle
} from 'react-icons/fa';
import { GiMountainRoad, GiWoodCabin, GiStonePath, GiMonkey, GiTiger } from 'react-icons/gi';
import { MdLandscape, MdOutlineHiking, MdSpa, MdFestival } from 'react-icons/md';
import { IoMdSnow } from 'react-icons/io';
import emailjs from '@emailjs/browser';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Bhutan = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    adults: 2,
    children: 0,
    childrenAges: '',
    arrivalDate: '',
    departureDate: '',
    accommodationType: 'hotel',
    mealsIncluded: 'yes',
    budget: '',
    specialRequests: {
      camping: false,
      monasteryStay: false,
      photographyTour: false,
      trekking: false,
      culturalImmersion: false,
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
    if (formData.children > 0 && !formData.childrenAges.trim()) {
      errors.childrenAges = 'Children ages are required when children are included';
    }
    if (!formData.budget) errors.budget = 'Budget range is required';
    
    return errors;
  };

  // Function to prepare and send email
  const sendBookingEmail = async (paymentMethod = 'Booking Request', paymentId = '') => {
    // Prepare special requests text
    const specialRequests = [];
    if (formData.specialRequests.camping) specialRequests.push("Camping");
    if (formData.specialRequests.monasteryStay) specialRequests.push("Monastery Stay");
    if (formData.specialRequests.photographyTour) specialRequests.push("Photography Tour");
    if (formData.specialRequests.trekking) specialRequests.push("Trekking");
    if (formData.specialRequests.culturalImmersion) specialRequests.push("Cultural Immersion");
    if (formData.specialRequests.other) specialRequests.push(formData.specialRequests.other);
    
    const specialRequestsText = specialRequests.length > 0 
      ? specialRequests.join(", ") 
      : 'No special requests';

    const paymentInfo = paymentId ? `Payment ID: ${paymentId}` : paymentMethod;
    const fullMessage = `${formData.message}\n\nSpecial Requests: ${specialRequestsText}\n\nPayment Method: ${paymentInfo}`;

    try {
      emailjs.init('37pN2ThzFwwhwk7ai');
      
      const result = await emailjs.send(
        'service_ov629rm',
        'template_jr1dnto',
        {
          package_name: selectedPackage.title,
          destination: "Bhutan",
          package_price: selectedPackage.price,
          duration: selectedPackage.duration,
          from_name: formData.name,
          from_email: formData.email,
          phone_number: formData.phone,
          arrivalDate: formData.arrivalDate ? formData.arrivalDate.toDateString() : '',
          departureDate: formData.departureDate ? formData.departureDate.toDateString() : '',
          adults: formData.adults,
          kids: formData.children || '0',
          kidsAges: formData.childrenAges || 'Not specified',
          accommodationType: formData.accommodationType === 'hotel' ? 'Hotel' : 
                           formData.accommodationType === 'homestay' ? 'Homestay' : 'Luxury Resort',
          mealsIncluded: formData.mealsIncluded === 'yes' ? 'Included' : 'Excluded',
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
        description: `Bhutan Tour Package - ${selectedPackage.title}`,
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
                setIsBookingOpen(false);
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
                setIsBookingOpen(false);
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
          destination: "Bhutan",
          booking_reference: `BHUTAN-${Date.now()}`,
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
      adults: 2,
      children: 0,
      childrenAges: '',
      arrivalDate: '',
      departureDate: '',
      accommodationType: 'hotel',
      mealsIncluded: 'yes',
      budget: '',
      specialRequests: {
        camping: false,
        monasteryStay: false,
        photographyTour: false,
        trekking: false,
        culturalImmersion: false,
        other: ''
      },
      message: ''
    });
    setFormErrors({});
  };

  const packages = [
    {
      id: 1,
      title: "Classic Bhutan Cultural Tour",
      duration: "7 Days / 6 Nights",
      price: "$1,999",
      rating: 4.9,
      image: "/images/Bhutan2.avif",
      type: "culture",
      highlights: [
        "Explore Paro, Thimphu & Punakha",
        "Visit Tiger's Nest Monastery (Taktsang)",
        "Experience traditional Bhutanese festivals",
        "Tour ancient dzongs and temples",
        "Cultural performances and local interactions",
        "Traditional Bhutanese meals"
      ],
      icon: <FaPlaceOfWorship className="text-2xl text-amber-600" />
    },
    {
      id: 2,
      title: "Bhutan Himalayan Trek",
      duration: "10 Days / 9 Nights",
      price: "$2,499",
      rating: 4.7,
      image: "/images/Bhutan3.jpeg",
      type: "adventure",
      highlights: [
        "Druk Path Trek (6 days of trekking)",
        "Camp with views of Himalayan peaks",
        "Visit remote monasteries",
        "Experience nomadic life",
        "Professional trekking guides and support",
        "All camping equipment provided"
      ],
      icon: <MdOutlineHiking className="text-2xl text-green-500" />
    },
    {
      id: 3,
      title: "Bhutan Happiness Retreat",
      duration: "8 Days / 7 Nights",
      price: "$2,299",
      rating: 4.8,
      image: "/images/Bhutan4.jpg",
      type: "wellness",
      highlights: [
        "Meditation sessions with monks",
        "Traditional hot stone baths",
        "GNH (Gross National Happiness) workshops",
        "Yoga with Himalayan views",
        "Organic farm-to-table meals",
        "Private consultations with traditional healers"
      ],
      icon: <FaPrayingHands className="text-2xl text-blue-500" />
    },
    {
      id: 4,
      title: "Bhutan Festival Tour",
      duration: "9 Days / 8 Nights",
      price: "$2,799",
      rating: 4.6,
      image: "/images/Bhutan5.jpg",
      type: "culture",
      highlights: [
        "Attend vibrant Tshechu festivals",
        "Witness sacred mask dances",
        "Photography-focused itinerary",
        "Local home stays",
        "Private audience with monks",
        "Learn traditional Bhutanese dances"
      ],
      icon: <GiStonePath className="text-2xl text-red-500" />
    }
  ];

  const galleryImages = [
    "/images/Bhutan1.jpeg",
    "/images/Bhutan2.avif",
    "/images/Bhutan3.jpeg",
    "/images/Bhutan4.jpg",
    "/images/Bhutan5.jpg",
    "/images/Bhutan6.jpg",
    "/images/Bhutan7.jpg",
    "/images/Bhutan8.jpeg",
  ];

  const filteredPackages = activeTab === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.type === activeTab);

  const togglePackage = (id) => {
    setExpandedPackage(expandedPackage === id ? null : id);
  };

  const openBookingModal = (pkg) => {
    setSelectedPackage(pkg);
    setFormData(prev => ({
      ...prev,
      package: pkg.title
    }));
    setFormErrors({});
    setShowPaymentError(false);
    setIsBookingOpen(true);
    setFormSubmitted(false);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
    setSelectedPackage(null);
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleChange = (e) => {
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
    const { name, checked, value } = e.target;
    if (name === 'other') {
      setFormData(prev => ({
        ...prev,
        specialRequests: {
          ...prev.specialRequests,
          other: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        specialRequests: {
          ...prev.specialRequests,
          [name]: checked
        }
      }));
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

  const incrementAdults = () => {
    setFormData(prev => ({
      ...prev,
      adults: Math.min(prev.adults + 1, 50)
    }));
  };

  const decrementAdults = () => {
    setFormData(prev => ({
      ...prev,
      adults: Math.max(prev.adults - 1, 1)
    }));
  };

  const incrementChildren = () => {
    setFormData(prev => ({
      ...prev,
      children: Math.min(prev.children + 1, 20)
    }));
  };

  const decrementChildren = () => {
    setFormData(prev => ({
      ...prev,
      children: Math.max(prev.children - 1, 0)
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
    
    setIsProcessing(true);
    
    try {
      // Send email for booking request
      await sendBookingEmail('Booking Request');
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setIsBookingOpen(false);
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50">
      {/* Hero Section */}
      <div className="relative h-screen max-h-[100vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/70 z-10"></div>
        <img 
          src="/images/Bhutan4.jpg"
          alt="Bhutan" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
          <div className="text-center max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif"
            >
              Kingdom of Bhutan
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl text-white mb-8 font-light"
            >
              Where happiness is a way of life
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-600 to-amber-600 text-white px-10 py-5 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all text-lg"
              onClick={() => document.getElementById('packages').scrollIntoView({ behavior: 'smooth' })}
            >
              Discover Bhutan's Magic
            </motion.button>
          </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white text-4xl"
          >
            <FaChevronDown />
          </motion.div>
        </div>
      </div>

      {/* Introduction Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-serif">The Last Shangri-La</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-green-500 via-amber-500 to-green-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Bhutan, the Land of the Thunder Dragon, is a mystical kingdom nestled in the Himalayas, known for its stunning landscapes, ancient Buddhist culture, and unique philosophy of Gross National Happiness. This pristine paradise offers travelers an authentic experience of traditional Himalayan life.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: <FaPlaceOfWorship className="text-5xl text-amber-600" />,
              title: "Spiritual Heritage",
              desc: "Home to sacred monasteries, dzongs, and vibrant Buddhist traditions dating back centuries"
            },
            {
              icon: <GiMountainRoad className="text-5xl text-green-500" />,
              title: "Pristine Nature",
              desc: "With 70% forest coverage, Bhutan boasts diverse ecosystems and rare wildlife including the endangered black-necked crane"
            },
            {
              icon: <FaPrayingHands className="text-5xl text-blue-500" />,
              title: "Happiness Philosophy",
              desc: "The only country that measures Gross National Happiness as a development indicator"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all text-center border border-gray-100"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-green-50 rounded-full">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bhutan Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-amber-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "72%", label: "Forest Coverage", icon: <FaLeaf className="text-3xl mx-auto mb-3" /> },
              { number: "800+", label: "Sacred Sites", icon: <FaPlaceOfWorship className="text-3xl mx-auto mb-3" /> },
              { number: "7000m+", label: "Mountain Peaks", icon: <FaMountain className="text-3xl mx-auto mb-3" /> },
              { number: "100%", label: "Organic Farming", icon: <FaLeaf className="text-3xl mx-auto mb-3" /> }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6"
              >
                {stat.icon}
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 px-4 bg-gradient-to-b from-white to-green-50 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-100 rounded-full opacity-20"></div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-serif">Bhutan Tour Packages</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-green-500 via-amber-500 to-green-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Immerse yourself in Bhutan's magic with our carefully curated experiences that showcase the kingdom's rich culture and breathtaking landscapes.
            </p>
          </div>

          {/* Package Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { id: 'all', label: 'All Packages', icon: <FaStar className="mr-2" /> },
              { id: 'culture', label: 'Cultural', icon: <FaPlaceOfWorship className="mr-2" /> },
              { id: 'adventure', label: 'Adventure', icon: <MdOutlineHiking className="mr-2" /> },
              { id: 'wellness', label: 'Wellness', icon: <MdSpa className="mr-2" /> }
            ].map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-medium transition-all flex items-center ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-600 to-amber-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Package Cards */}
          <div className="grid md:grid-cols-2 gap-10">
            {filteredPackages.map(pkg => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="relative h-72">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center text-amber-600 font-bold shadow-sm">
                    <FaStar className="mr-1" />
                    {pkg.rating}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-green-600/90 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                      {pkg.duration}
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">{pkg.title}</h3>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-green-600">{pkg.price}</span>
                      <span className="text-xs text-gray-500 ml-1">/person</span>
                    </div>
                  </div>

                  <div className="flex items-center mb-6">
                    <div className="mr-4 p-3 bg-green-100 rounded-xl shadow-inner">
                      {pkg.icon}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {pkg.type === 'culture' && 'Cultural Immersion'}
                      {pkg.type === 'adventure' && 'Adventure Expedition'}
                      {pkg.type === 'wellness' && 'Wellness Retreat'}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedPackage === pkg.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6 overflow-hidden"
                      >
                        <ul className="space-y-3 pl-2">
                          {pkg.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-green-500 mr-3 text-lg">✓</span>
                              <span className="text-gray-700">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <button
                      onClick={() => togglePackage(pkg.id)}
                      className="text-green-600 hover:text-green-800 font-medium flex items-center transition-colors"
                    >
                      {expandedPackage === pkg.id ? 'Show Less' : 'View Highlights'}
                      <FaChevronDown className={`ml-2 transition-transform ${expandedPackage === pkg.id ? 'rotate-180' : ''}`} />
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-green-600 to-amber-600 text-white px-8 py-3 rounded-xl font-medium shadow-md hover:shadow-lg"
                      onClick={() => openBookingModal(pkg)}
                    >
                      Book Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-green-100 rounded-full opacity-20"></div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-serif">Glimpses of Bhutan</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-green-500 via-amber-500 to-green-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Witness the breathtaking beauty of Bhutan through these stunning visuals that capture its essence.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all"
                onClick={() => openImageModal(image)}
              >
                <img 
                  src={image} 
                  alt={`Bhutan ${index + 1}`} 
                  className="w-full h-48 md:h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/10 hover:from-black/50 transition-colors"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-100 rounded-full opacity-20"></div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-serif">Why Choose Our Bhutan Tours?</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-green-500 via-amber-500 to-green-500 mx-auto mb-8 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Local Expertise",
                desc: "Our Bhutanese guides are deeply knowledgeable about culture and traditions",
                icon: "👨‍🌾",
                bg: "bg-green-50",
                border: "border-green-100"
              },
              {
                title: "Sustainable Tourism",
                desc: "We follow Bhutan's high-value, low-impact tourism policy",
                icon: "🌿",
                bg: "bg-amber-50",
                border: "border-amber-100"
              },
              {
                title: "Authentic Experiences",
                desc: "Genuine cultural interactions beyond typical tourist spots",
                icon: "🏯",
                bg: "bg-blue-50",
                border: "border-blue-100"
              },
              {
                title: "All-Inclusive",
                desc: "Daily tariff covers accommodation, meals, transport and guide",
                icon: "🛎️",
                bg: "bg-purple-50",
                border: "border-purple-100"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border ${item.bg} ${item.border}`}
              >
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <button
                onClick={closeBookingModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 transition-colors"
              >
                <FaTimes className="text-2xl" />
              </button>

              <div className="grid lg:grid-cols-2">
                {/* Package Info Side */}
                <div className="p-10 bg-gradient-to-b from-green-600 to-green-800 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/images/Bhutan6.jpg')] bg-cover bg-center opacity-20"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/60"></div>
                  <div className="relative z-10 h-full flex flex-col">
                    <div>
                      <h3 className="text-3xl font-bold mb-4">{selectedPackage.title}</h3>
                      <div className="flex items-center mb-6">
                        <div className="bg-white/20 px-4 py-1 rounded-full text-sm mr-4">
                          {selectedPackage.duration}
                        </div>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-300 mr-1" />
                          <span>{selectedPackage.rating}</span>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="font-bold text-xl mb-4">Package Highlights:</h4>
                        <ul className="space-y-3">
                          {selectedPackage.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-yellow-300 mr-3 text-xl">•</span>
                              <span className="text-lg">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-lg">Package Price:</span>
                          <span className="text-3xl font-bold">{selectedPackage.price}</span>
                        </div>
                        <div className="text-sm opacity-80 mt-1">per person (excluding flights)</div>
                      </div>

                      <div className="mt-8 space-y-4">
                        <div className="flex items-center">
                          <FaPhone className="mr-3 opacity-80" />
                          <span>+975 17123456</span>
                        </div>
                        <div className="flex items-center">
                          <FaEnvelope className="mr-3 opacity-80" />
                          <span>info@bhutantravel.com</span>
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-3 opacity-80" />
                          <span>Thimphu, Bhutan</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Side */}
                <div className="p-10 bg-white">
                  {formSubmitted ? (
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
                      <p className="text-gray-600 mb-8 text-lg">We've received your request for <span className="font-semibold">{selectedPackage.title}</span>. Our travel expert will contact you within 24 hours to confirm your booking and assist with visa processing.</p>
                      <button
                        onClick={closeBookingModal}
                        className="bg-gradient-to-r from-green-600 to-amber-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-lg"
                      >
                        Close
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      {/* Payment Error Alert */}
                      {showPaymentError && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
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
                          className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
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
                      
                      <h3 className="text-3xl font-bold text-gray-800 mb-2">Reserve Your Spot</h3>
                      <p className="text-xl text-gray-600 mb-8">Begin your Bhutan journey today</p>
                      
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="relative" id="name">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                            <div className="relative">
                              <FaUser className="absolute left-3 top-4 text-gray-400" />
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={`w-full pl-10 pr-5 py-4 rounded-xl border focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                                  formErrors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Your name"
                              />
                              {formErrors.name && (
                                <div className="absolute right-3 top-4 text-red-500">
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                            <div className="relative">
                              <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={`w-full pl-10 pr-5 py-4 rounded-xl border focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="your@email.com"
                              />
                              {formErrors.email && (
                                <div className="absolute right-3 top-4 text-red-500">
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
                        </div>

                        <div className="relative" id="phone">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                          <div className="relative">
                            <FaPhone className="absolute left-3 top-4 text-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className={`w-full pl-10 pr-5 py-4 rounded-xl border focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                                formErrors.phone ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="+975 17123456"
                            />
                            {formErrors.phone && (
                              <div className="absolute right-3 top-4 text-red-500">
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

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="relative" id="adults">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Adults *</label>
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={decrementAdults}
                                className="bg-gray-200 text-gray-700 px-4 py-3 rounded-l-xl hover:bg-gray-300 transition-colors"
                              >
                                <FaMinus />
                              </button>
                              <div className={`w-full px-5 py-3 border-t border-b text-center bg-white font-medium ${
                                formErrors.adults ? 'border-red-500 text-red-500' : 'border-gray-300'
                              }`}>
                                {formData.adults}
                              </div>
                              <button
                                type="button"
                                onClick={incrementAdults}
                                className="bg-gray-200 text-gray-700 px-4 py-3 rounded-r-xl hover:bg-gray-300 transition-colors"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={decrementChildren}
                                className="bg-gray-200 text-gray-700 px-4 py-3 rounded-l-xl hover:bg-gray-300 transition-colors"
                              >
                                <FaMinus />
                              </button>
                              <div className="w-full px-5 py-3 border-t border-b border-gray-300 text-center bg-white font-medium">
                                {formData.children}
                              </div>
                              <button
                                type="button"
                                onClick={incrementChildren}
                                className="bg-gray-200 text-gray-700 px-4 py-3 rounded-r-xl hover:bg-gray-300 transition-colors"
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </div>
                        </div>

                        {formData.children > 0 && (
                          <div className="relative" id="childrenAges">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Children Ages (comma separated) *</label>
                            <input
                              type="text"
                              name="childrenAges"
                              value={formData.childrenAges}
                              onChange={handleChange}
                              placeholder="e.g. 5, 8, 12"
                              className={`w-full px-5 py-4 rounded-xl border focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                                formErrors.childrenAges ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {formErrors.childrenAges && (
                              <p className="text-red-500 text-xs mt-1 flex items-center">
                                <FaExclamationCircle className="mr-1" /> {formErrors.childrenAges}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="relative" id="arrivalDate">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Date *</label>
                            <div className="relative">
                              <FaCalendarAlt className="absolute left-3 top-4 text-gray-400" />
                              <DatePicker
                                selected={formData.arrivalDate}
                                onChange={(date) => handleDateChange(date, 'arrivalDate')}
                                selectsStart
                                startDate={formData.arrivalDate}
                                endDate={formData.departureDate}
                                minDate={new Date()}
                                className={`w-full pl-10 pr-5 py-4 rounded-xl border focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                                  formErrors.arrivalDate ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                                placeholderText="Select arrival date"
                              />
                              {formErrors.arrivalDate && (
                                <div className="absolute right-3 top-4 text-red-500">
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
                          
                          <div className="relative" id="departureDate">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date *</label>
                            <div className="relative">
                              <FaCalendarAlt className="absolute left-3 top-4 text-gray-400" />
                              <DatePicker
                                selected={formData.departureDate}
                                onChange={(date) => handleDateChange(date, 'departureDate')}
                                selectsEnd
                                startDate={formData.arrivalDate}
                                endDate={formData.departureDate}
                                minDate={formData.arrivalDate || new Date()}
                                className={`w-full pl-10 pr-5 py-4 rounded-xl border focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                                  formErrors.departureDate ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                                placeholderText="Select departure date"
                              />
                              {formErrors.departureDate && (
                                <div className="absolute right-3 top-4 text-red-500">
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

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation *</label>
                            <div className="relative">
                              <FaHotel className="absolute left-3 top-4 text-gray-400" />
                              <select
                                name="accommodationType"
                                value={formData.accommodationType}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                              >
                                <option value="hotel">3-Star Hotel</option>
                                <option value="homestay">Homestay</option>
                                <option value="luxury">4/5-Star Resort</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Meals Included *</label>
                            <div className="relative">
                              <FaUtensils className="absolute left-3 top-4 text-gray-400" />
                              <select
                                name="mealsIncluded"
                                value={formData.mealsIncluded}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                              >
                                <option value="yes">Yes (Full Board)</option>
                                <option value="no">No (Breakfast Only)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="relative" id="budget">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Approximate Budget (without flights) *</label>
                          <div className="relative">
                            <FaWallet className="absolute left-3 top-4 text-gray-400" />
                            <input
                              type="text"
                              name="budget"
                              value={formData.budget}
                              onChange={handleChange}
                              className={`w-full pl-10 pr-5 py-4 rounded-xl border focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                                formErrors.budget ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="e.g. $2,000 - $3,000"
                            />
                            {formErrors.budget && (
                              <div className="absolute right-3 top-4 text-red-500">
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

                        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                          <label className="block text-lg font-medium text-gray-700 mb-4">Special Requests</label>
                          <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <label className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-gray-200 hover:border-green-300 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                name="camping"
                                checked={formData.specialRequests.camping}
                                onChange={handleSpecialRequestChange}
                                className="rounded text-green-600 h-5 w-5"
                              />
                              <span>Camping Experience</span>
                            </label>
                            <label className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-gray-200 hover:border-green-300 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                name="monasteryStay"
                                checked={formData.specialRequests.monasteryStay}
                                onChange={handleSpecialRequestChange}
                                className="rounded text-green-600 h-5 w-5"
                              />
                              <span>Monastery Stay</span>
                            </label>
                            <label className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-gray-200 hover:border-green-300 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                name="photographyTour"
                                checked={formData.specialRequests.photographyTour}
                                onChange={handleSpecialRequestChange}
                                className="rounded text-green-600 h-5 w-5"
                              />
                              <span>Photography Tour</span>
                            </label>
                            <label className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-gray-200 hover:border-green-300 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                name="trekking"
                                checked={formData.specialRequests.trekking}
                                onChange={handleSpecialRequestChange}
                                className="rounded text-green-600 h-5 w-5"
                              />
                              <span>Trekking</span>
                            </label>
                            <label className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-gray-200 hover:border-green-300 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                name="culturalImmersion"
                                checked={formData.specialRequests.culturalImmersion}
                                onChange={handleSpecialRequestChange}
                                className="rounded text-green-600 h-5 w-5"
                              />
                              <span>Cultural Immersion</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            name="other"
                            value={formData.specialRequests.other}
                            onChange={handleSpecialRequestChange}
                            placeholder="Other requests"
                            className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                            placeholder="Any additional information or requests..."
                          ></textarea>
                        </div>

                        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isProcessing}
                            className={`w-full py-5 px-6 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all text-lg ${
                              isProcessing
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700'
                            }`}
                          >
                            {isProcessing ? (
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
                              isProcessing || !razorpayLoaded
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'
                            }`}
                            onClick={paymentHandler}
                          >
                            {!razorpayLoaded ? 'Loading Payment...' : isProcessing ? 'Processing...' : 'Pay Now (₹500)'}
                          </motion.button>
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                          By submitting this form, you agree to our <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>.
                        </p>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-6xl w-full max-h-[90vh]"
            >
              <button
                onClick={closeImageModal}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10 transition-colors"
              >
                <FaTimes className="text-3xl" />
              </button>
              <img 
                src={selectedImage} 
                alt="Enlarged view" 
                className="w-full h-full object-contain max-h-[90vh]"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bhutan;