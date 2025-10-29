import React, { useState } from 'react';
import HotelRateManagement from './HotelRateManagement';

const RateTestComponent = () => {
  const [seasonalRates, setSeasonalRates] = useState([]);
  const [blackoutDates, setBlackoutDates] = useState([]);

  const handleRatesChange = (rates) => {
    console.log('Rates changed:', rates);
    setSeasonalRates(rates);
  };

  const handleBlackoutDatesChange = (dates) => {
    console.log('Blackout dates changed:', dates);
    setBlackoutDates(dates);
  };

  const showCurrentData = () => {
    console.log('Current seasonal rates:', seasonalRates);
    console.log('Current blackout dates:', blackoutDates);
    alert(`Seasonal Rates: ${seasonalRates.length}, Blackout Dates: ${blackoutDates.length}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Rate Management Test</h1>
      
      <HotelRateManagement
        rates={seasonalRates}
        blackoutDates={blackoutDates}
        onRatesChange={handleRatesChange}
        onBlackoutDatesChange={handleBlackoutDatesChange}
      />
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <button
          onClick={showCurrentData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show Current Data
        </button>
        
        <div className="mt-4 text-sm">
          <p>Seasonal Rates: {seasonalRates.length}</p>
          <p>Blackout Dates: {blackoutDates.length}</p>
        </div>
      </div>
    </div>
  );
};

export default RateTestComponent;