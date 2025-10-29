import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCalendar, FiDollarSign, FiInfo, FiAlertTriangle,
  FiCheck, FiX, FiTrendingUp, FiTrendingDown
} from 'react-icons/fi';
import { calculateStayRates, getRateSummary } from '../../../utils/hotelRateUtils';

const HotelRateDisplay = ({ 
  hotelRates, 
  checkInDate, 
  checkOutDate, 
  onRateCalculated 
}) => {
  const [rateCalculation, setRateCalculation] = useState(null);
  const [rateSummary, setRateSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (checkInDate && checkOutDate && hotelRates) {
      calculateRates();
    }
  }, [checkInDate, checkOutDate, hotelRates]);

  const calculateRates = async () => {
    setLoading(true);
    
    try {
      const calculation = calculateStayRates(checkInDate, checkOutDate, hotelRates);
      const summary = getRateSummary(calculation);
      
      setRateCalculation(calculation);
      setRateSummary(summary);
      
      // Notify parent component
      onRateCalculated?.(calculation, summary);
    } catch (error) {
      console.error('Rate calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!rateSummary) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
        <FiCalendar className="mx-auto text-gray-400 mb-2" size={24} />
        <p className="text-gray-600">Select check-in and check-out dates to view rates</p>
      </div>
    );
  }

  if (!rateSummary.available) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-lg p-6"
      >
        <div className="flex items-start space-x-3">
          <FiX className="text-red-500 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-red-800 mb-2">Unavailable Dates</h3>
            <p className="text-red-700 text-sm">{rateSummary.message}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiCheck size={20} />
            <h3 className="font-semibold">Available</h3>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">{rateSummary.nights} nights</p>
            <p className="text-2xl font-bold">{formatCurrency(rateSummary.totalRate)}</p>
          </div>
        </div>
      </div>

      {/* Rate Breakdown */}
      <div className="p-4 space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-600">Average/Night</p>
            <p className="font-semibold text-blue-800">{formatCurrency(rateSummary.averageRate)}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-sm text-purple-600">Weekdays</p>
            <p className="font-semibold text-purple-800">{rateSummary.weekdayNights} nights</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-sm text-orange-600">Weekends</p>
            <p className="font-semibold text-orange-800">{rateSummary.weekendNights} nights</p>
          </div>
        </div>

        {/* Rate Breakdown by Type */}
        {rateSummary.rateBreakdown.length > 1 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800 flex items-center">
              <FiInfo className="mr-2" size={16} />
              Rate Breakdown
            </h4>
            {rateSummary.rateBreakdown.map((breakdown, index) => (
              <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{breakdown.description}</span>
                  <span className="text-xs text-gray-500">({breakdown.nights} nights)</span>
                </div>
                <span className="font-semibold">{formatCurrency(breakdown.totalRate)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Daily Rate Calendar */}
        {rateCalculation && rateCalculation.dailyRates.length <= 14 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800 flex items-center">
              <FiCalendar className="mr-2" size={16} />
              Daily Rates
            </h4>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {rateCalculation.dailyRates.map((day, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {day.date.toLocaleDateString('en-IN', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    {day.isWeekend && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        Weekend
                      </span>
                    )}
                    {day.seasonalRate && (
                      <span className={`text-xs px-2 py-1 rounded-full ${getSeasonBadgeColor(day.seasonalRate.season)}`}>
                        {day.seasonalRate.season}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{formatCurrency(day.rate)}</span>
                    {day.rate > (hotelRates.defaultRate || 0) && (
                      <FiTrendingUp className="text-red-500" size={14} />
                    )}
                    {day.rate < (hotelRates.defaultRate || 0) && (
                      <FiTrendingDown className="text-green-500" size={14} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seasonal Rate Info */}
        {hotelRates.seasonalRates && hotelRates.seasonalRates.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
              <FiInfo className="mr-2" size={16} />
              Seasonal Pricing Available
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {hotelRates.seasonalRates.map((rate, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-blue-700">{rate.season} season:</span>
                  <span className="font-medium text-blue-800">
                    {formatCurrency(rate.baseRate)} - {formatCurrency(rate.weekendRate)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blackout Dates Warning */}
        {hotelRates.blackoutDates && hotelRates.blackoutDates.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
              <FiAlertTriangle className="mr-2" size={16} />
              Blackout Periods
            </h4>
            <div className="space-y-1 text-xs">
              {hotelRates.blackoutDates.map((blackout, index) => (
                <div key={index} className="text-yellow-700">
                  {new Date(blackout.startDate).toLocaleDateString()} - {new Date(blackout.endDate).toLocaleDateString()}: {blackout.reason}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const getSeasonBadgeColor = (season) => {
  switch (season) {
    case 'peak':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'regular':
      return 'bg-blue-100 text-blue-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default HotelRateDisplay;