import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Flight = () => {
  const [tripType, setTripType] = useState('ONEWAY');
  const [from, setFrom] = useState('SXR');
  const [to, setTo] = useState('DEL');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState('');
  const [airports, setAirports] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  const [departureDate, setDepartureDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const datePickerRef = useRef(null);

  // Use import.meta.env instead of process.env for Vite
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch airports and server status on component mount
  useEffect(() => {
    fetchAirports();
    checkServerStatus();
    
    // Set initial departure date in day/month/year format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow);
    setDepartureDate(formatDateForInput(tomorrow));
    
    // Close date picker when clicking outside
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check server health
  const checkServerStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/health`);
      setServerStatus(response.data);
    } catch (error) {
      console.error('Failed to check server status:', error);
      setServerStatus({ status: 'ERROR', message: 'Server unavailable' });
    }
  };

  // Fetch airports list
  const fetchAirports = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/airports`);
      if (response.data.success) {
        setAirports(response.data.airports);
      }
    } catch (error) {
      console.error('Failed to fetch airports:', error);
      // Fallback airports list
      setAirports([
        { code: "SXR", name: "Srinagar", city: "Srinagar", country: "India" },
        { code: "DEL", name: "Indira Gandhi International", city: "Delhi", country: "India" },
        { code: "BOM", name: "Chhatrapati Shivaji International", city: "Mumbai", country: "India" },
        { code: "BLR", name: "Kempegowda International", city: "Bangalore", country: "India" },
        { code: "MAA", name: "Chennai International", city: "Chennai", country: "India" },
        { code: "CCU", name: "Netaji Subhas Chandra Bose International", city: "Kolkata", country: "India" },
        { code: "HYD", name: "Rajiv Gandhi International", city: "Hyderabad", country: "India" },
        { code: "AMD", name: "Sardar Vallabhbhai Patel International", city: "Ahmedabad", country: "India" },
        { code: "PNQ", name: "Puen International", city: "Puen", country: "India" },
        { code: "GOI", name: "Goa International", city: "Goa", country: "India" },
        { code: "JAI", name: "Jaipur International", city: "Jaipur", country: "India" },
        { code: "IXC", name: "Chandigarh International", city: "Chandigarh", country: "India" }
      ]);
    }
  };

  // Get airport display name
  const getAirportDisplayName = (code) => {
    const airport = airports.find(a => a.code === code);
    return airport ? `${airport.code} - ${airport.city}` : code;
  };

  // Filter airports for dropdown
  const filterAirports = (searchTerm, exclude = '') => {
    return airports.filter(airport => 
      airport.code !== exclude &&
      (airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
       airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
       airport.name.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, 10);
  };

  // Format date for display (dd/mm/yyyy)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Format date for input field (dd/mm/yyyy)
  const formatDateForInput = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Parse date from input format (dd/mm/yyyy) to API format (yyyy-mm-dd)
  const parseDateFromInput = (dateString) => {
    if (!dateString) return '';
    
    const parts = dateString.split('/');
    if (parts.length !== 3) return '';
    
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    
    return `${year}-${month}-${day}`;
  };

  // Format date in day month year format for flight details
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const dateObj = new Date(dateString);
    
    // Array of month names
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Array of weekday names
    const weekdays = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    const weekday = weekdays[dateObj.getDay()];
    
    return `${weekday}, ${day} ${month} ${year}`;
  };

  // Swap airports
  const swapAirports = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  // Handle date change from input
  const handleDateChange = (e) => {
    const value = e.target.value;
    setDepartureDate(value);
    
    // Parse the date and update the API format date
    const parsedDate = parseDateFromInput(value);
    if (parsedDate) {
      setDate(parsedDate);
    }
  };

  // Handle date selection from calendar
  const handleDateSelect = (day, month, year) => {
    const selected = new Date(year, month, day);
    setSelectedDate(selected);
    setDepartureDate(formatDateForInput(selected));
    
    // Update the API format date
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    setDate(`${year}-${formattedMonth}-${formattedDay}`);
    
    // Close the date picker
    setShowDatePicker(false);
  };

  // Navigate to previous month in calendar
  const prevMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(year => year - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  // Navigate to next month in calendar
  const nextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(year => year + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  // Get month name
  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  };

  // Check if a day is today
  const isToday = (day, month, year) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // Check if a day is selected
  const isSelected = (day, month, year) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  // Check if a day is in the past
  const isPastDate = (day, month, year) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Handle search
  const handleSearch = async () => {
    // Validate inputs
    if (!from || from.length !== 3) {
      setError('Please select a valid origin airport');
      return;
    }
    
    if (!to || to.length !== 3) {
      setError('Please select a valid destination airport');
      return;
    }
    
    if (from === to) {
      setError('Origin and destination cannot be the same');
      return;
    }
    
    // Parse the date from input format
    const parsedDate = parseDateFromInput(departureDate);
    if (!parsedDate || !/^\d{4}-\d{2}-\d{2}$/.test(parsedDate)) {
      setError('Please enter a valid departure date in DD/MM/YYYY format');
      return;
    }
    
    if (tripType === 'ROUND TRIP' && (!returnDate || returnDate <= parsedDate)) {
      setError('Return date must be after departure date');
      return;
    }
    
    const totalPassengers = adults;
    if (totalPassengers < 1 || totalPassengers > 9) {
      setError('Total passengers must be between 1 and 9');
      return;
    }

    setLoading(true);
    setError('');
    setFlights([]);

    try {
      const searchData = {
        origin: from.toUpperCase(),
        destination: to.toUpperCase(),
        departure_date: parsedDate,
        adult: adults
      };

      console.log('Searching with:', searchData);

      const response = await axios.post(`${API_BASE_URL}/api/flights/search`, searchData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000 // 60 second timeout
      });

      if (response.data.success) {
        setFlights(response.data.flights || []);
        if (response.data.flights && response.data.flights.length === 0) {
          setError('No flights found for the selected route and date. Please try different dates or airports.');
        }
      } else {
        setError(response.data.message || 'Failed to search flights');
      }
    } catch (err) {
      console.error('Search error:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Search request timed out. Please try again with a stable internet connection.');
      } else if (err.response) {
        // Server responded with error status
        if (err.response.status === 500) {
          setError('Server error: The server encountered an internal error. Please try again later or contact support.');
        } else {
          const errorMsg = err.response.data?.message || `Server error: ${err.response.status}`;
          setError(errorMsg);
        }
        
        if (err.response.status === 503) {
          setError('Flight search service is temporarily unavailable. Please try again later.');
        }
      } else if (err.request) {
        // Request was made but no response received
        setError('No response from server. Please check if the server is running at ' + API_BASE_URL);
      } else {
        // Other errors
        setError(err.message || 'Failed to connect to server');
      }
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    // Handle different time formats
    if (timeString.includes(':')) {
      return timeString;
    }
    return timeString;
  };

  // Calendar component
  const Calendar = () => {
    const days = generateCalendarDays();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="absolute z-50 mt-10 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-64">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="font-semibold">
            {getMonthName(currentMonth)} {currentYear}
          </div>
          
          <button 
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="h-8"></div>;
            }
            
            const isPast = isPastDate(day, currentMonth, currentYear);
            const today = isToday(day, currentMonth, currentYear);
            const selected = isSelected(day, currentMonth, currentYear);
            
            return (
              <button
                key={index}
                onClick={() => !isPast && handleDateSelect(day, currentMonth, currentYear)}
                disabled={isPast}
                className={`h-8 rounded-full text-sm flex items-center justify-center
                  ${isPast ? 'text-gray-300 cursor-not-allowed' : 
                    selected ? 'bg-blue-600 text-white' :
                    today ? 'border border-blue-600 text-blue-600' :
                    'text-gray-700 hover:bg-blue-100'}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 text-center">
            <h1 className="text-3xl font-bold mb-2">✈️ TravelGo</h1>
            <p className="opacity-90">Find the best flights for your journey</p>
            
            {/* Server Status Indicator */}
            {serverStatus && (
              <div className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs ${
                serverStatus.status === 'OK' 
                  ? 'bg-green-500 bg-opacity-20 text-green-100' 
                  : 'bg-red-500 bg-opacity-20 text-red-100'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  serverStatus.status === 'OK' ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                {serverStatus.status === 'OK' ? 'Service Online' : 'Service Offline'}
              </div>
            )}
          </div>
          
          {/* Trip Type Selector */}
          <div className="flex justify-center pt-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-6 py-2 font-medium text-sm transition-colors ${
                  tripType === 'ONEWAY' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setTripType('ONEWAY')}
              >
                ONE WAY
              </button>
              <button
                className={`px-6 py-2 font-medium text-sm transition-colors ${
                  tripType === 'ROUND TRIP' 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setTripType('ROUND TRIP')}
              >
                ROUND TRIP
              </button>
            </div>
          </div>
          
          {/* Search Form */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              {/* From Airport */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">FROM</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    value={getAirportDisplayName(from)}
                    onClick={() => {
                      setShowFromDropdown(!showFromDropdown);
                      setShowToDropdown(false);
                      setShowDatePicker(false);
                    }}
                    readOnly
                    placeholder="Select origin airport"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* From Airport Dropdown */}
                {showFromDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {airports.filter(a => a.code !== to).map((airport) => (
                      <div
                        key={airport.code}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setFrom(airport.code);
                          setShowFromDropdown(false);
                        }}
                      >
                        <div className="font-medium text-gray-900">
                          {airport.code} - {airport.city}
                        </div>
                        <div className="text-sm text-gray-500">{airport.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Swap Button & To Airport */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">TO</label>
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                      value={getAirportDisplayName(to)}
                      onClick={() => {
                        setShowToDropdown(!showToDropdown);
                        setShowFromDropdown(false);
                        setShowDatePicker(false);
                      }}
                      readOnly
                      placeholder="Select destination airport"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Swap Button */}
                  <button
                    type="button"
                    onClick={swapAirports}
                    className="ml-2 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                    title="Swap airports"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>
                
                {/* To Airport Dropdown */}
                {showToDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {airports.filter(a => a.code !== from).map((airport) => (
                      <div
                        key={airport.code}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setTo(airport.code);
                          setShowToDropdown(false);
                        }}
                      >
                        <div className="font-medium text-gray-900">
                          {airport.code} - {airport.city}
                        </div>
                        <div className="text-sm text-gray-500">{airport.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Departure Date */}
              <div className="relative" ref={datePickerRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">DEPARTURE DATE</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    value={departureDate}
                    onChange={handleDateChange}
                    onClick={() => {
                      setShowDatePicker(!showDatePicker);
                      setShowFromDropdown(false);
                      setShowToDropdown(false);
                    }}
                    placeholder="DD/MM/YYYY"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Format: DD/MM/YYYY
                </div>
                
                {/* Date Picker */}
                {showDatePicker && <Calendar />}
              </div>
              
              {/* Passenger Count - Adults Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PASSENGERS</label>
                <div className="flex items-center">
                  <div className="w-full">
                    <label className="text-xs text-gray-600 block mb-1">Adults</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                      value={adults}
                      onChange={(e) => {
                        const value = Math.max(1, Math.min(9, parseInt(e.target.value) || 1));
                        setAdults(value);
                      }}
                      min="1"
                      max="9"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Total: {adults} passenger{adults !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            {/* Search Button */}
            <button 
              onClick={handleSearch}
              disabled={loading || serverStatus?.status !== 'OK'}
              className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${
                loading || serverStatus?.status !== 'OK' ? 'opacity-50 cursor-not-allowed transform-none' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  SEARCHING FLIGHTS...
                </div>
              ) : (
                '🔍 SEARCH FLIGHTS'
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Click outside to close dropdowns */}
        {(showFromDropdown || showToDropdown || showDatePicker) && (
          <div 
            className="fixed inset-0 z-5" 
            onClick={() => {
              setShowFromDropdown(false);
              setShowToDropdown(false);
              setShowDatePicker(false);
            }}
          />
        )}

        {/* Results Section */}
        {flights.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                ✈️ Available Flights ({flights.length})
              </h2>
              <p className="text-gray-600 text-sm">
                {getAirportDisplayName(from)} → {getAirportDisplayName(to)} • {formatDate(date)}
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {flights.map((flight, index) => (
                  <div key={flight.id || index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                    {/* Flight Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {flight.airline} {flight.flightNumber}
                        </h3>
                        <p className="text-sm text-gray-600">{flight.aircraft}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">
                          {formatPrice(flight.price)}
                        </div>
                        <p className="text-sm text-gray-600">{flight.fareType}</p>
                      </div>
                    </div>
                    
                    {/* Flight Route */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">
                          {formatTime(flight.departureTime)}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          {flight.origin}
                        </div>
                      </div>
                      
                      <div className="flex-1 mx-8 text-center">
                        <div className="text-sm text-gray-600 mb-1">
                          {flight.duration || 'Duration N/A'}
                        </div>
                        <div className="relative">
                          <div className="h-px bg-gray-300"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                            ✈️
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">
                          {formatTime(flight.arrivalTime)}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          {flight.destination}
                        </div>
                      </div>
                    </div>
                    
                    {/* Flight Details */}
                    <div className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          flight.refundable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {flight.refundable ? '✅ Refundable' : '❌ Non-refundable'}
                        </span>
                        
                        <span className="text-gray-600">
                          🧳 Baggage: {flight.baggage}
                        </span>
                        
                        {flight.available_seats && flight.available_seats !== 'N/A' && (
                          <span className="text-gray-600">
                            💺 {flight.available_seats} seats
                          </span>
                        )}
                      </div>
                      
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Select Flight
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No flights found message */}
        {!loading && flights.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to search?</h3>
            <p className="text-gray-600">
              Enter your travel details above and click "Search Flights" to find the best deals.
            </p>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 TravelGo Flight Search. All rights reserved.</p>
          <p className="mt-1">Powered by AirIQ API • Server: {API_BASE_URL}</p>
        </div>
      </div>
    </div>
  );
};

export default Flight;