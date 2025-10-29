import React, { useState } from 'react';
import HotelRegistrationForm from './Hotels/auth/HotelRegistrationForm';

const HotelRegistration = ({ onSuccess, onError }) => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(true);

  const handleSuccess = (result) => {
    setShowRegistrationForm(false);
    onSuccess?.(result);
  };

  const handleClose = () => {
    setShowRegistrationForm(false);
  };

  return (
    <HotelRegistrationForm
      isOpen={showRegistrationForm}
      onClose={handleClose}
      onSuccess={handleSuccess}
    />
  );
};

export default HotelRegistration;