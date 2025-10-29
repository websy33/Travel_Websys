/**
 * Hotel Rate Management Utilities
 * Handles seasonal rates, blackout dates, and rate calculations
 */

/**
 * Check if a date falls within a blackout period
 * @param {Date} date - Date to check
 * @param {Array} blackoutDates - Array of blackout periods
 * @returns {Object|null} - Blackout period if found, null otherwise
 */
export const isBlackoutDate = (date, blackoutDates = []) => {
  const checkDate = new Date(date);
  
  for (const blackout of blackoutDates) {
    const startDate = new Date(blackout.startDate);
    const endDate = new Date(blackout.endDate);
    
    if (checkDate >= startDate && checkDate <= endDate) {
      return blackout;
    }
  }
  
  return null;
};

/**
 * Get the applicable seasonal rate for a given date
 * @param {Date} date - Date to check
 * @param {Array} seasonalRates - Array of seasonal rates
 * @returns {Object|null} - Seasonal rate if found, null otherwise
 */
export const getSeasonalRate = (date, seasonalRates = []) => {
  const checkDate = new Date(date);
  
  for (const rate of seasonalRates) {
    const startDate = new Date(rate.startDate);
    const endDate = new Date(rate.endDate);
    
    if (checkDate >= startDate && checkDate <= endDate) {
      return rate;
    }
  }
  
  return null;
};

/**
 * Check if a date is a weekend (Friday or Saturday)
 * @param {Date} date - Date to check
 * @returns {boolean} - True if weekend, false otherwise
 */
export const isWeekend = (date) => {
  const day = new Date(date).getDay();
  return day === 5 || day === 6; // Friday = 5, Saturday = 6
};

/**
 * Calculate the rate for a specific date
 * @param {Date} date - Date to calculate rate for
 * @param {Object} hotelRates - Hotel rate configuration
 * @returns {Object} - Rate calculation result
 */
export const calculateDayRate = (date, hotelRates) => {
  const {
    defaultRate = 0,
    defaultWeekendRate = 0,
    seasonalRates = [],
    blackoutDates = []
  } = hotelRates;

  const result = {
    date: new Date(date),
    available: true,
    rate: defaultRate,
    rateType: 'default',
    isWeekend: isWeekend(date),
    blackout: null,
    seasonalRate: null
  };

  // Check for blackout dates first
  const blackout = isBlackoutDate(date, blackoutDates);
  if (blackout) {
    result.available = false;
    result.blackout = blackout;
    result.rate = 0;
    result.rateType = 'blackout';
    return result;
  }

  // Check for seasonal rates
  const seasonalRate = getSeasonalRate(date, seasonalRates);
  if (seasonalRate) {
    result.seasonalRate = seasonalRate;
    result.rate = result.isWeekend ? seasonalRate.weekendRate : seasonalRate.baseRate;
    result.rateType = `seasonal-${seasonalRate.season}`;
  } else {
    // Use default rates
    result.rate = result.isWeekend ? (defaultWeekendRate || defaultRate) : defaultRate;
    result.rateType = result.isWeekend ? 'default-weekend' : 'default';
  }

  return result;
};

/**
 * Calculate rates for a date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Object} hotelRates - Hotel rate configuration
 * @returns {Object} - Rate calculation summary
 */
export const calculateStayRates = (startDate, endDate, hotelRates) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
  if (nights <= 0) {
    return {
      nights: 0,
      totalRate: 0,
      averageRate: 0,
      dailyRates: [],
      unavailableDates: [],
      available: false
    };
  }

  const dailyRates = [];
  const unavailableDates = [];
  let totalRate = 0;

  // Calculate rate for each night
  for (let i = 0; i < nights; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    const dayRate = calculateDayRate(currentDate, hotelRates);
    dailyRates.push(dayRate);
    
    if (!dayRate.available) {
      unavailableDates.push(dayRate);
    } else {
      totalRate += dayRate.rate;
    }
  }

  const available = unavailableDates.length === 0;
  const averageRate = available ? totalRate / nights : 0;

  return {
    nights,
    totalRate: available ? totalRate : 0,
    averageRate,
    dailyRates,
    unavailableDates,
    available,
    startDate: start,
    endDate: end
  };
};

/**
 * Get rate summary for display
 * @param {Object} rateCalculation - Result from calculateStayRates
 * @returns {Object} - Formatted rate summary
 */
