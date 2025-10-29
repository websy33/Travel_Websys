/**
 * Complete Example: Hotel Registration Integration
 * 
 * This example shows how to integrate the hotel registration
 * system into your existing Hotels.jsx or any other page.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Import the registration components
import HotelRegistrationForm from '../Components/Hotels/auth/HotelRegistrationForm';
import AdminLogin from '../Components/Hotels/auth/AdminLogin';

// Import utilities
import { 
  getPendingRegistrations,
  getApprovedHotelOwners,
  getRegistrationStats 
} from '../utils/hotelRegistration';

/**
 * Example 1: Simple Usage
 */
export function SimpleRegistrationExample() {
  const [showRegister, setShowRegister] = useState(false);

  const handleSuccess = (result) => {
    console.log('Registration successful!', result);
    alert(`Thank you! Please check ${result.email} for verification.`);
  };

  return (
    <div className="p-8">
      <button
        onClick={() => setShowRegister(true)}
        className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
      >
        Register Your Hotel
      </button>

      <HotelRegistrationForm
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

/**
 * Example 2: With Login Integration
 */
export function LoginAndRegisterExample() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setShowLogin(false);
    console.log('User logged in:', userData);
  };

  const handleRegistrationSuccess = (result) => {
    console.log('Registration successful:', result);
    setShowRegister(false);
    
    // Show success message
    alert('Registration successful! Please verify your email and login.');
    
    // Optionally open login modal after 2 seconds
    setTimeout(() => {
      setShowLogin(true);
    }, 2000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Hotel Management
            </h1>
            
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <span className="text-gray-700">
                    Welcome, <strong>{currentUser.name}</strong>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                  >
                    Register Hotel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {currentUser ? (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Dashboard
            </h2>
            <p className="text-gray-600">
              Welcome to your hotel management dashboard!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Get Started
            </h2>
            <p className="text-gray-600 mb-6">
              Register your hotel to start receiving bookings
            </p>
            <button
              onClick={() => setShowRegister(true)}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg"
            >
              Register Now
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AdminLogin
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <HotelRegistrationForm
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
}

/**
 * Example 3: Admin Dashboard with Pending Registrations
 */
export function AdminDashboardExample() {
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [approvedOwners, setApprovedOwners] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [pending, approved, statistics] = await Promise.all([
        getPendingRegistrations(),
        getApprovedHotelOwners(),
        getRegistrationStats()
      ]);

      setPendingRegistrations(pending);
      setApprovedOwners(approved);
      setStats(statistics);

    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading registrations. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Admin Dashboard
        </h1>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Registrations" value={stats.total} color="blue" />
          <StatCard title="Pending" value={stats.pending} color="amber" />
          <StatCard title="Approved" value={stats.approved} color="green" />
          <StatCard title="Rejected" value={stats.rejected} color="red" />
        </div>

        {/* Pending Registrations */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Pending Registrations ({pendingRegistrations.length})
          </h2>

          {pendingRegistrations.length === 0 ? (
            <p className="text-gray-600">No pending registrations</p>
          ) : (
            <div className="space-y-4">
              {pendingRegistrations.map((registration) => (
                <RegistrationCard key={registration.id} registration={registration} />
              ))}
            </div>
          )}
        </div>

        {/* Approved Owners */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Approved Hotel Owners ({approvedOwners.length})
          </h2>

          {approvedOwners.length === 0 ? (
            <p className="text-gray-600">No approved owners yet</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {approvedOwners.map((owner) => (
                <OwnerCard key={owner.id} owner={owner} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Components

const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: 'from-blue-50 to-cyan-50 border-blue-200 text-blue-800',
    amber: 'from-amber-50 to-orange-50 border-amber-200 text-amber-800',
    green: 'from-green-50 to-emerald-50 border-green-200 text-green-800',
    red: 'from-red-50 to-pink-50 border-red-200 text-red-800'
  };

  return (
    <div className={`bg-gradient-to-r ${colors[color]} rounded-xl border p-6`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

const RegistrationCard = ({ registration }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{registration.hotelName}</h3>
          <p className="text-sm text-gray-600">{registration.ownerName}</p>
          <p className="text-xs text-gray-500 mt-1">{registration.email}</p>
          
          <div className="mt-2 space-y-1 text-xs text-gray-600">
            <p><strong>Phone:</strong> {registration.phone}</p>
            <p><strong>Location:</strong> {registration.city}, {registration.pincode}</p>
            <p><strong>GST:</strong> {registration.gstNumber}</p>
            <p><strong>PAN:</strong> {registration.panNumber}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
            Approve
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

const OwnerCard = ({ owner }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800">{owner.hotelName}</h3>
      <p className="text-sm text-gray-600">{owner.ownerName}</p>
      <p className="text-xs text-gray-500 mt-1">{owner.city}</p>
      <div className="mt-2 pt-2 border-t border-gray-200">
        <span className="text-xs text-green-600 font-medium">✓ Approved</span>
      </div>
    </div>
  );
};

/**
 * Example 4: Testing Registration Programmatically
 */
export async function testRegistration() {
  const { registerHotel } = await import('../utils/hotelRegistration');

  const testData = {
    ownerName: "Test Owner",
    email: "test" + Date.now() + "@example.com", // Unique email
    password: "TestPass123",
    phone: "9876543210",
    hotelName: "Test Grand Hotel",
    address: "123 Test Street, Lal Chowk",
    city: "Srinagar",
    pincode: "190001",
    gstNumber: "22ABCDE1234F1Z5",
    panNumber: "ABCDE1234F",
    description: "A beautiful test hotel",
    website: "https://testhotel.com"
  };

  try {
    console.log('Testing registration with:', testData);
    const result = await registerHotel(testData);
    console.log('✅ Registration successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Registration failed:', error);
    throw error;
  }
}

// Export all examples
export default {
  SimpleRegistrationExample,
  LoginAndRegisterExample,
  AdminDashboardExample,
  testRegistration
};
