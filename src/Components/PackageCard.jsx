const PackageCard = ({ packageItem }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md deal-card">
      <div className="relative h-48">
        <img
          src={packageItem.image}
          alt={packageItem.title}
          className="w-full h-full object-cover"
        />
        {packageItem.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
            {packageItem.discount} OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{packageItem.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{packageItem.destination}</p>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {packageItem.duration}
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="font-bold text-blue-600">₹{packageItem.price}</span>
            <span className="text-sm text-gray-500 ml-2 line-through">₹{packageItem.originalPrice}</span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;