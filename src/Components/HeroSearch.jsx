import { useState } from 'react';
import { FaPlane, FaHotel, FaUmbrellaBeach, FaTrain, FaTaxi, FaUserFriends, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import React from 'react'; 
const HeroSearch = ({ activeTab, setActiveTab }) => {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(1);

  const tabs = [
    { id: 'flights', icon: <FaPlane className="mr-2" />, label: 'Flights', color: 'from-indigo-600 to-purple-600' },
    { id: 'hotels', icon: <FaHotel className="mr-2" />, label: 'Hotels', color: 'from-emerald-600 to-teal-600' },
    { id: 'holidays', icon: <FaUmbrellaBeach className="mr-2" />, label: 'Holidays', color: 'from-amber-600 to-orange-600' },
    { id: 'trains', icon: <FaTrain className="mr-2" />, label: 'Trains', color: 'from-red-600 to-pink-600' },
    { id: 'cabs', icon: <FaTaxi className="mr-2" />, label: 'Cabs', color: 'from-blue-600 to-cyan-600' }
  ];

  const renderSearchForm = () => {
    switch (activeTab) {
      case 'flights':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <label className="block text-black mb-1 font-medium">From</label>
              <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-4 text-black" />
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  placeholder="City or Airport"
                  className="w-full pl-10 p-3 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-gray-700 mb-1 font-medium">To</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-4 text-black" />
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  placeholder="City or Airport"
                  className="w-full pl-10 p-3 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-black mb-1 font-medium">Departure</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-4 text-gray-400" />
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full pl-10 p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block  text-black mb-1 font-medium">Return</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-4  text-black" />
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full pl-10 p-3 border  text-black  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'hotels':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2 relative">
              <label className="block  text-black mb-1 font-medium">Destination</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, Hotel, or Property"
                  className="w-full pl-10 p-3 border border-black  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-gray-700 mb-1 font-medium">Check-in</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-4  text-black" />
                <input
                  type="date"
                  className="w-full pl-10 p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-gray-700 mb-1 font-medium">Check-out</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-4 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-gradient-to-r ${tabs.find(t => t.id === activeTab)?.color || 'from-indigo-600 to-purple-600'}  text-black py-8 px-4 transition-all duration-500`}>
      <div className="container mx-auto">
        <div className="flex overflow-x-auto pb-2 mb-6 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 mr-2 rounded-t-lg transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-white text-gray-900 shadow-lg transform -translate-y-1' 
                  : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-6 transform transition-all duration-300 hover:shadow-2xl">
          {renderSearchForm()}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-auto">
              <label className="block text-gray-700 mb-1 font-medium">Travellers</label>
              <div className="relative">
                <FaUserFriends className="absolute left-3 top-4 text-gray-400" />
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Traveller' : 'Travellers'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button className={`w-full md:w-auto bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105`}>
              Search {tabs.find(t => t.id === activeTab)?.label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;