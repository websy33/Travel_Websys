const FlightCard = ({ flight }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img src={flight.airlineLogo} alt={flight.airline} className="w-10 h-10 mr-3" />
          <div>
            <h3 className="font-bold">{flight.airline}</h3>
            <p className="text-gray-600 text-sm">{flight.flightNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-blue-600">₹{flight.price}</span>
          <p className="text-gray-600 text-sm">per person</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-center">
          <p className="text-xl font-bold">{flight.departureTime}</p>
          <p className="text-gray-600 text-sm">{flight.from}</p>
        </div>
        <div className="flex flex-col items-center mx-4">
          <p className="text-gray-500 text-sm">{flight.duration}</p>
          <div className="w-24 h-px bg-gray-300 my-1"></div>
          <p className="text-gray-500 text-xs">{flight.type}</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">{flight.arrivalTime}</p>
          <p className="text-gray-600 text-sm">{flight.to}</p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t">
        <div>
          <p className="text-sm text-gray-600">Baggage: {flight.baggage}</p>
          <p className="text-sm text-gray-600">Cancellation: {flight.cancellation}</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default FlightCard;