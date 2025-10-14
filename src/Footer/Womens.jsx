import React, { useState, useRef, useEffect } from 'react';
import { FaMapMarkerAlt, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaQuoteLeft, FaHeart, FaShare } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Debashree from '/videos/Debashree.mp4';
import Debashree1 from '/videos/Debashree1.mp4';

const clientTestimonials = [
  {
    id: 1,
    name: 'Ms Debashree Mukerjee',
    role: 'Solo Traveler',
    videoUrl: Debashree,
    thumbnail: '/images/Debashree.jpeg',
    location: 'Kashmir, India',
    quote: "Traveling solo through Kashmir was a transformative experience. The beauty of the landscape was matched only by the warmth of the local people.",
    type: 'solo',
    duration: '7 days',
    highlights: ['Houseboat stay in Dal Lake', 'Trekking in Gulmarg', 'Shikara ride at sunset']
  },
  
  
];

const samplePosts = [
  {
    id: 1,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
    location: 'Rishikesh, India',
    user: {
      name: 'TravelWithPriya',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
    }
  },
  {
    id: 2,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995',
    location: 'Himalayas, India',
    user: {
      name: 'MountainGirl',
      avatar: 'https://randomuser.me/api/portraits/women/67.jpg'
    }
  },
  {
    id: 3,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60',
    location: 'Udaipur, India',
    user: {
      name: 'CultureExplorer',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
    }
  }
];

