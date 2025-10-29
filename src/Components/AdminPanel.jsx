import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiCheckCircle, FiAlertCircle, FiClock, FiTrash2, 
  FiEye, FiDownload, FiUploadCloud, FiFileText, FiInfo,
  FiSettings, FiUsers, FiHome, FiTrendingUp
} from 'react-icons/fi';
import AdminReviews from './AdminReviews';

const AdminPanel = ({ 
  showAdminPanel, 
  setShowAdminPanel, 
  hotels, 
  pendingHotels, 
  hotelUsers,
  approveHotel,
  rejectHotel,
  deleteHotel,
  exportHotelData,
  importHotelData,
  recoverHotelData,
  migrateToFirestore
}) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showHotelDetails, setShowHotelDetails] = useState(false);

  const StatusBadge = ({ status }) => {
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

  const viewHotelDetails = (hotel) => {
    setSelectedHotel(hotel);
    setShowHotelDetails(true);
  };

  return (
    <AnimatePresence>
      {showAdminPanel && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-2xl w-full max-w-7xl max-h-[95vh] shadow-2xl overflow-hidden mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[95vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage hotels, users, and system data</p>
                </div>
                <button 
                  onClick={() => setShowAdminPanel(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg self-end sm:self-auto"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-blue-50 p-4 sm:p-6 rounded-xl border border-blue-200">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2 sm:mb-4">Pending Approvals</h3>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">{pendingHotels.length}</div>
                  <p className="text-sm sm:text-base text-blue-600">Hotels awaiting approval</p>
                </div>
                <div className="bg-green-50 p-4 sm:p-6 rounded-xl border border-green-200">
                  <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-2 sm:mb-4">Approved Hotels</h3>
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">{hotels.filter(h => h.status === 'approved').length}</div>
                  <p className="text-sm sm:text-base text-green-600">Active hotel listings</p>
                </div>
                <div className="bg-purple-50 p-4 sm:p-6 rounded-xl border border-purple-200">
                  <h3 className="text-base sm:text-lg font-semibold text-purple-800 mb-2 sm:mb-4">Total Hotels</h3>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">{hotels.length}</div>
                  <p className="text-sm sm:text-base text-purple-600">All hotels in system</p>
                </div>
                <div className="bg-orange-50 p-4 sm:p-6 rounded-xl border border-orange-200">
                  <h3 className="text-base sm:text-lg font-semibold text-orange-800 mb-2 sm:mb-4">Registered Hotels</h3>
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">{hotels.length + pendingHotels.length}</div>
                  <p className="text-sm sm:text-base text-orange-600">Total registered hotels</p>
                </div>
              </div>
              
              {/* Data Management Section */}
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200 mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Data Management</h3>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <motion.button
                    onClick={recoverHotelData}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiDownload size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden sm:inline">Recover Hotels</span>
                    <span className="sm:hidden">Recover</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={async () => {
                      if (window.confirm('This will migrate all localStorage data to Firestore for permanent storage. Continue?')) {
                        try {
                          await migrateToFirestore();
                          alert('Migration to Firestore completed successfully! Your data is now permanently stored.');
                        } catch (error) {
                          alert('Migration failed. Please try again.');
                        }
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiUploadCloud size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden sm:inline">Migrate to Firestore</span>
                    <span className="sm:hidden">Migrate</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={exportHotelData}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiUploadCloud size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden sm:inline">Export Data</span>
                    <span className="sm:hidden">Export</span>
                  </motion.button>
                  
                  <label className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors cursor-pointer text-sm sm:text-base">
                    <FiFileText size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden sm:inline">Import Data</span>
                    <span className="sm:hidden">Import</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importHotelData}
                      className="hidden"
                    />
                  </label>
                  
                  <motion.button
                    onClick={() => {
                      const backupInfo = localStorage.getItem('kashmirStays_approvedHotels_backup');
                      if (backupInfo) {
                        const info = JSON.parse(backupInfo);
                        alert(`Last backup: ${new Date(info.timestamp).toLocaleString()}\nHotels in backup: ${info.count}`);
                      } else {
                        alert('No backup information available.');
                      }
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiInfo size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden sm:inline">Backup Info</span>
                    <span className="sm:hidden">Info</span>
                  </motion.button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 mb-4 sm:mb-6 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'pending', label: 'Pending Approvals', count: pendingHotels.length },
                  { id: 'approved', label: 'Approved Hotels', count: hotels.filter(h => h.status === 'approved').length },
                  { id: 'users', label: 'Hotel Users', count: hotelUsers.length }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                      activeTab === tab.id
                        ? 'bg-white text-rose-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    {' '}({tab.count})
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {/* Pending Approvals */}
                {activeTab === 'pending' && (
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Pending Hotel Approvals</h3>
                    {pendingHotels.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <FiClock className="mx-auto text-gray-400 mb-4" size={48} />
                        <h4 className="text-lg font-semibold text-gray-600">No pending approvals</h4>
                        <p className="text-gray-500">All hotel submissions have been processed</p>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {pendingHotels.map(hotel => (
                          <div key={hotel.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                              <div className="flex-1 w-full sm:w-auto">
                                <h4 className="text-lg sm:text-xl font-bold text-gray-800">{hotel.name}</h4>
                                <p className="text-sm sm:text-base text-gray-600 mt-1">{hotel.location}</p>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                                  <StatusBadge status={hotel.status} />
                                  <span className="text-xs sm:text-sm text-gray-500">
                                    Submitted: {new Date(hotel.submissionDate).toLocaleDateString()}
                                  </span>
                                  <span className="text-xs sm:text-sm text-gray-500">
                                    By: {hotel.submittedBy}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                <motion.button
                                  onClick={() => viewHotelDetails(hotel)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <FiEye size={14} className="sm:w-4 sm:h-4" />
                                  <span>View</span>
                                </motion.button>
                                <motion.button
                                  onClick={() => approveHotel(hotel.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <FiCheckCircle size={14} className="sm:w-4 sm:h-4" />
                                  <span>Approve</span>
                                </motion.button>
                                <motion.button
                                  onClick={() => rejectHotel(hotel.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <FiX size={14} className="sm:w-4 sm:h-4" />
                                  <span>Reject</span>
                                </motion.button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Price:</span>
                                <span className="ml-1 sm:ml-2">₹{hotel.price?.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Stars:</span>
                                <span className="ml-1 sm:ml-2">{hotel.stars} Star</span>
                              </div>
                              <div className="col-span-2 sm:col-span-1">
                                <span className="font-medium text-gray-700">Rooms:</span>
                                <span className="ml-1 sm:ml-2">{hotel.rooms?.length} Types</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Approved Hotels */}
                {activeTab === 'approved' && (
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Approved Hotels</h3>
                    {hotels.filter(h => h.status === 'approved').length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <FiHome className="mx-auto text-gray-400 mb-4" size={48} />
                        <h4 className="text-lg font-semibold text-gray-600">No approved hotels</h4>
                        <p className="text-gray-500">Approved hotels will appear here</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:gap-6">
                        {hotels.filter(h => h.status === 'approved').map(hotel => (
                          <div key={hotel.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                              <div className="flex-1 w-full sm:w-auto">
                                <h4 className="text-lg sm:text-xl font-bold text-gray-800">{hotel.name}</h4>
                                <p className="text-sm sm:text-base text-gray-600 mt-1">{hotel.location}</p>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                                  <StatusBadge status={hotel.status} />
                                  <span className="text-xs sm:text-sm text-gray-500">
                                    Approved: {hotel.approvedDate ? new Date(hotel.approvedDate).toLocaleDateString() : 'N/A'}
                                  </span>
                                  <span className="text-xs sm:text-sm text-gray-500">
                                    By: {hotel.approvedBy || 'Admin'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                <motion.button
                                  onClick={() => viewHotelDetails(hotel)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <FiEye size={14} className="sm:w-4 sm:h-4" />
                                  <span>View</span>
                                </motion.button>
                                <motion.button
                                  onClick={() => deleteHotel(hotel.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <FiTrash2 size={14} className="sm:w-4 sm:h-4" />
                                  <span>Delete</span>
                                </motion.button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Price:</span>
                                <span className="ml-1 sm:ml-2">₹{hotel.price?.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Rating:</span>
                                <span className="ml-1 sm:ml-2">{hotel.rating}/5</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Stars:</span>
                                <span className="ml-1 sm:ml-2">{hotel.stars} Star</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Rooms:</span>
                                <span className="ml-1 sm:ml-2">{hotel.rooms?.length} Types</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Hotel Users */}
                {activeTab === 'users' && (
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Hotel Users</h3>
                    {hotelUsers.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <FiUsers className="mx-auto text-gray-400 mb-4" size={48} />
                        <h4 className="text-lg font-semibold text-gray-600">No hotel users</h4>
                        <p className="text-gray-500">Registered hotel users will appear here</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:gap-6">
                        {hotelUsers.map(user => (
                          <div key={user.id} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                              <div className="flex-1 w-full">
                                <h4 className="text-lg sm:text-xl font-bold text-gray-800">{user.hotelName}</h4>
                                <p className="text-sm sm:text-base text-gray-600 mt-1">Owner: {user.ownerName}</p>
                                <p className="text-sm sm:text-base text-gray-600 break-all">Email: {user.email}</p>
                                <p className="text-sm sm:text-base text-gray-600">Phone: {user.phone}</p>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                                  <span className="text-xs sm:text-sm text-gray-500">
                                    Registered: {new Date(user.registrationDate).toLocaleDateString()}
                                  </span>
                                  <span className={`text-xs sm:text-sm px-2 py-1 rounded-full ${
                                    user.emailVerified 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {user.emailVerified ? 'Email Verified' : 'Email Unverified'}
                                  </span>
                                </div>
                              </div>
                              <div className="text-left sm:text-right w-full sm:w-auto">
                                <div className="text-sm sm:text-base text-gray-500">
                                  Hotels: {user.hotels?.length || 0}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Reviews Section */}
              <AdminReviews />
            </div>
          </motion.div>

          {/* Hotel Details Modal */}
          <AnimatePresence>
            {showHotelDetails && selectedHotel && (
              <motion.div 
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className="p-6 overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Hotel Details</h3>
                      <button 
                        onClick={() => setShowHotelDetails(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <FiX size={24} />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Basic Information</h4>
                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Name:</span> {selectedHotel.name}</p>
                            <p><span className="font-medium">Location:</span> {selectedHotel.location}</p>
                            <p><span className="font-medium">Stars:</span> {selectedHotel.stars}</p>
                            <p><span className="font-medium">Rating:</span> {selectedHotel.rating}/5</p>
                            <p><span className="font-medium">Price:</span> ₹{selectedHotel.price?.toLocaleString()}</p>
                            <p><span className="font-medium">Status:</span> <StatusBadge status={selectedHotel.status} /></p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Contact Information</h4>
                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Phone:</span> {selectedHotel.contact?.phone || 'N/A'}</p>
                            <p><span className="font-medium">Email:</span> {selectedHotel.contact?.email || 'N/A'}</p>
                            <p><span className="font-medium">Submitted By:</span> {selectedHotel.submittedBy}</p>
                            <p><span className="font-medium">Submission Date:</span> {new Date(selectedHotel.submissionDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                        <p className="text-sm text-gray-600">{selectedHotel.description}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedHotel.amenities?.map(amenity => (
                            <span key={amenity} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Room Types ({selectedHotel.rooms?.length || 0})</h4>
                        <div className="grid gap-4">
                          {selectedHotel.rooms?.map((room, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Type:</span> {room.type}
                                </div>
                                <div>
                                  <span className="font-medium">Price:</span> ₹{room.price?.toLocaleString()}
                                </div>
                                <div>
                                  <span className="font-medium">Max Occupancy:</span> {room.maxOccupancy}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;