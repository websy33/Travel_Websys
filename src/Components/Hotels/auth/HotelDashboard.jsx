import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiUser, FiMail, FiPhone, FiMapPin, FiEdit, FiPlus,
  FiCalendar, FiDollarSign, FiSettings, FiEye, FiTrendingUp,
  FiClock, FiCheckCircle, FiAlertCircle, FiX, FiSave,
  FiCamera, FiUpload, FiTrash2, FiRefreshCw, FiFileText
} from 'react-icons/fi';
import { modalVariants } from '../../../utils/hotelAnimations';
import EnhancedInput from '../../common/EnhancedInput';
import { validationRules } from '../../../utils/hotelValidation';

/**
 * Hotel Dashboard Component
 * Shows hotel details and management options for logged-in hotel users
 */
const HotelDashboard = ({ 
  isOpen, 
  onClose, 
  currentUser,
  userHotels = [],
  pendingHotels = [],
  onUpdateProfile,
  onAddProperty,
  onEditProperty
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Profile edit state
  const [profileData, setProfileData] = useState({
    ownerName: currentUser?.ownerName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    alternatePhone: currentUser?.alternatePhone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    pincode: currentUser?.pincode || '',
    gstNumber: currentUser?.gstNumber || '',
    panNumber: currentUser?.panNumber || ''
  });

  const [errors, setErrors] = useState({});

  // Update profile data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        ownerName: currentUser.ownerName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        alternatePhone: currentUser.alternatePhone || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        pincode: currentUser.pincode || '',
        gstNumber: currentUser.gstNumber || '',
        panNumber: currentUser.panNumber || ''
      });
    }
  }, [currentUser]);

  // Handle profile input change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate profile data
  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailError = validationRules.email(profileData.email);
      if (emailError) newErrors.email = emailError;
    }

    if (!profileData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneError = validationRules.phone(profileData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    if (profileData.gstNumber && profileData.gstNumber.trim() !== '') {
      const gstError = validationRules.gstNumber(profileData.gstNumber);
      if (gstError) newErrors.gstNumber = gstError;
    }

    if (profileData.panNumber && profileData.panNumber.trim() !== '') {
      const panError = validationRules.panNumber(profileData.panNumber);
      if (panError) newErrors.panNumber = panError;
    }

    if (profileData.pincode && profileData.pincode.trim() !== '') {
      const pincodeError = validationRules.pincode(profileData.pincode);
      if (pincodeError) newErrors.pincode = pincodeError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle profile save
  const handleSaveProfile = async () => {
    if (!validateProfile()) {
      return;
    }

    setLoading(true);
    try {
      await onUpdateProfile?.(profileData);
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel profile edit
  const handleCancelEdit = () => {
    setProfileData({
      ownerName: currentUser?.ownerName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      alternatePhone: currentUser?.alternatePhone || '',
      address: currentUser?.address || '',
      city: currentUser?.city || '',
      pincode: currentUser?.pincode || '',
      gstNumber: currentUser?.gstNumber || '',
      panNumber: currentUser?.panNumber || ''
    });
    setErrors({});
    setEditMode(false);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: FiClock },
      approved: { color: 'bg-green-100 text-green-800 border-green-200', icon: FiCheckCircle },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: FiAlertCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="mr-1" size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl w-full max-w-6xl my-8 shadow-2xl max-h-[90vh] overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-pink-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-rose-100 text-rose-600 p-3 rounded-xl">
                  <FiHome size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Hotel Dashboard
                  </h2>
                  <p className="text-gray-600">
                    Welcome back, {currentUser?.ownerName || 'Hotel Owner'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mt-6 bg-white rounded-lg p-1">
              {[
                { id: 'overview', label: 'Overview', icon: FiTrendingUp },
                { id: 'profile', label: 'Profile', icon: FiUser },
                { id: 'properties', label: 'Properties', icon: FiHome },
                { id: 'settings', label: 'Settings', icon: FiSettings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Active Properties</p>
                        <p className="text-2xl font-bold text-blue-800">{userHotels.length}</p>
                      </div>
                      <div className="bg-blue-500 text-white p-3 rounded-lg">
                        <FiHome size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-600 text-sm font-medium">Pending Approval</p>
                        <p className="text-2xl font-bold text-yellow-800">{pendingHotels.length}</p>
                      </div>
                      <div className="bg-yellow-500 text-white p-3 rounded-lg">
                        <FiClock size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Account Status</p>
                        <p className="text-lg font-bold text-green-800">
                          {currentUser?.emailVerified ? 'Verified' : 'Unverified'}
                        </p>
                      </div>
                      <div className="bg-green-500 text-white p-3 rounded-lg">
                        <FiCheckCircle size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                      onClick={() => onAddProperty?.()}
                      className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="bg-rose-100 text-rose-600 p-2 rounded-lg">
                        <FiPlus size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">Add New Property</p>
                        <p className="text-sm text-gray-600">List a new hotel property</p>
                      </div>
                    </motion.button>

                    <motion.button
                      onClick={() => setActiveTab('profile')}
                      className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                        <FiEdit size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">Update Profile</p>
                        <p className="text-sm text-gray-600">Edit your account details</p>
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {pendingHotels.length > 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                        <FiClock className="text-yellow-600" size={16} />
                        <span className="text-sm text-yellow-800">
                          {pendingHotels.length} property(ies) awaiting admin approval
                        </span>
                      </div>
                    )}
                    {userHotels.length > 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <FiCheckCircle className="text-green-600" size={16} />
                        <span className="text-sm text-green-800">
                          {userHotels.length} property(ies) are live and accepting bookings
                        </span>
                      </div>
                    )}
                    {userHotels.length === 0 && pendingHotels.length === 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <FiHome className="text-gray-600" size={16} />
                        <span className="text-sm text-gray-600">
                          No properties listed yet. Add your first property to get started!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">Profile Information</h3>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                    >
                      <FiEdit size={16} />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {loading ? (
                          <FiRefreshCw className="animate-spin" size={16} />
                        ) : (
                          <FiSave size={16} />
                        )}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EnhancedInput
                      label="Full Name"
                      name="ownerName"
                      value={profileData.ownerName}
                      onChange={handleProfileChange}
                      placeholder="Enter your full name"
                      icon={FiUser}
                      error={errors.ownerName}
                      disabled={!editMode}
                      required
                    />

                    <EnhancedInput
                      label="Email Address"
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="your.email@example.com"
                      icon={FiMail}
                      error={errors.email}
                      disabled={!editMode}
                      required
                    />

                    <EnhancedInput
                      label="Phone Number"
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="10-digit mobile number"
                      icon={FiPhone}
                      error={errors.phone}
                      disabled={!editMode}
                      required
                    />

                    <EnhancedInput
                      label="Alternate Phone"
                      type="tel"
                      name="alternatePhone"
                      value={profileData.alternatePhone}
                      onChange={handleProfileChange}
                      placeholder="Alternative contact number"
                      icon={FiPhone}
                      disabled={!editMode}
                    />

                    <EnhancedInput
                      label="Address"
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      placeholder="Complete address"
                      icon={FiMapPin}
                      disabled={!editMode}
                    />

                    <EnhancedInput
                      label="City"
                      name="city"
                      value={profileData.city}
                      onChange={handleProfileChange}
                      placeholder="City"
                      disabled={!editMode}
                    />

                    <EnhancedInput
                      label="PIN Code"
                      name="pincode"
                      value={profileData.pincode}
                      onChange={handleProfileChange}
                      placeholder="6-digit PIN"
                      error={errors.pincode}
                      disabled={!editMode}
                    />

                    <EnhancedInput
                      label="GST Number"
                      name="gstNumber"
                      value={profileData.gstNumber}
                      onChange={handleProfileChange}
                      placeholder="22ABCDE1234F1Z5"
                      icon={FiFileText}
                      error={errors.gstNumber}
                      disabled={!editMode}
                    />

                    <EnhancedInput
                      label="PAN Number"
                      name="panNumber"
                      value={profileData.panNumber}
                      onChange={handleProfileChange}
                      placeholder="ABCDE1234F"
                      icon={FiFileText}
                      error={errors.panNumber}
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Properties Tab */}
            {activeTab === 'properties' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">My Properties</h3>
                  <button
                    onClick={() => onAddProperty?.()}
                    className="flex items-center space-x-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    <FiPlus size={16} />
                    <span>Add Property</span>
                  </button>
                </div>

                {/* Active Properties */}
                {userHotels.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <FiCheckCircle className="text-green-500 mr-2" size={20} />
                      Active Properties ({userHotels.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userHotels.map((hotel) => (
                        <div key={hotel.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="font-semibold text-gray-800">{hotel.name}</h5>
                              <p className="text-sm text-gray-600">{hotel.location}</p>
                            </div>
                            {getStatusBadge(hotel.status)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-rose-600">₹{hotel.price}/night</span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => onEditProperty?.(hotel)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <FiEdit size={16} />
                              </button>
                              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                <FiEye size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Properties */}
                {pendingHotels.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <FiClock className="text-yellow-500 mr-2" size={20} />
                      Pending Approval ({pendingHotels.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pendingHotels.map((hotel) => (
                        <div key={hotel.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="font-semibold text-gray-800">{hotel.name}</h5>
                              <p className="text-sm text-gray-600">{hotel.location}</p>
                            </div>
                            {getStatusBadge(hotel.status)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-yellow-600">₹{hotel.price}/night</span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => onEditProperty?.(hotel)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              >
                                <FiEdit size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Properties */}
                {userHotels.length === 0 && pendingHotels.length === 0 && (
                  <div className="bg-gray-50 rounded-xl p-12 text-center">
                    <div className="bg-gray-200 text-gray-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <FiHome size={32} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">No Properties Listed</h4>
                    <p className="text-gray-600 mb-6">Start by adding your first hotel property to get bookings.</p>
                    <button
                      onClick={() => onAddProperty?.()}
                      className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                    >
                      Add Your First Property
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-gray-800">Account Settings</h3>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Account Information</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Email Verification</p>
                        <p className="text-sm text-gray-600">
                          {currentUser?.emailVerified ? 'Your email is verified' : 'Please verify your email address'}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentUser?.emailVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {currentUser?.emailVerified ? 'Verified' : 'Unverified'}
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Account Type</p>
                        <p className="text-sm text-gray-600">Hotel Partner Account</p>
                      </div>
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Hotel Owner
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Member Since</p>
                        <p className="text-sm text-gray-600">
                          {currentUser?.registrationDate 
                            ? new Date(currentUser.registrationDate).toLocaleDateString()
                            : 'N/A'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h4 className="font-semibold text-red-800 mb-2">Danger Zone</h4>
                  <p className="text-sm text-red-600 mb-4">
                    These actions cannot be undone. Please proceed with caution.
                  </p>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Delete Account
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HotelDashboard;