const VideoPlayer = React.forwardRef(({ videoUrl, thumbnail, isPlaying, onPlayToggle, isMuted, onMuteToggle }, ref) => {
  return (
    <div className="overflow-hidden shadow-2xl relative h-[650px] w-full rounded-2xl">
      <video
        ref={ref}
        src={videoUrl}
        poster={thumbnail}
        controls={false}
        muted={isMuted}
        loop
        className="w-full h-full object-cover cursor-pointer"
        onClick={onPlayToggle}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6">
        <div className="flex items-center space-x-4 w-full">
          <motion.button
            onClick={onPlayToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white bg-pink-500 rounded-full p-4 backdrop-blur-sm shadow-lg"
          >
            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} className="ml-1" />}
          </motion.button>
          
          <motion.button
            onClick={onMuteToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white bg-black/50 rounded-full p-3 backdrop-blur-sm"
          >
            {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
          </motion.button>
        </div>
      </div>
    </div>
  );
});

const Womens = () => {
  const videoRefs = useRef(clientTestimonials.map(() => React.createRef()));
  const [videoStates, setVideoStates] = useState(
    clientTestimonials.map(() => ({
      isPlaying: false,
      isMuted: true
    }))
  );

  const togglePlay = (index) => {
    const newStates = [...videoStates];
    const video = videoRefs.current[index].current;
    
    if (video) {
      if (newStates[index].isPlaying) {
        video.pause();
      } else {
        // Pause all other videos
        clientTestimonials.forEach((_, i) => {
          if (i !== index && videoStates[i].isPlaying) {
            const otherVideo = videoRefs.current[i].current;
            if (otherVideo) {
              otherVideo.pause();
              const updatedStates = [...videoStates];
              updatedStates[i].isPlaying = false;
              setVideoStates(updatedStates);
            }
          }
        });
        
        video.play().catch(error => {
          console.log("Play failed:", error);
        });
      }
      newStates[index].isPlaying = !newStates[index].isPlaying;
      setVideoStates(newStates);
    }
  };

  const toggleMute = (index) => {
    const newStates = [...videoStates];
    const video = videoRefs.current[index].current;
    
    if (video) {
      video.muted = !newStates[index].isMuted;
      newStates[index].isMuted = !newStates[index].isMuted;
      setVideoStates(newStates);
    }
  };

  useEffect(() => {
    // Pause all videos when component unmounts
    return () => {
      clientTestimonials.forEach((_, index) => {
        const video = videoRefs.current[index].current;
        if (video) {
          video.pause();
        }
      });
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-pink-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-500 py-32 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Women's Travel Stories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Discover transformative journeys through the eyes of adventurous women
          </motion.p>
        </div>
      </div>

      {/* Main Video Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-16">
            <span className="inline-block px-6 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-medium mb-4 tracking-wider">
              VIDEO TESTIMONIALS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Featured Travel Experiences</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Real stories from women who embarked on unforgettable journeys
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {clientTestimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 transition-all duration-300 hover:shadow-3xl"
              >
                {/* Video Container */}
                <div className="relative">
                  <VideoPlayer
                    ref={videoRefs.current[index]}
                    videoUrl={testimonial.videoUrl}
                    thumbnail={testimonial.thumbnail}
                    isPlaying={videoStates[index].isPlaying}
                    onPlayToggle={() => togglePlay(index)}
                    isMuted={videoStates[index].isMuted}
                    onMuteToggle={() => toggleMute(index)}
                  />
                  
                  {/* Floating location tag */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                    <div className="flex items-center text-sm font-medium text-gray-800">
                      <FaMapMarkerAlt className="mr-2 text-pink-500" />
                      <span>{testimonial.location}</span>
                    </div>
                  </div>
                </div>
                
                {/* Video Info */}
                <div className="p-8">
                  <div className="flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">{testimonial.name}</h3>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-gray-500 font-medium">{testimonial.role}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-pink-500 font-medium">{testimonial.duration}</span>
                      </div>
                    </div>

                    <div className="relative mb-6">
                      <FaQuoteLeft className="absolute -left-6 top-0 text-pink-300 text-3xl" />
                      <p className="text-gray-700 text-lg pl-6 italic font-serif leading-relaxed">"{testimonial.quote}"</p>
                    </div>
                    
                    <div className="bg-pink-50 rounded-xl p-5 border border-pink-100">
                      <h4 className="font-bold text-pink-600 text-lg mb-3">Trip Highlights</h4>
                      <div className="space-y-2">
                        {testimonial.highlights.map((highlight, i) => (
                          <div key={i} className="flex items-start">
                            <div className="bg-pink-100 text-pink-600 rounded-full p-1 mr-3 mt-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <p className="text-gray-700 text-sm">{highlight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                      <div className="flex space-x-4">
                        
                      </div>
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium capitalize">
                        {testimonial.type}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Images Display Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <span className="inline-block px-6 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-medium mb-4 tracking-wider">
              TRAVEL GALLERY
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Moments of Wonder</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Captured memories from our community of women travelers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {samplePosts.map(post => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl"
              >
                {/* Image Container */}
                <div className="w-full aspect-square overflow-hidden relative">
                  <img 
                    src={post.url} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-pink-300" />
                        <span className="font-medium">{post.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Post Info */}
                <div className="p-6">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={post.user.avatar} 
                      alt={post.user.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-pink-200 shadow-sm"
                    />
                    <div>
                      <p className="font-bold text-gray-800">{post.user.name}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>Travel Enthusiast</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Values Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="inline-block px-6 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-medium mb-4 tracking-wider">
              OUR PROMISE
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Travel Designed for Women</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-xl">
              Experiences crafted to empower, inspire, and connect women through transformative journeys
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Safety & Comfort",
                content: "Women-only accommodations and verified female guides ensure your peace of mind throughout the journey.",
                icon: "🛡️",
                color: "bg-purple-100 text-purple-600"
              },
              {
                title: "Authentic Encounters",
                content: "Meaningful interactions with local women artisans, chefs, and storytellers for genuine cultural exchange.",
                icon: "👭",
                color: "bg-pink-100 text-pink-600"
              },
              {
                title: "Empowering Adventures",
                content: "Activities designed to build confidence and create lifelong memories in a supportive environment.",
                icon: "💪",
                color: "bg-amber-100 text-amber-600"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-lg text-center border border-gray-100 hover:border-pink-200 transition-all hover:transform hover:-translate-y-2"
              >
                <div className={`w-20 h-20 ${item.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-500 py-28 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10 z-0"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-6 py-2 bg-white/20 rounded-full text-sm font-medium mb-6 tracking-wider">
              READY TO EXPLORE?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready for Your Journey?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-10">
              Join our community of adventurous women and discover your next transformative experience.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-pink-600 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-gray-50 transition-all"
            >
              Explore Upcoming Trips
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Womens;