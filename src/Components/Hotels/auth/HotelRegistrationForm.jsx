import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiHome,
  FiFileText, FiCheck, FiAlertCircle, FiLoader, FiDollarSign,
  FiArrowRight, FiArrowLeft, FiCalendar, FiPlus, FiTrash2,
  FiStar, FiShield, FiAward, FiTrendingUp, FiClock, FiZap
} from 'react-icons/fi';
import EnhancedInput from '../../common/EnhancedInput';
import LoadingSpinner from '../../common/LoadingSpinner';
import HotelRateManagement from './HotelRateManagement';
import { validationRules } from '../../../utils/hotelValidation';
import { registerHotel } from '../../../utils/hotelRegistration';
import { modalVariants } from '../../../utils/hotelAnimations';

/**
 * Hotel Registration Form Component
 * Handles complete hotel owner registration with Firebase integration
 */
const HotelRegistrationForm = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Rate management state - FIXED: Consolidated state management
  const [seasonalRates, setSeasonalRates] = useState([]);
  const [blackoutDates, setBlackoutDates] = useState([]);
  const [extraBedRates, setExtraBedRates] = useState([]);
  const [cwnbRates, setCwnbRates] = useState([]);

  // Form data state
  const [formData, setFormData] = useState({
    // Personal Information
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    alternatePhone: '',
    
    // Hotel Information
    hotelName: '',
    address: '',
    city: '',
    state: 'Jammu & Kashmir',
    pincode: '',
    
    // Legal Documents
    gstNumber: '',
    panNumber: '',
    
    // Additional
    description: '',
    website: '',
    
    // Rate Information
    defaultRate: '',
    defaultWeekendRate: ''
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setError('');
  };

  // Validate current step - FIXED: More flexible validation for optional steps
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Personal Information validation
      if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else {
        const emailError = validationRules.email(formData.email);
        if (emailError) newErrors.email = emailError;
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else {
        const passwordError = validationRules.password(formData.password);
        if (passwordError) newErrors.password = passwordError;
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else {
        const phoneError = validationRules.phone(formData.phone);
        if (phoneError) newErrors.phone = phoneError;
      }
    }

    if (step === 2) {
      // Hotel Information validation
      if (!formData.hotelName.trim()) {
        newErrors.hotelName = 'Hotel name is required';
      } else {
        const hotelNameError = validationRules.hotelName(formData.hotelName);
        if (hotelNameError) newErrors.hotelName = hotelNameError;
      }
      
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      
      if (!formData.pincode.trim()) {
        newErrors.pincode = 'PIN code is required';
      } else {
        const pincodeError = validationRules.pincode(formData.pincode);
        if (pincodeError) newErrors.pincode = pincodeError;
      }
    }

    if (step === 3) {
      // Rate Management validation - FIXED: Make this step completely optional
      // Only validate if values are provided, but don't require them
      if (formData.defaultRate && formData.defaultRate.toString().trim() !== '') {
        const rate = parseFloat(formData.defaultRate);
        if (isNaN(rate) || rate < 100 || rate > 50000) {
          newErrors.defaultRate = 'Please enter a valid rate between ₹100 and ₹50,000';
        }
      }
      
      if (formData.defaultWeekendRate && formData.defaultWeekendRate.toString().trim() !== '') {
        const weekendRate = parseFloat(formData.defaultWeekendRate);
        if (isNaN(weekendRate) || weekendRate < 100 || weekendRate > 50000) {
          newErrors.defaultWeekendRate = 'Please enter a valid weekend rate between ₹100 and ₹50,000';
        }
      }
      
      // Step 3 is completely optional - clear any errors and allow progression
      setErrors(newErrors);
      return true; // Always allow progression from step 3
    }

    if (step === 4) {
      // Blackout Dates validation - FIXED: Use the blackoutDates state from HotelRateManagement
      // This step is also optional, so don't block progression
      const blackoutErrors = [];
      
      blackoutDates.forEach((date, index) => {
        if (date.startDate && !date.endDate) {
          blackoutErrors.push(`Blackout period ${index + 1}: End date is required when start date is set`);
        }
        if (date.endDate && !date.startDate) {
          blackoutErrors.push(`Blackout period ${index + 1}: Start date is required when end date is set`);
        }
        if (date.startDate && date.endDate) {
          const start = new Date(date.startDate);
          const end = new Date(date.endDate);
          if (end < start) {
            blackoutErrors.push(`Blackout period ${index + 1}: End date cannot be before start date`);
          }
        }
      });

      if (blackoutErrors.length > 0) {
        newErrors.blackoutDates = blackoutErrors;
      }
      
      // Step 4 is optional - allow progression even with errors (just show warnings)
      setErrors(newErrors);
      return true;
    }

    if (step === 5) {
      // Legal Documents validation - FIXED: Make these fields optional but validate if provided
      if (formData.gstNumber && formData.gstNumber.trim() !== '') {
        const gstError = validationRules.gstNumber(formData.gstNumber);
        if (gstError) newErrors.gstNumber = gstError;
      }
      
      if (formData.panNumber && formData.panNumber.trim() !== '') {
        const panError = validationRules.panNumber(formData.panNumber);
        if (panError) newErrors.panNumber = panError;
      }
      
      // Step 5 validation - only require personal and hotel info
      const step1Valid = validateStep(1);
      const step2Valid = validateStep(2);
      
      setErrors(newErrors);
      return step1Valid && step2Valid; // Only require steps 1 and 2 to be valid
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step - FIXED: Better error handling
  const handleNext = () => {
    setError('');
    
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError('Please fill all required fields correctly before proceeding.');
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
    // Scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle skip rate management (for step 3 only)
  const handleSkipRateManagement = () => {
    if (currentStep === 3) {
      setFormData(prev => ({ 
        ...prev, 
        defaultRate: prev.defaultRate || '2000',
        defaultWeekendRate: prev.defaultWeekendRate || '2500'
      }));
      setErrors({});
      setError('');
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle skip blackout dates (for step 4 only)
  const handleSkipBlackoutDates = () => {
    if (currentStep === 4) {
      setErrors({});
      setError('');
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle form submission - FIXED: Include all rate management data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submission started', {
      seasonalRates,
      blackoutDates,
      extraBedRates,
      cwnbRates,
      formData
    });

    // Validate all required steps
    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    const step5Valid = validateStep(5);

    if (!step1Valid || !step2Valid || !step5Valid) {
      setError('Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare complete registration data - FIXED: Include all rate management data
      const completeFormData = {
        ...formData,
        seasonalRates,
        blackoutDates: blackoutDates.filter(date => date.startDate && date.endDate),
        extraBedRates,
        cwnbRates,
        defaultRate: formData.defaultRate || '2000',
        defaultWeekendRate: formData.defaultWeekendRate || formData.defaultRate || '2500'
      };
      
      console.log('Submitting registration data:', completeFormData);
      
      // Register hotel in Firebase
      const result = await registerHotel(completeFormData);
      
      setSuccess(true);
      
      // Call success callback after delay
      setTimeout(() => {
        onSuccess?.(result);
        onClose?.();
      }, 3000);

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Success screen
  if (success) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-blue-100"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <FiCheck className="text-white" size={32} />
            </div>
          </div>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
              Welcome Aboard! 🎉
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Your hotel registration has been submitted successfully.
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 mb-6 shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-center mb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <FiMail className="text-blue-600" size={20} />
              </div>
            </div>
            <p className="text-sm font-semibold text-blue-800 mb-1">
              Verification Email Sent
            </p>
            <p className="text-xs text-blue-600">
              Check <strong className="text-blue-700">{formData.email}</strong> to verify your account
            </p>
          </motion.div>

          <motion.button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Your Journey 🚀
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl w-full max-w-4xl my-8 shadow-2xl border border-blue-100/50 backdrop-blur-sm"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Enhanced Header */}
            <div className="relative p-8 border-b border-blue-100 bg-gradient-to-r from-white to-blue-50/50 rounded-t-3xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 rounded-t-3xl"></div>
              
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-2 rounded-xl shadow-lg">
                      <FiStar className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Hotel Registration
                      </h2>
                      <p className="text-gray-600 mt-1 text-lg">
                        Join 5000+ successful hotel partners
                      </p>
                    </div>
                  </div>
                  
                  {/* Enhanced Progress bar */}
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-sm font-medium text-gray-600">
                      <span>Step {currentStep} of 5</span>
                      <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs">
                        {
                          currentStep === 1 ? 'Personal Info' :
                          currentStep === 2 ? 'Hotel Details' :
                          currentStep === 3 ? 'Rate Setup' :
                          currentStep === 4 ? 'Availability' :
                          'Legal Docs'
                        }
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((step) => (
                        <motion.div
                          key={step}
                          className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                            step < currentStep ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            step === currentStep ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-500/30' :
                            'bg-gray-200'
                          }`}
                          whileHover={{ scale: step === currentStep ? 1.05 : 1 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <motion.button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-all duration-300 p-3 hover:bg-gray-100 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiArrowRight size={24} />
                </motion.button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Enhanced Error Alert */}
              {(error || Object.keys(errors).length > 0) && (
                <motion.div
                  className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 shadow-lg"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <FiAlertCircle className="text-red-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-red-800 mb-2">Attention Required</h4>
                      <div className="text-sm text-red-700 space-y-2">
                        {error && (
                          <p className="bg-red-100/50 p-3 rounded-lg border border-red-200">{error}</p>
                        )}
                        {Object.keys(errors).length > 0 && (
                          <div>
                            <p className="font-semibold mb-2">Please fix the following:</p>
                            <ul className="space-y-1">
                              {Object.entries(errors).map(([field, errorMsg]) => (
                                Array.isArray(errorMsg) ? (
                                  errorMsg.map((msg, idx) => (
                                    <li key={`${field}-${idx}`} className="flex items-center space-x-2">
                                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                      <span>{msg}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li key={field} className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    <span>{errorMsg}</span>
                                  </li>
                                )
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-2xl inline-flex items-center space-x-3 mb-4">
                      <FiUser className="text-blue-600" size={24} />
                      <span className="text-lg font-semibold text-gray-700">Personal Information</span>
                    </div>
                    <p className="text-gray-600">Tell us about yourself to get started</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <EnhancedInput
                      label="Full Name"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      icon={FiUser}
                      error={errors.ownerName}
                      required
                      gradient
                    />

                    <EnhancedInput
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      icon={FiMail}
                      error={errors.email}
                      validationRule={validationRules.email}
                      required
                      showSuccess
                      gradient
                    />

                    <EnhancedInput
                      label="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      icon={FiLock}
                      error={errors.password}
                      validationRule={validationRules.password}
                      required
                      description="Must be at least 8 characters with uppercase, lowercase and number"
                      gradient
                    />

                    <EnhancedInput
                      label="Confirm Password"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      icon={FiLock}
                      error={errors.confirmPassword}
                      required
                      gradient
                    />

                    <EnhancedInput
                      label="Phone Number"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      icon={FiPhone}
                      error={errors.phone}
                      validationRule={validationRules.phone}
                      required
                      showSuccess
                      gradient
                    />

                    <EnhancedInput
                      label="Alternate Phone (Optional)"
                      type="tel"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleChange}
                      placeholder="Alternative contact number"
                      icon={FiPhone}
                      gradient
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Hotel Information */}
              {currentStep === 2 && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-2xl inline-flex items-center space-x-3 mb-4">
                      <FiHome className="text-green-600" size={24} />
                      <span className="text-lg font-semibold text-gray-700">Hotel Information</span>
                    </div>
                    <p className="text-gray-600">Tell us about your wonderful property</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <EnhancedInput
                      label="Hotel Name"
                      name="hotelName"
                      value={formData.hotelName}
                      onChange={handleChange}
                      placeholder="Enter hotel name"
                      icon={FiHome}
                      error={errors.hotelName}
                      validationRule={validationRules.hotelName}
                      required
                      showSuccess
                      gradient
                    />

                    <EnhancedInput
                      label="Hotel Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Complete address with landmarks"
                      icon={FiMapPin}
                      error={errors.address}
                      required
                      gradient
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <EnhancedInput
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        error={errors.city}
                        required
                        gradient
                      />

                      <EnhancedInput
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        gradient
                        disabled
                      />

                      <EnhancedInput
                        label="PIN Code"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="6-digit PIN"
                        error={errors.pincode}
                        validationRule={validationRules.pincode}
                        required
                        showSuccess
                        gradient
                      />
                    </div>

                    <EnhancedInput
                      label="Hotel Description (Optional)"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Brief description of your hotel's unique features and amenities"
                      gradient
                    />

                    <EnhancedInput
                      label="Website (Optional)"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://yourhotel.com"
                      gradient
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Rate Management - FIXED: Integrated HotelRateManagement component */}
              {currentStep === 3 && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-2xl inline-flex items-center space-x-3 mb-4">
                      <FiTrendingUp className="text-amber-600" size={24} />
                      <span className="text-lg font-semibold text-gray-700">Rate Management</span>
                    </div>
                    <p className="text-gray-600">Set up your pricing strategy for maximum revenue</p>
                  </div>

                  <motion.div
                    className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-6 shadow-lg"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <FiZap className="text-amber-600" size={20} />
                      <p className="text-sm font-semibold text-amber-800">
                        Smart Pricing Setup
                      </p>
                    </div>
                    <p className="text-xs text-amber-700">
                      💡 Pro Tip: You can skip this step and set up rates later from your dashboard with AI-powered recommendations
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <EnhancedInput
                      label="Default Rate (₹/night)"
                      type="number"
                      name="defaultRate"
                      value={formData.defaultRate}
                      onChange={handleChange}
                      placeholder="2000"
                      icon={FiDollarSign}
                      error={errors.defaultRate}
                      min="100"
                      max="50000"
                      step="100"
                      description="Base rate for regular days (optional)"
                      gradient
                    />

                    <EnhancedInput
                      label="Weekend Rate (₹/night)"
                      type="number"
                      name="defaultWeekendRate"
                      value={formData.defaultWeekendRate}
                      onChange={handleChange}
                      placeholder="2500"
                      icon={FiDollarSign}
                      error={errors.defaultWeekendRate}
                      min="100"
                      max="50000"
                      step="100"
                      description="Rate for Friday & Saturday nights (optional)"
                      gradient
                    />
                  </div>

                  {/* FIXED: Integrated HotelRateManagement component with proper state handlers */}
                  <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4 flex items-center space-x-3">
                      <FiAward className="text-purple-500" />
                      <span>Advanced Rate Configuration</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Configure seasonal rates, blackout dates, and additional charges to optimize your revenue
                    </p>
                    
                    {/* Hotel Rate Management Component Integration */}
                    <HotelRateManagement
                      rates={seasonalRates}
                      blackoutDates={blackoutDates}
                      extraBedRates={extraBedRates}
                      cwnbRates={cwnbRates}
                      onRatesChange={setSeasonalRates}
                      onBlackoutDatesChange={setBlackoutDates}
                      onExtraBedRatesChange={setExtraBedRates}
                      onCwnbRatesChange={setCwnbRates}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 4: Blackout Dates - FIXED: Removed duplicate blackout periods management */}
              {currentStep === 4 && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-2xl inline-flex items-center space-x-3 mb-4">
                      <FiCalendar className="text-purple-600" size={24} />
                      <span className="text-lg font-semibold text-gray-700">Availability Management</span>
                    </div>
                    <p className="text-gray-600">Review and manage your hotel's availability settings</p>
                  </div>

                  <motion.div
                    className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 mb-6 shadow-lg"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <FiClock className="text-purple-600" size={20} />
                      <p className="text-sm font-semibold text-purple-800">
                        Blackout Dates Summary
                      </p>
                    </div>
                    <p className="text-xs text-purple-700">
                      💡 You've configured {blackoutDates.length} blackout period(s) in the previous step. 
                      These will prevent bookings during the specified dates.
                    </p>
                  </motion.div>

                  {/* Enhanced Rate Management Tips */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6 mb-8 shadow-lg">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center space-x-3">
                      <FiTrendingUp className="text-green-500" />
                      <span>Revenue Optimization Tips</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <FiStar className="text-green-600" size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">Seasonal Pricing</p>
                          <p className="text-xs text-gray-600">Maximize revenue during peak periods with dynamic rates</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FiDollarSign className="text-blue-600" size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">Weekend Rates</p>
                          <p className="text-xs text-gray-600">Typically 20-30% higher than weekday rates</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-rose-100 p-2 rounded-lg">
                          <FiCalendar className="text-rose-600" size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">Blackout Dates</p>
                          <p className="text-xs text-gray-600">Prevent bookings during maintenance or private events</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-amber-100 p-2 rounded-lg">
                          <FiAlertCircle className="text-amber-600" size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">Avoid Conflicts</p>
                          <p className="text-xs text-gray-600">Ensure rate periods don't overlap to avoid conflicts</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Blackout Dates Summary */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                          Configured Blackout Periods
                        </h3>
                        <p className="text-gray-600">Review the blackout dates you've set up</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-rose-600">{blackoutDates.length}</p>
                        <p className="text-sm text-gray-600">Periods Configured</p>
                      </div>
                    </div>

                    {blackoutDates.length === 0 ? (
                      <motion.div
                        className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-8 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <FiCalendar className="text-gray-400 mx-auto mb-4" size={48} />
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">No Blackout Periods</h4>
                        <p className="text-gray-600 mb-4">You haven't configured any blackout periods yet.</p>
                        <p className="text-sm text-gray-500">
                          You can add blackout periods in the Rate Management step or skip this section entirely.
                        </p>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        {blackoutDates.map((date, index) => (
                          <motion.div
                            key={date.id}
                            className="bg-gradient-to-br from-white to-rose-50 border border-rose-200 rounded-2xl p-6 shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className="bg-rose-100 p-2 rounded-lg">
                                    <FiCalendar className="text-rose-600" size={18} />
                                  </div>
                                  <h4 className="text-lg font-semibold text-gray-800">
                                    Blackout Period {index + 1}
                                  </h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Period:</span>
                                    <p className="font-medium">
                                      {new Date(date.startDate).toLocaleDateString()} - {new Date(date.endDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                  {date.reason && (
                                    <div>
                                      <span className="text-gray-500">Reason:</span>
                                      <p className="font-medium">{date.reason}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 5: Legal Documents */}
              {currentStep === 5 && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-4 rounded-2xl inline-flex items-center space-x-3 mb-4">
                      <FiShield className="text-indigo-600" size={24} />
                      <span className="text-lg font-semibold text-gray-700">Legal Documents</span>
                    </div>
                    <p className="text-gray-600">Complete your registration with legal verification</p>
                  </div>

                  <motion.div
                    className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-6 mb-6 shadow-lg"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <FiFileText className="text-indigo-600" size={20} />
                      <p className="text-sm font-semibold text-indigo-800">
                        Secure & Verified
                      </p>
                    </div>
                    <p className="text-xs text-indigo-700">
                      🔒 Your information is protected with bank-level security. Legal documents are optional but recommended for verification.
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 gap-6 mb-8">
                    <EnhancedInput
                      label="GST Number (Optional)"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="22ABCDE1234F1Z5"
                      icon={FiFileText}
                      error={errors.gstNumber}
                      validationRule={validationRules.gstNumber}
                      description="15-digit GST identification number (optional but recommended for business)"
                      showSuccess
                      gradient
                    />

                    <EnhancedInput
                      label="PAN Number (Optional)"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                      icon={FiFileText}
                      error={errors.panNumber}
                      validationRule={validationRules.panNumber}
                      description="10-character PAN (5 letters, 4 numbers, 1 letter) - optional but recommended"
                      showSuccess
                      gradient
                    />
                  </div>

                  {/* Enhanced Review Section */}
                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="font-bold text-green-800 mb-4 flex items-center space-x-3 text-lg">
                      <FiCheck className="text-green-600" />
                      <span>Ready to Launch! 🚀</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-green-200">
                          <span className="font-semibold text-gray-700">Email</span>
                          <span className="text-green-700 font-medium">{formData.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-green-200">
                          <span className="font-semibold text-gray-700">Hotel</span>
                          <span className="text-green-700 font-medium">{formData.hotelName}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-green-200">
                          <span className="font-semibold text-gray-700">Location</span>
                          <span className="text-green-700 font-medium">{formData.city}, {formData.pincode}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-green-200">
                          <span className="font-semibold text-gray-700">Default Rate</span>
                          <span className="text-green-700 font-medium">₹{formData.defaultRate || '2000'}/night</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-green-200">
                          <span className="font-semibold text-gray-700">Weekend Rate</span>
                          <span className="text-green-700 font-medium">₹{formData.defaultWeekendRate || formData.defaultRate || '2500'}/night</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="font-semibold text-gray-700">Blackout Periods</span>
                          <span className="text-green-700 font-medium">{blackoutDates.length} configured</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Enhanced Navigation Buttons */}
              <div className="flex justify-between items-center pt-8 border-t border-blue-100">
                <div>
                  {currentStep > 1 ? (
                    <motion.button
                      type="button"
                      onClick={handlePrevious}
                      className="px-8 py-4 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-semibold flex items-center space-x-3 text-gray-700 hover:shadow-lg"
                      whileHover={{ scale: 1.02, x: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiArrowLeft size={18} />
                      <span>Previous</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      type="button"
                      onClick={onClose}
                      className="px-8 py-4 text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                  )}
                </div>

                <div className="flex space-x-4">
                  {currentStep < 5 ? (
                    <>
                      {(currentStep === 3 || currentStep === 4) && (
                        <motion.button
                          type="button"
                          onClick={currentStep === 3 ? handleSkipRateManagement : handleSkipBlackoutDates}
                          className="px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300 hover:shadow-lg"
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Skip & Continue
                        </motion.button>
                      )}
                      <motion.button
                        type="button"
                        onClick={handleNext}
                        className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-3 shadow-lg"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Next Step</span>
                        <FiArrowRight size={18} />
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center space-x-3 shadow-lg"
                      whileHover={{ scale: loading ? 1 : 1.05, y: loading ? 0 : -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {loading ? (
                        <>
                          <FiLoader className="animate-spin" size={18} />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <FiCheck size={18} />
                          <span>Complete Registration</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HotelRegistrationForm;