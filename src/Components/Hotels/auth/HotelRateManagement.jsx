import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCalendar, FiDollarSign, FiPlus, FiTrash2, 
  FiAlertCircle, FiSave, FiX 
} from 'react-icons/fi';

const HotelRateManagement = ({ 
  rates = [], 
  blackoutDates = [], 
  extraBedRates = [],
  cwnbRates = [],
  onRatesChange, 
  onBlackoutDatesChange,
  onExtraBedRatesChange,
  onCwnbRatesChange
}) => {
  const [activeTab, setActiveTab] = useState('seasonal');
  const [newRate, setNewRate] = useState({
    season: '',
    startDate: '',
    endDate: '',
    baseRate: '',
    weekendRate: '',
    description: ''
  });
  const [newBlackoutDate, setNewBlackoutDate] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [newExtraBedRate, setNewExtraBedRate] = useState({
    roomType: '',
    rate: '',
    description: ''
  });
  const [newCwnbRate, setNewCwnbRate] = useState({
    ageGroup: '',
    rate: '',
    description: ''
  });

  // Debug logs to help identify issues
  useEffect(() => {
    console.log('HotelRateManagement Debug:', {
      ratesCount: rates.length,
      blackoutDatesCount: blackoutDates.length,
      extraBedRatesCount: extraBedRates.length,
      cwnbRatesCount: cwnbRates.length,
      handlers: {
        onRatesChange: !!onRatesChange,
        onBlackoutDatesChange: !!onBlackoutDatesChange,
        onExtraBedRatesChange: !!onExtraBedRatesChange,
        onCwnbRatesChange: !!onCwnbRatesChange
      }
    });
  }, [rates, blackoutDates, extraBedRates, cwnbRates]);

  const seasons = [
    { value: 'peak', label: 'Peak Season', color: 'bg-red-100 text-red-800' },
    { value: 'high', label: 'High Season', color: 'bg-orange-100 text-orange-800' },
    { value: 'regular', label: 'Regular Season', color: 'bg-blue-100 text-blue-800' },
    { value: 'low', label: 'Low Season', color: 'bg-green-100 text-green-800' }
  ];

  const addRate = () => {
    console.log('Adding rate:', newRate);
    
    if (!newRate.season || !newRate.startDate || !newRate.endDate || !newRate.baseRate) {
      alert('Please fill in all required fields: Season, Start Date, End Date, and Base Rate');
      return;
    }
    
    if (!onRatesChange) {
      console.error('onRatesChange handler is not provided');
      alert('Rate change handler not available. Please check parent component implementation.');
      return;
    }

    try {
      const rate = {
        id: Date.now().toString(),
        ...newRate,
        baseRate: parseFloat(newRate.baseRate) || 0,
        weekendRate: parseFloat(newRate.weekendRate) || parseFloat(newRate.baseRate) || 0
      };

      console.log('New rate object:', rate);
      onRatesChange([...rates, rate]);
      
      // Reset form
      setNewRate({
        season: '',
        startDate: '',
        endDate: '',
        baseRate: '',
        weekendRate: '',
        description: ''
      });
      
      console.log('Rate added successfully');
    } catch (error) {
      console.error('Error adding rate:', error);
      alert('Error adding rate. Please check the console for details.');
    }
  };

  const removeRate = (id) => {
    console.log('Removing rate with id:', id);
    if (!onRatesChange) {
      console.error('onRatesChange handler is not provided');
      return;
    }
    onRatesChange(rates.filter(rate => rate.id !== id));
  };

  const addBlackoutDate = () => {
    console.log('Adding blackout date:', newBlackoutDate);
    
    if (!newBlackoutDate.startDate || !newBlackoutDate.endDate) {
      alert('Please fill in Start Date and End Date');
      return;
    }
    
    if (!onBlackoutDatesChange) {
      console.error('onBlackoutDatesChange handler is not provided');
      alert('Blackout dates change handler not available. Please check parent component implementation.');
      return;
    }

    try {
      const blackoutDate = {
        id: Date.now().toString(),
        ...newBlackoutDate,
        reason: newBlackoutDate.reason || 'No reason provided'
      };

      console.log('New blackout date object:', blackoutDate);
      onBlackoutDatesChange([...blackoutDates, blackoutDate]);
      
      // Reset form
      setNewBlackoutDate({
        startDate: '',
        endDate: '',
        reason: ''
      });
      
      console.log('Blackout date added successfully');
    } catch (error) {
      console.error('Error adding blackout date:', error);
      alert('Error adding blackout date. Please check the console for details.');
    }
  };

  const removeBlackoutDate = (id) => {
    console.log('Removing blackout date with id:', id);
    if (!onBlackoutDatesChange) {
      console.error('onBlackoutDatesChange handler is not provided');
      return;
    }
    onBlackoutDatesChange(blackoutDates.filter(date => date.id !== id));
  };

  const addExtraBedRate = () => {
    console.log('Adding extra bed rate:', newExtraBedRate);
    
    if (!newExtraBedRate.roomType || !newExtraBedRate.rate) {
      alert('Please fill in Room Type and Rate');
      return;
    }
    
    if (!onExtraBedRatesChange) {
      console.error('onExtraBedRatesChange handler is not provided');
      alert('Extra bed rates change handler not available. Please check parent component implementation.');
      return;
    }

    try {
      const extraBedRate = {
        id: Date.now().toString(),
        ...newExtraBedRate,
        rate: parseFloat(newExtraBedRate.rate) || 0
      };

      console.log('New extra bed rate object:', extraBedRate);
      onExtraBedRatesChange([...extraBedRates, extraBedRate]);
      
      // Reset form
      setNewExtraBedRate({
        roomType: '',
        rate: '',
        description: ''
      });
      
      console.log('Extra bed rate added successfully');
    } catch (error) {
      console.error('Error adding extra bed rate:', error);
      alert('Error adding extra bed rate. Please check the console for details.');
    }
  };

  const removeExtraBedRate = (id) => {
    console.log('Removing extra bed rate with id:', id);
    if (!onExtraBedRatesChange) {
      console.error('onExtraBedRatesChange handler is not provided');
      return;
    }
    onExtraBedRatesChange(extraBedRates.filter(rate => rate.id !== id));
  };

  const addCwnbRate = () => {
    console.log('Adding CWNB rate:', newCwnbRate);
    
    if (!newCwnbRate.ageGroup || !newCwnbRate.rate) {
      alert('Please fill in Age Group and Rate');
      return;
    }
    
    if (!onCwnbRatesChange) {
      console.error('onCwnbRatesChange handler is not provided');
      alert('CWNB rates change handler not available. Please check parent component implementation.');
      return;
    }

    try {
      const cwnbRate = {
        id: Date.now().toString(),
        ...newCwnbRate,
        rate: parseFloat(newCwnbRate.rate) || 0
      };

      console.log('New CWNB rate object:', cwnbRate);
      onCwnbRatesChange([...cwnbRates, cwnbRate]);
      
      // Reset form
      setNewCwnbRate({
        ageGroup: '',
        rate: '',
        description: ''
      });
      
      console.log('CWNB rate added successfully');
    } catch (error) {
      console.error('Error adding CWNB rate:', error);
      alert('Error adding CWNB rate. Please check the console for details.');
    }
  };

  const removeCwnbRate = (id) => {
    console.log('Removing CWNB rate with id:', id);
    if (!onCwnbRatesChange) {
      console.error('onCwnbRatesChange handler is not provided');
      return;
    }
    onCwnbRatesChange(cwnbRates.filter(rate => rate.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('seasonal')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'seasonal'
              ? 'bg-white text-rose-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FiDollarSign className="inline mr-2" />
          Seasonal Rates
        </button>
        <button
          onClick={() => setActiveTab('blackout')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'blackout'
              ? 'bg-white text-rose-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FiX className="inline mr-2" />
          Blackout Dates
        </button>
        <button
          onClick={() => setActiveTab('extrabed')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'extrabed'
              ? 'bg-white text-rose-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FiPlus className="inline mr-2" />
          Extra Bed Rates
        </button>
        <button
          onClick={() => setActiveTab('cwnb')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'cwnb'
              ? 'bg-white text-rose-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FiDollarSign className="inline mr-2" />
          CWNB Rates
        </button>
      </div>

      {/* Seasonal Rates Tab */}
      {activeTab === 'seasonal' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Add New Rate Form */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Seasonal Rate</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Season Type *
                </label>
                <select
                  value={newRate.season}
                  onChange={(e) => setNewRate({...newRate, season: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="">Select Season</option>
                  {seasons.map(season => (
                    <option key={season.value} value={season.value}>
                      {season.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newRate.description}
                  onChange={(e) => setNewRate({...newRate, description: e.target.value})}
                  placeholder="e.g., Summer holidays, Festival season"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={newRate.startDate}
                  onChange={(e) => setNewRate({...newRate, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={newRate.endDate}
                  onChange={(e) => setNewRate({...newRate, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Rate (₹/night) *
                </label>
                <input
                  type="number"
                  value={newRate.baseRate}
                  onChange={(e) => setNewRate({...newRate, baseRate: e.target.value})}
                  placeholder="2000"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekend Rate (₹/night)
                </label>
                <input
                  type="number"
                  value={newRate.weekendRate}
                  onChange={(e) => setNewRate({...newRate, weekendRate: e.target.value})}
                  placeholder="2500"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={addRate}
              className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newRate.season || !newRate.startDate || !newRate.endDate || !newRate.baseRate}
            >
              <FiPlus size={16} />
              <span>Add Rate</span>
            </button>
          </div>

          {/* Existing Rates */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Current Seasonal Rates</h3>
            
            {rates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiDollarSign size={48} className="mx-auto mb-4 opacity-50" />
                <p>No seasonal rates configured yet</p>
              </div>
            ) : (
              rates.map((rate) => {
                const season = seasons.find(s => s.value === rate.season);
                return (
                  <motion.div
                    key={rate.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${season?.color}`}>
                            {season?.label}
                          </span>
                          {rate.description && (
                            <span className="text-sm text-gray-600">{rate.description}</span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Period:</span>
                            <p className="font-medium">
                              {new Date(rate.startDate).toLocaleDateString()} - {new Date(rate.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Base Rate:</span>
                            <p className="font-medium text-green-600">₹{rate.baseRate}/night</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Weekend Rate:</span>
                            <p className="font-medium text-blue-600">₹{rate.weekendRate}/night</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Difference:</span>
                            <p className="font-medium text-orange-600">
                              +₹{rate.weekendRate - rate.baseRate}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeRate(rate.id)}
                        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      )}

      {/* Blackout Dates Tab */}
      {activeTab === 'blackout' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Add New Blackout Date Form */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Blackout Period</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={newBlackoutDate.startDate}
                  onChange={(e) => setNewBlackoutDate({...newBlackoutDate, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={newBlackoutDate.endDate}
                  onChange={(e) => setNewBlackoutDate({...newBlackoutDate, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <input
                  type="text"
                  value={newBlackoutDate.reason}
                  onChange={(e) => setNewBlackoutDate({...newBlackoutDate, reason: e.target.value})}
                  placeholder="e.g., Maintenance, Private event"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={addBlackoutDate}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newBlackoutDate.startDate || !newBlackoutDate.endDate}
            >
              <FiPlus size={16} />
              <span>Add Blackout Period</span>
            </button>
          </div>

          {/* Existing Blackout Dates */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Current Blackout Periods</h3>
            
            {blackoutDates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiCalendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>No blackout periods configured</p>
              </div>
            ) : (
              blackoutDates.map((blackout) => (
                <motion.div
                  key={blackout.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-red-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Blackout Period
                        </span>
                        <span className="text-sm text-gray-600">{blackout.reason}</span>
                      </div>
                      
                      <p className="text-sm font-medium">
                        {new Date(blackout.startDate).toLocaleDateString()} - {new Date(blackout.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => removeBlackoutDate(blackout.id)}
                      className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* Extra Bed Rates Tab */}
      {activeTab === 'extrabed' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Add New Extra Bed Rate Form */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Extra Bed Rate</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type *
                </label>
                <select
                  value={newExtraBedRate.roomType}
                  onChange={(e) => setNewExtraBedRate({...newExtraBedRate, roomType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="">Select Room Type</option>
                  <option value="standard">Standard Room</option>
                  <option value="deluxe">Deluxe Room</option>
                  <option value="suite">Suite</option>
                  <option value="family">Family Room</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extra Bed Rate (₹/night) *
                </label>
                <input
                  type="number"
                  value={newExtraBedRate.rate}
                  onChange={(e) => setNewExtraBedRate({...newExtraBedRate, rate: e.target.value})}
                  placeholder="500"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newExtraBedRate.description}
                  onChange={(e) => setNewExtraBedRate({...newExtraBedRate, description: e.target.value})}
                  placeholder="e.g., Rollaway bed, Sofa bed"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={addExtraBedRate}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newExtraBedRate.roomType || !newExtraBedRate.rate}
            >
              <FiPlus size={16} />
              <span>Add Extra Bed Rate</span>
            </button>
          </div>

          {/* Existing Extra Bed Rates */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Current Extra Bed Rates</h3>
            
            {extraBedRates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiPlus size={48} className="mx-auto mb-4 opacity-50" />
                <p>No extra bed rates configured yet</p>
              </div>
            ) : (
              extraBedRates.map((rate) => (
                <motion.div
                  key={rate.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {rate.roomType.charAt(0).toUpperCase() + rate.roomType.slice(1)} Room
                        </span>
                        {rate.description && (
                          <span className="text-sm text-gray-600">{rate.description}</span>
                        )}
                      </div>
                      
                      <p className="text-lg font-semibold text-green-600">₹{rate.rate}/night</p>
                    </div>
                    
                    <button
                      onClick={() => removeExtraBedRate(rate.id)}
                      className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* CWNB Rates Tab */}
      {activeTab === 'cwnb' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Add New CWNB Rate Form */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add CWNB (Child With No Bed) Rate</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Group *
                </label>
                <select
                  value={newCwnbRate.ageGroup}
                  onChange={(e) => setNewCwnbRate({...newCwnbRate, ageGroup: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="">Select Age Group</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-12">6-12 years</option>
                  <option value="13-17">13-17 years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CWNB Rate (₹/night) *
                </label>
                <input
                  type="number"
                  value={newCwnbRate.rate}
                  onChange={(e) => setNewCwnbRate({...newCwnbRate, rate: e.target.value})}
                  placeholder="200"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newCwnbRate.description}
                  onChange={(e) => setNewCwnbRate({...newCwnbRate, description: e.target.value})}
                  placeholder="e.g., Includes breakfast, No bed provided"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={addCwnbRate}
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newCwnbRate.ageGroup || !newCwnbRate.rate}
            >
              <FiPlus size={16} />
              <span>Add CWNB Rate</span>
            </button>
          </div>

          {/* Existing CWNB Rates */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Current CWNB Rates</h3>
            
            {cwnbRates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiDollarSign size={48} className="mx-auto mb-4 opacity-50" />
                <p>No CWNB rates configured yet</p>
              </div>
            ) : (
              cwnbRates.map((rate) => (
                <motion.div
                  key={rate.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          Age {rate.ageGroup}
                        </span>
                        {rate.description && (
                          <span className="text-sm text-gray-600">{rate.description}</span>
                        )}
                      </div>
                      
                      <p className="text-lg font-semibold text-purple-600">₹{rate.rate}/night</p>
                    </div>
                    
                    <button
                      onClick={() => removeCwnbRate(rate.id)}
                      className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <FiAlertCircle className="text-blue-600 mt-0.5" size={16} />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Rate Management Tips:</p>
            <ul className="space-y-1 text-xs">
              <li>• Seasonal rates help maximize revenue during peak periods</li>
              <li>• Weekend rates typically 20-30% higher than weekday rates</li>
              <li>• Blackout dates prevent bookings during maintenance or private events</li>
              <li>• Extra bed rates apply when guests request additional bedding</li>
              <li>• CWNB rates are for children sharing parents' bed without extra bedding</li>
              <li>• Ensure rate periods don't overlap to avoid conflicts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelRateManagement;