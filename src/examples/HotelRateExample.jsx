import React, { useState } from 'react';
import { motion } from 'framer-motion';
import HotelRateDisplay from '../Components/Hotels/display/HotelRateDisplay';
import { FiCalendar, FiSearch } from 'react-icons/fi';

/**
 * Example component demonstrating hotel rate management
 * Shows how seasonal rates and blackout dates work
 */
const HotelRateExample = () => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(0);

  // Sample hotel data with different rate configurations
  const sampleHotels = [
    {
      id: 1,
      name: "Kashmir Crown Hotel",
      location: "Srinagar, Kashmir",
      defaultRate: 3000,
      defaultWeekendRate: 3500,
      seasonalRates: [
        {
          id: 1,
          season: 'peak',
          description: 'Summer Tourist Season',
          startDate: '2024-05-01',
          endDate: '2024-08-31',
          baseRate: 5000,
          weekendRate: 6000
        },
        {
          id: 2,
          season: 'high',
          description: 'Spring & Autumn',
          startDate: '2024-03-01',
          endDate: '2024-04-30',
          baseRate: 4000,
          weekendRate: 4500
        },
        {
          id: 3,
          season: 'low',
          description: 'Winter Season',
          startDate: '2024-12-01',
          endDate: '2025-02-28',
          baseRate: 2000,
          weekendRate: 2500
        }
      ],
      blackoutDates: [
        {
          id: 1,
          startDate: '2024-07-15',
          endDate: '2024-07-20',
          reason: 'Annual Maintenance'
        },
        {
          id: 2,
          startDate: '2024-12-24',
          endDate: '2024-12-26',
          reason: 'Private Event'
        }
      ]
    },
    {
      id: 2,
      name: "Gulmarg Ski Resort",
      location: "Gulmarg, Kashmir",
      defaultRate: 4000,
      defaultWeekendRate: 5000,
      seasonalRates: [
        {
          id: 1,
          season: 'peak',
          description: 'Ski Season',
          startDate: '2024-12-15',
          endDate: '2025-03-15',
          baseRate: 8000,
          weekendRate: 10000
        },
        {
          id: 2,
          season: 'high',
          description: 'Summer Meadows',
          startDate: '2024-06-01',
          endDate: '2024-09-30',
          baseRate: 6000,
          weekendRate: 7000
        }
      ],
      blackoutDates: [
        {
          id: 1,
          startDate: '2024-11-01',
          endDate: '2024-11-30',
          reason: 'Pre-season Preparation'
        }
      ]
    },
    {
      id: 3,
      name: "Dal Lake Heritage Hotel",
      location: "Srinagar, Kashmir",
      defaultRate: 2500,
      defaultWeekendRate: 3000,
      seasonalRates: [
        {
          id: 1,
          season: 'peak',
          description: 'Tulip Festival & Summer',
          startDate: '2024-04-01',
          endDate: '2024-09-30',
          baseRate: 4500,
          weekendRate: 5500
        }
      ],
      blackoutDates: []
    }
  ];

  const currentHotel = sampleHotels[selectedHotel];

  const handleRateCalculated = (calculation, summary) => {
    console.log('Rate calculation:', calculation);
    console.log('Rate summary:', summary);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Hotel Rate Management System
        </h1>
        <p className="text-gray-600">
          Seasonal pricing and blackout date management for hotels
        </p>
      </div>

      {/* Hotel Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Hotel</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleHotels.map((hotel, index) => (
            <motion.button
              key={hotel.id}
              onClick={() => setSelectedHotel(index)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedHotel === index
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="font-semibold text-gray-800">{hotel.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{hotel.location}</p>
              <div className="text-xs text-gray-500">
                <p>Base Rate: ₹{hotel.defaultRate}/night</p>
                <p>Seasonal Rates: {hotel.seasonalRates.length}</p>
                <p>Blackout Periods: {hotel.blackoutDates.length}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiCalendar className="mr-2" />
          Select Dates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Date
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out Date
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate || new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              // Trigger rate calculation (handled by HotelRateDisplay component)
            }}
            disabled={!checkInDate || !checkOutDate}
            className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <FiSearch size={16} />
            <span>Check Rates</span>
          </button>
        </div>
      </div>

      {/* Hotel Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotel Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {currentHotel.name}
          </h2>
          <p className="text-gray-600 mb-4">{currentHotel.location}</p>
          
          <div className="space-y-4">
            {/* Default Rates */}
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Default Rates</h3>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Weekday Rate:</span>
                  <span className="font-medium">₹{currentHotel.defaultRate}/night</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Weekend Rate:</span>
                  <span className="font-medium">₹{currentHotel.defaultWeekendRate}/night</span>
                </div>
              </div>
            </div>

            {/* Seasonal Rates */}
            {currentHotel.seasonalRates.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Seasonal Rates</h3>
                <div className="space-y-2">
                  {currentHotel.seasonalRates.map((rate) => (
                    <div key={rate.id} className="bg-blue-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-blue-800 capitalize">
                          {rate.season} Season
                        </span>
                        <span className="text-xs text-blue-600">
                          {new Date(rate.startDate).toLocaleDateString()} - {new Date(rate.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-blue-700 mb-2">{rate.description}</p>
                      <div className="flex justify-between text-sm">
                        <span>₹{rate.baseRate} - ₹{rate.weekendRate}/night</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blackout Dates */}
            {currentHotel.blackoutDates.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Blackout Periods</h3>
                <div className="space-y-2">
                  {currentHotel.blackoutDates.map((blackout) => (
                    <div key={blackout.id} className="bg-red-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-red-800">
                          {blackout.reason}
                        </span>
                        <span className="text-xs text-red-600">
                          {new Date(blackout.startDate).toLocaleDateString()} - {new Date(blackout.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rate Display */}
        <div>
          <HotelRateDisplay
            hotelRates={currentHotel}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            onRateCalculated={handleRateCalculated}
          />
        </div>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Rate Management Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <FiCalendar className="text-blue-600" size={20} />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Seasonal Pricing</h3>
            <p className="text-sm text-gray-600">Peak, high, regular, and low season rates</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <FiCalendar className="text-green-600" size={20} />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Weekend Rates</h3>
            <p className="text-sm text-gray-600">Higher rates for Friday & Saturday nights</p>
          </div>
          <div className="text-center">
            <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <FiCalendar className="text-red-600" size={20} />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Blackout Dates</h3>
            <p className="text-sm text-gray-600">Block dates for maintenance or events</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <FiCalendar className="text-purple-600" size={20} />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Dynamic Calculation</h3>
            <p className="text-sm text-gray-600">Real-time rate calculation for any date range</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelRateExample;