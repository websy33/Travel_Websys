import React, { useState } from 'react';
import { FiHome } from 'react-icons/fi';

/**
 * Image Placeholder Component
 */
const ImagePlaceholder = ({ className = "" }) => (
  <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`}>
    <div className="flex items-center justify-center h-full">
      <FiHome className="text-gray-400 text-2xl" />
    </div>
  </div>
);

/**
 * Lazy Loading Image Component with Error Handling
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for image
 * @param {string} className - CSS classes
 * @param {function} onLoad - Callback when image loads
 * @param {string} fallbackSrc - Fallback image if main image fails
 */
const LazyImage = ({ 
  src, 
  alt, 
  className = "", 
  onLoad, 
  fallbackSrc = null,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
    onLoad?.();
  };

  const handleError = () => {
    console.warn(`Failed to load image: ${currentSrc}`);
    
    // Try fallback image if available and not already using it
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsLoading(true);
      setError(false);
    } else {
      setIsLoading(false);
      setError(true);
    }
  };

  const imageSrc = currentSrc && currentSrc.trim() !== '' ? currentSrc : null;

  if (!imageSrc || error) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <FiHome className="text-gray-400 text-2xl" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0">
          <ImagePlaceholder className="w-full h-full" />
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

/**
 * Progressive Image Loading Component
 * Loads a low-quality placeholder first, then the full image
 */
export const ProgressiveImage = ({
  placeholderSrc,
  src,
  alt,
  className = "",
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-500`}
        {...props}
      />
    </div>
  );
};

/**
 * Image with zoom on hover
 */
export const ZoomableImage = ({ src, alt, className = "", ...props }) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <LazyImage
        src={src}
        alt={alt}
        className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
        {...props}
      />
    </div>
  );
};

export default LazyImage;
