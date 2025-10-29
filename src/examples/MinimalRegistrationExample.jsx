/**
 * MINIMAL EXAMPLE: Hotel Registration with Firebase
 * Copy this code to test the registration system
 */

import React, { useState } from 'react';
import HotelRegistrationForm from '../Components/Hotels/auth/HotelRegistrationForm';

function MinimalExample() {
  const [showRegister, setShowRegister] = useState(false);

  const handleSuccess = (result) => {
    console.log('✅ SUCCESS! Data saved to Firebase:', result);
    
    // Show success message
    alert(`
      🎉 Registration Successful!
      
      User ID: ${result.userId}
      Email: ${result.email}
      Registration ID: ${result.registrationId}
      
      ✅ User created in Firebase Authentication
      ✅ Data saved to Firestore
      ✅ Verification email sent to ${result.email}
      
      Check Firebase Console to see your data!
    `);
    
    setShowRegister(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Hotel Registration System
          </h1>
          <p className="text-gray-600">
            Connected to Firebase - Ready to accept registrations
          </p>
        </div>

        {/* Register Button */}
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="mb-6">
            <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Firebase Connected!
            </h2>
            <p className="text-gray-600">
              Your .env keys are configured. Registration data will be saved to Firebase.
            </p>
          </div>

          <button
            onClick={() => setShowRegister(true)}
            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Register Your Hotel
          </button>

          <div className="mt-8 text-left bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-3">What happens when you register?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Creates user account in Firebase Authentication</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Saves complete data to Firestore (hotelRegistrations collection)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Sends email verification to registered email</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Sets status as "pending" for admin approval</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Returns registration ID and user ID</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <InfoCard 
            icon="🔐"
            title="Firebase Auth"
            description="User accounts created automatically"
          />
          <InfoCard 
            icon="💾"
            title="Firestore Database"
            description="Data stored in hotelRegistrations"
          />
          <InfoCard 
            icon="📧"
            title="Email Verification"
            description="Automatic verification emails"
          />
        </div>
      </div>

      {/* Registration Modal */}
      <HotelRegistrationForm
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

// Helper component
function InfoCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

export default MinimalExample;
