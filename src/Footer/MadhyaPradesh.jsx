import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, FaCalendarAlt, FaHome, FaUmbrella, FaUtensils, 
  FaChevronDown, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaPlus, FaMinus, FaMountain, FaWater, FaTree, FaLandmark,
  FaExclamationCircle
} from 'react-icons/fa';
import { GiTiger, GiElephant, GiJungle } from 'react-icons/gi';
import { MdOutlineHiking, MdLandscape, MdFamilyRestroom, MdTempleHindu } from 'react-icons/md';
import { IoMdTrain } from 'react-icons/io';
import { SiYourtraveldottv } from 'react-icons/si';
import emailjs from '@emailjs/browser';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MadhyaPradesh = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

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
      wildlife: false,
      heritage: false,
      adventure: false,
      spiritual: false,
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
    const specialRequests = [];
    if (formData.specialRequests.wildlife) specialRequests.push("Wildlife Focus");
    if (formData.specialRequests.heritage) specialRequests.push("Heritage Sites");
    if (formData.specialRequests.adventure) specialRequests.push("Adventure Activities");
    if (formData.specialRequests.spiritual) specialRequests.push("Spiritual Sites");
    if (formData.specialRequests.other) specialRequests.push(formData.specialRequests.other);
    
    const specialRequestsText = specialRequests.length > 0 
      ? specialRequests.join(", ") 
      : 'No special requests';

    const paymentInfo = paymentId ? `Payment ID: ${paymentId}` : paymentMethod;
    const fullMessage = `${formData.message}\n\nSpecial Requests: ${specialRequestsText}\n\nPayment Method: ${paymentInfo}`;

    try {
      const result = await emailjs.send(
        'service_ov629rm',
        'template_jr1dnto',
        {
          package_name: selectedPackage.title,
          destination: "Madhya Pradesh",
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
                           formData.accommodationType === 'homestay' ? 'Homestay' : 'Resort',
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
    setPaymentProcessing(true);
    
    // Validate form before payment
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setShowPaymentError(true);
      setPaymentProcessing(false);
      
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
      setPaymentProcessing(false);
      return;
    }
    
    if (!window.Razorpay) {
      alert('Payment service is unavailable. Please try the booking request option.');
      setPaymentProcessing(false);
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
        description: `Madhya Pradesh Tour Package - ${selectedPackage.title}`,
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
                setIsBookingOpen(false);
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
          destination: "Madhya Pradesh",
          booking_reference: `MP-${Date.now()}`,
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
      setPaymentProcessing(false);
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
        wildlife: false,
        heritage: false,
        adventure: false,
        spiritual: false,
        other: ''
      },
      message: ''
    });
    setFormErrors({});
  };

  const packages = [
    {
      id: 1,
      title: "Classic Madhya Pradesh Circuit",
      duration: "8 Days / 7 Nights",
      price: "₹28,999",
      rating: 4.8,
      image: "/images/MP1.jpeg",
      type: "popular",
      highlights: [
        "Explore Bhopal's lakes and museums",
        "Visit Sanchi Stupa - UNESCO World Heritage Site",
        "Wildlife safari in Kanha or Bandhavgarh National Park",
        "Discover Khajuraho's erotic temples",
        "Visit Orchha's medieval architecture",
        "Explore Gwalior Fort and palaces",
        "Experience Pachmarhi hill station"
      ],
      icon: <FaStar className="text-2xl text-yellow-500" />
    },
    {
      id: 2,
      title: "Wildlife Adventure Tour",
      duration: "6 Days / 5 Nights",
      price: "₹34,999",
      rating: 4.9,
      image: "/images/MP2.jpeg",
      type: "wildlife",
      highlights: [
        "Multiple safaris in Kanha and Bandhavgarh",
        "Chance to spot Royal Bengal Tigers",
        "Bird watching in Panna National Park",
        "Stay in jungle lodges and resorts",
        "Evening nature walks with naturalists",
        "Visit to conservation centers"
      ],
      icon: <GiTiger className="text-2xl text-amber-700" />
    },
    {
      id: 3,
      title: "Heritage & Spiritual Journey",
      duration: "7 Days / 6 Nights",
      price: "₹24,999",
      rating: 4.7,
      image: "/images/MP3.jpg",
      type: "heritage",
      highlights: [
        "Detailed tour of Khajuraho temples",
        "Visit to Orchha's Raja Mahal and Chaturbhuj Temple",
        "Explore Sanchi Buddhist monuments",
        "Discover Ujjain's Mahakaleshwar Temple",
        "Visit Omkareshwar - one of the 12 Jyotirlingas",
        "Explore Mandu's Afghan architecture"
      ],
      icon: <FaLandmark className="text-2xl text-blue-600" />
    },
    {
      id: 4,
      title: "Luxury Heritage Experience",
      duration: "5 Days / 4 Nights",
      price: "₹45,999",
      rating: 4.5,
      image: "/images/MP4.jpg",
      type: "luxury",
      highlights: [
        "Stay at heritage palaces and luxury tents",
        "Private guided tours of Khajuraho",
        "Elephant safari in Panna",
        "Gourmet dining with royal cuisine",
        "Spa treatments with traditional techniques",
        "Personalized itinerary with chauffeur"
      ],
      icon: <MdTempleHindu className="text-2xl text-amber-600" />
    }
  ];

  const galleryImages = [
    "/images/MP1.jpeg",
    "/images/MP2.jpeg",
    "/images/MP3.jpg",
    "/images/MP4.jpg",
    "/images/MP5.jpeg",
    "/images/MP6.jpg",
    "/images/MP7.jpeg",
    "/images/MP8.avif",
  ];
  const filteredPackages = activeTab === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.type === activeTab);

  const togglePackage = (id) => {
    setExpandedPackage(expandedPackage === id ? null : id);
  };

  const openBookingModal = (pkg) => {
    setSelectedPackage(pkg);
    setFormErrors({});
    setShowPaymentError(false);
    setIsBookingOpen(true);
    setSubmitSuccess(false);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
    setSelectedPackage(null);
    setPaymentProcessing(false);
    resetForm();
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

  const incrementChildren = () => {
    setFormData(prev => ({
      ...prev,
      children: prev.children + 1
    }));
  };

  const decrementChildren = () => {
    if (formData.children > 0) {
      setFormData(prev => ({
        ...prev,
        children: prev.children - 1
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
    
    setIsSubmitting(true);

    try {
      // Send email for booking request
      await sendBookingEmail('Booking Request');
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsBookingOpen(false);
        resetForm();
      }, 3000);
    } catch (err) {
      console.log('FAILED...', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      {/* Hero Section */}
      <div className="relative h-96 md:h-screen max-h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="/images/MP3.jpg"
          alt="Madhya Pradesh" 
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
              The Heart of Incredible India
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white mb-8 drop-shadow-md"
            >
              Where tigers roam ancient forests and temples tell timeless stories
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all hover:brightness-110"
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Discover Madhya Pradesh</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Madhya Pradesh, literally the "Central Province", is India's hidden gem boasting incredible biodiversity, 
            awe-inspiring architecture, and living cultural traditions. From tiger safaris to UNESCO World Heritage Sites, 
            this state offers an authentic Indian experience away from the tourist crowds.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <GiTiger className="text-4xl text-amber-600" />,
              title: "Wildlife Sanctuaries",
              desc: "Home to 25% of India's tiger population in parks like Kanha and Bandhavgarh"
            },
            {
              icon: <FaLandmark className="text-4xl text-blue-500" />,
              title: "Architectural Marvels",
              desc: "Khajuraho temples, Sanchi Stupa, and medieval forts of Gwalior"
            },
            {
              icon: <MdTempleHindu className="text-4xl text-orange-700" />,
              title: "Spiritual Journeys",
              desc: "Sacred sites like Ujjain and Omkareshwar on the Narmada river"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center border border-gray-100 hover:border-amber-200"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-amber-50 rounded-full">
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
      <section id="packages" className="py-16 px-4 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Tour Packages</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from our carefully curated packages that showcase the best of Madhya Pradesh's diverse attractions.
            </p>
          </div>

          {/* Package Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { id: 'all', label: 'All Packages' },
              { id: 'popular', label: 'Popular' },
              { id: 'wildlife', label: 'Wildlife' },
              { id: 'heritage', label: 'Heritage' },
              { id: 'luxury', label: 'Luxury' }
            ].map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-300'
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
                    <div className="bg-amber-600/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {pkg.duration}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{pkg.title}</h3>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-amber-600">{pkg.price}</span>
                      <span className="text-xs text-gray-500 ml-1">/person</span>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="mr-3 p-2 bg-amber-100 rounded-lg">
                      {pkg.icon}
                    </div>
                    <div className="text-sm text-gray-600">
                      {pkg.type === 'popular' && 'Popular Tour'}
                      {pkg.type === 'wildlife' && 'Wildlife Adventure'}
                      {pkg.type === 'heritage' && 'Heritage Tour'}
                      {pkg.type === 'luxury' && 'Luxury Experience'}
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
                              <span className="text-amber-500 mr-2">✓</span>
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
                      className="text-amber-600 hover:text-amber-800 font-medium flex items-center transition-colors"
                    >
                      {expandedPackage === pkg.id ? 'Show Less' : 'View Highlights'}
                      <FaChevronDown className={`ml-2 transition-transform ${expandedPackage === pkg.id ? 'rotate-180' : ''}`} />
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg"
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
      <section className="py-16 px-4 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Glimpses of Madhya Pradesh</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Witness the diverse beauty of Madhya Pradesh through these stunning visuals.
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
                  alt={`Tour ${index + 1}`} 
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
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mb-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <GiTiger className="text-4xl text-amber-600" />,
                title: "Expert Naturalists",
                desc: "Knowledgeable guides for wildlife safaris and nature walks"
              },
              {
                icon: <IoMdTrain className="text-4xl text-blue-600" />,
                title: "Heritage Specialists",
                desc: "Archaeology-trained guides for historical sites"
              },
              {
                icon: <GiJungle className="text-4xl text-green-600" />,
                title: "Responsible Tourism",
                desc: "Supporting local communities and conservation"
              },
              {
                icon: <FaHome className="text-4xl text-orange-500" />,
                title: "Authentic Stays",
                desc: "From jungle lodges to heritage properties"
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
                  <div className="p-3 bg-amber-50 rounded-full">
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

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute inset-0 bg-[url('/images/mp-wildlife.jpg')] bg-cover bg-center opacity-20 rounded-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
                <button
                  onClick={closeBookingModal}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 transition-colors bg-white rounded-full p-2 shadow-md"
                >
                  <FaTimes className="text-xl" />
                </button>

                <div className="grid md:grid-cols-2">
                  {/* Package Info Side */}
                  <div className="p-8 bg-gradient-to-b from-amber-600 to-orange-700 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/images/mp-wildlife.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-2">{selectedPackage.title}</h3>
                      <div className="flex items-center mb-4">
                        <div className="bg-white/20 px-3 py-1 rounded-full text-sm mr-3">
                          {selectedPackage.duration}
                        </div>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-300 mr-1" />
                          <span>{selectedPackage.rating}</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-bold mb-2">Package Highlights:</h4>
                        <ul className="space-y-2">
                          {selectedPackage.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-yellow-300 mr-2">✓</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Package Price:</span>
                          <span className="text-2xl font-bold">{selectedPackage.price}</span>
                        </div>
                        <div className="text-sm opacity-80 mt-1">per person (excluding flights)</div>
                      </div>

                      <div className="mt-6 space-y-3">
                        <div className="flex items-center">
                          <FaPhone className="mr-3 opacity-80" />
                          <span>+91 9796337997</span>
                        </div>
                        <div className="flex items-center">
                          <FaEnvelope className="mr-3 opacity-80" />
                          <span>info@traveligo.in</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Side */}
                  <div className="p-8 bg-white/90 backdrop-blur-sm">
                    {submitSuccess ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8 h-full flex flex-col items-center justify-center"
                      >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Request Sent!</h3>
                        <p className="text-gray-600 mb-6">We've received your request for <span className="font-semibold">{selectedPackage.title}</span>. Our travel expert will contact you within 24 hours to confirm your booking.</p>
                        <button
                          onClick={closeBookingModal}
                          className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg"
                        >
                          Close
                        </button>
                      </motion.div>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Reserve Your Spot</h3>
                        <p className="text-gray-600 mb-6">Secure your Madhya Pradesh tour today</p>
                        
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
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div id="name">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/70 ${
                                  formErrors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Your name"
                              />
                              {formErrors.name && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                  <FaExclamationCircle className="mr-1" /> {formErrors.name}
                                </p>
                              )}
                            </div>
                            <div id="email">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/70 ${
                                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="your@email.com"
                              />
                              {formErrors.email && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                  <FaExclamationCircle className="mr-1" /> {formErrors.email}
                                </p>
                              )}
                            </div>
                          </div>

                          <div id="phone">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/70 ${
                                formErrors.phone ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="+91 9876543210"
                            />
                            {formErrors.phone && (
                              <p className="text-red-500 text-xs mt-1 flex items-center">
                                <FaExclamationCircle className="mr-1" /> {formErrors.phone}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div id="adults">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Adults *</label>
                              <div className={`flex items-center rounded-lg overflow-hidden ${
                                formErrors.adults ? 'border border-red-500' : ''
                              }`}>
                                <button
                                  type="button"
                                  onClick={decrementAdults}
                                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg hover:bg-gray-300 transition-colors"
                                >
                                  <FaMinus />
                                </button>
                                <div className="w-full px-4 py-2 border-t border-b border-gray-300 text-center bg-white">
                                  {formData.adults}
                                </div>
                                <button
                                  type="button"
                                  onClick={incrementAdults}
                                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg hover:bg-gray-300 transition-colors"
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
                              <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                  type="button"
                                  onClick={decrementChildren}
                                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg hover:bg-gray-300 transition-colors"
                                >
                                  <FaMinus />
                                </button>
                                <div className="w-full px-4 py-2 border-t border-b border-gray-300 text-center bg-white">
                                  {formData.children}
                                </div>
                                <button
                                  type="button"
                                  onClick={incrementChildren}
                                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg hover:bg-gray-300 transition-colors"
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            </div>
                          </div>

                          {formData.children > 0 && (
                            <div id="childrenAges">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Children Ages *</label>
                              <input
                                type="text"
                                name="childrenAges"
                                value={formData.childrenAges}
                                onChange={handleChange}
                                placeholder="e.g. 5, 8, 12"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/70 ${
                                  formErrors.childrenAges ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required={formData.children > 0}
                              />
                              {formErrors.childrenAges && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                  <FaExclamationCircle className="mr-1" /> {formErrors.childrenAges}
                                </p>
                              )}
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <div id="arrivalDate">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Date *</label>
                              <DatePicker
                                selected={formData.arrivalDate}
                                onChange={(date) => handleDateChange(date, 'arrivalDate')}
                                selectsStart
                                startDate={formData.arrivalDate}
                                endDate={formData.departureDate}
                                minDate={new Date()}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/70 ${
                                  formErrors.arrivalDate ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                                placeholderText="Select arrival date"
                              />
                              {formErrors.arrivalDate && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                  <FaExclamationCircle className="mr-1" /> {formErrors.arrivalDate}
                                </p>
                              )}
                            </div>
                            <div id="departureDate">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date *</label>
                              <DatePicker
                                selected={formData.departureDate}
                                onChange={(date) => handleDateChange(date, 'departureDate')}
                                selectsEnd
                                startDate={formData.arrivalDate}
                                endDate={formData.departureDate}
                                minDate={formData.arrivalDate || new Date()}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/70 ${
                                  formErrors.departureDate ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                                placeholderText="Select departure date"
                              />
                              {formErrors.departureDate && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                  <FaExclamationCircle className="mr-1" /> {formErrors.departureDate}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation *</label>
                              <select
                                name="accommodationType"
                                value={formData.accommodationType}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/70"
                              >
                                <option value="hotel">Hotel</option>
                                <option value="homestay">Homestay</option>
                                <option value="resort">Resort</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Meals Included *</label>
                              <select
                                name="mealsIncluded"
                                value={formData.mealsIncluded}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/70"
                              >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                              </select>
                            </div>
                          </div>

                          <div id="budget">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Approximate Budget (without flights) *</label>
                            <input
                              type="text"
                              name="budget"
                              value={formData.budget}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/70 ${
                                formErrors.budget ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="e.g. ₹25,000 - ₹35,000"
                              required
                            />
                            {formErrors.budget && (
                              <p className="text-red-500 text-xs mt-1 flex items-center">
                                <FaExclamationCircle className="mr-1" /> {formErrors.budget}
                              </p>
                            )}
                          </div>

                          <div className="bg-amber-50/70 p-4 rounded-lg border border-amber-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <label className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200 hover:border-amber-300 transition-colors">
                                <input
                                  type="checkbox"
                                  name="wildlife"
                                  checked={formData.specialRequests.wildlife}
                                  onChange={handleSpecialRequestChange}
                                  className="rounded text-amber-600"
                                />
                                <span>Wildlife Focus</span>
                              </label>
                              <label className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200 hover:border-amber-300 transition-colors">
                                <input
                                  type="checkbox"
                                  name="heritage"
                                  checked={formData.specialRequests.heritage}
                                  onChange={handleSpecialRequestChange}
                                  className="rounded text-amber-600"
                                />
                                <span>Heritage Sites</span>
                              </label>
                              <label className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200 hover:border-amber-300 transition-colors">
                                <input
                                  type="checkbox"
                                  name="adventure"
                                  checked={formData.specialRequests.adventure}
                                  onChange={handleSpecialRequestChange}
                                  className="rounded text-amber-600"
                                />
                                <span>Adventure Activities</span>
                              </label>
                              <label className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200 hover:border-amber-300 transition-colors">
                                <input
                                  type="checkbox"
                                  name="spiritual"
                                  checked={formData.specialRequests.spiritual}
                                  onChange={handleSpecialRequestChange}
                                  className="rounded text-amber-600"
                                />
                                <span>Spiritual Sites</span>
                              </label>
                            </div>
                            <input
                              type="text"
                              name="other"
                              value={formData.specialRequests.other}
                              onChange={handleSpecialRequestChange}
                              placeholder="Other requests"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              rows="3"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/70"
                              placeholder="Any additional information or requests..."
                            ></textarea>
                          </div>

                          <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.button
                              type="submit"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              disabled={isSubmitting}
                              className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all ${
                                isSubmitting
                                  ? 'bg-gray-400'
                                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
                              }`}
                            >
                              {isSubmitting ? (
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
                              disabled={paymentProcessing || !razorpayLoaded}
                              className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all ${
                                paymentProcessing || !razorpayLoaded ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'
                              }`}
                              onClick={paymentHandler}
                            >
                              {!razorpayLoaded ? 'Loading Payment...' : paymentProcessing ? 'Processing...' : 'Pay Now'}
                            </motion.button>
                          </div>

                          <p className="text-xs text-gray-500 text-center">
                            By submitting this form, you agree to our <a href="#" className="text-amber-600 hover:underline">Terms of Service</a> and <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a>.
                          </p>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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

export default MadhyaPradesh;