import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';

/**
 * Enhanced Input Field Component with Validation
 * @param {string} label - Input label
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} type - Input type (text, email, password, etc.)
 * @param {string} placeholder - Placeholder text
 * @param {boolean} required - Whether field is required
 * @param {Component} icon - Icon component (from react-icons)
 * @param {string} error - External error message
 * @param {string} description - Helper text below label
 * @param {function} validationRule - Validation function
 * @param {boolean} showSuccess - Show success state when valid
 */
const EnhancedInput = ({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder, 
  required = false,
  icon: Icon,
  error,
  description,
  validationRule,
  showSuccess = false,
  disabled = false,
  ...props 
}) => {
  const [localError, setLocalError] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(e);
    
    // Validate on change if field has been touched
    if (isTouched) {
      validateField(newValue);
    }
  };

  const handleBlur = (e) => {
    setIsTouched(true);
    validateField(e.target.value);
  };

  const validateField = (fieldValue) => {
    if (validationRule && required && fieldValue) {
      const validationError = validationRule(fieldValue);
      setLocalError(validationError);
    } else if (required && !fieldValue) {
      setLocalError('This field is required');
    } else {
      setLocalError('');
    }
  };

  const displayError = error || localError;
  const isValid = isTouched && !displayError && value && showSuccess;
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      
      {description && (
        <p className="text-sm text-gray-600 -mt-1">{description}</p>
      )}
      
      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        
        {/* Input Field */}
        <input
          type={inputType}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full p-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${
            Icon ? 'pl-10' : 'pl-3'
          } ${
            type === 'password' ? 'pr-10' : 'pr-3'
          } ${
            displayError 
              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
              : isValid
              ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-200'
              : 'border-gray-200 bg-white focus:border-rose-500 focus:ring-rose-200'
          } ${
            disabled ? 'opacity-60 cursor-not-allowed bg-gray-100' : ''
          }`}
          {...props}
        />
        
        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
        
        {/* Success Icon */}
        {isValid && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
            <FiCheckCircle size={18} />
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {displayError && (
        <motion.p 
          className="text-red-600 text-sm flex items-center space-x-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiAlertCircle size={14} />
          <span>{displayError}</span>
        </motion.p>
      )}
    </div>
  );
};

/**
 * Enhanced Textarea Component
 */
export const EnhancedTextarea = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  description,
  rows = 4,
  maxLength,
  ...props
}) => {
  const [localError, setLocalError] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const handleBlur = () => {
    setIsTouched(true);
    if (required && !value) {
      setLocalError('This field is required');
    } else {
      setLocalError('');
    }
  };

  const displayError = error || localError;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      
      {description && (
        <p className="text-sm text-gray-600 -mt-1">{description}</p>
      )}
      
      <textarea
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full p-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 resize-none ${
          displayError 
            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
            : 'border-gray-200 bg-white focus:border-rose-500 focus:ring-rose-200'
        }`}
        {...props}
      />
      
      {maxLength && (
        <div className="flex justify-end text-xs text-gray-500">
          {value?.length || 0} / {maxLength}
        </div>
      )}
      
      {displayError && (
        <motion.p 
          className="text-red-600 text-sm flex items-center space-x-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FiAlertCircle size={14} />
          <span>{displayError}</span>
        </motion.p>
      )}
    </div>
  );
};

/**
 * Enhanced Select Component
 */
export const EnhancedSelect = ({
  label,
  value,
  onChange,
  options = [],
  required = false,
  error,
  description,
  icon: Icon,
  placeholder = "Select an option",
  ...props
}) => {
  const displayError = error;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      
      {description && (
        <p className="text-sm text-gray-600 -mt-1">{description}</p>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            <Icon size={18} />
          </div>
        )}
        
        <select
          value={value}
          onChange={onChange}
          className={`w-full p-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 appearance-none ${
            Icon ? 'pl-10' : 'pl-3'
          } pr-10 ${
            displayError 
              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-200 bg-white focus:border-rose-500 focus:ring-rose-200'
          }`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
        
        {/* Dropdown Arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {displayError && (
        <motion.p 
          className="text-red-600 text-sm flex items-center space-x-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FiAlertCircle size={14} />
          <span>{displayError}</span>
        </motion.p>
      )}
    </div>
  );
};

export default EnhancedInput;
