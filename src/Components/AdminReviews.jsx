import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiUser, FiCalendar } from 'react-icons/fi';

const AdminReviews = () => {
  const [reviews] = useState([
    {
      id: 1,
      user: 'John Doe',
      rating: 5,
      comment: 'Excellent admin panel! Very user-friendly and efficient.',
      date: '2024-01-15'
    },
    {
      id: 2,
      user: 'Sarah Smith',
      rating: 4,
      comment: 'Great system for managing hotels. Easy approval process.',
      date: '2024-01-10'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      rating: 5,
      comment: 'Perfect for our travel business. Highly recommended!',
      date: '2024-01-05'
    }
  ]);

  const StarRating = ({ rating }) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="mt-6 sm:mt-8 bg-gray-50 rounded-xl p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">System Reviews</h3>
      
      <div className="grid gap-3 sm:gap-4">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 text-sm sm:text-base truncate">{review.user}</h4>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 w-full sm:w-auto justify-end sm:justify-start">
                <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {new Date(review.date).toLocaleDateString()}
              </div>
            </div>
            
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{review.comment}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;