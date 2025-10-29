import React, { useState } from 'react';
import HotelRateManagement from './HotelRateManagement';

const RateManagementTest = () => {
  const [seasonalRates, setSeasonalRates] = useState([]);
  const [blackoutDates, setBlackoutDates] = useState([]);
  const [extraBedRates, setExtraBedRates] = useState([]);
  const [cwnbRates, setCwnbRates] = useState([]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Rate Management Test</h1>
      
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
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <p>Seasonal Rates: {seasonalRates.length}</p>
        <p>Blackout Dates: {blackoutDates.length}</p>
        <p>Extra Bed Rates: {extraBedRates.length}</p>
        <p>CWNB Rates: {cwnbRates.length}</p>
      </div>
    </div>
  );
};

export default RateManagementTest;