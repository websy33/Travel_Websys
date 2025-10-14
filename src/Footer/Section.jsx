import React, { useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaUsers, 
  FaCalendarAlt, 
  FaStar, 
  FaRegStar, 
  FaQuoteLeft,
  FaHeart,
  FaShareAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Section = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useState([]);

  const trips = [
    {
      id: 1,
      title: "Mountain Explorer",
      location: "Kashmir, India",
      duration: "8 days",
      groupSize: "12-15 women",
      description: "An adventurous group trek through the Himalayas, perfect for women seeking challenge and connection.",
      image: "https://risingkashmir.blr1.digitaloceanspaces.com/wp-content/uploads/2024/08/Image-OP-1-1.png",
      type: "adventure",
    
    },
    {
      id: 2,
      title: "Kerala Backwaters Retreat",
      location: "Kerala, India",
      duration: "7 days",
      groupSize: "8-12 women",
      description: "A serene group journey through Kerala's backwaters, combining relaxation with cultural immersion.",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae",
      type: "wellness",
     
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      trip: "Himalayan Explorer",
      text: "Traveling with this group of women was transformative. We formed incredible bonds while experiencing the Himalayas together.",
      avatar: "https://randomuser.me/api/portraits/women/43.jpg"
    },
    {
      id: 2,
      name: "Maria Gonzalez",
      trip: "Kerala Backwaters Retreat",
      text: "The perfect balance of group activities and personal time. I made lifelong friends on this trip.",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    }
  ];

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredTrips = activeTab === 'all' 
    ? trips 
    : trips.filter(trip => trip.type === activeTab);

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      i < Math.floor(rating) ? 
        <FaStar key={i} className="text-yellow-400" /> : 
        <FaRegStar key={i} className="text-yellow-400" />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-700 to-pink-600 py-32 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Women's Group Trips
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Connect with like-minded women on unforgettable group adventures
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Trip Filter */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'all' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
            }`}
          >
            All Trips
          </button>
          <button
            onClick={() => setActiveTab('adventure')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'adventure' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
            }`}
          >
            Adventure
          </button>
          <button
            onClick={() => setActiveTab('wellness')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'wellness' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
            }`}
          >
            Wellness
          </button>
        </motion.div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
          {filteredTrips.map((trip) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={trip.image} 
                  alt={trip.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => toggleFavorite(trip.id)}
                    className="p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition-all"
                  >
                    <FaHeart className={favorites.includes(trip.id) ? "text-pink-500" : "text-gray-400"} />
                  </button>
                  <button className="p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition-all">
                    <FaShareAlt className="text-gray-600" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">{trip.title}</h3>
                  <div className="flex items-center text-white/90">
                    <FaMapMarkerAlt className="mr-1" />
                    <span className="text-sm">{trip.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center text-yellow-400 mb-1">
                      {renderStars(trip.rating)}
                      <span className="text-gray-600 text-sm ml-2">{trip.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <FaUsers className="mr-1" />
                      <span className="mr-3">{trip.groupSize}</span>
                      <FaCalendarAlt className="mr-1" />
                      <span>{trip.duration}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{trip.price}</div>
                </div>

                <p className="text-gray-600 mb-6">{trip.description}</p>

                {trip.highlights && trip.highlights.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-800">Trip Highlights:</h4>
                    <ul className="space-y-2">
                      {trip.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <div className="bg-purple-100 text-purple-600 rounded-full p-1 mr-3 mt-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-600">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {trip.dates && trip.dates.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-bold text-gray-800 mb-2">Available Dates:</h4>
                    <div className="flex flex-wrap gap-2">
                      {trip.dates.map((date, index) => (
                        <span key={index} className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm">
                          {date}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                
              </div>
            </motion.div>
          ))}
        </div>

        
        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join a Group?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Connect with other adventurous women and create memories together
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-pink-600 px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-all shadow-lg"
            >
              Contact us 
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all shadow-lg"
            >
             +91 9796337997
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section;