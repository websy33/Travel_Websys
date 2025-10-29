import React from 'react';
import HotelRegistrationForm from './HotelRegistrationForm';
import HotelDashboard from './HotelDashboard';

/**
 * Hotel Authentication Wrapper Component
 * Shows registration form for new users or dashboard for logged-in users
 */
const HotelAuthWrapper = ({ 
  isOpen, 
  onClose, 
  currentUser,
  isAuthenticated,
  userRole,
  // Registration props
  onRegistrationSuccess,
  // Dashboard props
  userHotels = [],
  pendingHotels = [],
  onUpdateProfile,
  onAddProperty,
  onEditProperty
}) => {
  // If user is authenticated as hotel, show dashboard
  if (isAuthenticated && userRole === 'hotel' && currentUser) {
    return (
      <HotelDashboard
        isOpen={isOpen}
        onClose={onClose}
        currentUser={currentUser}
        userHotels={userHotels}
        pendingHotels={pendingHotels}
        onUpdateProfile={onUpdateProfile}
        onAddProperty={onAddProperty}
        onEditProperty={onEditProperty}
      />
    );
  }

  // Otherwise show registration form
  return (
    <HotelRegistrationForm
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onRegistrationSuccess}
    />
  );
};

export default HotelAuthWrapper;