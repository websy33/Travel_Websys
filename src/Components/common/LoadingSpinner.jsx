import React from 'react';
import { motion } from 'framer-motion';

/**
 * Loading Spinner Component
 * @param {string} size - Size variant: 'sm', 'md', 'lg', 'xl'
 * @param {string} color - Color variant: 'rose', 'blue', 'green', 'gray'
 * @param {string} text - Optional loading text
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'rose', 
  text = null,
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const colorClasses = {
    rose: 'border-rose-600',
    blue: 'border-blue-600',
    green: 'border-green-600',
    gray: 'border-gray-600',
    pink: 'border-pink-600'
  };

  const spinnerClass = `${sizeClasses[size]} ${colorClasses[color]}`;

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className={`animate-spin rounded-full border-b-2 ${spinnerClass}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
      {text && (
        <motion.p
          className="text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      {content}
    </div>
  );
};

/**
 * Skeleton Loading Component
 */
export const SkeletonLoader = ({ className = "", count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-gray-200 rounded ${className}`}
        />
      ))}
    </>
  );
};

/**
 * Card Skeleton Loader
 */
export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <SkeletonLoader className="h-48 w-full" />
      <SkeletonLoader className="h-6 w-3/4" />
      <SkeletonLoader className="h-4 w-full" count={2} />
      <div className="flex justify-between items-center">
        <SkeletonLoader className="h-8 w-24" />
        <SkeletonLoader className="h-10 w-32" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