export const getRateSummary = (rateCalculation) => {
  const {
    nights,
    totalRate,
    averageRate,
    dailyRates,
    unavailableDates,
    available
  } = rateCalculation;

  if (!available) {
    return {
      available: false,
      message: `Unavailable dates: ${unavailableDates.map(d => 
        d.blackout ? `${d.date.toLocaleDateString()} (${d.blackout.reason})` : d.date.toLocaleDateString()
      ).join(', ')}`
    };
  }

  // Group rates by type for summary
  const rateBreakdown = dailyRates.reduce((acc, day) => {
    const key = day.rateType;
    if (!acc[key]) {
      acc[key] = {
        nights: 0,
        totalRate: 0,
        rateType: key,
        description: getRateTypeDescription(key, day.seasonalRate)
      };
    }
    acc[key].nights++;
    acc[key].totalRate += day.rate;
    return acc;
  }, {});

  return {
    available: true,
    nights,
    totalRate,
    averageRate: Math.round(averageRate),
    rateBreakdown: Object.values(rateBreakdown),
    weekendNights: dailyRates.filter(d => d.isWeekend).length,
    weekdayNights: dailyRates.filter(d => !d.isWeekend).length
  };
};

/**
 * Get human-readable description for rate type
 * @param {string} rateType - Rate type identifier
 * @param {Object} seasonalRate - Seasonal rate object if applicable
 * @returns {string} - Human-readable description
 */
const getRateTypeDescription = (rateType, seasonalRate = null) => {
  switch (rateType) {
    case 'default':
      return 'Regular Rate';
    case 'default-weekend':
      return 'Weekend Rate';
    case 'seasonal-peak':
      return seasonalRate?.description || 'Peak Season';
    case 'seasonal-high':
      return seasonalRate?.description || 'High Season';
    case 'seasonal-regular':
      return seasonalRate?.description || 'Regular Season';
    case 'seasonal-low':
      return seasonalRate?.description || 'Low Season';
    default:
      return 'Special Rate';
  }
};

/**
 * Validate rate configuration
 * @param {Object} rateConfig - Rate configuration to validate
 * @returns {Object} - Validation result
 */
export const validateRateConfig = (rateConfig) => {
  const errors = [];
  const warnings = [];

  const {
    defaultRate,
    defaultWeekendRate,
    seasonalRates = [],
    blackoutDates = []
  } = rateConfig;

  // Validate default rates
  if (!defaultRate || defaultRate <= 0) {
    errors.push('Default rate must be greater than 0');
  }

  if (defaultWeekendRate && defaultWeekendRate < defaultRate) {
    warnings.push('Weekend rate is lower than default rate');
  }

  // Validate seasonal rates
  seasonalRates.forEach((rate, index) => {
    if (!rate.startDate || !rate.endDate) {
      errors.push(`Seasonal rate ${index + 1}: Start and end dates are required`);
    }
    
    if (new Date(rate.startDate) >= new Date(rate.endDate)) {
      errors.push(`Seasonal rate ${index + 1}: Start date must be before end date`);
    }
    
    if (!rate.baseRate || rate.baseRate <= 0) {
      errors.push(`Seasonal rate ${index + 1}: Base rate must be greater than 0`);
    }
  });

  // Check for overlapping seasonal rates
  for (let i = 0; i < seasonalRates.length; i++) {
    for (let j = i + 1; j < seasonalRates.length; j++) {
      const rate1 = seasonalRates[i];
      const rate2 = seasonalRates[j];
      
      const start1 = new Date(rate1.startDate);
      const end1 = new Date(rate1.endDate);
      const start2 = new Date(rate2.startDate);
      const end2 = new Date(rate2.endDate);
      
      if ((start1 <= end2 && end1 >= start2)) {
        warnings.push(`Seasonal rates ${i + 1} and ${j + 1} have overlapping dates`);
      }
    }
  }

  // Validate blackout dates
  blackoutDates.forEach((blackout, index) => {
    if (!blackout.startDate || !blackout.endDate) {
      errors.push(`Blackout period ${index + 1}: Start and end dates are required`);
    }
    
    if (new Date(blackout.startDate) >= new Date(blackout.endDate)) {
      errors.push(`Blackout period ${index + 1}: Start date must be before end date`);
    }
    
    if (!blackout.reason) {
      warnings.push(`Blackout period ${index + 1}: Reason is recommended`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

export default {
  isBlackoutDate,
  getSeasonalRate,
  isWeekend,
  calculateDayRate,
  calculateStayRates,
  getRateSummary,
  validateRateConfig
};