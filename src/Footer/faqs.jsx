import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaChevronDown, 
  FaHeadset, 
  FaComments,
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaFileAlt,
  FaShieldAlt,
  FaSlidersH,
  FaArrowRight
} from 'react-icons/fa';

const faqs = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoverStates, setHoverStates] = useState({
    card: null,
    button: false
  });

  const faqData = [
  {
    question: "What documents do I need for international travel?",
    answer: "You'll need a valid passport (with 6+ months validity), visa (if required), travel insurance, and vaccination certificates. Requirements vary by destination.",
    category: "Travel Prep",
    icon: <FaMapMarkerAlt className="text-xl" />,
    color: "from-blue-400 to-blue-600"
  },
  {
    question: "How early should I book my trip?",
    answer: "For international trips, book 3-6 months ahead. Domestic trips can be booked 1-3 months in advance. Popular destinations need earlier booking.",
    category: "Booking",
    icon: <FaCalendarAlt className="text-xl" />,
    color: "from-purple-400 to-purple-600"
  },
  {
    question: "What's your cancellation policy?",
    answer: "Full refund 30+ days before, 50% refund 15-30 days before. Within 15 days, refunds vary by vendor. Special packages may have different terms.",
    category: "Policies",
    icon: <FaFileAlt className="text-xl" />,
    color: "from-pink-400 to-pink-600"
  },
  {
    question: "Is travel insurance available?",
    answer: "Yes! We offer comprehensive coverage including trip cancellation, medical emergencies, and lost baggage protection. Add it during booking.",
    category: "Insurance",
    icon: <FaShieldAlt className="text-xl" />,
    color: "from-green-400 to-green-600"
  },
  {
    question: "Can I customize my package?",
    answer: "Absolutely! Our experts will help customize flights, hotels, and activities. Use the 'Customize Trip' option or contact us directly.",
    category: "Customization",
    icon: <FaSlidersH className="text-xl" />,
    color: "from-orange-400 to-orange-600"
  },
  {
    question: "How can I book a flight or hotel on your website?",
    answer: "Simply select your destination, travel dates, and preferences. We’ll show you the best options, and you can confirm your booking in just a few clicks.",
    category: "Booking",
    icon: <FaCalendarAlt className="text-xl" />,
    color: "from-purple-400 to-purple-600"
  },
  {
    question: "Can I cancel or change my travel booking?",
    answer: "Yes, most bookings can be changed or cancelled. Policies depend on the airline or hotel—check your confirmation email for details.",
    category: "Policies",
    icon: <FaFileAlt className="text-xl" />,
    color: "from-pink-400 to-pink-600"
  },
  {
    question: "Is it safe to book through your platform?",
    answer: "Absolutely! We use secure payment gateways and encrypted transactions to ensure your data and payments are protected.",
    category: "Security",
    icon: <FaShieldAlt className="text-xl" />,
    color: "from-red-400 to-red-600"
  },
  {
    question: "Do you offer travel packages or holiday deals?",
    answer: "Yes, we provide customized holiday packages that include flights, hotels, activities, and transfers—everything you need in one deal.",
    category: "Packages",
    icon: <FaMapMarkerAlt className="text-xl" />,
    color: "from-yellow-400 to-yellow-600"
  },
  {
    question: "Do you offer group or corporate travel services?",
    answer: "Yes, we handle group and corporate travel with special discounts and dedicated support. Contact us for tailored packages.",
    category: "Corporate",
    icon: <FaComments className="text-xl" />,
    color: "from-indigo-400 to-indigo-600"
  }
];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 10
          }}
          className="text-center mb-20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold py-3 px-6 rounded-full mb-6 shadow-lg"
          >
            <FaComments className="mr-3" /> TRAVEL HELP CENTER
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-5">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Questions</span> Answered
          </h1>
          <motion.div
            className="w-32 h-1.5 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ 
              delay: 0.3,
              duration: 0.8,
              type: "spring"
            }}
          />
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know to plan your perfect vacation
          </p>
        </motion.div>

        {/* Category Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-16"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { type: "spring", stiffness: 100 }
                }
              }}
              whileHover={{ 
                y: -10,
                scale: 1.03
              }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setHoverStates({...hoverStates, card: index})}
              onHoverEnd={() => setHoverStates({...hoverStates, card: null})}
              className={`bg-white p-6 rounded-2xl shadow-md border border-gray-100 cursor-pointer transition-all duration-300 ${hoverStates.card === index ? 'shadow-xl' : ''}`}
            >
              <div className={`w-14 h-14 rounded-xl mb-5 flex items-center justify-center bg-gradient-to-r ${faq.color} text-white`}>
                {faq.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.category}</h3>
              <p className="text-sm text-gray-500">
                {faqData.filter(item => item.category === faq.category).length} topics
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-20">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1
              }}
              className="relative"
            >
              <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${faq.color} opacity-0 ${activeIndex === index ? 'opacity-10' : ''} transition-opacity duration-300`}
              />
              
              <div className={`relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all ${activeIndex === index ? 'ring-2 ring-opacity-30' : ''}`}
                style={{
                  ringColor: faq.color.split(' ')[1].replace('from-', '')
                }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center group"
                >
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg mr-5 flex items-center justify-center ${activeIndex === index ? `bg-gradient-to-r ${faq.color} text-white` : 'bg-gray-100 text-gray-600'} transition-all`}>
                      {index + 1}
                    </div>
                    <h3 className={`text-lg md:text-xl font-medium ${activeIndex === index ? `text-transparent bg-clip-text bg-gradient-to-r ${faq.color}` : 'text-gray-800'} transition-all`}>
                      {faq.question}
                    </h3>
                  </div>
                  <motion.span
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    className={`text-2xl ${activeIndex === index ? `text-gradient bg-gradient-to-r ${faq.color}` : 'text-gray-400'} transition-colors`}
                  >
                    <FaChevronDown />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 pt-2 text-gray-600 pl-20">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: 0.5,
            type: "spring",
            stiffness: 100
          }}
          className="relative overflow-hidden rounded-3xl shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-95"></div>
          <div className="absolute inset-0 bg-noise opacity-10"></div>
          
          <div className="relative z-10 p-12 text-center">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FaHeadset className="text-3xl text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-4">Still have questions?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Our travel experts are available 24/7 to help you plan your dream vacation
            </p>
            
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-pink-600 font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              onMouseEnter={() => setHoverStates({...hoverStates, button: true})}
              onMouseLeave={() => setHoverStates({...hoverStates, button: false})}
            >
              <motion.span
                animate={{ 
                  x: hoverStates.button ? 5 : 0
                }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                Contact Support
              </motion.span>
              <motion.span
                animate={{ 
                  x: hoverStates.button ? 5 : 0
                }}
                transition={{ type: "spring", stiffness: 500 }}
                className="ml-3"
              >
                <FaArrowRight />
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default faqs;