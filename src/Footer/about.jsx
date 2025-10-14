import React from 'react';
import { motion } from 'framer-motion';
import { FaUmbrellaBeach, FaRoute, FaHeart, FaConciergeBell, FaBullseye, FaEye } from 'react-icons/fa';
import { GiAirplane, GiEarthAmerica } from 'react-icons/gi';

const About = () => {
  // Animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Pink color variants
  const pink = {
    primary: 'bg-gradient-to-r from-pink-500 to-pink-600',
    light: 'text-pink-400',
    medium: 'text-pink-500',
    dark: 'text-pink-600',
    border: 'border-pink-500'
  };

  return (
    <section className="relative bg-[url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2565&auto=format')] bg-cover bg-center py-28 px-6 before:absolute before:inset-0 before:bg-black/30 before:z-0">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif">
            Why <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-pink-600">Traveligo</span>?
          </h1>
          <div className={`w-32 h-1 ${pink.primary} mx-auto mb-8`}></div>
          <p className="text-gray-100 max-w-3xl mx-auto text-xl leading-relaxed">
            We don't just book trips - we craft <span className={`font-semibold ${pink.light}`}>unforgettable journeys</span> 
            that ignite your passion for exploration.
          </p>
        </motion.div>

        {/* Vision & Mission Section - REMAINS EXACTLY THE SAME */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
        >
          {/* Mission Card */}
          <motion.div
            variants={fadeInUp}
            className="bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-white/20"
          >
            <div className="flex items-center mb-6">
              <div className={`p-3 rounded-full ${pink.primary} text-white mr-4`}>
                <FaBullseye className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-gray-600 mb-4">
              To revolutionize travel by making it <span className={`font-semibold ${pink.medium}`}>accessible, personalized, and stress-free</span> for 
              every type of traveler through innovative technology and exceptional service.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className={`${pink.medium} mr-2`}>✓</span>
                <span>Democratize luxury travel experiences</span>
              </li>
              <li className="flex items-start">
                <span className={`${pink.medium} mr-2`}>✓</span>
                <span>Provide 24/7 personalized support</span>
              </li>
              <li className="flex items-start">
                <span className={`${pink.medium} mr-2`}>✓</span>
                <span>Deliver seamless booking experiences</span>
              </li>
            </ul>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            variants={fadeInUp}
            className="bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-white/20"
          >
            <div className="flex items-center mb-6">
              <div className={`p-3 rounded-full ${pink.primary} text-white mr-4`}>
                <FaEye className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Vision</h2>
            </div>
            <p className="text-gray-600 mb-4">
              To become the <span className={`font-semibold ${pink.medium}`}>world's most trusted travel companion</span>, 
              transforming how people explore the planet through:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className={`${pink.medium} mr-2`}>✦</span>
                <span>Sustainable travel initiatives</span>
              </li>
              <li className="flex items-start">
                <span className={`${pink.medium} mr-2`}>✦</span>
                <span>Global community of travel enthusiasts</span>
              </li>
              <li className="flex items-start">
                <span className={`${pink.medium} mr-2`}>✦</span>
                <span>Cutting-edge virtual travel experiences</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Value Propositions - REMAINS EXACTLY THE SAME */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {[
            {
              icon: <GiAirplane className="text-4xl mb-4" style={{ color: '#EC4899' }} />,
              title: "500+ Destinations",
              text: "From hidden gems to iconic landmarks"
            },
            {
              icon: <FaUmbrellaBeach className="text-4xl mb-4" style={{ color: '#EC4899' }} />,
              title: "Tailored Packages",
              text: "Beach escapes, mountain treks & city breaks"
            },
            {
              icon: <FaConciergeBell className="text-4xl mb-4" style={{ color: '#EC4899' }} />,
              title: "24/7 Concierge",
              text: "Dedicated travel experts at your service"
            },
            {
              icon: <FaHeart className="text-4xl mb-4" style={{ color: '#EC4899' }} />,
              title: "5-Star Reviews",
              text: "Trusted by 50,000+ travelers"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ 
                y: -10,
                boxShadow: '0 20px 25px -5px rgba(236, 72, 153, 0.1), 0 10px 10px -5px rgba(236, 72, 153, 0.04)'
              }}
              className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-white/20 hover:border-pink-300/30 transition-all"
            >
              <div className="text-center">
                {item.icon}
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Story Section with your content */}
        <motion.div 
          variants={fadeInUp}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 max-w-4xl mx-auto shadow-2xl border border-white/20 mb-20"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <GiEarthAmerica className="text-5xl mb-6" style={{ color: '#EC4899' }} />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold" style={{ color: '#DB2777' }}>Established in 2018</span>, Traveligo has rapidly grown to be the top destination management company serving the exotic destinations of Jammu, Kashmir, and Ladakh.
              </p>
              <p className="text-gray-600 mb-4">
                Praised as one of the most reliable and high-quality names in the Indian tourism circuit, Traveligo is an expert supplier to an elite national client base and is involved with big names such as Bollywood celebrities <span className="font-semibold">Vishal Bhardwaj</span>, <span className="font-semibold">Ishan Khattar</span>, and <span className="font-semibold">IP Singh</span>.
              </p>
              <p className="text-gray-600 mb-4">
                For clients who want the very best, our service reputation is paramount, as it is for the entertainment-based clientele with their demands for privacy and luxury within flawlessly prepared travel packages.
              </p>
              <p className="text-gray-600">
                With an unmatched network of contacts in the travel and tourism sector, Traveligo surpasses at tailoring experiences that meet the discerning tastes of both local travelers and VIPs. We assure you that every trip is planned and executed with professionalism and detail second to none.
              </p>
            </div>
            <div className="flex-1">
              <div className="bg-[url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1740&auto=format')] h-64 md:h-80 bg-cover bg-center rounded-xl shadow-lg"></div>
            </div>
          </div>
        </motion.div>

        {/* CTA - REMAINS EXACTLY THE SAME */}
        <motion.div 
          variants={fadeInUp}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Write Your Adventure?</h3>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 20px 5px rgba(236, 72, 153, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            className={`${pink.primary} text-white font-bold px-10 py-4 rounded-full text-lg transition-all shadow-lg hover:shadow-pink-500/40`}
          >
            Start Planning Today →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default About;