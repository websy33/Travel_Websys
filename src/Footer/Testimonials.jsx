import React, { useState, useRef, useEffect } from 'react';
import { FaQuoteLeft, FaPlay, FaPause, FaChevronLeft, FaChevronRight, FaVolumeUp, FaVolumeMute, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Import videos
import kanikaman from "/videos/kanikaman.mp4";
import ishan from "/videos/ishan.mp4";
import Rashmika from "/videos/Rashmika.mp4";
import Raza from '/videos/raza.mp4';

const Testimonials = () => {
  const photoTestimonials = [
    {
      id: 1,
      name: 'Ishan Khattar',
      role: 'Bollywood Actor',
      content: 'From snow-capped peaks to bustling local markets, Traveligo orchestrated our entire Kashmir schedule with military precision. Their fixers knew every hidden gem location that made our frames magical!',
      image: '/images/ishan.jpeg',
      bgGradient: 'from-purple-500 to-pink-500',
      highlight: "📍 Shot 3 major song sequences in record time",
      rating: 5
    },
    {
      id: 2,
      name: 'Kanika Man',
      role: 'Artist & Content Creator',
      content: 'As a solo female traveler, I never felt safer! Traveligo arranged my entire aesthetic shoot - from the perfect houseboat to the most photogenic apple orchards. Their team even knew the golden hour spots Instagram dreams are made of!',
      image: '/images/kanikamann.jpeg',
      bgGradient: 'from-fuchsia-500 to-purple-600',
      highlight: "✨ Curated 12 unique content locations in 3 days",
      rating: 5
    },
    {
      id: 3,
      name: 'Vishal Bharadwaj',
      role: 'Acclaimed Filmmaker & Composer',
      content: 'When we needed to shoot in sensitive border areas, Traveligo handled all permissions and security like pros. Their local crew saved us 3 weeks of prep time - allowing me to focus entirely on capturing Kashmir\'s raw beauty.',
      image: '/images/vishal.jpeg',
      bgGradient: 'from-amber-500 to-orange-600',
      highlight: "🎮 Secured rare permits for restricted areas",
      rating: 4
    },
    {
      id: 4,
      name: 'IP Singh',
      role: 'Punjabi Music Sensation',
      content: 'Our entire music crew of 45 people moved like clockwork! Traveligo arranged everything - from vintage cars for our shoot to last-minute drone permits. The cherry on top? They found us an actual shehnai player at 4 AM for that perfect dawn shot!',
      image: '/images/ipsing.jpeg',
      bgGradient: 'from-rose-500 to-pink-600',
      highlight: "🎶 Coordinated 5 location shifts in single day",
      rating: 5
    },
    {
      id: 5,
      name: 'Dr. Raza',
      role: 'Medical Professionals & Travel Enthusiasts',
      content: 'Traveligo helped us experience its magic firsthand. They crafted the perfect balance - luxury houseboats for relaxation while secretly arranging those off-the-map experiences we craved as adventurers!',
      image: '/images/raza.jpeg',
      bgGradient: 'from-rose-400 to-pink-500',
      rating: 4
    }
  ];

  const videoTestimonials = [
    {
      id: 6,
      name: 'Ishan Khattar',
      role: 'Bollywood Actor',
      content: ishan,
      thumbnail: '/images/ishan.jpeg',
      bgGradient: 'from-violet-500 to-fuchsia-500',
    },
    {
      id: 7,
      name: 'Kanika Man',
      role: 'Artist',
      content: kanikaman,
      thumbnail: '/images/kanikamann.jpeg',
      bgGradient: 'from-indigo-500 to-blue-500',
    },
    {
      id: 8,
      name: 'Rashmika Kaur',
      role: 'Singer',
      content: Rashmika,
      thumbnail: '/images/rashmika.jpeg',
      bgGradient: 'from-emerald-500 to-teal-500',
    },
    {
      id: 9,
      name: 'Dr Raza',
      role: 'Doctor',
      content: Raza,
      thumbnail: '/images/raza.jpeg',
      bgGradient: 'from-amber-500 to-orange-500',
    },
  ];

  const [photoIndex, setPhotoIndex] = useState(0);
  const currentPhoto = photoTestimonials[photoIndex];
  const [isHovering, setIsHovering] = useState(false);

  const nextPhoto = () => setPhotoIndex((i) => (i === photoTestimonials.length - 1 ? 0 : i + 1));
  const prevPhoto = () => setPhotoIndex((i) => (i === 0 ? photoTestimonials.length - 1 : i - 1));

  // Video states management
  const [videoStates, setVideoStates] = useState(
    videoTestimonials.map(() => ({
      isPlaying: false,
      isMuted: true,
      progress: 0,
      hasInteracted: false,
      isHovered: false
    }))
  );

  const videoRefs = useRef(videoTestimonials.map(() => React.createRef()));

  const togglePlay = async (index) => {
    const vid = videoRefs.current[index].current;
    if (!vid) return;
    
    try {
      const newVideoStates = [...videoStates];
      
      if (newVideoStates[index].isPlaying) {
        vid.pause();
      } else {
        if (!newVideoStates[index].hasInteracted) {
          newVideoStates[index].hasInteracted = true;
          newVideoStates[index].isMuted = false;
          vid.muted = false;
        }
        
        await vid.play();
      }
      
      newVideoStates[index].isPlaying = !newVideoStates[index].isPlaying;
      setVideoStates(newVideoStates);
    } catch (err) {
      console.error('Video playback failed:', err);
      const newVideoStates = [...videoStates];
      vid.muted = true;
      newVideoStates[index].isMuted = true;
      await vid.play();
      newVideoStates[index].isPlaying = true;
      setVideoStates(newVideoStates);
    }
  };

  const toggleMute = (index) => {
    const vid = videoRefs.current[index].current;
    if (!vid) return;
    
    const newVideoStates = [...videoStates];
    vid.muted = !vid.muted;
    newVideoStates[index].isMuted = vid.muted;
    newVideoStates[index].hasInteracted = true;
    setVideoStates(newVideoStates);
  };

  const handleVideoHover = (index, isHovering) => {
    const newVideoStates = [...videoStates];
    newVideoStates[index].isHovered = isHovering;
    setVideoStates(newVideoStates);
  };

  useEffect(() => {
    const cleanups = videoTestimonials.map((_, index) => {
      const vid = videoRefs.current[index].current;
      if (!vid) return () => {};
      
      const updateProgress = () => {
        if (vid.duration) {
          const newVideoStates = [...videoStates];
          newVideoStates[index].progress = (vid.currentTime / vid.duration) * 100;
          setVideoStates(newVideoStates);
        }
      };
      
      const handleEnded = () => {
        const newVideoStates = [...videoStates];
        newVideoStates[index].isPlaying = false;
        newVideoStates[index].progress = 0;
        vid.currentTime = 0;
        setVideoStates(newVideoStates);
      };
      
      vid.addEventListener('timeupdate', updateProgress);
      vid.addEventListener('ended', handleEnded);
      
      return () => {
        vid.removeEventListener('timeupdate', updateProgress);
        vid.removeEventListener('ended', handleEnded);
      };
    });
    
    return () => cleanups.forEach(cleanup => cleanup());
  }, []);

  // Auto-rotate photo testimonials only when not hovering
  useEffect(() => {
    const pt = isHovering ? null : setInterval(nextPhoto, 8000);
    return () => {
      if (pt) clearInterval(pt);
    };
  }, [photoIndex, isHovering]);

  // Render star ratings
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? "text-yellow-400" : "text-gray-300"} 
        size={14}
      />
    ));
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-purple-500 filter blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-amber-500 filter blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-blue-500 filter blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500">
            Celebrity Endorsements
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hear what celebrities and influencers say about their extraordinary experiences with Traveligo
          </p>
        </motion.div>

        {/* Photo Testimonials Carousel */}
        <div className="mb-20">
          <div 
            className="relative h-[550px] rounded-3xl overflow-hidden shadow-2xl"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhoto.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className={`absolute inset-0 bg-gradient-to-br ${currentPhoto.bgGradient} p-8 flex flex-col justify-between`}
              >
                <div className="flex justify-between items-start">
                  <FaQuoteLeft className="text-white text-5xl opacity-20" />
                  <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-full p-2 shadow-lg">
                    <motion.img 
                      src={currentPhoto.image} 
                      alt={currentPhoto.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    />
                  </div>
                </div>
                
                <div className="text-center px-8">
                  <motion.p 
                    className="text-white text-2xl md:text-3xl font-medium mb-8 leading-relaxed"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    "{currentPhoto.content}"
                  </motion.p>
                  
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto"
                  >
                    {currentPhoto.highlight && (
                      <p className="text-amber-300 font-semibold mb-3 text-lg">
                        {currentPhoto.highlight}
                      </p>
                    )}
                    <h3 className="text-white text-3xl font-bold mb-1">{currentPhoto.name}</h3>
                    <p className="text-gray-300 mb-3">{currentPhoto.role}</p>
                    <div className="flex justify-center gap-1">
                      {renderStars(currentPhoto.rating)}
                    </div>
                  </motion.div>
                </div>
                
                <div className="flex justify-center gap-6">
                  <button 
                    onClick={prevPhoto}
                    className="p-4 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition-all shadow-lg hover:scale-110"
                  >
                    <FaChevronLeft className="text-white text-xl" />
                  </button>
                  <div className="flex items-center gap-2">
                    {photoTestimonials.map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setPhotoIndex(i)}
                        className={`w-3 h-3 rounded-full transition-all ${i === photoIndex ? 'bg-white w-6' : 'bg-white bg-opacity-30'}`}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={nextPhoto}
                    className="p-4 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition-all shadow-lg hover:scale-110"
                  >
                    <FaChevronRight className="text-white text-xl" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Video Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Video Testimonials
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {videoTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                onMouseEnter={() => handleVideoHover(index, true)}
                onMouseLeave={() => handleVideoHover(index, false)}
                className={`relative rounded-2xl overflow-hidden shadow-2xl aspect-[9/16] transition-all duration-300 ${videoStates[index].isHovered ? 'shadow-lg shadow-cyan-500/20' : ''}`}
              >
                <video
                  ref={videoRefs.current[index]}
                  src={testimonial.content}
                  loop
                  muted={videoStates[index].isMuted}
                  className="w-full h-full object-cover"
                  playsInline
                  preload="metadata"
                  poster={testimonial.thumbnail}
                />
                
                {/* Video overlay with controls */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-t from-black/90 via-transparent to-transparent">
                  {/* Top info */}
                  <motion.div 
                    className="text-white"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ 
                      y: videoStates[index].isHovered ? 0 : -20, 
                      opacity: videoStates[index].isHovered ? 1 : 0 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-bold text-xl">{testimonial.name}</h3>
                    <p className="text-sm opacity-80">{testimonial.role}</p>
                  </motion.div>
                  
                  {/* Center play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      onClick={() => togglePlay(index)}
                      className="p-5 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition-all backdrop-blur-md shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {videoStates[index].isPlaying ? (
                        <FaPause className="text-white text-2xl" />
                      ) : (
                        <FaPlay className="text-white text-2xl" />
                      )}
                    </motion.button>
                  </div>
                  
                  {/* Bottom controls */}
                  <motion.div 
                    className="flex flex-col gap-3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ 
                      y: videoStates[index].isHovered || videoStates[index].isPlaying ? 0 : 20, 
                      opacity: videoStates[index].isHovered || videoStates[index].isPlaying ? 1 : 0 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-full bg-gray-600 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        className="bg-amber-400 h-1.5 rounded-full"
                        style={{ width: `${videoStates[index].progress}%` }}
                        initial={{ width: 0 }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <motion.button
                        onClick={() => toggleMute(index)}
                        className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {videoStates[index].isMuted ? (
                          <FaVolumeMute className="text-white" />
                        ) : (
                          <FaVolumeUp className="text-white" />
                        )}
                      </motion.button>
                      
                      {videoStates[index].isPlaying && (
                        <span className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                          {Math.floor((videoStates[index].progress / 100) * 100)}%
                        </span>
                      )}
                    </div>
                  </motion.div>
                </div>
                
                {/* Play indicator */}
                {!videoStates[index].isPlaying && (
                  <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <FaPlay size={10} /> PLAY
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;