import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

const Holidays = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('price');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    arrivalDate: '',
    departureDate: '',
    adults: 1,
    kids: '',
    kidsAges: '',
    hotelCategory: '3',
    mealsIncluded: 'yes',
    budget: '',
    package: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: false
  });
  const formRef = useRef();

  // Complete Package Data
  const packages = [
    // Pilgrimage Tours
    {
      id: 1,
      title: 'Amarnath Yatra Helicopter Package',
      destination: 'Kashmir, India',
      duration: '5 Days',
      price: 34999,
      originalPrice: 44999,
      discount: '22%',
      image: "/images/Vaishnodevi.webp",
      type: 'pilgrimage',
      rating: 4.8,
      highlights: ['Helicopter ride', 'VIP darshan', 'Medical support'],
      description: 'Embark on a spiritual journey to the holy Amarnath cave with our comfortable helicopter package.',
      itinerary: [
        'Day 1: Arrival in Srinagar',
        'Day 2: Helicopter to Panjtarni',
        'Day 3: Darshan at Amarnath Cave',
        'Day 4: Return to Srinagar',
        'Day 5: Departure'
      ],
      inclusions: [
        'Accommodation in 3-star hotels',
        'All meals (breakfast, lunch, dinner)',
        'Helicopter tickets',
        'Local transfers',
        'Medical support team'
      ],
      exclusions: [
        'Personal expenses',
        'Travel insurance',
        'Anything not mentioned in inclusions'
      ]
    },
    {
      id: 2,
      title: 'Vaishno Devi Tour Package',
      destination: 'Jammu, India',
      duration: '3 Days',
      price: 12999,
      originalPrice: 15999,
      discount: '18%',
    image: "/images/Vaishno.jpeg",
      type: 'pilgrimage',
      rating: 4.7,
      highlights: ['Pony ride available', 'Comfortable stays', 'Guided tour'],
      description: 'Visit the holy shrine of Vaishno Devi with our well-planned pilgrimage package.',
      itinerary: [
        'Day 1: Arrival in Jammu',
        'Day 2: Trek to Vaishno Devi',
        'Day 3: Return and departure'
      ],
      inclusions: [
        '2 nights accommodation',
        'All meals',
        'Pony/Palki charges',
        'Local guide'
      ],
      exclusions: [
        'Personal expenses',
        'Camera charges',
        'Any additional services'
      ]
    },
    {
      id: 3,
      title: 'Char Dham Yatra Package',
      destination: 'Uttarakhand, India',
      duration: '12 Days',
      price: 49999,
      originalPrice: 59999,
      discount: '17%',
      image: "/images/Char.jpeg",
      type: 'pilgrimage',
      rating: 4.7,
      highlights: ['All four dhams', 'Comfortable stays', 'Expert guides'],
      description: 'Complete the sacred Char Dham Yatra covering Yamunotri, Gangotri, Kedarnath and Badrinath.',
      itinerary: [
        'Day 1-3: Yamunotri Dham',
        'Day 4-6: Gangotri Dham',
        'Day 7-9: Kedarnath Dham',
        'Day 10-12: Badrinath Dham'
      ],
      inclusions: [
        '11 nights accommodation',
        'All meals',
        'Transportation',
        'Guide services'
      ],
      exclusions: [
        'Personal expenses',
        'Pony/Palki charges',
        'Any additional services'
      ]
    },
    {
      id: 4,
      title: 'Do Dham Yatra Package',
      destination: 'Uttarakhand, India',
      duration: '7 Days',
      price: 32999,
      originalPrice: 39999,
      discount: '18%',
     image: "/images/do.jpeg",
      type: 'pilgrimage',
      rating: 4.6,
      highlights: ['Two sacred dhams', 'Comfortable travel', 'Guided tour'],
      description: 'Visit two of the four sacred Dhams - Kedarnath and Badrinath.',
      itinerary: [
        'Day 1-3: Kedarnath Dham',
        'Day 4-7: Badrinath Dham'
      ],
      inclusions: [
        '6 nights accommodation',
        'All meals',
        'Transportation',
        'Guide services'
      ],
      exclusions: [
        'Personal expenses',
        'Pony/Palki charges',
        'Any additional services'
      ]
    },

    // Adventure Tours
    {
      id: 5,
      title: 'Himalayan Trekking Expedition',
      destination: 'Himachal Pradesh, India',
      duration: '7 Days',
      price: 28999,
      originalPrice: 34999,
      discount: '17%',
      image: "/images/Trek.jpeg",
      type: 'adventure',
      rating: 4.9,
      highlights: ['High-altitude trek', 'Camping', 'Local cuisine'],
      description: 'Experience the thrill of trekking in the Himalayas with our expert guides.',
      itinerary: [
        'Day 1: Arrival and acclimatization',
        'Day 2-5: Trekking through Himalayas',
        'Day 6: Return to base',
        'Day 7: Departure'
      ],
      inclusions: [
        'Camping equipment',
        'All meals',
        'Expert guide',
        'First aid support'
      ],
      exclusions: [
        'Personal trekking gear',
        'Travel insurance',
        'Any additional services'
      ]
    },
    {
      id: 6,
      title: 'Trekking and Camping Adventure',
      destination: 'Rishikesh, India',
      duration: '4 Days',
      price: 15999,
      originalPrice: 19999,
      discount: '20%',
     image: "/images/Trek.jpeg",
      type: 'adventure',
      rating: 4.5,
      highlights: ['River-side camping', 'Jungle trekking', 'Bonfire nights'],
      description: 'Combine trekking and camping in the foothills of Himalayas near Rishikesh.',
      itinerary: [
        'Day 1: Arrival and camping setup',
        'Day 2-3: Trekking activities',
        'Day 4: Departure'
      ],
      inclusions: [
        'Camping equipment',
        'All meals',
        'Expert guide',
        'Bonfire arrangements'
      ],
      exclusions: [
        'Personal expenses',
        'Travel insurance',
        'Any additional services'
      ]
    },
    {
      id: 7,
      title: 'Skiing Adventure in Gulmarg',
      destination: 'Kashmir, India',
      duration: '5 Days',
      price: 32999,
      originalPrice: 39999,
      discount: '18%',
       image: "/images/Ski.jpeg",
      type: 'adventure',
      rating: 4.8,
      highlights: ['Ski equipment', 'Professional trainer', 'Snow activities'],
      description: 'Experience the thrill of skiing in the snow-clad mountains of Gulmarg.',
      itinerary: [
        'Day 1: Arrival and orientation',
        'Day 2-4: Skiing sessions',
        'Day 5: Departure'
      ],
      inclusions: [
        'Ski equipment',
        'Professional trainer',
        'Accommodation',
        'All meals'
      ],
      exclusions: [
        'Personal expenses',
        'Travel insurance',
        'Any additional services'
      ]
    },

    // Leisure Tours
    {
      id: 8,
      title: 'Maldives Luxury Retreat',
      destination: 'Maldives',
      duration: '6 Days',
      price: 89999,
      originalPrice: 109999,
      discount: '18%',
  image: "/images/Maldives.jpeg",
      type: 'leisure',
      rating: 4.9,
      highlights: ['Private villa', 'Spa treatments', 'Island hopping'],
      description: 'Relax in luxury at this Maldives resort with overwater bungalows and private beaches.',
      itinerary: [
        'Day 1: Arrival and resort check-in',
        'Day 2-5: Leisure activities',
        'Day 6: Departure'
      ],
      inclusions: [
        'Luxury villa accommodation',
        'All meals',
        'Spa credits',
        'Airport transfers'
      ],
      exclusions: [
        'Personal expenses',
        'Premium activities',
        'Travel insurance'
      ]
    },
    {
      id: 9,
      title: 'Goa Beach Vacation',
      destination: 'Goa, India',
      duration: '5 Days',
      price: 24999,
      originalPrice: 29999,
      discount: '17%',
      image: "/images/Goa.jpeg",
      type: 'leisure',
      rating: 4.6,
      highlights: ['Beachfront resort', 'Water sports', 'Nightlife'],
      description: 'Enjoy the sun, sand and sea at Goa\'s beautiful beaches with this all-inclusive package.',
      itinerary: [
        'Day 1: Arrival and beach time',
        'Day 2-4: Leisure activities',
        'Day 5: Departure'
      ],
      inclusions: [
        'Beachfront accommodation',
        'Breakfast included',
        'Airport transfers',
        'Welcome drink'
      ],
      exclusions: [
        'Lunch and dinner',
        'Water sports charges',
        'Personal expenses'
      ]
    },

    // Healing Tours
    {
      id: 10,
      title: 'Yoga and Meditation Retreat',
      destination: 'Rishikesh, India',
      duration: '7 Days',
      price: 24999,
      originalPrice: 29999,
      discount: '17%',
    image: "/images/Yoga.jpeg",
      type: 'healing',
      rating: 4.8,
      highlights: ['Daily yoga sessions', 'Ayurvedic meals', 'Meditation classes'],
      description: 'Rejuvenate your mind and body with our yoga and meditation retreat in Rishikesh.',
      itinerary: [
        'Day 1: Arrival and orientation',
        'Day 2-6: Yoga and meditation schedule',
        'Day 7: Departure'
      ],
      inclusions: [
        'Daily yoga sessions',
        'Ayurvedic meals',
        'Meditation classes',
        'Accommodation'
      ],
      exclusions: [
        'Personal expenses',
        'Spa treatments',
        'Travel insurance'
      ]
    },
    {
      id: 11,
      title: 'Ayurveda Wellness Package',
      destination: 'Kerala, India',
      duration: '10 Days',
      price: 35999,
      originalPrice: 42999,
      discount: '16%',
       image: "/images/Camping.jpeg",
      type: 'healing',
      rating: 4.7,
      highlights: ['Ayurvedic treatments', 'Yoga sessions', 'Organic meals'],
      description: 'Experience traditional Ayurvedic treatments in the serene backwaters of Kerala.',
      itinerary: [
        'Day 1: Arrival and consultation',
        'Day 2-9: Treatment schedule',
        'Day 10: Departure'
      ],
      inclusions: [
        'Ayurvedic treatments',
        'Yoga sessions',
        'Organic meals',
        'Accommodation'
      ],
      exclusions: [
        'Personal expenses',
        'Additional treatments',
        'Travel insurance'
      ]
    },

    // Cultural & Heritage Tours
    {
      id: 12,
      title: 'Rajasthan Cultural Journey',
      destination: 'Rajasthan, India',
      duration: '8 Days',
      price: 32999,
      originalPrice: 39999,
      discount: '17%',
       image: "/images/Camping.jpeg",
      type: 'cultural',
      rating: 4.7,
      highlights: ['Palace stays', 'Folk performances', 'Desert safari'],
      description: 'Immerse yourself in the rich culture and heritage of Rajasthan.',
      itinerary: [
        'Day 1-2: Jaipur',
        'Day 3-4: Jodhpur',
        'Day 5-6: Udaipur',
        'Day 7-8: Jaisalmer'
      ],
      inclusions: [
        'Heritage hotel stays',
        'All meals',
        'Cultural performances',
        'Desert safari'
      ],
      exclusions: [
        'Personal expenses',
        'Camera charges at monuments',
        'Travel insurance'
      ]
    }
    
  ];

  // Filter and sort packages
  const filteredPackages = packages.filter(pkg => {
    const matchesCategory = activeTab === 'all' || pkg.type === activeTab;
    const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         pkg.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedPackages = [...filteredPackages].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'duration') return parseInt(a.duration) - parseInt(b.duration);
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  // Handle Book Now click
  const handleBookNow = (pkg) => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      arrivalDate: '',
      departureDate: '',
      adults: 1,
      kids: '',
      kidsAges: '',
      hotelCategory: '3',
      mealsIncluded: 'yes',
      budget: '',
      package: pkg.title,
      message: `I'm interested in booking the ${pkg.title} package for ${pkg.duration}`
    });
    setShowBookingForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission with EmailJS
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: false, error: false });

    emailjs.sendForm(
      'service_ov629rm',
        'template_jr1dnto',
        templateParams,
        '37pN2ThzFwwhwk7ai'
      )
    .then((result) => {
      setFormStatus({ submitting: false, success: true, error: false });
      setFormData({
        name: '',
        email: '',
        phone: '',
        arrivalDate: '',
        departureDate: '',
        adults: 1,
        kids: '',
        kidsAges: '',
        hotelCategory: '3',
        mealsIncluded: 'yes',
        budget: '',
        package: '',
        message: ''
      });
      setTimeout(() => {
        setShowBookingForm(false);
        setFormStatus({ submitting: false, success: false, error: false });
      }, 3000);
    }, (error) => {
      setFormStatus({ submitting: false, success: false, error: true });
      console.error('EmailJS Error:', error.text);
    });
  };

  // Reset filters
  const resetFilters = () => {
    setActiveTab('all');
    setSearchQuery('');
    setSortBy('price');
  };

  // Package card component
  const PackageCard = ({ packageItem }) => (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl"
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        <img 
          src={packageItem.image} 
          alt={packageItem.title}
          className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105"
        />
        {packageItem.discount && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
            {packageItem.discount} OFF
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-3 left-3 text-white">
          <p className="font-medium">{packageItem.destination}</p>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-sm">{packageItem.duration}</span>
          </div>
        </div>
      </div>
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800">{packageItem.title}</h3>
          <div className="flex items-center bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 px-3 py-1 rounded-full">
            <span className="font-medium">{packageItem.rating}</span>
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{packageItem.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {packageItem.highlights.slice(0, 3).map((highlight, index) => (
            <span key={index} className="bg-blue-50 text-Black-700 text-xs px-2 py-1 rounded-full">
              {highlight}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <span className="text-2xl font-bold text-pink-600">₹{packageItem.price.toLocaleString()}</span>
            {packageItem.originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">₹{packageItem.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
      <div className="px-5 pb-5">
        <div className="flex gap-3">
          <button 
            onClick={() => setSelectedPackage(packageItem)}
            className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 py-3 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md"
          >
            View Details
          </button>
          <button 
            onClick={() => handleBookNow(packageItem)}
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Booking Form */}
      <header className="bg-gradient-to-r from-pink-700 to-purple-600 py-6 px-4 shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <h1 className="text-3xl font-bold text-white">Traveligo Tour Packages</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setShowBookingForm(!showBookingForm);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white text-indigo-600 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              {showBookingForm ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  Close Form
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  Book Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Booking Form */}
        <AnimatePresence>
          {showBookingForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="container mx-auto mt-6 bg-white rounded-xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Book Your Dream Tour</h2>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span className="font-medium text-gray-700">24/7 Support: +1 (123) 456-7890</span>
                </div>
              </div>
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        required
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        required
                        placeholder="Your email address"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        required
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>

                  {/* Travel Dates */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Date of Arrival</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="arrivalDate"
                        value={formData.arrivalDate}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Date of Departure</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="departureDate"
                        value={formData.departureDate}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  {/* Travelers Information */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">No. of Adults</label>
                    <select
                      name="adults"
                      value={formData.adults}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Kids (if any)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        name="kids"
                        value={formData.kids}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                      >
                        <option value="">None</option>
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        name="kidsAges"
                        value={formData.kidsAges}
                        onChange={handleInputChange}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        placeholder="Ages (e.g. 5,8)"
                        disabled={!formData.kids}
                      />
                    </div>
                  </div>

                  {/* Accommodation */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Hotel Category</label>
                    <div className="flex gap-4">
                      {['3', '4', '5'].map(category => (
                        <label key={category} className="flex items-center">
                          <input
                            type="radio"
                            name="hotelCategory"
                            value={category}
                            checked={formData.hotelCategory === category}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-gray-700">{category} Star</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Meals Included</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="mealsIncluded"
                          value="yes"
                          checked={formData.mealsIncluded === 'yes'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="mealsIncluded"
                          value="no"
                          checked={formData.mealsIncluded === 'no'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium">Approximate Budget (without flights)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                        placeholder="Your approximate budget"
                      />
                    </div>
                  </div>

                  {/* Package Info */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-gray-700 font-medium">Package</label>
                    <input
                      type="text"
                      name="package"
                      value={formData.package}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                      required
                      readOnly
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-gray-700 font-medium">Special Requirements</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                      placeholder="Any special requests or requirements..."
                    ></textarea>
                  </div>
                </div>

                {/* Form Status Messages */}
                {formStatus.success && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                      <h4 className="font-bold">Thank you!</h4>
                      <p>Your booking enquiry has been sent successfully. We'll contact you shortly.</p>
                    </div>
                  </motion.div>
                )}
                {formStatus.error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                      <h4 className="font-bold">Error submitting form</h4>
                      <p>Please try again or contact us directly at support@traveligo.com</p>
                    </div>
                  </motion.div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={formStatus.submitting}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      formStatus.submitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {formStatus.submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                        Submit Enquiry
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Section */}
      <section className="bg-white py-8 px-4 shadow-sm">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search destinations or packages..."
                className="w-full px-5 py-4 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md pl-14"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-2 rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['all', 'pilgrimage', 'adventure', 'leisure', 'healing', 'cultural'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full capitalize transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {tab === 'all' ? 'All Tours' : `${tab} Tours`}
            </motion.button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <p className="text-gray-600">
            Showing <span className="font-bold text-indigo-600">{sortedPackages.length}</span> packages
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white shadow-sm"
            >
              <option value="price">Price (Low to High)</option>
              <option value="duration">Duration (Short to Long)</option>
              <option value="rating">Rating (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Packages Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {sortedPackages.map((pkg) => (
            <PackageCard key={pkg.id} packageItem={pkg} />
          ))}
        </motion.div>

        {/* No results */}
        {sortedPackages.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-6">
              <svg className="h-12 w-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No packages found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">We couldn't find any packages matching your search criteria. Try adjusting your filters or search term.</p>
            <motion.button 
              onClick={resetFilters}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Reset All Filters
            </motion.button>
          </motion.div>
        )}
      </main>

      {/* Package Details Modal */}
      <AnimatePresence>
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPackage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all duration-300 z-10"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
                
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-full">
                    <img
                      src={selectedPackage.image}
                      alt={selectedPackage.title}
                      className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <h2 className="text-2xl font-bold text-white">{selectedPackage.title}</h2>
                      <p className="text-gray-200">{selectedPackage.destination}</p>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 px-4 py-2 rounded-full">
                          <span className="font-medium">{selectedPackage.rating}</span>
                          <svg className="h-5 w-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        </div>
                        {selectedPackage.discount && (
                          <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                            {selectedPackage.discount} OFF
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-indigo-600">₹{selectedPackage.price.toLocaleString()}</div>
                        {selectedPackage.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">₹{selectedPackage.originalPrice.toLocaleString()}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
                      <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                        <svg className="w-5 h-5 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span className="text-sm">{selectedPackage.duration}</span>
                      </div>
                      <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                        <svg className="w-5 h-5 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span className="text-sm">{selectedPackage.type} Tour</span>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Package Description</h3>
                      <p className="text-gray-700 mb-6">{selectedPackage.description}</p>
                      
                      <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Package Highlights</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                        {selectedPackage.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>

                      <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Itinerary</h3>
                      <div className="space-y-4 mb-8">
                        {selectedPackage.itinerary.map((item, index) => (
                          <div key={index} className="flex items-start">
                            <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1">
                              {index + 1}
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg flex-grow">
                              <p className="text-gray-800">{item}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-green-50 p-5 rounded-xl">
                          <h3 className="text-lg font-semibold mb-4 text-green-800 flex items-center gap-2">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            Inclusions
                          </h3>
                          <ul className="space-y-3">
                            {selectedPackage.inclusions.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-red-50 p-5 rounded-xl">
                          <h3 className="text-lg font-semibold mb-4 text-red-800 flex items-center gap-2">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                            </svg>
                            Exclusions
                          </h3>
                          <ul className="space-y-3">
                            {selectedPackage.exclusions.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <svg className="h-5 w-5 text-red-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                                </svg>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t flex justify-between">
                      <motion.button
                        onClick={() => setSelectedPackage(null)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-medium transition-all duration-300"
                      >
                        Close
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          handleBookNow(selectedPackage);
                          setSelectedPackage(null);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Book Now
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Holidays;