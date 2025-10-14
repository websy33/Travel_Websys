import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaHeart, FaMountain, FaSnowflake, FaSpa, FaHotel, FaChevronDown, FaTimes, FaPlus, FaMinus, FaExclamationCircle, FaCalendarAlt, FaPhone, FaEnvelope, FaUser, FaWallet, FaUtensils, FaUsers, FaChild } from 'react-icons/fa';
import { GiRiver, GiWoodCabin, GiCampingTent } from 'react-icons/gi';
import emailjs from '@emailjs/browser';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Himachal = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formStatus, setFormStatus] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPaymentError, setShowPaymentError] = useState(false);
  const form = useRef();

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

  // Form validation function
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
    const formatDate = (date) => {
      if (!date) return 'Not specified';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const paymentInfo = paymentId ? `Payment ID: ${paymentId}` : paymentMethod;
    
    const templateParams = {
      package_name: selectedPackage?.title || 'Custom Himachal Package',
      duration: selectedPackage?.duration || 'Custom Duration',
      destination: "Himachal Pradesh",
      package_price: selectedPackage?.price || 'Custom Quote',
      from_name: formData.name,
      from_email: formData.email,
      phone_number: formData.phone,
      arrivalDate: formData.arrivalDate ? formatDate(formData.arrivalDate) : 'Not specified',
      departureDate: formData.departureDate ? formatDate(formData.departureDate) : 'Not specified',
      adults: formData.adults,
      kids: formData.kids,
      kidsAges: formData.kidsAges || 'Not specified',
      hotelCategory: formData.hotelCategory + ' Star',
      mealsIncluded: formData.mealsIncluded === 'yes' ? 'Included' : 'Excluded',
      budget: formData.budget || 'Not specified',
      message: formData.message + (formData.specialRequests.length > 0 ? 
        `\n\nSpecial Requests:\n- ${formData.specialRequests.join('\n- ')}` : ''),
      payment_method: paymentInfo
    };

    try {
      emailjs.init('37pN2ThzFwwhwk7ai');
      
      const result = await emailjs.send(
        'service_ov629rm',
        'template_jr1dnto',
        templateParams
      );
      return result;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  };

  // Fixed Payment Handler - Direct Razorpay Integration
  const paymentHandler = async (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    // Validate form before payment
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setShowPaymentError(true);
      setIsProcessingPayment(false);
      
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
      setIsProcessingPayment(false);
      return;
    }
    
    if (!window.Razorpay) {
      alert('Payment service is unavailable. Please try the booking request option.');
      setIsProcessingPayment(false);
      return;
    }

    try {
      const amount = 50000; // ₹500 in paise
      const currency = "INR";
      
      // Direct Razorpay integration without backend
      const options = {
        key: "rzp_live_R8Ga0PdPPfJptw",
        amount: amount,
        currency: currency,
        name: "Traveligo - Himachal Packages",
        description: selectedPackage ? `Himachal Package - ${selectedPackage.title}` : "Himachal Package Booking",
        image: "https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png",
        handler: function (response) {
          setIsProcessingPayment(false);
          console.log('Payment successful:', response);
          
          // Send success email with payment ID
          sendBookingEmail('Online Payment Successful', response.razorpay_payment_id)
            .then(() => {
              console.log('Payment success email sent');
              setFormSubmitted(true);
              setTimeout(() => {
                setFormSubmitted(false);
                setShowBookingForm(false);
                resetForm();
              }, 3000);
            })
            .catch(err => {
              console.error('Failed to send success email:', err);
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
          package: selectedPackage?.title || "Himachal Package",
          destination: "Himachal Pradesh, India",
          booking_type: "Advance Payment",
          customer_email: formData.email
        },
        theme: {
          color: "#3399cc"
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      
      rzp1.on('payment.failed', function (response) {
        setIsProcessingPayment(false);
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
      setIsProcessingPayment(false);
      console.error("Payment initialization error:", error);
      alert("Payment initialization failed. Please try again or use the booking request option.");
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

  const specialRequestOptions = [
    'Candlelight Dinner',
    'Anniversary Cake',
    'Flower Decoration',
    'Honeymoon Suite',
    'Private Guide',
    'Adventure Activities',
    'Spa Package',
    'Mountain Photography',
    'Cultural Experiences',
    'Custom Itinerary'
  ];

  // Gallery images
  const galleryImages = [
    "/images/Manalih.jpeg",
    "/images/shimlah.jpeg",
    "/images/Kasolh.jpeg",
    "/images/Dharamshalah.jpeg",
    "/images/adventuresh.jpeg",
    "/images/advenh.jpeg",
    "/images/dalhousiah.jpeg",
  ];

  const packages = [
    {
      id: 1,
      title: "Manali Romantic Retreat",
      duration: "5 Days / 4 Nights",
      price: "₹32,999",
      originalPrice: "₹36,999",
      rating: 4.8,
      reviews: 156,
      image: "/images/Manalih.jpeg",
      type: "honeymoon",
      highlights: [
        "Private cottage with mountain view",
        "Candlelight dinner by the Beas River",
        "Couple's spa with Himalayan herbs",
        "Sunrise at Solang Valley",
        "Personalized photo session"
      ],
      icon: <FaHeart className="text-2xl text-rose-500" />,
      description: "Perfect romantic getaway in the heart of Himalayas with luxury accommodations",
      bestFor: "Couples and honeymooners",
      tags: ["Romantic", "Luxury"]
    },
    {
      id: 2,
      title: "Shimla-Kufri Winter Wonderland",
      duration: "6 Days / 5 Nights",
      price: "₹38,999",
      originalPrice: "₹42,999",
      rating: 4.7,
      reviews: 134,
      image: "/images/shimlah.jpeg",
      type: "winter",
      highlights: [
        "Snow activities in Kufri",
        "Stay in heritage colonial hotel",
        "Horse riding on Mall Road",
        "Ice skating experience",
        "Cozy fireplace dinners"
      ],
      icon: <FaSnowflake className="text-2xl text-blue-400" />,
      description: "Experience the magical winter of Shimla with snow-filled adventures",
      bestFor: "Winter enthusiasts and families",
      tags: ["Winter", "Family"]
    },
    {
      id: 3,
      title: "Kasol Riverside Camping",
      duration: "4 Days / 3 Nights",
      price: "₹24,999",
      originalPrice: "₹28,999",
      rating: 4.6,
      reviews: 189,
      image:  "/images/Kasolh.jpeg",
      type: "adventure",
      highlights: [
        "Luxury riverside camping",
        "Trek to Kheerganga hot springs",
        "Bonfire under the stars",
        "Israeli cuisine tasting",
        "Parvati Valley exploration"
      ],
      icon: <GiCampingTent className="text-2xl text-green-500" />,
      description: "Adventure-packed getaway in the mystical Parvati Valley",
      bestFor: "Adventure seekers and backpackers",
      tags: ["Adventure", "Budget"]
    },
    {
      id: 4,
      title: "Dharamshala Luxury Escape",
      duration: "5 Days / 4 Nights",
      price: "₹45,999",
      originalPrice: "₹49,999",
      rating: 4.9,
      reviews: 167,
      image:  "/images/Dharamshalah.jpeg",
      type: "luxury",
      highlights: [
        "5-star resort with spa",
        "Private tour of McLeodGanj",
        "Tibetan culture experience",
        "Sunset at Triund Hill",
        "Personal butler service"
      ],
      icon: <FaHotel className="text-2xl text-amber-500" />,
      description: "Luxury retreat in the spiritual capital of Himachal",
      bestFor: "Luxury travelers and spiritual seekers",
      tags: ["Luxury", "Spiritual"]
    },
    {
      id: 5,
      title: "Manali Adventure Expedition",
      duration: "8 Days / 7 Nights",
      price: "₹52,999",
      originalPrice: "₹56,999",
      rating: 4.9,
      reviews: 145,
      image:"/images/adventuresh.jpeg",
      type: "adventure",
      highlights: [
        "Stay in traditional homestays",
        "Visit Key Monastery",
        "Chandratal Lake camping",
        "High-altitude village tours",
        "Local cuisine experiences"
      ],
      icon: <FaMountain className="text-2xl text-purple-500" />,
      description: "Comprehensive adventure tour covering major Himalayan attractions",
      bestFor: "Adventure enthusiasts and nature lovers",
      tags: ["Adventure", "Comprehensive"]
    },
    {
      id: 6,
      title: "Dalhousie-Khajjiar Romantic Getaway",
      duration: "6 Days / 5 Nights",
      price: "₹36,999",
      originalPrice: "₹40,999",
      rating: 4.8,
      reviews: 123,
      image: "/images/dalhousiah.jpeg",
      type: "honeymoon",
      highlights: [
        "Stay in colonial-era villa",
        "Horse riding in Khajjiar meadows",
        "Panchpula waterfall picnic",
        "Stargazing at Dainkund Peak",
        "Couple's nature walk"
      ],
      icon: <GiWoodCabin className="text-2xl text-emerald-500" />,
      description: "Romantic escape to Switzerland of India with colonial charm",
      bestFor: "Couples and photography enthusiasts",
      tags: ["Romantic", "Scenic"]
    }
  ];

  const filteredPackages = activeTab === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.type === activeTab);

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

  const handleSpecialRequestChange = (option) => {
    setFormData(prev => {
      if (prev.specialRequests.includes(option)) {
        return {
          ...prev,
          specialRequests: prev.specialRequests.filter(item => item !== option)
        };
      } else {
        return {
          ...prev,
          specialRequests: [...prev.specialRequests, option]
        };
      }
    });
  };

  const incrementAdults = () => {
    setFormData(prev => ({
      ...prev,
      adults: Math.min(prev.adults + 1, 100)
    }));
  };

  const decrementAdults = () => {
    if (formData.adults > 1) {
      setFormData(prev => ({
        ...prev,
        adults: Math.max(prev.adults - 1, 1)
      }));
    }
  };

  const incrementKids = () => {
    setFormData(prev => ({
      ...prev,
      kids: Math.min(prev.kids + 1, 20)
    }));
  };

  const decrementKids = () => {
    if (formData.kids > 0) {
      setFormData(prev => ({
        ...prev,
        kids: Math.max(prev.kids - 1, 0)
      }));
    }
  };

  const handleAdultsChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setFormData(prev => ({
      ...prev,
      adults: Math.min(Math.max(value, 1), 100)
    }));
  };

  const handleKidsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      kids: Math.min(Math.max(value, 0), 20)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
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
      setIsProcessing(false);
      return;
    }
    
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
      setFormStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const openBookingForm = (pkg) => {
    setSelectedPackage(pkg);
    setFormData(prev => ({
      ...prev,
      package: pkg.title
    }));
    setFormErrors({});
    setShowPaymentError(false);
    setShowBookingForm(true);
    setFormStatus(null);
    setFormSubmitted(false);
  };

  const BookingForm = () => (
    <AnimatePresence>
      {showBookingForm && (
        <motion.div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto relative"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center z-10">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {selectedPackage ? `Book ${selectedPackage.title}` : 'Custom Himachal Adventure'}
                </h3>
                {selectedPackage && (
                  <p className="text-blue-100">{selectedPackage.duration} • {selectedPackage.price}</p>
                )}
              </div>
              <button 
                className="text-white hover:text-blue-200 transition-colors p-2"
                onClick={() => setShowBookingForm(false)}
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              {formSubmitted ? (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block mb-6"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </motion.div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedPackage ? 'Booking Request Sent!' : 'Enquiry Sent!'}
                  </h4>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {selectedPackage 
                      ? `Thank you for your interest in ${selectedPackage.title}. Our Himalayan expert will contact you within 24 hours to confirm your booking.`
                      : 'We\'ve received your enquiry. Our Himalayan specialist will contact you shortly to discuss your mountain getaway.'}
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                    onClick={() => setShowBookingForm(false)}
                  >
                    Close
                  </motion.button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Package Summary */}
                  <div className="lg:col-span-1">
                    {selectedPackage ? (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 sticky top-6">
                        <h4 className="font-bold text-gray-900 text-lg mb-4">Package Summary</h4>
                        <div className="space-y-4">
                          <div>
                            <span className="text-gray-600 text-sm">Package:</span>
                            <p className="font-medium">{selectedPackage.title}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 text-sm">Duration:</span>
                            <p className="font-medium">{selectedPackage.duration}</p>
                          </div>
                          <div>
                            <span className="text-gray-600 text-sm">Price:</span>
                            <p className="font-bold text-blue-600 text-xl">{selectedPackage.price}</p>
                            {selectedPackage.originalPrice && (
                              <p className="text-gray-400 line-through text-sm">{selectedPackage.originalPrice}</p>
                            )}
                          </div>
                          <div>
                            <span className="text-gray-600 text-sm">Rating:</span>
                            <div className="flex items-center">
                              <FaStar className="text-yellow-400 mr-1" />
                              <span className="font-medium">{selectedPackage.rating}</span>
                              <span className="text-gray-500 text-sm ml-1">({selectedPackage.reviews} reviews)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-100 sticky top-6">
                        <h4 className="font-bold text-gray-900 text-lg mb-4">Why Choose Himachal?</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                          <li className="flex items-center">
                            <FaMountain className="text-blue-500 mr-2" />
                            Breathtaking Himalayan landscapes
                          </li>
                          <li className="flex items-center">
                            <FaHeart className="text-blue-500 mr-2" />
                            Perfect for all types of travelers
                          </li>
                          <li className="flex items-center">
                            <GiCampingTent className="text-blue-500 mr-2" />
                            Adventure and relaxation options
                          </li>
                          <li className="flex items-center">
                            <FaHotel className="text-blue-500 mr-2" />
                            Wide range of accommodations
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Booking Form */}
                  <div className="lg:col-span-2">
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

                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                          <div className="relative" id="name">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                            <div className="relative">
                              <FaUser className="absolute left-3 top-3 text-gray-400" />
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  formErrors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                            <div className="relative">
                              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                          
                          <div className="relative" id="phone">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                            <div className="relative">
                              <FaPhone className="absolute left-3 top-3 text-gray-400" />
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Date *</label>
                            <div className="relative">
                              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 z-10" />
                              <DatePicker
                                selected={formData.arrivalDate}
                                onChange={(date) => handleDateChange(date, 'arrivalDate')}
                                selectsStart
                                startDate={formData.arrivalDate}
                                endDate={formData.departureDate}
                                minDate={new Date()}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date *</label>
                            <div className="relative">
                              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 z-10" />
                              <DatePicker
                                selected={formData.departureDate}
                                onChange={(date) => handleDateChange(date, 'departureDate')}
                                selectsEnd
                                startDate={formData.arrivalDate}
                                endDate={formData.departureDate}
                                minDate={formData.arrivalDate || new Date()}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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

                      {/* Travelers Information */}
                      <div className="bg-gray-50 rounded-lg p-6 mt-6">
                        <h4 className="font-semibold text-gray-800 mb-4">Travelers Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div id="adults">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Adults *</label>
                            <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
                              <button
                                type="button"
                                onClick={decrementAdults}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={formData.adults <= 1}
                              >
                                <FaMinus />
                              </button>
                              <input
                                type="number"
                                name="adults"
                                value={formData.adults}
                                onChange={handleAdultsChange}
                                min="1"
                                max="100"
                                className={`flex-1 text-center px-4 py-2 border-none bg-transparent focus:outline-none ${
                                  formErrors.adults ? 'text-red-500' : ''
                                }`}
                                required
                              />
                              <button
                                type="button"
                                onClick={incrementAdults}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={formData.adults >= 100}
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Kids</label>
                            <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
                              <button
                                type="button"
                                onClick={decrementKids}
                                disabled={formData.kids <= 0}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                              >
                                <FaMinus />
                              </button>
                              <input
                                type="number"
                                name="kids"
                                value={formData.kids}
                                onChange={handleKidsChange}
                                min="0"
                                max="20"
                                className="flex-1 text-center px-4 py-2 border-none bg-transparent focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={incrementKids}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={formData.kids >= 20}
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </div>
                          
                          {formData.kids > 0 && (
                            <div className="md:col-span-2" id="kidsAges">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Children Ages (comma separated) *</label>
                              <input
                                type="text"
                                name="kidsAges"
                                value={formData.kidsAges}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                  formErrors.kidsAges ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="e.g. 5, 8, 12"
                                required={formData.kids > 0}
                              />
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Category *</label>
                          <div className="relative">
                            <FaHotel className="absolute left-3 top-3 text-gray-400" />
                            <select
                              name="hotelCategory"
                              value={formData.hotelCategory}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                              required
                            >
                              <option value="3">3 Star Standard</option>
                              <option value="4">4 Star Premium</option>
                              <option value="5">5 Star Luxury</option>
                              <option value="boutique">Boutique Hotel</option>
                              <option value="heritage">Heritage Property</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Meals Included? *</label>
                          <div className="relative">
                            <FaUtensils className="absolute left-3 top-3 text-gray-400" />
                            <select
                              name="mealsIncluded"
                              value={formData.mealsIncluded}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
                          <div className="relative">
                            <FaWallet className="absolute left-3 top-3 text-gray-400" />
                            <select
                              name="budget"
                              value={formData.budget}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white ${
                                formErrors.budget ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                            >
                              <option value="">Select Budget Range</option>
                              <option value="economy">Economy (₹20,000 - ₹40,000)</option>
                              <option value="mid-range">Mid-Range (₹40,000 - ₹70,000)</option>
                              <option value="premium">Premium (₹70,000 - ₹1,00,000)</option>
                              <option value="luxury">Luxury (₹1,00,000+)</option>
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

                      {/* Special Requests */}
                      <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 mt-6">
                        <h4 className="font-semibold text-gray-800 mb-4">Special Requests</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                          {specialRequestOptions.map((option, index) => (
                            <motion.label
                              key={index}
                              whileTap={{ scale: 0.95 }}
                              className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                                formData.specialRequests.includes(option)
                                  ? 'bg-blue-100 border-blue-500 text-blue-800'
                                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.specialRequests.includes(option)}
                                onChange={() => handleSpecialRequestChange(option)}
                                className="hidden"
                              />
                              <span className="text-sm">{option}</span>
                            </motion.label>
                          ))}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Any other special requests or notes about your Himalayan adventure..."
                          ></textarea>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 mt-6">
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isProcessing}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-lg font-bold transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isProcessing ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            selectedPackage ? 'Submit Booking Request' : 'Send Enquiry'
                          )}
                        </motion.button>
                        
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={paymentHandler}
                          disabled={isProcessingPayment || !razorpayLoaded}
                          className={`flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-4 rounded-lg font-bold transition-all duration-200 shadow-lg flex items-center justify-center ${
                            isProcessingPayment || !razorpayLoaded ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {!razorpayLoaded ? 'Loading Payment...' : isProcessingPayment ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing Payment...
                            </>
                          ) : (
                            'Pay Advance '
                          )}
                        </motion.button>
                      </div>

                      <p className="text-center text-gray-500 text-sm mt-4">
                        By submitting this form, you agree to our{' '}
                        <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                      </p>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative h-screen max-h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/shimlah.jpeg"
            alt="Himachal Mountains" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-indigo-900/50"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-sm font-semibold py-2 px-6 rounded-full mb-6 border border-white/30">
              <FaMountain className="mr-2" /> HIMALAYAN ESCAPES
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif"
          >
            Himachal <span className="text-blue-200">&</span> Manali
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto mb-8"
          >
            Romantic mountain getaways and adventurous experiences in the Himalayas
          </motion.p>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="text-blue-200 text-5xl animate-pulse"
          >
            <FaHeart />
          </motion.div>
          
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

      {/* Packages Section */}
      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-20">
        {/* Filter Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {['all', 'honeymoon', 'winter', 'adventure', 'luxury'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-3 rounded-full text-sm font-medium capitalize transition-all ${activeTab === tab 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
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
            const hasDiscount = pkg.originalPrice !== pkg.price;
            
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
                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                      SAVE ₹{(parseInt(pkg.originalPrice.replace(/[^0-9]/g, '')) - parseInt(pkg.price.replace(/[^0-9]/g, ''))).toLocaleString()}
                    </div>
                  )}
                  
                  {/* Tags */}
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    {pkg.tags.map((tag, index) => (
                      <span key={index} className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

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
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-bold">
                            {pkg.price}
                          </span>
                          {hasDiscount && (
                            <span className="text-gray-300 line-through text-sm">
                              {pkg.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-yellow-300">
                          <FaStar className="mr-1" />
                          <span className="text-white font-medium">{pkg.rating}</span>
                          <span className="text-gray-300 text-sm ml-1">({pkg.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center text-gray-500 text-sm">
                        <GiRiver className="mr-2" />
                        <span>{pkg.duration}</span>
                        <span className="mx-2">•</span>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {pkg.bestFor}
                        </span>
                      </div>
                      <button
                        onClick={() => togglePackage(pkg.id)}
                        className="text-blue-600 font-medium hover:text-blue-700 transition-colors flex items-center text-sm"
                      >
                        {isExpanded ? 'Show Less' : 'View Details'} 
                        <FaChevronDown className={`ml-2 text-blue-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    <p className="text-gray-600 mb-4 text-sm">{pkg.description}</p>

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
                              <FaHeart className="text-blue-500 mr-2" /> Package Highlights:
                            </h4>
                            <ul className="space-y-2 mb-4">
                              {pkg.highlights.map((highlight, index) => (
                                <motion.li 
                                  key={index} 
                                  className="flex items-start"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <span className="text-blue-500 mr-2 mt-1">•</span>
                                  <span className="text-gray-600 text-sm">{highlight}</span>
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
                      className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                      onClick={() => openBookingForm(pkg)}
                    >
                      Book This Mountain Escape
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
              <FaMountain />
            </div>
            <h3 className="text-2xl font-medium text-gray-700 mb-2">No packages found in this category</h3>
            <p className="text-gray-500 mb-6">Contact us to customize your perfect Himalayan getaway</p>
            <button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              onClick={() => setShowBookingForm(true)}
            >
              Plan Your Trip
            </button>
          </motion.div>
        )}
      </div>

      {/* Gallery Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Himalayan Gallery</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore the breathtaking beauty of Himachal through our collection
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="overflow-hidden rounded-lg shadow-md cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image} 
                  alt={`Himalayan Scenery ${index + 1}`}
                  className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute -top-10 right-0 text-white hover:text-blue-300 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <FaTimes className="h-8 w-8" />
              </button>
              <img 
                src={selectedImage} 
                alt="Full size"
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Why Choose Us Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Our Himalayan Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Local Experts",
                description: "Our team knows every hidden gem in the Himalayas",
                icon: "🏔️"
              },
              {
                title: "Authentic Stays",
                description: "Carefully selected boutique hotels and homestays",
                icon: "🛖"
              },
              {
                title: "Safety First",
                description: "All adventure activities with certified guides",
                icon: "🛡️"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      <BookingForm />
    </div>
  );
};

export default Himachal;