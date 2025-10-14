import { useState, useRef, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaExclamationTriangle, FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaYoutube, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your User ID
emailjs.init('37pN2ThzFwwhwk7ai');

// Map component that will display both locations
const MapComponent = ({ locations }) => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [mapError, setMapError] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (window.google && window.google.maps) {
      setScriptLoaded(true);
      return;
    }

    // Load Google Maps script if not already loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setScriptLoaded(true));
      existingScript.addEventListener('error', () => {
        setMapError('Failed to load Google Maps. Please check your API key and billing settings.');
      });
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCHCXXpbu8kefRv_Y_aS4ehoHSclw0x904&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setScriptLoaded(true);
      };
      script.onerror = () => {
        setMapError('Failed to load Google Maps. Please check your API key and billing settings.');
      };
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (scriptLoaded && ref.current && !map) {
      initializeMap();
    }
  }, [scriptLoaded, map]);

  function initializeMap() {
    try {
      const newMap = new window.google.maps.Map(ref.current, {
        center: { lat: 32.7266, lng: 74.8570 },
        zoom: 6,
        styles: [
          {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#444444"}]
          },
          {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{"color": "#f8f9fa"}]
          },
          {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
          },
          {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
              {"saturation": -100},
              {"lightness": 45}
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{"visibility": "simplified"}]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{"visibility": "off"}]
          },
          {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{"visibility": "off"}]
          },
          {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
              {"color": "#d4e6ff"},
              {"visibility": "on"}
            ]
          }
        ]
      });
      
      setMap(newMap);
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize Google Maps. Please check your API key and billing settings.');
    }
  }

  // Add markers when map is ready
  useEffect(() => {
    if (map && scriptLoaded && window.google) {
      try {
        // Clear existing markers
        markers.forEach(marker => marker.setMap(null));
        
        const newMarkers = locations.map(location => {
          const [lat, lng] = location.coordinates.split(',').map(coord => parseFloat(coord));
          
          return new window.google.maps.Marker({
            position: { lat, lng },
            map,
            title: location.name,
            icon: {
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24">
                  <path fill="#3b82f6" d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(30, 40),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 40)
            }
          });
        });
        
        setMarkers(newMarkers);
        
        // Fit map to show all markers
        if (newMarkers.length > 0) {
          const bounds = new window.google.maps.LatLngBounds();
          newMarkers.forEach(marker => bounds.extend(marker.getPosition()));
          map.fitBounds(bounds);
          
          // Add a slight zoom out for better view
          setTimeout(() => {
            if (map.getZoom() > 10) {
              map.setZoom(map.getZoom() - 1);
            }
          }, 500);
        }
      } catch (error) {
        console.error('Error adding markers:', error);
        setMapError('Failed to load map markers.');
      }
    }
  }, [map, locations, scriptLoaded]);

  if (mapError) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 shadow-lg">
        <FaExclamationTriangle className="text-yellow-500 text-4xl mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Map Unavailable</h3>
        <p className="text-gray-600 mb-4">{mapError}</p>
        <p className="text-sm text-gray-500">
          Please check your Google Maps API key and ensure billing is enabled on your Google Cloud account.
        </p>
      </div>
    );
  }

  return <div ref={ref} style={{ width: '100%', height: '500px' }} className="rounded-2xl shadow-lg" />;
};

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Define multiple locations with coordinates
  const locations = [
    {
      id: 0,
      name: 'Srinagar Office',
      address: 'First Boulevard road lane Dalgate Srinagar 190001, Jammu & Kashmir',
      coordinates: '34.0807346,74.8295321',
    },
    {
      id: 1,
      name: 'Delhi Office',
      address: 'Abul Fazal Enclave Part 2, Jamia Nagar, Okhla, New Delhi, 110025',
      coordinates: '28.560436,77.290303',
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await emailjs.send(
        'service_ov629rm',
        'template_jr1dnto',
        {
          from_name: formData.name,
          from_email: formData.email,
          phone_number: formData.phone,
          subject: formData.subject,
          message: formData.message
        }
      );

      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setSubmitSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80"></div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-medium"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-lg"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full shadow-2xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Get in <span className="text-blue-300">Touch</span>
                </h1>
              </div>
            </div>
          </motion.div>
          
          <div className="flex justify-center items-center mb-6">
            <div className="w-24 h-1 bg-blue-400 rounded-full mr-4"></div>
            <FaStar className="text-yellow-400 text-xl" />
            <div className="w-24 h-1 bg-blue-400 rounded-full ml-4"></div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-200 max-w-2xl mx-auto bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10"
          >
            Have questions about your dream vacation? Our team is ready to help you plan your perfect getaway.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/10 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-purple-500/10 rounded-full"></div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-8 relative pb-3 after:absolute after:left-0 after:bottom-0 after:h-1 after:w-16 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 after:rounded-full">
              Our Contact Details
            </h2>
            
            <motion.div 
              className="space-y-6"
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="flex items-start p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition-all border border-gray-100 group relative overflow-hidden"
                variants={fadeIn}
                whileHover={{ scale: 1.02, y: -3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full mr-4 shadow-md group-hover:scale-110 transition-transform">
                  <FaPhone className="text-white text-xl" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-gray-800">Call Us</h3>
                  <p className="text-gray-600">+91 9796337997</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition-all border border-gray-100 group relative overflow-hidden"
                variants={fadeIn}
                whileHover={{ scale: 1.02, y: -3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full mr-4 shadow-md group-hover:scale-110 transition-transform">
                  <FaEnvelope className="text-white text-xl" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-gray-800">Email Us</h3>
                  <p className="text-gray-600">info@traveligo.in</p>
                  <p className="text-gray-600">enquiry@traveligo.in</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition-all border border-gray-100 group relative overflow-hidden"
                variants={fadeIn}
                whileHover={{ scale: 1.02, y: -3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full mr-4 shadow-md group-hover:scale-110 transition-transform">
                  <FaMapMarkerAlt className="text-white text-xl" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-gray-800">Visit Us</h3>
                  <div className="mb-2">
                    <p className="font-medium text-gray-800">Srinagar Office:</p>
                    <p className="text-gray-600">First Boulevard road lane Dalgate</p>
                    <p className="text-gray-600">Srinagar 190001, Jammu & Kashmir</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Delhi Office:</p>
                    <p className="text-gray-600">Abul Fazal Enclave Part 2, Jamia Nagar</p>
                    <p className="text-gray-600">Okhla, New Delhi, 110025</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition-all border border-gray-100 group relative overflow-hidden"
                variants={fadeIn}
                whileHover={{ scale: 1.02, y: -3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full mr-4 shadow-md group-hover:scale-110 transition-transform">
                  <FaClock className="text-white text-xl" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-gray-800">Working Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 7:00 PM</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 5:00 PM</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Social Media Links */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Follow Our Journey</h3>
              <div className="flex space-x-3">
                {[
                  { icon: <FaFacebook className="text-xl" />, color: 'bg-blue-600 hover:bg-blue-700', url: 'https://www.facebook.com/' },
                  { icon: <FaTwitter className="text-xl" />, color: 'bg-black hover:bg-gray-800', url: 'https://x.com/Traveligo159449' },
                  { icon: <FaInstagram className="text-xl" />, color: 'bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800', url: 'https://www.instagram.com/traveligo_' },
                  { icon: <FaLinkedin className="text-xl" />, color: 'bg-blue-700 hover:bg-blue-800', url: 'https://www.linkedin.com/company/traveligo/' },
                  { icon: <FaYoutube className="text-xl" />, color: 'bg-red-600 hover:bg-red-700', url: 'https://youtube.com/@traveligoo' }
                ].map((social, i) => (
                  <motion.a 
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-white p-3 rounded-full shadow-md hover:shadow-lg transition-all ${social.color} relative overflow-hidden group`}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-500/10 rounded-full"></div>
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full"></div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-8 relative pb-3 after:absolute after:left-0 after:bottom-0 after:h-1 after:w-16 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 after:rounded-full">
              Send Us a Message
            </h2>
            
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 flex items-center shadow-md"
                role="alert"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Thank you! Your message has been sent successfully. We'll contact you soon.</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center shadow-md"
                role="alert"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="relative z-10">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 items-center">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full mr-2">Required</span>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm hover:shadow-md"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2  items-center">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full mr-2">Required</span>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm hover:shadow-md"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm hover:shadow-md"
                      placeholder="Enter your phone"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2  items-center">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full mr-2">Required</span>
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm hover:shadow-md"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 items-center">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full mr-2">Required</span>
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm hover:shadow-md"
                    placeholder="Tell us about your travel plans..."
                  ></textarea>
                </div>

                <div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center relative overflow-hidden group ${
                      isSubmitting ? 'opacity-80' : ''
                    }`}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute -top-8 -right-8 w-20 h-20 bg-blue-500/10 rounded-full"></div>
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-purple-500/10 rounded-full"></div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-6 relative pb-3 after:absolute after:left-0 after:bottom-0 after:h-1 after:w-16 after:bg-gradient-to-r after:from-blue-500 after:to-purple-500 after:rounded-full">
            Find Us on Map
          </h2>
          
          {/* Map with both locations */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <MapComponent locations={locations} />
          </div>
          
          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {locations.map((location) => (
              <motion.div 
                key={location.id} 
                className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 group relative overflow-hidden"
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                    <FaMapMarkerAlt className="text-blue-500 mr-2" />
                    {location.name}
                  </h3>
                  <p className="text-gray-600">{location.address}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;