import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaChevronDown, FaShieldAlt, FaUserShield, FaDatabase, FaCookie, FaShippingFast, FaMoneyBillWave, FaPlane, FaHotel, FaGlobe, FaCreditCard, FaEnvelope, FaUmbrellaBeach } from 'react-icons/fa';

const Privacy = () => {
  const [expandedSections, setExpandedSections] = useState([]);

  const sections = [
    {
      id: 'data-collection',
      title: "Data Collection",
      icon: <FaDatabase className="text-pink-500 text-2xl" />,
      content: [
        "We collect personal information you provide when you create an account, make bookings, or contact us.",
        "This may include your name, email, phone number, payment details, and travel preferences.",
        "We automatically collect technical data like IP addresses and device information for security and analytics."
      ]
    },
    {
      id: 'data-use',
      title: "How We Use Your Data",
      icon: <FaUserShield className="text-pink-500 text-2xl" />,
      content: [
        "To process and manage your bookings and reservations.",
        "To personalize your experience and provide tailored travel recommendations.",
        "To communicate important information about your bookings.",
        "For internal analytics to improve our services."
      ]
    },
    {
      id: 'data-sharing',
      title: "Data Sharing",
      icon: <FaShieldAlt className="text-pink-500 text-2xl" />,
      content: [
        "We only share necessary information with hotels, airlines, and service providers to fulfill your bookings.",
        "We may disclose information if required by law or to protect our rights and safety.",
        "We never sell your personal data to third parties."
      ]
    },
    {
      id: 'cookies',
      title: "Cookies & Tracking",
      icon: <FaCookie className="text-pink-500 text-2xl" />,
      content: [
        "We use cookies to enhance your browsing experience and remember your preferences.",
        "Analytics cookies help us understand how visitors use our site.",
        "You can manage cookie preferences in your browser settings."
      ]
    },
    {
      id: 'security',
      title: "Data Security",
      icon: <FaLock className="text-pink-500 text-2xl" />,
      content: [
        "We implement industry-standard security measures including encryption.",
        "Regular security audits and monitoring protect your information.",
        "Payment details are processed through PCI-compliant services."
      ]
    },
    {
      id: 'rights',
      title: "Your Rights",
      icon: <FaUserShield className="text-pink-500 text-2xl" />,
      content: [
        "You can access, update, or delete your personal information in your account settings.",
        "Right to request a copy of your data in a portable format.",
        "Right to withdraw consent or object to certain processing.",
        "Contact our privacy officer at enquiry@traveligo.com for requests."
      ]
    },
    {
      id: 'shipping',
      title: "Shipping Policy",
      icon: <FaShippingFast className="text-pink-500 text-2xl" />,
      content: [
        "All travel documents and tickets are delivered digitally via email immediately after purchase confirmation.",
        "For physical items (if applicable), standard shipping takes 3-5 business days within the country.",
        "Express shipping options are available at checkout for an additional fee (1-2 business days).",
        "International shipping may take 7-14 business days depending on the destination.",
        "You will receive a tracking number via email once your order has been shipped.",
        "Shipping costs are calculated at checkout based on weight, dimensions, and destination."
      ]
    },
    {
      id: 'cancellations',
      title: "Cancellations and Refunds",
      icon: <FaMoneyBillWave className="text-pink-500 text-2xl" />,
      content: [
        "At Traveligo, we understand that plans may change. To ensure transparency and flexibility, here are our cancellation and refund guidelines:",
        "",
        "🛫 Flight Tickets",
        "• Non-refundable tickets: Most cannot be canceled for a refund.",
        "• Refundable tickets: Policies vary by airline—please check fare conditions at the time of booking.",
        "• Change requests: May be subject to airline fees and fare differences.",
        "",
        "🏨 Hotel Bookings",
        "• Free cancellation: Available for most properties up to 24–48 hours before check-in (subject to hotel policy).",
        "• Late cancellations, no-shows, or early departures: Non-refundable.",
        "",
        "🌍 Tour Packages",
        "• 30+ days before departure: Full refund (minus processing fees).",
        "• 15–29 days before departure: 50% refund.",
        "• Within 14 days of departure: Non-refundable.",
        "• Refund timeline: Processed within 7–10 business days to the original payment method.",
        "",
        "💳 Payment Gateway & Refund Policies",
        "• Refunds are credited back to the original payment method used at the time of booking.",
        "• Processing fees charged by the payment gateway are non-refundable.",
        "• In case of failed or incomplete transactions, the deducted amount (if any) is automatically reversed by your bank/payment provider within 5–7 working days.",
        "",
        "📩 Need Assistance?",
        "For cancellations or refund requests, please reach out to our support team:",
        "✉️ info@traveligo.in",
        "",
        "🛡️ Travel Insurance",
        "We strongly recommend purchasing travel insurance to safeguard against unexpected changes, medical emergencies, or other unforeseen circumstances."
      ]
    }
  ];

  const toggleSection = (id) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(section => section !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background with Multiple Layers */}
      <div className="absolute inset-0 z-0">
        {/* Main background image */}
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] 
          bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundPosition: 'center 40%',
            filter: 'brightness(0.7)'
          }}
        ></div>
        
        {/* Animated floating elements */}
        <motion.div 
          className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-pink-500/10 backdrop-blur-sm"
          animate={{
            y: [0, 40, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-purple-900/15 to-pink-900/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/15"></div>
        
        {/* Subtle sparkle effect */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/80"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, (Math.random() * 40) - 20],
                x: [0, (Math.random() * 30) - 15],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-semibold py-2 px-6 rounded-full mb-6 shadow-lg"
            >
              <FaLock className="mr-2" /> POLICIES
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600">Policies</span>
            </h1>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-pink-300 to-pink-500 mx-auto mb-6 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
            <p className="text-lg text-white max-w-2xl mx-auto">
              We're committed to transparency about our privacy practices, shipping, and cancellation policies.
            </p>
          </motion.div>

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-md border border-pink-100 mb-12 text-center backdrop-blur-sm"
          >
            <p className="text-gray-600">
              <span className="font-semibold text-pink-600">Last Updated:</span> June 15, 2023
            </p>
          </motion.div>

          {/* Policy Sections */}
          <div className="space-y-6">
            {sections.map((section) => {
              const isExpanded = expandedSections.includes(section.id);
              
              return (
                <motion.div 
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-white"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-6 py-5 text-left flex items-center group"
                  >
                    <div className="mr-4 p-3 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg shadow-sm group-hover:shadow-md transition-all">
                      {section.icon}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 flex-1 text-left group-hover:text-pink-600 transition-colors">
                      {section.title}
                    </h2>
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="text-pink-500 text-xl group-hover:text-pink-700 transition-colors"
                    >
                      <FaChevronDown />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pl-16">
                          {section.id === 'cancellations' ? (
                            <div className="space-y-4 text-gray-600">
                              {section.content.map((item, index) => {
                                if (item === "") return <div key={index} className="h-3"></div>;
                                
                                if (item.startsWith("🛫") || item.startsWith("🏨") || item.startsWith("🌍") || 
                                    item.startsWith("💳") || item.startsWith("📩") || item.startsWith("🛡️")) {
                                  return (
                                    <motion.div 
                                      key={index}
                                      className="font-semibold text-lg mt-4 text-pink-600"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                    >
                                      {item}
                                    </motion.div>
                                  );
                                }
                                
                                if (item.startsWith("•")) {
                                  return (
                                    <motion.div 
                                      key={index}
                                      className="flex items-start"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                    >
                                      <span className="text-pink-400 mr-2">•</span>
                                      {item.substring(1)}
                                    </motion.div>
                                  );
                                }
                                
                                if (item.startsWith("✉️")) {
                                  return (
                                    <motion.div 
                                      key={index}
                                      className="flex items-center mt-2"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                    >
                                      <span className="text-pink-500 mr-2">✉️</span>
                                      <a href="mailto:info@traveligo.in" className="text-pink-600 hover:underline">
                                        {item.substring(2)}
                                      </a>
                                    </motion.div>
                                  );
                                }
                                
                                return (
                                  <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                  >
                                    {item}
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : (
                            <ul className="space-y-3 text-gray-600">
                              {section.content.map((item, index) => (
                                <motion.li 
                                  key={index} 
                                  className="flex items-start"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <span className="text-pink-400 mr-2">•</span>
                                  {item}
                                </motion.li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-8 backdrop-blur-sm shadow-lg"
          >
            <div className="flex flex-col md:flex-row items-center">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="bg-gradient-to-r from-pink-500 to-pink-600 p-4 rounded-full mr-6 mb-4 md:mb-0 shadow-md"
              >
                <FaUserShield className="text-white text-2xl" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Questions About Our Policies?</h3>
                <p className="text-gray-600 mb-4">
                  Contact our customer service team for any questions about our policies.
                </p>
                <a 
                  href="mailto:info@traveligo.in" 
                  className="text-pink-600 font-medium hover:text-pink-700 transition-colors inline-flex items-center"
                >
                  info@traveligo.in
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;