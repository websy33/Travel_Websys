import React, { useState } from 'react';
import HotelRegistrationForm from './HotelRegistrationForm';

/**
 * Debug component to test Rate Management functionality
 */
const RateManagementDebug = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = (result) => {
    console.log('Registration successful:', result);
    alert('Registration completed successfully!');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Rate Management Debug</h1>
      
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Open Hotel Registration Form
      </button>

      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h2 className="font-semibold mb-2">Debug Instructions:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Open Hotel Registration Form" above</li>
          <li>Fill in the first two steps (Personal & Hotel Information)</li>
          <li>On Step 3 (Rate Management), try entering a default rate</li>
          <li>Check browser console for debug logs</li>
          <li>Try both "Next Step" and "Skip & Use Defaults" buttons</li>
        </ol>
      </div>

      <HotelRegistrationForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default RateManagementDebug;