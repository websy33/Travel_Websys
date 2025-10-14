import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, 
  FaHeart, 
  FaUmbrellaBeach, 
  FaSpa, 
  FaBed, 
  FaCamera,
  FaChevronDown,
  FaMountain,
  FaRing,
  FaCalendarAlt,
  FaUsers,
  FaChild,
  FaHotel,
  FaUtensils,
  FaWallet,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaTimes,
  FaCheck,
  FaPlus,
  FaMinus,
  FaMotorcycle,
  FaExclamationCircle
} from 'react-icons/fa';
import { 
  GiSandsOfTime, 
  GiBoatHorizon, 
  GiIsland,
  GiCakeSlice,
  GiCandleLight,
  GiFlowerPot,
  GiWoodCabin
} from 'react-icons/gi';
import { MdEmojiFoodBeverage, MdOutlinePool } from 'react-icons/md';
import { IoMdFlower, IoIosSnow } from 'react-icons/io';
import { BiHappyHeartEyes, BiTrip } from 'react-icons/bi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import emailjs from '@emailjs/browser';

const Honeymoon = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
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
    hotelCategory: '4',
    mealsIncluded: 'yes',
    budget: '',
    package: '',
    specialRequests: {
      candlelightDinner: false,
      anniversaryCelebration: false,
      birthdayCelebration: false,
      honeymoonPackage: false,
      flowerDecoration: false,
      photographySession: false,
      spaTreatment: false,
      cakeSurprise: false,
      privateDining: false,
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

  // Hero image slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === honeymoonHeroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
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
    const formatDate = (date) => {
      if (!date) return 'Not specified';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

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
    
    // Create adult ages information
    const adultAgesInfo = formData.adults > 2 
      ? `Adult Ages: ${Array(formData.adults - 2).fill('Adult').map((_, i) => `Adult ${i + 3}`).join(', ')}`
      : 'Adult Ages: Not specified (default couple)';
    
    const fullMessage = `${formData.message}\n\nSpecial Requests: ${specialRequestsText}${otherRequest ? '\n' + otherRequest : ''}\n\n${adultAgesInfo}\n\nPayment Method: ${paymentInfo}`;

    try {
      emailjs.init('37pN2ThzFwwhwk7ai');
      
      const result = await emailjs.send(
        'service_ov629rm',
        'template_jr1dnto',
        {
          package_name: selectedPackage ? selectedPackage.title : 'Custom Honeymoon',
          destination: selectedPackage ? selectedPackage.destination : 'Custom Destination',
          package_price: selectedPackage ? selectedPackage.price : 'Custom Quote',
          duration: selectedPackage ? selectedPackage.duration : 'Custom Duration',
          from_name: formData.name,
          from_email: formData.email,
          phone_number: formData.phone,
          arrivalDate: formData.arrivalDate ? formatDate(formData.arrivalDate) : '',
          departureDate: formData.departureDate ? formatDate(formData.departureDate) : '',
          adults: formData.adults,
          kids: formData.kids || '0',
          kidsAges: formData.kidsAges || 'Not specified',
          adultAges: formData.adults > 2 
            ? Array(formData.adults - 2).fill('Adult').map((_, i) => `Adult ${i + 3}`).join(', ')
            : 'Not specified (default couple)',
          hotelCategory: formData.hotelCategory + ' Star',
          mealsIncluded: formData.mealsIncluded === 'yes' ? 'Yes' : 
                        formData.mealsIncluded === 'no' ? 'No' : 
                        formData.mealsIncluded === 'breakfast' ? 'Breakfast Only' : 
                        formData.mealsIncluded === 'half-board' ? 'Half Board' : 'Full Board',
          budget: formData.budget === 'economy' ? 'Economy (₹50,000 - ₹1,00,000)' :
                  formData.budget === 'mid-range' ? 'Mid-Range (₹1,00,000 - ₹2,00,000)' :
                  formData.budget === 'premium' ? 'Premium (₹2,00,000 - ₹4,00,000)' : 'Luxury (₹4,00,000+)',
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
        description: `Honeymoon Package - ${selectedPackage.title}`,
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
          destination: "Honeymoon",
          booking_reference: `HONEYMOON-${Date.now()}`,
          customer_email: formData.email
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
      hotelCategory: '4',
      mealsIncluded: 'yes',
      budget: '',
      package: '',
      specialRequests: {
        candlelightDinner: false,
        anniversaryCelebration: false,
        birthdayCelebration: false,
        honeymoonPackage: false,
        flowerDecoration: false,
        photographySession: false,
        spaTreatment: false,
        cakeSurprise: false,
        privateDining: false,
        other: ''
      },
      message: ''
    });
    setFormErrors({});
  };

  const honeymoonHeroImages = [
    "/images/balih.webp",
    "/images/Santorinih.jpeg",
    "/images/maldievesh.jpeg",
    "/images/Swissh.webp"
  ];

  const galleryImages = [
    "/images/balih.webp",
    "/images/Santorinih.jpeg",
    "/images/maldievesh.jpeg",
    "/images/Swissh.webp",
    "/images/Andamanh.jpeg",
    "/images/Client7.jpeg"
  ];

  const packages = [
    {
      id: 1,
      title: "Bali Romantic Paradise",
      duration: "7 Days / 6 Nights",
      price: "₹89,999",
      originalPrice: "₹99,999",
      discount: "10% OFF",
      rating: 4.9,
      images: ["/images/balih.webp"],
      type: "international",
      destination: "Bali, Indonesia",
      highlights: [
        "Private pool villa with flower bath",
        "Sunset Uluwatu temple tour",
        "Couple's Balinese massage",
        "Floating breakfast experience",
        "Professional couple's photoshoot"
      ],
      icon: <GiIsland className="text-2xl text-pink-500" />,
      description: "Experience the ultimate romantic getaway in Bali with luxurious private villas and unforgettable experiences tailored for couples.",
      bestFor: "Newlyweds looking for tropical luxury",
      specialFeature: "Private candlelight dinner on the beach",
      inclusions: [
        "Return flights from major Indian cities",
        "6 nights in luxury private pool villa",
        "Daily breakfast and 3 romantic dinners",
        "All transfers in private AC vehicle",
        "All experiences mentioned"
      ]
    },
    {
      id: 2,
      title: "Santorini Dream Escape",
      duration: "6 Days / 5 Nights",
      price: "₹1,25,999",
      originalPrice: "₹1,35,999",
      discount: "7% OFF",
      rating: 5.0,
      images: ["/images/Santorinih.jpeg"],
      type: "international",
      destination: "Santorini, Greece",
      highlights: [
        "Caldera-view suite with private jacuzzi",
        "Private yacht sunset cruise",
        "Wine tasting at volcanic vineyards",
        "Romantic Oia village exploration",
        "Professional golden hour photoshoot"
      ],
      icon: <GiBoatHorizon className="text-2xl text-pink-500" />,
      description: "The iconic white-washed cliffs of Santorini provide the perfect backdrop for your dream honeymoon.",
      bestFor: "Couples who love stunning views and luxury",
      specialFeature: "Helicopter tour over the caldera",
      inclusions: [
        "Return flights from Delhi/Mumbai",
        "5 nights in caldera-view suite",
        "Daily breakfast with sea view",
        "Private transfers",
        "All mentioned experiences"
      ]
    },
    {
      id: 3,
      title: "Maldives Overwater Romance",
      duration: "5 Days / 4 Nights",
      price: "₹95,999",
      originalPrice: "₹1,05,999",
      discount: "9% OFF",
      rating: 5.0,
      images: ["/images/maldievesh.jpeg"],
      type: "international",
      destination: "Maldives",
      highlights: [
        "Luxury overwater villa with glass floor",
        "Private sandbank picnic",
        "Underwater restaurant dining",
        "Couple's spa treatment over water",
        "Starlit beachside dinner"
      ],
      icon: <FaUmbrellaBeach className="text-2xl text-pink-500" />,
      description: "Experience ultimate privacy and luxury in your own overwater bungalow in the Maldives.",
      bestFor: "Couples seeking secluded luxury",
      specialFeature: "Private dolphin watching cruise",
      inclusions: [
        "Return seaplane transfers",
        "4 nights in overwater villa",
        "All meals included",
        "Complimentary mini-bar",
        "All mentioned romantic experiences"
      ]
    },
    {
      id: 4,
      title: "Swiss Alps Fairytale",
      duration: "8 Days / 7 Nights",
      price: "₹1,49,999",
      originalPrice: "₹1,59,999",
      discount: "6% OFF",
      rating: 4.9,
      images: ["/images/Swissh.webp"],
      type: "international",
      destination: "Swiss Alps",
      highlights: [
        "Mountain chalet with fireplace",
        "Private fondue dinner in igloo",
        "Scenic train journey",
        "Sunrise hot air balloon ride",
        "Chocolate tasting experience"
      ],
      icon: <FaMountain className="text-2xl text-pink-500" />,
      description: "A winter wonderland honeymoon in the Swiss Alps with cozy mountain retreats and breathtaking scenery.",
      bestFor: "Couples who love mountain scenery",
      specialFeature: "Private horse-drawn sleigh ride",
      inclusions: [
        "Return flights from India",
        "7 nights in luxury chalet",
        "Daily breakfast and 2 special dinners",
        "Swiss Travel Pass for trains",
        "All mentioned experiences"
      ]
    },
    {
      id: 5,
      title: "Andaman Island Love Story",
      duration: "6 Days / 5 Nights",
      price: "₹52,999",
      originalPrice: "₹58,999",
      discount: "10% OFF",
      rating: 4.8,
      images: ["/images/Andamanh.jpeg"],
      type: "beach",
      destination: "Andaman Islands, India",
      highlights: [
        "Beachfront villa with private pool",
        "Private island hopping tour",
        "Scuba diving for couples",
        "Glass-bottom boat ride",
        "Romantic beachside cabana dinner"
      ],
      icon: <GiSandsOfTime className="text-2xl text-pink-500" />,
      description: "India's own tropical paradise with pristine beaches and crystal clear waters perfect for honeymooners.",
      bestFor: "Couples wanting a tropical honeymoon closer to home",
      specialFeature: "Private sunset cruise to Havelock Island",
      inclusions: [
        "Return flights from major cities",
        "5 nights in beachfront villa",
        "Daily breakfast and 2 romantic dinners",
        "All transfers and sightseeing",
        "All mentioned water activities"
      ]
    },
    {
      id: 6,
      title: "Kashmir Valley of Love",
      duration: "7 Days / 6 Nights",
      price: "₹62,999",
      originalPrice: "₹68,999",
      discount: "9% OFF",
      rating: 4.9,
      images: ["/images/Client7.jpeg"],
      type: "mountain",
      destination: "Kashmir, India",
      highlights: [
        "Premium houseboat stay on Dal Lake",
        "Private shikara ride with flowers",
        "Couple's Kashmiri Kahwa tasting",
        "Sunrise photography at Pangong",
        "Personalized romantic surprises"
      ],
      icon: <FaRing className="text-2xl text-pink-500" />,
      description: "Experience the romance of Kashmir with its stunning landscapes and luxurious houseboat stays.",
      bestFor: "Couples who love mountain lakes and culture",
      specialFeature: "Private gondola ride to Gulmarg",
      inclusions: [
        "Return flights from Delhi",
        "3 nights in houseboat + 3 nights in luxury hotel",
        "All meals included",
        "Private transfers and sightseeing",
        "All mentioned experiences"
      ]
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
      adults: Math.min(prev.adults + 1, 100)
    }));
  };

  const decrementAdults = () => {
    setFormData(prev => ({
      ...prev,
      adults: Math.max(prev.adults - 1, 1)
    }));
  };

  const incrementKids = () => {
    setFormData(prev => ({
      ...prev,
      kids: Math.min(prev.kids + 1, 20)
    }));
  };

  const decrementKids = () => {
    setFormData(prev => ({
      ...prev,
      kids: Math.max(prev.kids - 1, 0)
    }));
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
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-pink-50">
      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-200 text-xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 40 - 20, 0],
              rotate: [0, Math.random() * 360],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FaHeart />
          </motion.div>
        ))}
      </div>

      {/* Hero Section with Slideshow */}
      <div className="relative h-screen max-h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode='wait'>
            <motion.img
              key={currentImageIndex}
              src={honeymoonHeroImages[currentImageIndex]}
              alt="Romantic couple"
              className="w-full h-full object-cover object-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-900/60 to-rose-900/50"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-sm font-semibold py-2 px-6 rounded-full mb-6 border border-white/30">
              <FaRing className="mr-2" /> BEGIN YOUR FOREVER
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif"
          >
            Honeymoon <span className="text-pink-200">Packages</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-pink-100 max-w-2xl mx-auto mb-8"
          >
            Curated romantic experiences to celebrate your love story
          </motion.p>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-pink-600 px-8 py-3 rounded-full font-bold shadow-lg"
              onClick={() => setShowBookingForm(true)}
            >
              Book Now
            </motion.button>
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

      {/* Romantic Experiences Ribbon */}
      <motion.div 
        className="bg-gradient-to-r from-pink-600 to-rose-600 py-8 px-6 text-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {[
              { icon: <GiIsland className="text-2xl" />, text: "Private Island Getaways" },
              { icon: <FaUmbrellaBeach className="text-2xl" />, text: "Beachfront Villas" },
              { icon: <FaMountain className="text-2xl" />, text: "Mountain Retreats" },
              { icon: <GiBoatHorizon className="text-2xl" />, text: "Sunset Cruises" },
              { icon: <FaSpa className="text-2xl" />, text: "Couple's Spa" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm"
              >
                {item.icon}
                <span className="text-sm md:text-base font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Packages Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Romantic Getaways for Every Couple</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked honeymoon packages designed to create unforgettable memories
            </p>
          </motion.div>

          {/* Package Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-full bg-white shadow-md p-1">
              {[
                { id: 'all', label: 'All Packages' },
                { id: 'international', label: 'International' },
                { id: 'beach', label: 'Beach' },
                { id: 'mountain', label: 'Mountain' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white' : 'text-gray-600 hover:text-pink-600'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ${isExpanded ? 'ring-2 ring-pink-500' : ''}`}
                    whileHover={{ y: -5 }}
                    layout
                  >
                    {/* Image with Floating Icon */}
                    <div className="relative h-60 overflow-hidden group">
                      <img 
                        src={pkg.images[0]} 
                        alt={pkg.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-md">
                        {pkg.icon}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-white font-bold text-2xl">{pkg.title}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="bg-pink-600 text-white text-xs px-3 py-1 rounded-full">{pkg.price}</span>
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
                        <div className="flex items-center text-gray-500 text-sm">
                          <BiTrip className="mr-2" />
                          <span>{pkg.duration}</span>
                          <span className="mx-2">•</span>
                          <span className="px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-800">
                            {pkg.bestFor}
                          </span>
                        </div>
                        <button
                          onClick={() => togglePackage(pkg.id)}
                          className="text-pink-600 font-medium hover:text-pink-700 transition-colors flex items-center text-sm"
                        >
                          {isExpanded ? 'Show Less' : 'View Details'} 
                          <FaChevronDown className={`ml-2 text-pink-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>

                      <p className="text-gray-600 mb-4">{pkg.description}</p>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 border-t border-pink-100">
                              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                <FaMapMarkerAlt className="text-pink-500 mr-2" /> Package Highlights:
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
                                    <span className="text-pink-500 mr-2">✓</span>
                                    <span className="text-gray-600">{highlight}</span>
                                  </motion.li>
                                ))}
                              </ul>
                              
                              {/* Special Feature */}
                              <div className="bg-pink-50 rounded-lg p-4 mb-4 border border-pink-100">
                                <div className="flex items-center text-pink-700">
                                  <BiHappyHeartEyes className="mr-2 text-xl" />
                                  <span className="font-medium">Special Feature:</span>
                                </div>
                                <p className="mt-1 text-pink-600">{pkg.specialFeature}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.button 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full mt-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                        onClick={() => handleBookNow(pkg)}
                      >
                        Book Honeymoon Package
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
              <div className="text-pink-500 text-6xl mb-4">
                <FaHeart />
              </div>
              <h3 className="text-2xl font-medium text-gray-700 mb-2">No packages found in this category</h3>
              <p className="text-gray-500 mb-6">Contact us to customize your perfect honeymoon itinerary</p>
              <button className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-3 rounded-full font-medium hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg">
                Enquire About Honeymoon Packages
              </button>
            </motion.div>
          )}
        </div>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Honeymoon Gallery</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through our collection of romantic destinations and experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="overflow-hidden rounded-lg shadow-md cursor-pointer"
                onClick={() => setSelectedGalleryImage(image)}
              >
                <img 
                  src={image} 
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-32 object-cover hover:opacity-90 transition-opacity"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Special Offers Banner */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-700 to-rose-700 text-white overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Exclusive Honeymoon Perks</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {[
                {
                  title: "Complimentary Upgrade",
                  description: "Room upgrade upon availability",
                  icon: <FaBed className="text-3xl mx-auto mb-3 text-pink-200" />,
                  delay: 0.1
                },
                {
                  title: "Romantic Surprise",
                  description: "Special welcome amenity",
                  icon: <FaHeart className="text-3xl mx-auto mb-3 text-pink-200" />,
                  delay: 0.2
                },
                {
                  title: "Photo Package",
                  description: "Professional couple photoshoot",
                  icon: <FaCamera className="text-3xl mx-auto mb-3 text-pink-200" />,
                  delay: 0.3
                }
              ].map((offer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: offer.delay }}
                  viewport={{ once: true }}
                  className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-white/20"
                >
                  {offer.icon}
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-pink-100">{offer.description}</p>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-pink-600 px-8 py-3 rounded-full font-bold hover:bg-pink-50 transition-all shadow-xl"
              onClick={() => setShowBookingForm(true)}
            >
              Contact Our Romance Specialists
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-pink-600 text-5xl mb-6">
              <FaHeart />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Begin Your Romantic Journey?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Our honeymoon specialists will craft a personalized experience that celebrates your unique love story.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-3 rounded-full font-bold hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg"
                onClick={() => setShowBookingForm(true)}
              >
                Enquire Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-pink-600 px-8 py-3 rounded-full font-bold hover:bg-gray-50 border border-pink-200 transition-all shadow-lg"
              >
                Call: +91 9796337997
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedGalleryImage && (
          <motion.div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGalleryImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute -top-10 right-0 text-white hover:text-pink-300 transition-colors"
                onClick={() => setSelectedGalleryImage(null)}
              >
                <FaTimes className="h-6 w-6" />
              </button>
              <img 
                src={selectedGalleryImage} 
                alt="Full size"
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-rose-600 p-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-white">
                {selectedPackage ? `Book ${selectedPackage.title}` : 'Enquire About Honeymoon Packages'}
              </h3>
              <button 
                onClick={() => setShowBookingForm(false)}
                className="text-white hover:text-pink-200 transition-colors"
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
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedPackage ? 'Booking Request Sent!' : 'Enquiry Sent!'}
                  </h4>
                  <p className="text-gray-600 mb-6">
                    {selectedPackage 
                      ? `We've received your booking request for ${selectedPackage.title}. Our romance specialist will contact you shortly to confirm your booking.`
                      : 'We\'ve received your enquiry. Our romance specialist will contact you shortly to discuss your dream honeymoon.'}
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg`}
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
                  
                  {selectedPackage && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-100">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-gray-900 text-lg">{selectedPackage.title}</h4>
                        <span className="font-bold text-pink-600 text-lg">{selectedPackage.price}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="mr-2 text-pink-500" />
                        <span className="text-sm">{selectedPackage.duration}</span>
                      </div>
                    </div>
                  )}
                  
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
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                                formErrors.name ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                              placeholder=""
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
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                                formErrors.email ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                              placeholder=""
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
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
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
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
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
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
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
                              disabled={formData.adults <= 1}
                              className={`bg-gray-200 ${formData.adults <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'} text-gray-700 font-bold py-2 px-3 rounded-l-lg`}
                            >
                              <FaMinus />
                            </button>
                            <input
                              type="number"
                              id="adults"
                              name="adults"
                              value={formData.adults}
                              onChange={handleAdultsChange}
                              min="1"
                              max="100"
                              className={`w-full text-center px-4 py-2 border-t border-b focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                                formErrors.adults ? 'border-red-500' : 'border-gray-300'
                              }`}
                              required
                            />
                            <button
                              type="button"
                              onClick={incrementAdults}
                              disabled={formData.adults >= 100}
                              className={`bg-gray-200 ${formData.adults >= 100 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'} text-gray-700 font-bold py-2 px-3 rounded-r-lg`}
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
                              disabled={formData.kids <= 0}
                              className={`bg-gray-200 ${formData.kids <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'} text-gray-700 font-bold py-2 px-3 rounded-l-lg`}
                            >
                              <FaMinus />
                            </button>
                            <input
                              type="number"
                              id="kids"
                              name="kids"
                              value={formData.kids}
                              onChange={handleKidsChange}
                              min="0"
                              max="20"
                              className="w-full text-center px-4 py-2 border-t border-b border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            />
                            <button
                              type="button"
                              onClick={incrementKids}
                              disabled={formData.kids >= 20}
                              className={`bg-gray-200 ${formData.kids >= 20 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'} text-gray-700 font-bold py-2 px-3 rounded-r-lg`}
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
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
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
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                              required
                            >
                              <option value="3">3 Star</option>
                              <option value="4">4 Star</option>
                              <option value="5">5 Star</option>
                              <option value="luxury">Luxury</option>
                              <option value="boutique">Boutique</option>
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
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
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
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
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
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Special Romantic Requests</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="candlelightDinner"
                            name="candlelightDinner"
                            checked={formData.specialRequests.candlelightDinner}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                          />
                          <label htmlFor="candlelightDinner" className="ml-2 block text-sm text-gray-700">
                            Candlelight Dinner
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="cakeSurprise"
                            name="cakeSurprise"
                            checked={formData.specialRequests.cakeSurprise}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                          />
                          <label htmlFor="cakeSurprise" className="ml-2 block text-sm text-gray-700">
                            Cake Surprise
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="flowerDecoration"
                            name="flowerDecoration"
                            checked={formData.specialRequests.flowerDecoration}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                          />
                          <label htmlFor="flowerDecoration" className="ml-2 block text-sm text-gray-700">
                            Flower Decoration
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="privateDining"
                            name="privateDining"
                            checked={formData.specialRequests.privateDining}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                          />
                          <label htmlFor="privateDining" className="ml-2 block text-sm text-gray-700">
                            Private Dining
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="photographySession"
                            name="photographySession"
                            checked={formData.specialRequests.photographySession}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                          />
                          <label htmlFor="photographySession" className="ml-2 block text-sm text-gray-700">
                            Photography Session
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="spaTreatment"
                            name="spaTreatment"
                            checked={formData.specialRequests.spaTreatment}
                            onChange={handleSpecialRequestChange}
                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                          />
                          <label htmlFor="spaTreatment" className="ml-2 block text-sm text-gray-700">
                            Couple's Spa Treatment
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Any other information you'd like to share about your honeymoon"
                      ></textarea>
                    </div>
                    
                    {selectedPackage && (
                      <input type="hidden" name="package" value={selectedPackage.title} />
                    )}
                    
                    {/* Two-column button layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={isProcessing}
                        className={`w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white py-3 rounded-lg font-bold transition-all duration-200 shadow-lg ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isProcessing ? 'Processing...' : (selectedPackage ? 'Submit Booking Request' : 'Submit Enquiry')}
                      </motion.button>
                      
                      {/* Payment Button */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={isProcessing || !razorpayLoaded}
                        className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-lg font-bold transition-all duration-200 shadow-lg ${isProcessing || !razorpayLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={paymentHandler}
                      >
                        {!razorpayLoaded ? 'Loading Payment...' : isProcessing ? 'Processing...' : 'Pay Now '}
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

export default Honeymoon;