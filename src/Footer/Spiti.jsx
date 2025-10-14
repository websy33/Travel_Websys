import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, FaCalendarAlt, FaHome, FaPrayingHands, FaUtensils, 
  FaChevronDown, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaPlus, FaMinus, FaPlaceOfWorship, FaHeart, FaUser, FaWallet, FaHotel,
  FaExclamationCircle
} from 'react-icons/fa';
import { GiMountainRoad, GiWoodCabin, GiStonePath } from 'react-icons/gi';
import { MdLandscape, MdOutlineHiking } from 'react-icons/md';
import { IoMdSnow } from 'react-icons/io';
import emailjs from '@emailjs/browser';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Spiti = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
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
    arrivalDate: '',
    departureDate: '',
    adults: 2,
    kids: 0,
    kidsAges: '',
    accommodationType: 'homestay',
    mealsIncluded: 'yes',
    budget: '',
    package: '',
    specialRequests: {
      camping: false,
      monasteryStay: false,
      photographyTour: false,
      bikeRental: false,
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
          destination: "Spiti Valley",
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
          accommodationType: formData.accommodationType,
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
        description: `Spiti Valley Tour Package - ${selectedPackage.title}`,
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
          destination: "Spiti Valley",
          booking_reference: `SPITI-${Date.now()}`,
          customer_email: formData.email
        },
        theme: {
          color: "#0EA5E9"
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
      accommodationType: 'homestay',
      mealsIncluded: 'yes',
      budget: '',
      package: '',
      specialRequests: {
        camping: false,
        monasteryStay: false,
        photographyTour: false,
        bikeRental: false,
        other: ''
      },
      message: ''
    });
    setFormErrors({});
  };

  const packages = [
    {
      id: 1,
      title: "Classic Spiti Valley Circuit",
      duration: "7 Days / 6 Nights",
      price: "₹25,999",
      rating: 4.9,
      image: "/images/Spiti1.webp",
      type: "adventure",
      highlights: [
        "Visit Key Monastery - the largest in Spiti",
        "Chandratal Lake camping under the stars",
        "Cross Kunzum Pass (4,590m)",
        "Explore ancient villages like Kaza, Kibber & Langza",
        "Hike to Dhankar Lake"
      ],
      icon: <GiMountainRoad className="text-2xl text-blue-500" />
    },
    {
      id: 2,
      title: "Spiti Winter Expedition",
      duration: "6 Days / 5 Nights",
      price: "₹32,999",
      rating: 4.7,
      image: "/images/Spiti2.jpeg",
      type: "winter",
      highlights: [
        "Experience Spiti in full snow (Dec-Feb)",
        "Stay in traditional mud houses with Bukhari heating",
        "Visit frozen waterfalls",
        "Snow leopard spotting (if lucky!)",
        "Winter road adventure"
      ],
      icon: <IoMdSnow className="text-2xl text-blue-300" />
    },
    {
      id: 3,
      title: "Spiti Bike Tour",
      duration: "8 Days / 7 Nights",
      price: "₹38,999",
      rating: 4.8,
      image: "/images/Spiti3.jpeg",
      type: "adventure",
      highlights: [
        "Royal Enfield bike rental included",
        "Ride through some of the world's highest motorable roads",
        "Support vehicle throughout",
        "Mechanic assistance",
        "Biker-friendly accommodations"
      ],
      icon: <MdOutlineHiking className="text-2xl text-red-500" />
    },
    {
      id: 4,
      title: "Spiti Cultural Immersion",
      duration: "9 Days / 8 Nights",
      price: "₹28,999",
      rating: 4.6,
      image: "/images/Spiti4.jpeg",
      type: "culture",
      highlights: [
        "Stay with local families in homestays",
        "Participate in monastery rituals",
        "Traditional Spitian cooking class",
        "Visit ancient gompas like Tabo & Dhankar",
        "Cultural performances"
      ],
      icon: <FaPlaceOfWorship className="text-2xl text-amber-600" />
    }
  ];

  const galleryImages = [
    "/images/Spiti1.webp",
    "/images/Spiti2.jpeg",
    "/images/Spiti3.jpeg",
    "/images/Spiti4.jpeg",
    "/images/Spiti5.avif",
    "/images/Spiti6.jpg",
    "/images/Spiti7.webp",
    "/images/Spiti8.jpeg",
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

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-amber-50">
      {/* Hero Section */}
      <div className="relative h-96 md:h-screen max-h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/70 z-10"></div>
        <img 
          src="/images/Spiti1.webp"
          alt="Spiti Valley" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
          <div className="text-center max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif drop-shadow-lg"
            >
              Discover the Mystical Spiti Valley
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white mb-8 font-light drop-shadow-md"
            >
              Where the mountains touch the sky and time stands still
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-amber-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all text-lg hover:brightness-110"
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-serif">The Last Shangri-La</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-amber-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Spiti Valley, nestled in the Himalayas of Himachal Pradesh, is a cold desert mountain valley known for its breathtaking landscapes, ancient monasteries, and unique culture. Often called "Little Tibet," Spiti offers an otherworldly experience unlike anywhere else in India.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <GiMountainRoad className="text-5xl text-blue-500" />,
              title: "Adventure Paradise",
              desc: "Home to some of the world's highest motorable roads and thrilling trekking routes"
            },
            {
              icon: <FaPlaceOfWorship className="text-5xl text-amber-600" />,
              title: "Spiritual Haven",
              desc: "Ancient monasteries dating back over 1000 years with vibrant Buddhist culture"
            },
            {
              icon: <MdLandscape className="text-5xl text-green-500" />,
              title: "Raw Natural Beauty",
              desc: "Dramatic landscapes with rugged mountains, deep gorges, and pristine rivers"
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
                <div className="p-4 bg-blue-50 rounded-full">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Spiti Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-amber-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "4,270m", label: "Average Altitude", icon: <GiMountainRoad className="text-3xl mx-auto mb-3" /> },
              { number: "1000+", label: "Years of History", icon: <FaPlaceOfWorship className="text-3xl mx-auto mb-3" /> },
              { number: "12+", label: "Ancient Monasteries", icon: <GiStonePath className="text-3xl mx-auto mb-3" /> },
              { number: "100%", label: "Adventure Guaranteed", icon: <MdOutlineHiking className="text-3xl mx-auto mb-3" /> }
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
      <section id="packages" className="py-16 px-4 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-100 rounded-full opacity-20"></div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-serif">Spiti Valley Tour Packages</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-amber-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose from our carefully curated packages that showcase the best of Spiti Valley, from adventurous road trips to cultural immersions.
            </p>
          </div>

          {/* Package Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { id: 'all', label: 'All Packages', icon: <FaStar className="mr-2" /> },
              { id: 'adventure', label: 'Adventure', icon: <MdOutlineHiking className="mr-2" /> },
              { id: 'winter', label: 'Winter Special', icon: <IoMdSnow className="mr-2" /> },
              { id: 'culture', label: 'Cultural', icon: <FaPlaceOfWorship className="mr-2" /> }
            ].map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-medium transition-all flex items-center ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-amber-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Package Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {filteredPackages.map(pkg => {
              const isExpanded = expandedPackage === pkg.id;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center text-amber-600 font-bold shadow-sm">
                      <FaStar className="mr-1" />
                      {pkg.rating}
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-blue-600/90 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
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
                      <div className="mr-3 p-2 bg-blue-100 rounded-lg shadow-inner">
                        {pkg.icon}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {pkg.type === 'adventure' && 'Adventure Tour'}
                        {pkg.type === 'winter' && 'Winter Expedition'}
                        {pkg.type === 'culture' && 'Cultural Experience'}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
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
                        {isExpanded ? 'Show Less' : 'View Highlights'}
                        <FaChevronDown className={`ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-600 to-amber-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg"
                        onClick={() => handleBookNow(pkg)}
                      >
                        Book Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-100 rounded-full opacity-20"></div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-serif">Glimpses of Spiti Valley</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-amber-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Witness the breathtaking beauty of Spiti through these stunning visuals that capture its essence.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="relative rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all group"
                onClick={() => openImageModal(image)}
              >
                <img 
                  src={image} 
                  alt={`Spiti Valley ${index + 1}`} 
                  className="w-full h-40 md:h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/10 hover:from-black/50 transition-colors"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-100 rounded-full opacity-20"></div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-serif">Why Choose Our Spiti Tours?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-amber-500 mx-auto mb-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <GiMountainRoad className="text-5xl text-blue-500" />,
                title: "Local Expertise",
                desc: "Our guides are Spiti natives who know every hidden gem and secret spot",
                bg: "bg-blue-50",
                border: "border-blue-100"
              },
              {
                icon: <FaPlaceOfWorship className="text-5xl text-amber-600" />,
                title: "Responsible Tourism",
                desc: "We ensure minimal environmental impact and support local communities",
                bg: "bg-amber-50",
                border: "border-amber-100"
              },
              {
                icon: <MdOutlineHiking className="text-5xl text-red-500" />,
                title: "Safety First",
                desc: "Fully equipped with oxygen, first aid, and emergency protocols",
                bg: "bg-red-50",
                border: "border-red-100"
              },
              {
                icon: <GiStonePath className="text-5xl text-green-500" />,
                title: "Customizable Itineraries",
                desc: "Tailor your trip to match your interests and pace",
                bg: "bg-green-50",
                border: "border-green-100"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border ${item.bg} ${item.border}`}
              >
                <div className="text-5xl mb-4 flex justify-center">
                  <div className="p-3 bg-white rounded-full shadow-inner">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-center">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Booking Form Modal */}
      {showBookingForm && selectedPackage && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-amber-600 p-4 flex justify-between items-center z-10">
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
                    className={`bg-gradient-to-r from-blue-600 to-amber-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg`}
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
                  
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-amber-50 rounded-lg border border-blue-100">
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
                          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="accommodationType">Accommodation Type *</label>
                          <div className="relative">
                            <FaHome className="absolute left-3 top-3 text-gray-400" />
                            <select
                              id="accommodationType"
                              name="accommodationType"
                              value={formData.accommodationType}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            >
                              <option value="homestay">Homestay</option>
                              <option value="hotel">Hotel</option>
                              <option value="camping">Camping</option>
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
                              <option value="economy">Economy (₹20,000 - ₹30,000)</option>
                              <option value="mid-range">Mid-Range (₹30,000 - ₹50,000)</option>
                              <option value="premium">Premium (₹50,000 - ₹80,000)</option>
                              <option value="luxury">Luxury (₹80,000+)</option>
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
                            id="camping"
                            name="camping"
                            checked={formData.specialRequests.camping}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="camping" className="ml-2 block text-sm text-gray-700">
                            Camping Experience
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="monasteryStay"
                            name="monasteryStay"
                            checked={formData.specialRequests.monasteryStay}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="monasteryStay" className="ml-2 block text-sm text-gray-700">
                            Monastery Stay
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="photographyTour"
                            name="photographyTour"
                            checked={formData.specialRequests.photographyTour}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="photographyTour" className="ml-2 block text-sm text-gray-700">
                            Photography Tour
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="bikeRental"
                            name="bikeRental"
                            checked={formData.specialRequests.bikeRental}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="bikeRental" className="ml-2 block text-sm text-gray-700">
                            Bike Rental
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
                        className={`w-full bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white py-3 rounded-lg font-bold transition-all duration-200 shadow-lg ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default Spiti;