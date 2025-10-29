import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase';

const HotelDataViewer = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const q = query(
        collection(db, 'hotelRegistrations'),
        orderBy('registeredAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const hotelData = [];
      
      querySnapshot.forEach((doc) => {
        hotelData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setHotels(hotelData);
      console.log('Fetched hotels:', hotelData);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading hotels...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Registered Hotels Data</h1>
      
      {hotels.length === 0 ? (
        <p>No hotels registered yet.</p>
      ) : (
        <div className="space-y-6">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{hotel.hotelName}</h3>
                  <p className="text-gray-600 mb-2">{hotel.city}, {hotel.state}</p>
                  <p className="text-sm text-gray-500">Owner: {hotel.ownerName}</p>
                  <p className="text-sm text-gray-500">Email: {hotel.email}</p>
                  <p className="text-sm text-gray-500">Status: {hotel.status}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Rate Information</h4>
                  <div className="text-sm space-y-1">
                    <p>Default Rate: ₹{hotel.defaultRate || 'Not set'}</p>
                    <p>Weekend Rate: ₹{hotel.defaultWeekendRate || 'Not set'}</p>
                    <p>Seasonal Rates: {hotel.seasonalRates?.length || 0}</p>
                    <p>Blackout Dates: {hotel.blackoutDates?.length || 0}</p>
                  </div>
                  
                  {hotel.seasonalRates && hotel.seasonalRates.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-medium text-sm mb-1">Seasonal Rates:</h5>
                      {hotel.seasonalRates.map((rate, index) => (
                        <div key={index} className="text-xs bg-blue-50 p-2 rounded mb-1">
                          <p><strong>{rate.season}:</strong> {rate.description}</p>
                          <p>₹{rate.baseRate} - ₹{rate.weekendRate}</p>
                          <p>{rate.startDate} to {rate.endDate}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {hotel.blackoutDates && hotel.blackoutDates.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-medium text-sm mb-1">Blackout Dates:</h5>
                      {hotel.blackoutDates.map((blackout, index) => (
                        <div key={index} className="text-xs bg-red-50 p-2 rounded mb-1">
                          <p><strong>{blackout.reason}</strong></p>
                          <p>{blackout.startDate} to {blackout.endDate}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={fetchHotels}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh Data
      </button>
    </div>
  );
};

export default HotelDataViewer;