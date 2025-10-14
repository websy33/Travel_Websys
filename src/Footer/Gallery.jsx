import { useState } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/20/solid';
import { motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  // Client photos data
  const clientPhotos = [
    {
      id: 1,
      name: 'Mr Nihal and Family',
      location: 'Kashmir',
      image: '/images/Client1.jpeg',
      quote: 'Our honeymoon was magical thanks to Traveligo!'
    },
    {
      id: 2,
      name: 'Mitesh Jain & Family',
      location: 'Kashmir',
      image: '/images/Client2.jpeg',
      quote: 'Best family vacation we ever had!'
    },
    {
      id: 3,
      name: 'Mrs Rana Nazar & Family',
      location: 'Kashmir',
      image: '/images/Client3.jpeg',
      quote: 'Best family vacation we ever had!'
    },
    {
      id: 4,
      name: 'Mr Kiran & Family',
      location: 'Kashmir',
      image: '/images/Client4.jpeg',
      quote: 'Our honeymoon was magical thanks to Traveligo!'
    },
    {
      id: 5,
      name: 'Mr Kushal Sharma & Family',
      location: 'Kashmir',
      image:'/images/Client5.jpeg',
      quote: 'Perfect family vacation with amazing memories!'
    },
    {
      id: 6,
      name: 'Mr Ishan Khatter',
      location: 'Kashmir',
      image:'/images/ishan.jpeg',
      quote: 'Unforgettable beach trip with perfect planning!'
    },
    {
      id: 7,
      name: 'Meera',
      location: 'Kashmir',
      image: '/images/Client7.jpeg',
      quote: 'Our honeymoon was magical thanks to Traveligo!'
    },
    {
      id: 8,
      name: 'Ms Kanika Mann',
      location: 'Kashmir',
      image: '/images/kanikamann.jpeg',
      quote: 'My solo trip was perfectly planned and so much fun!'
    },
    {
      id: 9,
      name: 'Mr Mohit Khiyani & Family',
      location: 'Kashmir',
      image: '/images/Client8.jpeg',
      quote: 'Our honeymoon was magical thanks to Traveligo!'
    }
  ];

  const displayedPhotos = showAllPhotos ? clientPhotos : clientPhotos.slice(0, 4);

  return (
    <section className="relative py-24 bg-gradient-to-b from-pink-50 to-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-10"></div>
      <div className="absolute top-1/4 right-10 w-64 h-64 bg-pink-100 rounded-full opacity-10 mix-blend-multiply filter blur-[100px] animate-float"></div>
      <div className="absolute bottom-1/3 left-10 w-72 h-72 bg-pink-200 rounded-full opacity-10 mix-blend-multiply filter blur-[100px] animate-float-delay"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20 relative"
        >
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-pink-300 rounded-full opacity-5 filter blur-3xl"></div>
          <div className="absolute -bottom-5 right-20 w-16 h-16 bg-white rounded-full opacity-20"></div>
          
          <motion.div
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, -5, 0] }}
            className="inline-flex items-center px-6 py-3 bg-white border border-pink-200 rounded-full shadow-pink-sm mb-8 backdrop-blur-sm"
          >
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
            </span>
            <span className="text-sm font-medium text-pink-600">Client Memories</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-serif relative">
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-pink-600 to-pink-500">
                Travel Stories
              </span>
              <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full"></span>
            </span>
            <br />
            <span className="text-gray-800">That Inspire</span>
          </h1>

          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="w-40 h-1 bg-gradient-to-r from-pink-100 via-pink-400 to-pink-100 mx-auto mb-8 rounded-full"
          ></motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed relative"
          >
            {showAllPhotos ? (
              <span className="typewriter">Every journey tells a beautiful story...</span>
            ) : (
              <span className="typewriter">Featured moments that inspire wanderlust...</span>
            )}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <AnimatePresence>
            {displayedPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="relative group overflow-hidden rounded-3xl shadow-2xl hover:shadow-pink-lg transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src={photo.image}
                  alt={photo.name}
                  className="w-full h-96 object-cover transform transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <motion.div
                    initial={{ y: 30 }}
                    whileInView={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500"
                  >
                    <h3 className="text-2xl font-bold text-white mb-2 font-serif">{photo.name}</h3>
                    <p className="text-pink-200 mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {photo.location}
                    </p>
                    <p className="text-pink-50 italic font-light">"{photo.quote}"</p>
                  </motion.div>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-300/30 transition-all duration-500 rounded-3xl"></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAllPhotos(!showAllPhotos)}
            className="relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-semibold rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white opacity-10 group-hover:opacity-0 transition-opacity duration-500"></span>
            <span className="relative z-10 flex items-center">
              {showAllPhotos ? (
                <>
                  <ChevronLeftIcon className="w-6 h-6 mr-3" />
                  Show Less
                </>
              ) : (
                <>
                  View All Memories
                  <ChevronRightIcon className="w-6 h-6 ml-3" />
                </>
              )}
            </span>
            <span className="absolute inset-0 border-2 border-white/20 rounded-full group-hover:border-white/40 transition-all duration-500"></span>
          </motion.button>
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
      
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delay { animation: float 8s ease-in-out 2s infinite; }
        .shadow-pink-sm { box-shadow: 0 4px 20px -5px rgba(236, 72, 153, 0.3); }
        .shadow-pink-lg { box-shadow: 0 25px 50px -12px rgba(236, 72, 153, 0.25); }
        .typewriter {
          display: inline-block;
          overflow: hidden;
          border-right: 2px solid pink;
          white-space: nowrap;
          animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
        }
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: pink; }
        }
      `}</style>
    </section>
  );
};

export default Gallery;
