import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { clientPhotos } from './Gallery';

const AllPhotosPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Link 
            to="/" 
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Gallery
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            All Client Photos
          </h1>
          <div className="w-5"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {clientPhotos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={photo.image}
                  alt={photo.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{photo.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{photo.location}</p>
                <p className="text-gray-600 italic">"{photo.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllPhotosPage;