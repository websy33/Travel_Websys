// Hotel Validation Rules and Utilities

/**
 * Validation rules for hotel-related forms
 */
export const validationRules = {
  panNumber: (value) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(value)) {
      return 'PAN number must be in format: ABCDE1234F (5 letters, 4 numbers, 1 letter)';
    }
    return '';
  },
  
  gstNumber: (value) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(value)) {
      return 'GST number must be in valid format (22ABCDE1234F1Z5)';
    }
    return '';
  },
  
  phone: (value) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(value.replace(/\D/g, ''))) {
      return 'Please enter a valid 10-digit Indian phone number';
    }
    return '';
  },
  
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  },
  
  pincode: (value) => {
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(value)) {
      return 'Please enter a valid 6-digit pincode';
    }
    return '';
  },
  
  hotelName: (value) => {
    if (value.length < 3) {
      return 'Hotel name must be at least 3 characters long';
    }
    if (value.length > 100) {
      return 'Hotel name must be less than 100 characters';
    }
    return '';
  },
  
  price: (value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 500) {
      return 'Price must be at least ₹500';
    }
    if (numValue > 1000000) {
      return 'Price must be less than ₹10,00,000';
    }
    return '';
  },
  
  password: (value) => {
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return 'Password must contain uppercase, lowercase and number';
    }
    return '';
  },
  
  required: (value) => {
    if (!value || value.trim() === '') {
      return 'This field is required';
    }
    return '';
  }
};

/**
 * Validate entire form based on validation rules
 * @param {Object} formData - Form data to validate
 * @param {Object} rules - Mapping of field names to validation rules
 * @returns {Object} - Object containing errors for each field
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(fieldName => {
    const value = formData[fieldName];
    const rule = rules[fieldName];
    
    if (typeof rule === 'function') {
      const error = rule(value);
      if (error) {
        errors[fieldName] = error;
      }
    } else if (Array.isArray(rule)) {
      // Multiple validation rules for one field
      for (const singleRule of rule) {
        const error = singleRule(value);
        if (error) {
          errors[fieldName] = error;
          break;
        }
      }
    }
  });
  
  return errors;
};

/**
 * Check if form has any errors
 * @param {Object} errors - Errors object from validateForm
 * @returns {boolean}
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Format Indian phone number for display
 * @param {string} phone
 * @returns {string}
 */
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

/**
 * Validate and format PAN number
 * @param {string} pan
 * @returns {string}
 */
export const formatPAN = (pan) => {
  return pan.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

/**
 * Validate and format GST number
 * @param {string} gst
 * @returns {string}
 */
export const formatGST = (gst) => {
  return gst.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

/**
 * Check if password meets minimum requirements
 * @param {string} password
 * @returns {Object} - Requirements status
 */
export const checkPasswordStrength = (password) => {
  return {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    score: calculatePasswordScore(password)
  };
};

const calculatePasswordScore = (password) => {
  let score = 0;
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (/[a-z]/.test(password)) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/\d/.test(password)) score += 15;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 15;
  return score;
};

export default {
  validationRules,
  validateForm,
  hasErrors,
  formatPhoneNumber,
  formatPAN,
  formatGST,
  checkPasswordStrength
};
