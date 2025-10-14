import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMoneyBillWave, 
  FaExchangeAlt, 
  FaCalendarAlt, 
  FaHotel, 
  FaPlane, 
  FaShieldAlt,
  FaChevronDown,
  FaPercentage
} from 'react-icons/fa';
import { GiPayMoney, GiCancel } from 'react-icons/gi';
import { IoMdAirplane } from 'react-icons/io';
import { BsBuildings, BsShieldCheck } from 'react-icons/bs';

const policy = () => {
  const [activeTab, setActiveTab] = useState('deposits');
  const [expandedItems, setExpandedItems] = useState([]);
  const [hoverState, setHoverState] = useState({
    tab: null,
    card: null
  });

  // Premium Glass Card Component with Pink Accents
  const GlassCard = ({ children, className = '', whileHover = {} }) => (
    <motion.div
      className={`backdrop-blur-lg bg-white/20 rounded-3xl border border-pink-100/30 shadow-[0_8px_32px_rgba(249,168,212,0.15)] overflow-hidden ${className}`}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 15px 30px rgba(249,168,212,0.2)",
        borderColor: 'rgba(249,168,212,0.5)',
        ...whileHover
      }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>
      {children}
    </motion.div>
  );

  const policySections = [
    {
      id: 'deposits',
      title: "Deposits & Payments",
      icon: <GiPayMoney className="text-2xl text-pink-600" />,
      color: "from-pink-500 to-pink-600",
      policies: [
        {
          question: "How much deposit is required?",
          answer: "A 30% deposit is required at time of booking to secure your reservation. For premium packages, a 50% deposit may be required."
        },
        {
          question: "When is final payment due?",
          answer: "Final payment is due 60 days prior to departure. For bookings made within 60 days of travel, full payment is required immediately."
        }
      ]
    },
    {
      id: 'cancellations',
      title: "Cancellations",
      icon: <GiCancel className="text-2xl text-pink-600" />,
      color: "from-pink-400 to-rose-500",
      policies: [
        {
          question: "What is your cancellation policy?",
          answer: "Cancellations made 90+ days before departure receive full refund minus $200 admin fee. 60-89 days: 75% refund. 30-59 days: 50% refund. Less than 30 days: no refund."
        },
        {
          question: "Can I get travel insurance?",
          answer: "Yes! We strongly recommend our comprehensive travel insurance that covers cancellations for medical reasons and other unforeseen circumstances."
        }
      ]
    },
    {
      id: 'changes',
      title: "Changes & Amendments",
      icon: <FaCalendarAlt className="text-2xl text-pink-600" />,
      color: "from-pink-300 to-fuchsia-500",
      policies: [
        {
          question: "Can I change my travel dates?",
          answer: "Date changes are permitted up to 45 days before departure with a $150 change fee. Within 45 days, changes are treated as cancellations."
        },
        {
          question: "Can I change travelers?",
          answer: "Traveler substitutions are allowed up to 30 days before departure with a $100 processing fee, subject to airline/hotel approval."
        }
      ]
    },
    {
      id: 'accommodations',
      title: "Accommodations",
      icon: <BsBuildings className="text-2xl text-pink-600" />,
      color: "from-pink-200 to-rose-400",
      policies: [
        {
          question: "What if my hotel changes?",
          answer: "We reserve the right to substitute accommodations of equal or higher standard. You'll be notified of any changes with alternative options."
        },
        {
          question: "Can I request specific rooms?",
          answer: "We're happy to forward special requests (adjacent rooms, high floor, etc.) but cannot guarantee fulfillment as it depends on hotel availability."
        }
      ]
    },
    {
      id: 'flights',
      title: "Flights",
      icon: <IoMdAirplane className="text-2xl text-pink-600" />,
      color: "from-pink-100 to-rose-300",
      policies: [
        {
          question: "When will I get flight details?",
          answer: "Flight itineraries are typically provided 30 days prior to departure. For charter flights, details may come 14 days before travel."
        },
        {
          question: "Can I select my seats?",
          answer: "Seat selection is available for most airlines, though some may charge fees. We can assist with seat requests once ticketing is complete."
        }
      ]
    },
    {
      id: 'insurance',
      title: "Travel Insurance",
      icon: <BsShieldCheck className="text-2xl text-pink-600" />,
      color: "from-pink-50 to-rose-200",
      policies: [
        {
          question: "What does insurance cover?",
          answer: "Our policies cover trip cancellation, medical emergencies, lost baggage, flight delays, and more. Coverage details are provided at booking."
        },
        {
          question: "When should I purchase insurance?",
          answer: "We recommend purchasing within 14 days of initial deposit to qualify for pre-existing condition coverage."
        }
      ]
    }
  ];

  const toggleItem = (id) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Floating Pink Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-pink-100 opacity-20"
            initial={{
              scale: 0,
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100
            }}
            animate={{
              scale: 1,
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100,
              transition: {
                duration: Math.random() * 30 + 30,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Elegant Header */}
        <motion.div 
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-semibold py-3 px-6 rounded-full mb-6 shadow-lg"
          >
            <span className="mr-2">✧</span> PREMIUM BOOKING POLICIES
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600">Booking</span> Terms
          </h1>
          <motion.div
            className="w-32 h-1.5 bg-gradient-to-r from-pink-300 to-pink-500 mx-auto mb-6 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.3, type: "spring" }}
          />
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Clear policies designed with your travel experience in mind
          </p>
        </motion.div>

        {/* Pink Tab Navigation */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {policySections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              onHoverStart={() => setHoverState({...hoverState, tab: section.id})}
              onHoverEnd={() => setHoverState({...hoverState, tab: null})}
              whileHover={{ 
                y: -8, 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(249,168,212,0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className={`relative overflow-hidden rounded-xl p-1 transition-all ${
                activeTab === section.id ? 'shadow-xl' : 'shadow-md'
              }`}
              style={{
                background: activeTab === section.id ? 
                  `linear-gradient(135deg, ${section.color.replace('from-', '').replace('to-', '').replace(' ', ', ')})` : 
                  'rgba(255,255,255,0.8)'
              }}
            >
              <GlassCard whileHover={{}}>
                <div className={`p-4 flex items-center transition-all ${
                  activeTab === section.id ? 'text-pink-700' : 'text-gray-700'
                }`}>
                  <div className={`p-3 rounded-lg mr-3 ${
                    activeTab === section.id ? 'bg-white/20' : 'bg-pink-50'
                  }`}>
                    {section.icon}
                  </div>
                  <span className="font-medium">{section.title}</span>
                </div>
              </GlassCard>
              
              {hoverState.tab === section.id && activeTab !== section.id && (
                <motion.div 
                  className="absolute inset-0 rounded-xl opacity-20"
                  style={{
                    background: `linear-gradient(135deg, ${section.color.replace('from-', '').replace('to-', '').replace(' ', ', ')})`
                  }}
                  layoutId="tabHover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Main Content Area */}
        <GlassCard className="p-8 mb-16">
          {policySections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: activeTab === section.id ? 1 : 0,
                x: activeTab === section.id ? 0 : -20,
                display: activeTab === section.id ? 'block' : 'none'
              }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center mb-8">
                <div className={`p-4 rounded-xl bg-gradient-to-r ${section.color} text-white shadow-lg mr-6`}>
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">{section.title}</h2>
                  <p className="text-pink-500">Policy details and common questions</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {section.policies.map((policy, index) => {
                  const itemId = `${section.id}-${index}`;
                  const isExpanded = expandedItems.includes(itemId);
                  
                  return (
                    <motion.div 
                      key={itemId}
                      whileHover={{ y: -3 }}
                    >
                      <GlassCard>
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full px-6 py-5 text-left flex justify-between items-center group"
                        >
                          <h3 className="text-lg font-medium text-gray-800 group-hover:text-pink-600 transition-colors">
                            {policy.question}
                          </h3>
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            className="text-gray-500 group-hover:text-pink-500 text-xl transition-colors"
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
                              <div className="px-6 pb-6 text-gray-600">
                                {policy.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </GlassCard>

        {/* Pink Notice */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden rounded-3xl p-0.5 bg-gradient-to-r from-pink-400 to-pink-600 shadow-xl"
        >
          <div className="absolute inset-0 bg-noise opacity-10"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-[calc(1.5rem-1px)] p-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-5 rounded-xl mb-6 md:mb-0 md:mr-8 shadow-lg">
                <FaShieldAlt className="text-white text-4xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Flexible Booking Guarantee</h3>
                <p className="text-gray-600 mb-6">
                  We understand plans change. That's why we offer our exclusive Flexible Booking options with reduced change fees when you book select packages.
                </p>
                <button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-3 px-8 rounded-full hover:shadow-lg transition-all">
                  Explore Flexible Options
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default policy;