const HotelCard = ({ hotel }) => {
  return (
    <div className="hotel-card-shadow bg-white rounded-lg overflow-hidden mb-6">
      <div className="md:flex">
        <div className="md:w-1/3 h-48 md:h-auto">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 md:w-2/3">
          <div className="flex justify-between">
            <h3 className="text-xl font-bold">{hotel.name}</h3>
            <div className="flex items-center">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {hotel.rating}
              </span>
              <span className="ml-1 text-gray-600 text-sm">({hotel.reviews} reviews)</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-1">{hotel.location}</p>
          <div className="flex items-center mt-2">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-gray-700">{hotel.amenities.join(' • ')}</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div>
              <p className="text-sm text-gray-500">Starting from</p>
              <p className="text-xl font-bold text-blue-600">₹{hotel.price}</p>
              <p className="text-xs text-gray-500">+ ₹{hotel.taxes} taxes & fees</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              View Deal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;