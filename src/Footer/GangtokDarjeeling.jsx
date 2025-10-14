import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaHeart, FaChevronDown, FaMountain, FaTimes, FaPlus, FaMinus, FaCalendarAlt, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser, FaHotel, FaUtensils, FaWallet, FaExclamationCircle } from 'react-icons/fa';
import { GiTeapot, GiTigerHead, GiMonumentValley, GiVillage, GiRiver } from 'react-icons/gi';
import { MdFamilyRestroom, MdTrain, MdOutlineHiking } from 'react-icons/md';
import { IoLeaf } from 'react-icons/io5';
import emailjs from '@emailjs/browser';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const GangtokDarjeeling = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
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
    children: 0,
    childrenAges: '',
    hotelCategory: '3',
    mealsIncluded: 'yes',
    budget: '',
    specialRequests: {
      candlelightDinner: false,
      anniversaryCake: false,
      flowerDecor: false,
      privateTransport: false,
      photoSession: false,
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
    if (formData.specialRequests.candlelightDinner) specialRequests.push("Candlelight Dinner");
    if (formData.specialRequests.anniversaryCake) specialRequests.push("Anniversary Cake");
    if (formData.specialRequests.flowerDecor) specialRequests.push("Flower Decoration");
    if (formData.specialRequests.privateTransport) specialRequests.push("Private Transport");
    if (formData.specialRequests.photoSession) specialRequests.push("Photo Session");
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
          destination: "Gangtok & Darjeeling",
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
          hotelCategory: formData.hotelCategory === '3' ? '3 Star' : 
                        formData.hotelCategory === '4' ? '4 Star' : '5 Star',
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
        description: `Gangtok & Darjeeling Tour Package - ${selectedPackage.title}`,
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
          destination: "Gangtok & Darjeeling",
          booking_reference: `GANGTOK-${Date.now()}`,
          customer_email: formData.email
        },
        theme: {
          color: "#3B82F6"
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
      children: 0,
      childrenAges: '',
      hotelCategory: '3',
      mealsIncluded: 'yes',
      budget: '',
      specialRequests: {
        candlelightDinner: false,
        anniversaryCake: false,
        flowerDecor: false,
        privateTransport: false,
        photoSession: false,
        other: ''
      },
      message: ''
    });
    setFormErrors({});
  };

  const packages = [
    {
      id: 1,
      title: "Premium Gangtok & Darjeeling",
      duration: "7 Days / 6 Nights",
      price: "₹42,999",
      rating: 4.8,
      image: "/images/Darjeeling1.jpeg",
      type: "luxury",
      highlights: [
        "5-star hotels with mountain views",
        "Toy Train joy ride in Darjeeling",
        "Visit to Tsomgo Lake",
        "Sunrise at Tiger Hill",
        "Private city tours"
      ],
      icon: <FaMountain className="text-2xl text-blue-500" />
    },
    {
      id: 2,
      title: "Romantic Honeymoon Package",
      duration: "6 Days / 5 Nights",
      price: "₹38,999",
      rating: 4.9,
      image: "/images/darjeeling2.jpeg",
      type: "honeymoon",
      highlights: [
        "Candlelight dinners with mountain views",
        "Couple spa treatments",
        "Romantic room decorations",
        "Private sunset viewings",
        "Honeymoon photography session"
      ],
      icon: <FaHeart className="text-2xl text-pink-500" />
    },
    {
      id: 3,
      title: "Family Adventure Tour",
      duration: "8 Days / 7 Nights",
      price: "₹49,999",
      rating: 4.7,
      image: "/images/Darjeeling3.jpeg",
      type: "family",
      highlights: [
        "Kid-friendly activities",
        "Family-sized accommodations",
        "Tea garden visits",
        "Toy train experience",
        "Zoo and ropeway adventures"
      ],
      icon: <MdFamilyRestroom className="text-2xl text-green-500" />
    },
    {
      id: 4,
      title: "Tea Estate Experience",
      duration: "5 Days / 4 Nights",
      price: "₹32,999",
      rating: 4.6,
      image: "/images/Darjeeling4.jpeg",
      type: "cultural",
      highlights: [
        "Stay in heritage tea bungalows",
        "Tea tasting sessions",
        "Tea plucking experience",
        "Visit to tea factories",
        "Local cultural performances"
      ],
      icon: <GiTeapot className="text-2xl text-amber-600" />
    }
  ];

  const galleryImages = [
    "/images/Darjeeling1.jpeg",
    "/images/darjeeling2.jpeg",
    "/images/Darjeeling3.jpeg",
    "/images/Darjeeling4.jpeg",
    "/images/Darjeeling5.jpeg",
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
    setFormSubmitted(false);
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative h-96 md:h-screen max-h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="/images/Darjeeling1.jpeg"
          alt="Gangtok & Darjeeling" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
          <div className="text-center max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
            >
              Gangtok & Darjeeling
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white mb-8 drop-shadow-md"
            >
              Where the Himalayas meet colonial charm and tea-scented breezes
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all hover:brightness-110"
              onClick={() => document.getElementById('packages').scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Packages
            </motion.button>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Queen of the Himalayas</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-orange-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Gangtok and Darjeeling offer a perfect blend of Himalayan grandeur, colonial heritage, and vibrant local culture. 
            From the world-famous tea gardens to the breathtaking views of Kanchenjunga, every moment here is magical.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <GiTigerHead className="text-4xl text-blue-600" />,
              title: "Tiger Hill Sunrise",
              desc: "Witness the spectacular sunrise over Kanchenjunga from Tiger Hill"
            },
            {
              icon: <MdTrain className="text-4xl text-orange-500" />,
              title: "Toy Train Rides",
              desc: "Experience the UNESCO-listed Darjeeling Himalayan Railway"
            },
            {
              icon: <GiMonumentValley className="text-4xl text-blue-700" />,
              title: "Buddhist Culture",
              desc: "Explore ancient monasteries and spiritual sites"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center border border-gray-100 hover:border-blue-200"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-50 rounded-full">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-16 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Tour Packages</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-orange-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from our carefully curated packages that showcase the best of Gangtok and Darjeeling.
            </p>
          </div>

          {/* Package Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { id: 'all', label: 'All Packages' },
              { id: 'luxury', label: 'Luxury' },
              { id: 'honeymoon', label: 'Honeymoon' },
              { id: 'family', label: 'Family' },
              { id: 'cultural', label: 'Cultural' }
            ].map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-orange-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Package Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {filteredPackages.map(pkg => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow group"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title} 
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center text-amber-600 font-bold">
                    <FaStar className="mr-1" />
                    {pkg.rating}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-blue-600/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {pkg.duration}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{pkg.title}</h3>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-blue-600">{pkg.price}</span>
                      <span className="text-xs text-gray-500 ml-1">/person</span>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="mr-3 p-2 bg-blue-100 rounded-lg">
                      {pkg.icon}
                    </div>
                    <div className="text-sm text-gray-600">
                      {pkg.type === 'luxury' && 'Luxury Experience'}
                      {pkg.type === 'honeymoon' && 'Honeymoon Special'}
                      {pkg.type === 'family' && 'Family Package'}
                      {pkg.type === 'cultural' && 'Cultural Tour'}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedPackage === pkg.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4 overflow-hidden"
                      >
                        <ul className="space-y-2 pl-2">
                          {pkg.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-blue-500 mr-2">✓</span>
                              <span className="text-gray-700">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <button
                      onClick={() => togglePackage(pkg.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                    >
                      {expandedPackage === pkg.id ? 'Show Less' : 'View Highlights'}
                      <FaChevronDown className={`ml-2 transition-transform ${expandedPackage === pkg.id ? 'rotate-180' : ''}`} />
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-600 to-orange-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg"
                      onClick={() => handleBookNow(pkg)}
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
      <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Glimpses of Gangtok & Darjeeling</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-orange-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Witness the breathtaking beauty of these Himalayan gems through these stunning visuals.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="relative rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => openImageModal(image)}
              >
                <img 
                  src={image} 
                  alt={`Gangtok & Darjeeling ${index + 1}`} 
                  className="w-full h-40 md:h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Our Tours?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-orange-500 mx-auto mb-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <GiVillage className="text-4xl text-blue-600" />,
                title: "Local Expertise",
                desc: "Our guides are Himalayan natives who know every hidden trail and viewpoint"
              },
              {
                icon: <IoLeaf className="text-4xl text-green-500" />,
                title: "Sustainable Tourism",
                desc: "We support local communities and preserve the mountain ecosystem"
              },
              {
                icon: <MdOutlineHiking className="text-4xl text-blue-700" />,
                title: "Adventure Specialists",
                desc: "Expert-led treks and activities with top safety standards"
              },
              {
                icon: <GiRiver className="text-4xl text-green-400" />,
                title: "Cultural Immersion",
                desc: "Authentic experiences with local communities and traditions"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="text-4xl mb-4 flex justify-center">
                  <div className="p-3 bg-blue-50 rounded-full">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{item.title}</h3>
                <p className="text-gray-600 text-center">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-orange-600 p-4 flex justify-between items-center z-10 -m-6 mb-6 rounded-t-xl">
                <h3 className="text-xl font-bold text-white">Book {selectedPackage?.title}</h3>
                <button 
                  onClick={() => setShowBookingForm(false)}
                  className="text-white hover:text-blue-200 transition-colors"
                  disabled={isProcessing}
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

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
                  <p className="text-gray-600 mb-6">We've received your booking request for {selectedPackage?.title}. Our travel expert will contact you shortly to confirm your Himalayan adventure.</p>
                  <p className="text-sm text-gray-500">This window will close automatically...</p>
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
                  
                  <p className="text-gray-600 mb-6">{selectedPackage?.duration} | {selectedPackage?.price}</p>

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative" id="name">
                          <label className="block text-gray-700 mb-1">Full Name *</label>
                          <div className="relative">
                            <FaUser className="absolute left-3 top-3 text-gray-400" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                                formErrors.name ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                              disabled={isProcessing}
                              placeholder="Enter your full name"
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
                          <label className="block text-gray-700 mb-1">Email *</label>
                          <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                                formErrors.email ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                              disabled={isProcessing}
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
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative" id="phone">
                          <label className="block text-gray-700 mb-1">Phone Number *</label>
                          <div className="relative">
                            <FaPhone className="absolute left-3 top-3 text-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                                formErrors.phone ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                              disabled={isProcessing}
                              placeholder="+91 XXXXX XXXXX"
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

                        <div className="relative" id="budget">
                          <label className="block text-gray-700 mb-1">Budget Range *</label>
                          <div className="relative">
                            <FaWallet className="absolute left-3 top-3 text-gray-400" />
                            <select
                              name="budget"
                              value={formData.budget}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none ${
                                formErrors.budget ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                              disabled={isProcessing}
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative" id="arrivalDate">
                          <label className="block text-gray-700 mb-1">Arrival Date *</label>
                          <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                            <DatePicker
                              selected={formData.arrivalDate}
                              onChange={(date) => handleDateChange(date, 'arrivalDate')}
                              selectsStart
                              startDate={formData.arrivalDate}
                              endDate={formData.departureDate}
                              minDate={new Date()}
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                                formErrors.arrivalDate ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                              disabled={isProcessing}
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

                        <div className="relative" id="departureDate">
                          <label className="block text-gray-700 mb-1">Departure Date *</label>
                          <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                            <DatePicker
                              selected={formData.departureDate}
                              onChange={(date) => handleDateChange(date, 'departureDate')}
                              selectsEnd
                              startDate={formData.arrivalDate}
                              endDate={formData.departureDate}
                              minDate={formData.arrivalDate || new Date()}
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                                formErrors.departureDate ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                              disabled={isProcessing}
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative" id="adults">
                          <label className="block text-gray-700 mb-1">Adults *</label>
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={decrementAdults}
                              className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              disabled={isProcessing || formData.adults <= 1}
                            >
                              <FaMinus />
                            </button>
                            <div className={`w-full px-4 py-2 text-center border-0 focus:ring-0 ${
                              formErrors.adults ? 'text-red-500' : ''
                            }`}>
                              {formData.adults}
                            </div>
                            <button
                              type="button"
                              onClick={incrementAdults}
                              className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              disabled={isProcessing}
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
                          <label className="block text-gray-700 mb-1">Children</label>
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={decrementChildren}
                              className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              disabled={isProcessing || formData.children <= 0}
                            >
                              <FaMinus />
                            </button>
                            <div className="w-full px-4 py-2 text-center border-0 focus:ring-0">
                              {formData.children}
                            </div>
                            <button
                              type="button"
                              onClick={incrementChildren}
                              className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              disabled={isProcessing}
                            >
                              <FaPlus />
                            </button>
                          </div>
                        </div>
                      </div>

                      {formData.children > 0 && (
                        <div className="relative" id="childrenAges">
                          <label className="block text-gray-700 mb-1">Children Ages (comma separated) *</label>
                          <input
                            type="text"
                            name="childrenAges"
                            value={formData.childrenAges}
                            onChange={handleInputChange}
                            placeholder="e.g. 5, 8, 12"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                              formErrors.childrenAges ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={isProcessing}
                          />
                          {formErrors.childrenAges && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <FaExclamationCircle className="mr-1" /> {formErrors.childrenAges}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 mb-1">Hotel Category *</label>
                          <div className="relative">
                            <FaHotel className="absolute left-3 top-3 text-gray-400" />
                            <select
                              name="hotelCategory"
                              value={formData.hotelCategory}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none"
                              required
                              disabled={isProcessing}
                            >
                              <option value="3">3 Star</option>
                              <option value="4">4 Star</option>
                              <option value="5">5 Star</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-1">Meals Included *</label>
                          <div className="relative">
                            <FaUtensils className="absolute left-3 top-3 text-gray-400" />
                            <select
                              name="mealsIncluded"
                              value={formData.mealsIncluded}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none"
                              required
                              disabled={isProcessing}
                            >
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                              <option value="breakfast">Breakfast Only</option>
                              <option value="half-board">Half Board</option>
                              <option value="full-board">Full Board</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1">Special Requests</label>
                        <div className="space-y-2 mb-3">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              name="candlelightDinner"
                              checked={formData.specialRequests.candlelightDinner}
                              onChange={handleSpecialRequestChange}
                              className="rounded text-orange-600"
                              disabled={isProcessing}
                            />
                            <span>Candlelight Dinner</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              name="anniversaryCake"
                              checked={formData.specialRequests.anniversaryCake}
                              onChange={handleSpecialRequestChange}
                              className="rounded text-orange-600"
                              disabled={isProcessing}
                            />
                            <span>Anniversary Cake</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              name="flowerDecor"
                              checked={formData.specialRequests.flowerDecor}
                              onChange={handleSpecialRequestChange}
                              className="rounded text-orange-600"
                              disabled={isProcessing}
                            />
                            <span>Flower Decoration</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              name="privateTransport"
                              checked={formData.specialRequests.privateTransport}
                              onChange={handleSpecialRequestChange}
                              className="rounded text-orange-600"
                              disabled={isProcessing}
                            />
                            <span>Private Transport</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              name="photoSession"
                              checked={formData.specialRequests.photoSession}
                              onChange={handleSpecialRequestChange}
                              className="rounded text-orange-600"
                              disabled={isProcessing}
                            />
                            <span>Photo Session</span>
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              className="rounded text-orange-600 opacity-0"
                              disabled
                            />
                            <input
                              type="text"
                              name="other"
                              value={formData.specialRequests.other}
                              onChange={handleSpecialRequestChange}
                              placeholder="Other requests"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              disabled={isProcessing}
                            />
                          </div>
                        </div>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Any additional information or requests..."
                          disabled={isProcessing}
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className={`w-full bg-gradient-to-r from-blue-600 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-orange-700 transition-all shadow-lg ${
                            isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          {isProcessing ? 'Processing...' : 'Submit Booking Request'}
                        </button>
                        
                        <button
                          type="button"
                          onClick={paymentHandler}
                          disabled={isProcessing || !razorpayLoaded}
                          className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg ${
                            isProcessing || !razorpayLoaded ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          {!razorpayLoaded ? 'Loading Payment...' : isProcessing ? 'Processing...' : 'Pay Now (₹500)'}
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-6xl w-full max-h-[90vh]"
            >
              <button
                onClick={closeImageModal}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10 transition-colors bg-black/50 rounded-full p-2"
              >
                <FaTimes className="text-2xl" />
              </button>
              <img 
                src={selectedImage} 
                alt="Enlarged view" 
                className="w-full h-full object-contain max-h-[90vh] rounded-lg"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GangtokDarjeeling;