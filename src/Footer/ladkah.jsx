import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaChevronDown, FaTimes, FaCamera, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaUsers, FaChild, FaHotel, FaUtensils, FaWallet, FaMapMarkerAlt, FaMotorcycle, FaMountain, FaPlus, FaMinus, FaHeart, FaSnowflake, FaHiking, FaUmbrellaBeach, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { GiWoodCabin, GiCampfire, GiMonkFace } from 'react-icons/gi';
import { BiHappyHeartEyes, BiTrip } from 'react-icons/bi';
import { IoIosSnow, IoIosFlash } from 'react-icons/io';
import { TbAirBalloon } from 'react-icons/tb';
import emailjs from '@emailjs/browser';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Ladakh = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [activeGalleryFilter, setActiveGalleryFilter] = useState('all');
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

  // Weather data for Ladakh (mock data - in real app, use weather API)
  const ladakhWeather = {
    temperature: '-2°C to 15°C',
    condition: 'Sunny with clear skies',
    bestTime: 'May to September',
    altitude: '3,500m above sea level'
  };

  // Enhanced special request options
  const specialRequestOptions = [
    "Candle Light Dinner",
    "Birthday/Anniversary Cake",
    "Honeymoon Decorations",
    "Vegetarian Meals Only",
    "Non-Vegetarian Preference",
    "Adventure Activities",
    "Cultural Experiences",
    "Photography Assistance",
    "Medical Support",
    "Oxygen Cylinder",
    "Private Vehicle",
    "Language Interpreter"
  ];

  // Hero image slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === ladakhHeroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mock weather API call
  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setCurrentWeather({
          temperature: '-5°C',
          condition: 'Partly Cloudy',
          humidity: '45%',
          wind: '15 km/h'
        });
        setIsLoading(false);
      }, 1000);
    };

    if (showWeather) {
      fetchWeather();
    }
  }, [showWeather]);

  const ladakhHeroImages = [
    "/images/ladakh1.webp",
    "/images/ladakh2.webp",
    "/images/ladakh3.webp",
    "/images/ladakh4.webp"
  ];

  // Enhanced packages data
  const packages = [
    {
      id: 1,
      title: "Classic Ladakh Adventure",
      duration: "7 Days / 6 Nights",
      price: "₹28,999",
      originalPrice: "₹32,999",
      rating: 4.8,
      reviews: 124,
      image: "/images/ladakh1.webp",
      type: "classic",
      highlights: [
        "Explore Leh Palace & monasteries",
        "Visit Pangong Tso Lake",
        "Nubra Valley with Bactrian camel ride",
        "Khardung La pass (World's highest motorable road)",
        "Traditional Ladakhi cultural evening",
        "Acclimatization day in Leh"
      ],
      description: "The perfect introduction to Ladakh covering all major attractions with comfortable stays.",
      icon: <FaMapMarkerAlt className="text-2xl text-amber-500" />,
      specialFeature: "Exclusive monastery meditation session",
      bestFor: "First-time visitors",
      difficulty: "Moderate",
      tags: ["Best Seller", "Family Friendly"],
      included: ["Accommodation", "Meals", "Transport", "Guide"],
      excluded: ["Flight Tickets", "Personal Expenses"]
    },
    {
      id: 2,
      title: "Ladakh Bike Expedition",
      duration: "10 Days / 9 Nights",
      price: "₹42,999",
      originalPrice: "₹47,999",
      rating: 4.9,
      reviews: 89,
      image: "/images/ladakh2.webp",
      type: "biking",
      highlights: [
        "Royal Enfield Himalayan bikes",
        "Ride through 5 high-altitude passes",
        "Mechanic support throughout",
        "Backup vehicle for emergencies",
        "Special biking gear provided",
        "Night camping under stars"
      ],
      description: "For biking enthusiasts looking to conquer the challenging Himalayan roads.",
      icon: <FaMotorcycle className="text-2xl text-amber-500" />,
      specialFeature: "Personalized biking certificate",
      bestFor: "Adventure seekers",
      difficulty: "Challenging",
      tags: ["Adventure", "Thrilling"],
      included: ["Bike Rental", "Safety Gear", "Support Vehicle"],
      excluded: ["Personal Insurance", "Fuel Costs"]
    },
    {
      id: 3,
      title: "Winter Ladakh Special",
      duration: "6 Days / 5 Nights",
      price: "₹34,999",
      originalPrice: "₹39,999",
      rating: 4.7,
      reviews: 67,
      image: "/images/ladakh3.webp",
      type: "winter",
      highlights: [
        "Chadar Trek preparation",
        "Frozen Zanskar River experience",
        "Ice hockey on frozen lakes",
        "Stay in heated traditional homestays",
        "Bonfire nights with locals"
      ],
      description: "Experience Ladakh's magical winter landscape with unique frozen river adventures.",
      icon: <IoIosSnow className="text-2xl text-amber-500" />,
      specialFeature: "Thermal gear rental included",
      bestFor: "Winter enthusiasts",
      difficulty: "Extreme",
      tags: ["Winter", "Unique Experience"],
      included: ["Winter Gear", "Heated Accommodation"],
      excluded: ["Specialized Equipment"]
    },
    {
      id: 4,
      title: "Ladakh Photography Tour",
      duration: "8 Days / 7 Nights",
      price: "₹38,999",
      originalPrice: "₹42,999",
      rating: 4.9,
      reviews: 156,
      image: "/images/ladakh4.webp",
      type: "photography",
      highlights: [
        "Golden hour at Pangong Lake",
        "Monastery architecture sessions",
        "Portrait photography with locals",
        "Night sky/astrophotography",
        "Professional photography guide",
        "Editing workshop included"
      ],
      description: "Designed for photography enthusiasts to capture Ladakh's stunning landscapes.",
      icon: <FaCamera className="text-2xl text-amber-500" />,
      specialFeature: "Photo editing workshop included",
      bestFor: "Photography lovers",
      difficulty: "Easy",
      tags: ["Photography", "Creative"],
      included: ["Photo Guide", "Editing Software Access"],
      excluded: ["Camera Equipment"]
    },
    {
      id: 5,
      title: "Ladakh Luxury Retreat",
      duration: "6 Days / 5 Nights",
      price: "₹52,999",
      originalPrice: "₹58,999",
      rating: 5.0,
      reviews: 203,
      image: "/images/ladakh5.webp",
      type: "luxury",
      highlights: [
        "5-star boutique hotels",
        "Private helicopter tours",
        "Personalized Buddhist monastery visits",
        "Gourmet Ladakhi cuisine",
        "Spa with traditional therapies",
        "Personal butler service"
      ],
      description: "Experience Ladakh in ultimate comfort with exclusive access and premium services.",
      icon: <GiWoodCabin className="text-2xl text-amber-500" />,
      specialFeature: "Private butler service",
      bestFor: "Luxury travelers",
      difficulty: "Easy",
      tags: ["Luxury", "Premium"],
      included: ["5-Star Hotels", "Private Transport"],
      excluded: ["Premium Alcohol", "Spa Treatments"]
    },
    {
      id: 6,
      title: "Ladakh Trekking Expedition",
      duration: "12 Days / 11 Nights",
      price: "₹45,999",
      originalPrice: "₹49,999",
      rating: 4.9,
      reviews: 178,
      image: "/images/ladakh6.webp",
      type: "trekking",
      highlights: [
        "Markha Valley Trek",
        "Camping under starry skies",
        "Local guide and porters",
        "Visit remote Himalayan villages",
        "High-altitude acclimatization",
        "Traditional village meals"
      ],
      description: "For adventure seekers wanting to explore Ladakh's breathtaking trails.",
      icon: <FaHiking className="text-2xl text-amber-500" />,
      specialFeature: "Personalized trekking certificate",
      bestFor: "Hiking enthusiasts",
      difficulty: "Difficult",
      tags: ["Trekking", "Adventure"],
      included: ["Camping Equipment", "Porters"],
      excluded: ["Personal Trekking Gear"]
    }
  ];

  // Enhanced Gallery Images with categories
  const galleryImages = [
    { id: 1, src: "/images/ladakh1.webp", category: "landscape", title: "Pangong Tso Lake", description: "The breathtaking blue waters of Pangong Lake" },
    { id: 2, src: "/images/ladakh2.webp", category: "adventure", title: "Bike Expedition", description: "Royal Enfield adventure on world's highest roads" },
    { id: 3, src: "/images/ladakh3.webp", category: "winter", title: "Frozen Wonderland", description: "Magical winter landscape of Ladakh" },
    { id: 4, src: "/images/ladakh4.webp", category: "landscape", title: "Nubra Valley", description: "Sand dunes and double-humped camels" },
    { id: 5, src: "/images/ladakh5.webp", category: "luxury", title: "Luxury Camp", description: "Premium stays under the stars" },
    { id: 6, src: "/images/ladakh6.webp", category: "trekking", title: "Mountain Trails", description: "Epic trekking routes in Himalayas" },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Mumbai",
      rating: 5,
      comment: "The Ladakh bike trip was absolutely incredible! The support team was professional and the scenery breathtaking.",
      image: "/images/client1.jpg",
      package: "Ladakh Bike Expedition"
    },
    {
      name: "Priya Sharma",
      location: "Delhi",
      rating: 5,
      comment: "Our family had the best vacation in Ladakh. The kids loved the pony rides and we enjoyed the cultural experiences.",
      image: "/images/client2.jpg",
      package: "Ladakh Family Adventure"
    },
    {
      name: "Amit Patel",
      location: "Bangalore",
      rating: 4,
      comment: "The photography tour exceeded my expectations. Our guide knew all the best spots for perfect shots.",
      image: "/images/client3.jpg",
      package: "Ladakh Photography Tour"
    }
  ];

  // Viral Keywords and Hashtags
  const viralKeywords = [
    "#LadakhDiaries", "#HeavenOnEarth", "BucketListDestination", "RoadTripGoals",
    "MountainLove", "AdventureAwaits", "HimalayanDreams", "TravelGoals2024",
    "EpicRoadTrips", "NatureTherapy", "Wanderlust", "ExploreLadakh"
  ];

  const filteredPackages = activeTab === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.type === activeTab);

  const filteredGalleryImages = activeGalleryFilter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeGalleryFilter);

  const togglePackage = (id) => {
    setExpandedPackage(expandedPackage === id ? null : id);
  };

  const handleBookNow = (pkg) => {
    setSelectedPackage(pkg);
    setFormData(prev => ({
      ...prev,
      package: pkg.title
    }));
    setShowBookingForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleSpecialRequestToggle = (request) => {
    setFormData(prev => {
      const newRequests = prev.specialRequests.includes(request)
        ? prev.specialRequests.filter(r => r !== request)
        : [...prev.specialRequests, request];
      
      return {
        ...prev,
        specialRequests: newRequests
      };
    });
  };

  const incrementCount = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] + 1
    }));
  };

  const decrementCount = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(field === 'adults' ? 1 : 0, prev[field] - 1)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    emailjs.init('37pN2ThzFwwhwk7ai');
    
    emailjs.send(
      'service_ov629rm',
      'template_jr1dnto',
      {
        package_name: selectedPackage?.title || "Custom Ladakh Tour",
        duration: selectedPackage?.duration || "Custom",
        destination: "Ladakh",
        package_price: selectedPackage?.price || "Custom Quote",
        from_name: formData.name,
        from_email: formData.email,
        phone_number: formData.phone,
        arrivalDate: formData.arrivalDate ? formData.arrivalDate.toDateString() : '',
        departureDate: formData.departureDate ? formData.departureDate.toDateString() : '',
        adults: formData.adults,
        kids: formData.kids,
        kidsAges: formData.kidsAges,
        hotelCategory: formData.hotelCategory,
        mealsIncluded: formData.mealsIncluded,
        budget: formData.budget,
        specialRequests: formData.specialRequests.join(', '),
        message: formData.message
      }
    )
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setShowBookingForm(false);
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
      }, 3000);
    }, (err) => {
      console.log('FAILED...', err);
      alert('Failed to send message. Please try again.');
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const paymentHandler = async (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    try {
      if (!formData.name || !formData.email || !formData.phone) {
        alert('Please complete your contact information before payment');
        setIsProcessingPayment(false);
        return;
      }

      if (!window.Razorpay) {
        throw new Error('Payment service is not available. Please try again later.');
      }

      const amount = 50000;
      const currency = "INR";
      
      const options = {
        key: "rzp_live_R8Ga0PdPPfJptw",
        amount: amount,
        currency: currency,
        name: "Traveligo - Ladakh Adventures",
        description: selectedPackage ? `Ladakh Tour - ${selectedPackage.title}` : "Ladakh Tour Package",
        image: "https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png",
        handler: function (response) {
          setIsProcessingPayment(false);
          console.log('Payment successful:', response);
          alert(`Payment successful! Your booking is confirmed. Payment ID: ${response.razorpay_payment_id}`);
          handleSubmit(e);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone.replace(/\D/g, '')
        },
        notes: {
          package: selectedPackage?.title || "Ladakh Package",
          destination: "Ladakh, India",
          customer_email: formData.email,
          booking_type: "Advance Payment"
        },
        theme: {
          color: "#f59e0b"
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      
      rzp1.on('payment.failed', function (response) {
        setIsProcessingPayment(false);
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}. Please try again or use the booking request option.`);
      });
      
      rzp1.open();
      
    } catch (error) {
      setIsProcessingPayment(false);
      console.error("Payment initialization error:", error);
      alert('Online payment is temporarily unavailable. Please use the "Submit Booking Request" button instead. Our team will contact you for payment details.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-gray-100">
      {/* Enhanced Hero Section */}
      <div className="relative h-screen max-h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode='wait'>
            <motion.img
              key={currentImageIndex}
              src={ladakhHeroImages[currentImageIndex]}
              alt="Ladakh Landscape"
              className="w-full h-full object-cover object-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-gray-900/40"></div>
        </div>
        
        {/* Weather Widget */}
        <motion.div 
          className="absolute top-4 right-4 z-20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() => setShowWeather(!showWeather)}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/30 hover:bg-white/30 transition-all"
          >
            {showWeather ? 'Hide Weather' : 'Show Weather'}
          </button>
          
          <AnimatePresence>
            {showWeather && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
              >
                {isLoading ? (
                  <div className="text-gray-600">Loading weather...</div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-800">Ladakh Weather</span>
                      <FaSnowflake className="text-blue-400" />
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Temp: {ladakhWeather.temperature}</div>
                      <div>Condition: {ladakhWeather.condition}</div>
                      <div>Best Time: {ladakhWeather.bestTime}</div>
                      <div>Altitude: {ladakhWeather.altitude}</div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pt-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-sm font-semibold py-2 px-6 rounded-full mb-6 border border-white/30">
              <FaMountain className="mr-2 text-amber-300" /> LAND OF HIGH PASSES
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-serif"
          >
            Discover <span className="text-amber-200">Ladakh</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-amber-100 max-w-2xl mx-auto mb-8"
          >
            Where rugged mountains meet serene monasteries in India's most adventurous destination
          </motion.p>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="flex gap-4 flex-wrap justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-amber-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-amber-600 transition-all"
              onClick={() => setShowBookingForm(true)}
            >
              Book Your Adventure
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all"
            >
              Watch Video Tour
            </motion.button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-12 left-0 right-0 flex justify-center"
          >
            <div className="animate-bounce text-amber-200 text-2xl">
              <FaChevronDown />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Features Ribbon */}
      <motion.div 
        className="bg-gradient-to-r from-amber-600 via-red-600 to-orange-600 py-8 px-6 text-white relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { icon: <FaMotorcycle className="text-3xl mx-auto mb-2" />, text: "Bike Expeditions", count: "50+ Trips" },
              { icon: <FaCamera className="text-3xl mx-auto mb-2" />, text: "Photography Tours", count: "100+ Locations" },
              { icon: <FaHiking className="text-3xl mx-auto mb-2" />, text: "Trekking Routes", count: "15+ Trails" },
              { icon: <GiWoodCabin className="text-3xl mx-auto mb-2" />, text: "Luxury Stays", count: "4-5 Star" },
              { icon: <GiMonkFace className="text-3xl mx-auto mb-2" />, text: "Cultural Experiences", count: "Authentic" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
              >
                {item.icon}
                <span className="font-medium text-sm md:text-base mb-1">{item.text}</span>
                <span className="text-amber-200 text-xs">{item.count}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "Happy Travelers" },
              { number: "15+", label: "Years Experience" },
              { number: "98%", label: "Success Rate" },
              { number: "24/7", label: "Support Available" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6"
              >
                <div className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Packages Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Ladakh Adventure Packages</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Carefully crafted itineraries for every type of traveler
          </p>
        </motion.div>

        {/* Enhanced Filter Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {[
            { key: 'all', label: 'All Packages', icon: <FaMountain /> },
            { key: 'classic', label: 'Classic', icon: <FaMapMarkerAlt /> },
            { key: 'biking', label: 'Biking', icon: <FaMotorcycle /> },
            { key: 'trekking', label: 'Trekking', icon: <FaHiking /> },
            { key: 'luxury', label: 'Luxury', icon: <GiWoodCabin /> },
            { key: 'family', label: 'Family', icon: <FaUsers /> },
            { key: 'cultural', label: 'Cultural', icon: <GiMonkFace /> },
            { key: 'photography', label: 'Photography', icon: <FaCamera /> }
          ].map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.key 
                  ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
              }`}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Enhanced Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 ${
                    isExpanded ? 'border-amber-500' : 'border-transparent'
                  }`}
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
                  <div className="relative h-60 overflow-hidden group">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-bold text-2xl">{pkg.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-amber-600 text-white text-sm px-3 py-1 rounded-full font-bold">
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
                        <BiTrip className="mr-2" />
                        <span>{pkg.duration}</span>
                        <span className="mx-2">•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          pkg.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          pkg.difficulty === 'Moderate' ? 'bg-blue-100 text-blue-800' :
                          pkg.difficulty === 'Difficult' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {pkg.difficulty}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 text-sm">{pkg.description}</p>

                    <div className="mb-4">
                      <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full mb-2">
                        Best for: {pkg.bestFor}
                      </span>
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
                              <FaMapMarkerAlt className="text-amber-500 mr-2" /> Package Highlights:
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
                                  <span className="text-amber-500 mr-2 mt-1">•</span>
                                  <span className="text-gray-600 text-sm">{highlight}</span>
                                </motion.li>
                              ))}
                            </ul>
                            
                            {/* Included/Excluded */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <h5 className="font-semibold text-green-600 text-sm mb-2">Included:</h5>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {pkg.included.map((item, index) => (
                                    <li key={index}>✓ {item}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h5 className="font-semibold text-red-600 text-sm mb-2">Excluded:</h5>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {pkg.excluded.map((item, index) => (
                                    <li key={index}>✗ {item}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            {/* Special Feature */}
                            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                              <div className="flex items-center text-amber-700">
                                <BiHappyHeartEyes className="mr-2 text-lg" />
                                <span className="font-medium text-sm">Special Feature:</span>
                              </div>
                              <p className="mt-1 text-amber-600 text-sm">{pkg.specialFeature}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-2 mt-4">
                      <motion.button 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all text-sm"
                        onClick={() => handleBookNow(pkg)}
                      >
                        Book Now
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-4 border border-amber-500 text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        onClick={() => togglePackage(pkg.id)}
                      >
                        <FaChevronDown className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </motion.button>
                    </div>
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
              <FaMountain />
            </div>
            <h3 className="text-2xl font-medium text-gray-700 mb-2">No packages found in this category</h3>
            <p className="text-gray-500 mb-6">Contact us to customize your perfect Ladakh itinerary</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-amber-500 to-red-600 text-white px-8 py-3 rounded-full font-medium hover:from-amber-600 hover:to-red-700 transition-all shadow-lg"
              onClick={() => setShowBookingForm(true)}
            >
              Enquire About Ladakh Tours
            </motion.button>
          </motion.div>
        )}
      </section>

      {/* Viral Keywords Section */}
      <section className="py-12 bg-gradient-to-r from-amber-500 to-red-600 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Join the Ladakh Adventure Movement</h2>
            <p className="text-amber-100 text-lg">Share your journey with these trending hashtags</p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {viralKeywords.map((keyword, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-white/30 transition-all"
              >
                {keyword}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Gallery Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Ladakh Through The Lens</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Capturing the raw beauty and epic adventures of the Land of High Passes
            </p>
          </motion.div>

          {/* Gallery Filter Tabs */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {[
              { key: 'all', label: 'All Photos' },
              { key: 'landscape', label: 'Landscapes' },
              { key: 'adventure', label: 'Adventure' },
              { key: 'cultural', label: 'Culture' },
              { key: 'winter', label: 'Winter' },
              { key: 'luxury', label: 'Luxury' },
              { key: 'trekking', label: 'Trekking' }
            ].map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveGalleryFilter(tab.key)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  activeGalleryFilter === tab.key 
                    ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGalleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group overflow-hidden rounded-2xl shadow-xl cursor-pointer"
              >
                <img 
                  src={image.src} 
                  alt={image.title}
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-bold text-xl mb-2">{image.title}</h3>
                    <p className="text-amber-200 text-sm">{image.description}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                    image.category === 'landscape' ? 'bg-green-500' :
                    image.category === 'adventure' ? 'bg-blue-500' :
                    image.category === 'cultural' ? 'bg-purple-500' :
                    image.category === 'winter' ? 'bg-cyan-500' :
                    image.category === 'luxury' ? 'bg-amber-500' :
                    'bg-orange-500'
                  }`}>
                    {image.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Media CTA */}
          <motion.div 
            className="text-center mt-16 bg-white rounded-2xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Share Your Ladakh Story</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Tag us in your Ladakh adventures and get featured on our social media
            </p>
            <div className="flex justify-center gap-4 mb-6">
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
                href="#"
              >
                <FaInstagram className="text-2xl" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
                href="#"
              >
                <FaFacebook className="text-2xl" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, y: -2 }}
                className="bg-sky-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
                href="#"
              >
                <FaTwitter className="text-2xl" />
              </motion.a>
            </div>
            <p className="text-amber-600 font-medium">@LadakhAdventuresOfficial</p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Travelers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real experiences from adventurers who explored Ladakh with us
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'} mr-1`} />
                  ))}
                </div>
                <p className="text-gray-600 mb-3 italic">"{testimonial.comment}"</p>
                <div className="text-amber-600 text-sm font-medium">{testimonial.package}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-red-600 p-6 flex justify-between items-center z-10">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {selectedPackage ? `Book ${selectedPackage.title}` : 'Custom Ladakh Adventure'}
                </h3>
                {selectedPackage && (
                  <p className="text-amber-100">{selectedPackage.duration} • {selectedPackage.price}</p>
                )}
              </div>
              <button 
                onClick={() => setShowBookingForm(false)}
                className="text-white hover:text-amber-200 transition-colors p-2"
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
                      ? `Thank you for your interest in ${selectedPackage.title}. Our adventure expert will contact you within 24 hours to confirm your booking.`
                      : 'We\'ve received your enquiry. Our Ladakh specialist will contact you shortly to discuss your dream adventure.'}
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:from-amber-700 hover:to-red-700 transition-all"
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
                      <div className="bg-gradient-to-br from-amber-50 to-red-50 rounded-xl p-6 border border-amber-100 sticky top-6">
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
                            <p className="font-bold text-amber-600 text-xl">{selectedPackage.price}</p>
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
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100 sticky top-6">
                        <h4 className="font-bold text-gray-900 text-lg mb-4">Why Choose Ladakh?</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                          <li className="flex items-center">
                            <FaMountain className="text-amber-500 mr-2" />
                            Highest motorable roads in the world
                          </li>
                          <li className="flex items-center">
                            <GiMonkFace className="text-amber-500 mr-2" />
                            Rich Buddhist culture and heritage
                          </li>
                          <li className="flex items-center">
                            <FaCamera className="text-amber-500 mr-2" />
                            Breathtaking landscapes for photography
                          </li>
                          <li className="flex items-center">
                            <FaHiking className="text-amber-500 mr-2" />
                            Adventure activities for all levels
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Booking Form */}
                  <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                              Full Name *
                            </label>
                            <div className="relative">
                              <FaUser className="absolute left-3 top-3 text-gray-400" />
                              <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                required
                                placeholder="Enter your full name"
                              />
                            </div>
                          </div>
                          
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                              Email Address *
                            </label>
                            <div className="relative">
                              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                required
                                placeholder="your@email.com"
                              />
                            </div>
                          </div>
                          
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
                              Phone Number *
                            </label>
                            <div className="relative">
                              <FaPhone className="absolute left-3 top-3 text-gray-400" />
                              <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                required
                                placeholder="+91 9876543210"
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Travel Dates */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="arrivalDate">
                              Arrival Date *
                            </label>
                            <div className="relative">
                              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 z-10" />
                              <DatePicker
                                selected={formData.arrivalDate}
                                onChange={(date) => handleDateChange(date, 'arrivalDate')}
                                selectsStart
                                startDate={formData.arrivalDate}
                                endDate={formData.departureDate}
                                minDate={new Date()}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                required
                                placeholderText="Select arrival date"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="departureDate">
                              Departure Date *
                            </label>
                            <div className="relative">
                              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 z-10" />
                              <DatePicker
                                selected={formData.departureDate}
                                onChange={(date) => handleDateChange(date, 'departureDate')}
                                selectsEnd
                                startDate={formData.arrivalDate}
                                endDate={formData.departureDate}
                                minDate={formData.arrivalDate || new Date()}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                required
                                placeholderText="Select departure date"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Travelers Information */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-800 mb-4">Travelers Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Adults *</label>
                            <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
                              <button
                                type="button"
                                onClick={() => decrementCount('adults')}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <FaMinus />
                              </button>
                              <input
                                type="number"
                                name="adults"
                                value={formData.adults}
                                onChange={handleInputChange}
                                min="1"
                                className="flex-1 text-center px-4 py-2 border-none bg-transparent focus:outline-none"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => incrementCount('adults')}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Kids</label>
                            <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
                              <button
                                type="button"
                                onClick={() => decrementCount('kids')}
                                disabled={formData.kids === 0}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                              >
                                <FaMinus />
                              </button>
                              <input
                                type="number"
                                name="kids"
                                value={formData.kids}
                                onChange={handleInputChange}
                                min="0"
                                className="flex-1 text-center px-4 py-2 border-none bg-transparent focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => incrementCount('kids')}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </div>
                          
                          {formData.kids > 0 && (
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="kidsAges">
                                Kids Ages (comma separated)
                              </label>
                              <input
                                type="text"
                                id="kidsAges"
                                name="kidsAges"
                                value={formData.kidsAges}
                                onChange={handleInputChange}
                                placeholder="e.g. 5, 8, 12"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Accommodation Preferences */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="hotelCategory">
                            Hotel Category *
                          </label>
                          <div className="relative">
                            <FaHotel className="absolute left-3 top-3 text-gray-400" />
                            <select
                              id="hotelCategory"
                              name="hotelCategory"
                              value={formData.hotelCategory}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none bg-white"
                              required
                            >
                              <option value="3">3 Star Standard</option>
                              <option value="4">4 Star Premium</option>
                              <option value="5">5 Star Luxury</option>
                              <option value="boutique">Boutique Hotels</option>
                              <option value="homestay">Homestay Experience</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="mealsIncluded">
                            Meals Preference *
                          </label>
                          <div className="relative">
                            <FaUtensils className="absolute left-3 top-3 text-gray-400" />
                            <select
                              id="mealsIncluded"
                              name="mealsIncluded"
                              value={formData.mealsIncluded}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none bg-white"
                              required
                            >
                              <option value="breakfast">Breakfast Only</option>
                              <option value="half-board">Half Board (Breakfast + Dinner)</option>
                              <option value="full-board">Full Board (All Meals)</option>
                              <option value="all-inclusive">All Inclusive</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="budget">
                            Budget Range
                          </label>
                          <div className="relative">
                            <FaWallet className="absolute left-3 top-3 text-gray-400" />
                            <select
                              id="budget"
                              name="budget"
                              value={formData.budget}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none bg-white"
                            >
                              <option value="">Select Budget Range</option>
                              <option value="economy">Economy (₹50,000 - ₹1,00,000)</option>
                              <option value="mid-range">Mid-Range (₹1,00,000 - ₹2,00,000)</option>
                              <option value="premium">Premium (₹2,00,000 - ₹4,00,000)</option>
                              <option value="luxury">Luxury (₹4,00,000+)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Special Requests */}
                      <div className="bg-amber-50 rounded-lg p-6 border border-amber-100">
                        <h4 className="font-semibold text-gray-800 mb-4">Special Requests & Preferences</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          {specialRequestOptions.map((option, index) => (
                            <motion.label
                              key={index}
                              whileTap={{ scale: 0.95 }}
                              className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                                formData.specialRequests.includes(option)
                                  ? 'bg-amber-100 border-amber-500 text-amber-800'
                                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.specialRequests.includes(option)}
                                onChange={() => handleSpecialRequestToggle(option)}
                                className="hidden"
                              />
                              <span className="text-sm">{option}</span>
                            </motion.label>
                          ))}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="message">
                            Additional Notes & Requirements
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                            placeholder="Tell us about any specific requirements, dietary restrictions, special occasions, or other preferences..."
                          ></textarea>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isLoading}
                          className="flex-1 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white py-4 rounded-lg font-bold transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isLoading ? (
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
                          disabled={isProcessingPayment || !formData.name || !formData.email}
                          className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-lg font-bold transition-all duration-200 shadow-lg flex items-center justify-center ${
                            isProcessingPayment || !formData.name || !formData.email ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {isProcessingPayment ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing Payment...
                            </>
                          ) : (
                            'Pay Advance (₹500)'
                          )}
                        </motion.button>
                      </div>

                      <p className="text-center text-gray-500 text-sm">
                        By submitting this form, you agree to our{' '}
                        <a href="#" className="text-amber-600 hover:underline">Terms of Service</a> and{' '}
                        <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a>
                      </p>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Ladakh;