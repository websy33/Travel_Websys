import { motion } from 'framer-motion';
import { FaTimesCircle, FaPhone, FaEnvelope, FaWhatsapp, FaArrowLeft, FaInfoCircle, FaExclamationTriangle, FaClock, FaHandHoldingUsd, FaFileInvoiceDollar, FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init('37pN2ThzFwwhwk7ai');

const Cancellation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bookingRef: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Send email using EmailJS
    emailjs.send(
      'service_ov629rm',
      'template_jr1dnto',
      {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        booking_ref: formData.bookingRef,
        message: formData.message,
        to_email: 'info@traveligo.in'
      }
    )
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      setIsSubmitted(true);
      setIsSubmitting(false);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          bookingRef: '',
          message: ''
        });
      }, 3000);
    })
    .catch((err) => {
      console.error('FAILED...', err);
      alert('There was an error sending your message. Please try again or contact us directly.');
      setIsSubmitting(false);
    });
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/70 to-slate-900 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/5"
            style={{
              width: Math.floor(Math.random() * 300) + 100,
              height: Math.floor(Math.random() * 300) + 100,
              top: `${Math.floor(Math.random() * 100)}%`,
              left: `${Math.floor(Math.random() * 100)}%`,
            }}
            animate={{
              x: [0, Math.floor(Math.random() * 20) - 10],
              y: [0, Math.floor(Math.random() * 20) - 10],
            }}
            transition={{
              duration: Math.floor(Math.random() * 15) + 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-indigo-900/70"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ x: -5, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center text-blue-300 hover:text-white mb-6 transition-all backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full"
          >
            <FaArrowLeft className="mr-2" /> Back
          </motion.button>
          
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              variants={fadeIn}
            >
              Cancellation <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Policy</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-blue-100 max-w-3xl mx-auto"
              variants={fadeIn}
            >
              Understand our cancellation procedures and refund policies for a hassle-free experience
            </motion.p>
            
            <motion.div
              className="mt-8 flex justify-center"
              variants={fadeIn}
            >
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Policy Content */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/10 mb-8"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className="flex items-center mb-8">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mr-4"
                >
                  <FaTimesCircle className="text-red-400 text-3xl" />
                </motion.div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  Standard Cancellation Policy
                </h2>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-blue-100 mb-8">
                  At Traveligo, we understand that plans can change unexpectedly. Our cancellation policy is designed to be fair to both our customers and our business operations. Please review the following policy details carefully.
                </p>
                
                <motion.div 
                  className="mb-8"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-300">
                    <FaClock className="mr-3" />
                    Cancellation Timeframes & Refunds
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-5 border border-blue-500/20">
                      <h4 className="font-bold mb-3 text-lg flex items-center text-blue-200">
                        <span className="bg-blue-500/20 p-2 rounded-lg mr-3">
                          <FaHandHoldingUsd className="text-blue-300" />
                        </span>
                        Domestic Packages
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2 mt-1">•</span>
                          <span><strong className="text-white">30+ days</strong> before departure: <strong className="text-green-400">90% refund</strong></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2 mt-1">•</span>
                          <span><strong className="text-white">15-29 days</strong> before departure: <strong className="text-green-300">70% refund</strong></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2 mt-1">•</span>
                          <span><strong className="text-white">7-14 days</strong> before departure: <strong className="text-yellow-300">50% refund</strong></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2 mt-1">•</span>
                          <span><strong className="text-white">Less than 7 days</strong>: <strong className="text-red-400">No refund</strong></span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 rounded-xl p-5 border border-indigo-500/20">
                      <h4 className="font-bold mb-3 text-lg flex items-center text-indigo-200">
                        <span className="bg-indigo-500/20 p-2 rounded-lg mr-3">
                          <FaFileInvoiceDollar className="text-indigo-300" />
                        </span>
                        International Packages
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="text-indigo-400 mr-2 mt-1">•</span>
                          <span><strong className="text-white">45+ days</strong> before departure: <strong className="text-green-400">85% refund</strong></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-400 mr-2 mt-1">•</span>
                          <span><strong className="text-white">30-44 days</strong> before departure: <strong className="text-green-300">60% refund</strong></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-400 mr-2 mt-1">•</span>
                          <span><strong className="text-white">15-29 days</strong> before departure: <strong className="text-yellow-300">40% refund</strong></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-400 mr-2 mt-1">•</span>
                          <span><strong className="text-white">Less than 15 days</strong>: <strong className="text-red-400">No refund</strong></span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mb-8"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-300">
                    <FaInfoCircle className="mr-3" />
                    Cancellation Procedure
                  </h3>
                  <ol className="list-decimal pl-6 space-y-3 mb-6 text-blue-100">
                    <li>All cancellation requests must be sent in writing to <span className="text-blue-300">info@traveligo.in</span></li>
                    <li>Please mention your booking reference number in all communications</li>
                    <li>Refunds will be processed within 7-10 working days from the date of cancellation approval</li>
                    <li>The refund will be credited to the original mode of payment</li>
                    <li>Processing fees may apply as per payment gateway policies</li>
                  </ol>
                </motion.div>
                
                <motion.div 
                  className="mb-8"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-300">
                    <FaExclamationTriangle className="mr-3" />
                    Special Cases
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-5 border border-blue-500/20">
                      <h4 className="font-bold mb-3 text-blue-200">Flight Cancellations</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2 mt-1">•</span>
                          <span>Follow airline-specific policies</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2 mt-1">•</span>
                          <span>Airline cancellation charges apply</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-400 mr-2 mt-1">•</span>
                          <span>Refunds as per airline policy timelines</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 rounded-xl p-5 border border-indigo-500/20">
                      <h4 className="font-bold mb-3 text-indigo-200">Hotel Cancellations</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-indigo-400 mr-2 mt-1">•</span>
                          <span>Subject to hotel policies</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-400 mr-2 mt-1">•</span>
                          <span>Peak season may have stricter policies</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-400 mr-2 mt-1">•</span>
                          <span>Non-refundable rates are clearly marked</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mb-8"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  <h3 className="text-xl font-semibold mb-3 text-blue-300">Force Majeure Events</h3>
                  <p className="text-blue-100 mb-3">
                    In case of unforeseen circumstances such as natural disasters, political unrest, pandemics, or other events beyond our control:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-blue-100 mb-6">
                    <li>Full credit will be provided for future travel valid for 12 months</li>
                    <li>Rescheduling options will be offered without cancellation charges</li>
                    <li>Refund policies will be determined based on recoverable costs from suppliers</li>
                  </ul>
                </motion.div>
                
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  <h3 className="text-xl font-semibold mb-3 text-blue-300">Medical Emergencies</h3>
                  <p className="text-blue-100 mb-3">
                    We understand that health issues can disrupt travel plans. In case of genuine medical emergencies:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-blue-100">
                    <li>Please notify us immediately with supporting documentation</li>
                    <li>We will make every effort to recover maximum refund from suppliers</li>
                    <li>Cases are evaluated individually for possible exceptions</li>
                    <li>Travel insurance claims can be facilitated</li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-2xl font-bold mb-6 text-blue-300">Travel Insurance Recommendation</h2>
              <p className="text-blue-100 mb-4">
                We strongly recommend purchasing comprehensive travel insurance at the time of booking. A good travel insurance policy can protect you against:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-blue-100">
                <li>Trip cancellations and interruptions</li>
                <li>Medical emergencies during travel</li>
                <li>Loss of baggage and personal belongings</li>
                <li>Travel delays and missed connections</li>
                <li>Emergency evacuation services</li>
              </ul>
              <p className="text-blue-100 mt-4">
                Our team can assist you in selecting appropriate travel insurance based on your destination and needs.
              </p>
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div>
            <motion.div 
              className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-blue-500/30 mb-8 sticky top-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h3 className="text-xl font-bold mb-4 text-white">Need Help With Cancellation?</h3>
              <p className="text-blue-100 mb-6">Our support team is here to assist you with any cancellation requests or questions.</p>
              
              <div className="space-y-4">
                <motion.a 
                  href="tel:+919796337997" 
                  className="flex items-center p-4 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl transition-all group border border-blue-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-blue-500/20 p-3 rounded-xl mr-4 group-hover:bg-blue-500/30 transition-colors">
                    <FaPhone className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Call us at</p>
                    <p className="text-white font-medium">+91 9796337997</p>
                  </div>
                </motion.a>
                
                <motion.a 
                  href="mailto:info@traveligo.in" 
                  className="flex items-center p-4 bg-indigo-600/20 hover:bg-indigo-600/30 rounded-xl transition-all group border border-indigo-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-indigo-500/20 p-3 rounded-xl mr-4 group-hover:bg-indigo-500/30 transition-colors">
                    <FaEnvelope className="text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-indigo-200">Email us at</p>
                    <p className="text-white font-medium">info@traveligo.in</p>
                  </div>
                </motion.a>
                
                <motion.a 
                  href="https://wa.me/919796337997" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-green-600/20 hover:bg-green-600/30 rounded-xl transition-all group border border-green-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-green-500/20 p-3 rounded-xl mr-4 group-hover:bg-green-500/30 transition-colors">
                    <FaWhatsapp className="text-green-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-green-200">WhatsApp</p>
                    <p className="text-white font-medium">+91 9796337997</p>
                  </div>
                </motion.a>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 mb-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h3 className="text-xl font-bold mb-4 text-blue-300">Important Notes</h3>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2 mt-1">•</span>
                  <span>All times are calculated based on destination local time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2 mt-1">•</span>
                  <span>Refund amounts are based on the total tour cost minus any non-recoverable expenses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2 mt-1">•</span>
                  <span>Processing fees may apply for refund processing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2 mt-1">•</span>
                  <span>No refund for unused services during the tour</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2 mt-1">•</span>
                  <span>Policy subject to change without prior notice</span>
                </li>
              </ul>
            </motion.div>

            {/* Support Form */}
            <motion.div 
              className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h3 className="text-xl font-bold mb-4 text-blue-300">Contact Support</h3>
              <p className="text-blue-100 mb-6">Send us a message and we'll get back to you shortly.</p>
              
              {isSubmitted ? (
                <motion.div 
                  className="bg-green-900/30 p-4 rounded-xl border border-green-500/30 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-green-400 text-4xl mb-3">✓</div>
                  <p className="text-green-200 font-medium">Thank you for your message!</p>
                  <p className="text-green-100 text-sm mt-1">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-blue-200 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-blue-200 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bookingRef" className="block text-sm font-medium text-blue-200 mb-1">Booking Reference (if applicable)</label>
                    <input
                      type="text"
                      id="bookingRef"
                      name="bookingRef"
                      value={formData.bookingRef}
                      onChange={handleChange}
                      className="w-full bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-colors"
                      placeholder="TRV-123456"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-blue-200 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full bg-slate-800/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-colors"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-500 hover:to-indigo-500'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/0/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" /> Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-16 bg-gradient-to-r from-blue-900/50 to-indigo-900/50">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h2 
            className="text-3xl font-bold mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            Have Questions About Our Policy?
          </motion.h2>
          <motion.p 
            className="text-xl text-blue-100 max-w-2xl mx-auto mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            Contact our support team for clarification or assistance with your specific situation.
          </motion.p>
          
          <motion.button
            onClick={() => {
              document.querySelector('.lg\\:col-span-2').scrollIntoView({ behavior: 'smooth' });
            }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-full text-white font-medium border border-white/20 hover:border-white/40 transition-all"
          >
            Contact Support Now
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Cancellation;