import { useNavigate } from 'react-router-dom';
import logo from './logo.jpeg';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';

// Import Font Awesome icons
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPlane,
  FaStar,
  FaArrowRight
} from 'react-icons/fa';

// Payment method images
const paymentImages = {
  Visa: "./images/Visa.webp",
  MasterCard: "./images/MasterCard.webp",
  Rupay: "./images/Rupay.webp"
};

const addFallbackSrc = (ev, paymentMethod) => {
  ev.target.src = `https://placehold.co/80x40/ec4899/white?text=${paymentMethod}`;
  ev.target.onerror = null;
};

emailjs.init("37pN2ThzFwwhwk7ai");

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const footerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 1]);
  const yTransform = useTransform(scrollYProgress, [0, 1], [100, 0]);

  useEffect(() => {
    const unsubscribe = opacity.on("change", value => {
      setIsVisible(value > 0.3);
    });
    return () => unsubscribe();
  }, [opacity]);

  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  const links = {
    "Domestic Packages": [
      { name: 'Kashmir Tours', path: '/kashmir' },
      { name: 'Ladakh Adventures', path: '/ladakh' },
      { name: 'Honeymoon Specials', path: '/honeymoon' },
      { name: 'Himachal Manali Packages', path: '/Himachal' },
      { name: 'Rajasthan Packages', path: '/Rajasthan' },
      { name: 'Goa Packages', path: '/Goa' },
      { name: 'Kerala Packages', path: '/Kerala' },
      { name: 'Spiti Valley', path: '/Spiti' },
      { name: 'Andaman and Nicobar Islands', path: '/Andaman' },
      { name: 'Bhutan', path: '/Bhutan' },
      { name: 'Meghalaya', path: '/Meghalaya' },
      { name: 'Darjeeling Gangtok and Sikkim', path: '/GangtokDarjeeling' },
      { name: 'Uttarakhand', path: '/Utrakhand' },
      { name: 'Bangalore Mysore Ooty', path: '/Banglore' },
      { name: 'Lakshadweep', path: '/Lakshadweep' },
      { name: 'Madhya Pradesh', path: '/MadhyaPradesh' }
    ],
    "International Packages": [
      { name: 'Dubai Packages', path: '/Dubai' },
      { name: 'Bali Packages', path: '/Bali' },
      { name: 'Thailand Packages', path: '/Thailand' },
      { name: 'Vietnam', path: '/Vietnam' },
      { name: 'Singapore and Malaysia', path: '/Singapore' },
      { name: 'Hong Kong and Macao', path: '/Hong' },
      { name: 'New Zealand', path: '/NewZealand' },
      { name: 'South Africa', path: '/SouthAfrica' },
      { name: 'Japan', path: '/Japan' },
      { name: 'Azerbaijan', path: '/Azerbaijan' },
      { name: 'Almaty', path: '/Almaty' },
      { name: 'Georgia', path: '/Georgia' },
      { name: 'Uzbekistan', path: '/Uzbekistan' },
      { name: 'Kazakhstan', path: '/Kazakhstan' },
      { name: 'South Korea', path: '/South' },
      { name: 'Sri Lanka', path: '/Srilanka' },
      { name: 'Egypt', path: '/Egypt' },
      { name: 'Russia', path: '/Russia' },
      { name: 'Mauritius', path: '/Mauritius' },
      { name: 'Turkey', path: '/Turkey' },
      { name: 'Nepal', path: '/Nepal' }
    ],
    "Company": [
      { name: 'About Us', path: '/about' },
      { name: 'Our Team', path: '/team' },
      { name: 'Testimonials', path: '/Testimonials' },
      { name: 'Women\'s Solo trip', path: '/Womens' },
      { name: 'Group Trip', path: '/Section' },
      { name: 'Careers', path: '/careers' },
      { name: 'Gallery', path: '/Gallery' },
      { name: 'Destination Weddings', path: '/Weddings' }
    ],
    "Support": [
      { name: 'Contact Us', path: '/contact' },
      { name: 'FAQs', path: '/faqs' },
      { name: 'Booking Policy', path: '/policy' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Cancellation Policy', path: '/cancellation' }
    ]
  };

  // Policy links mapping
  const policyLinks = {
    'Privacy Policy': '/privacy',
    'Terms of Service': '/terms',
    'Cookie Policy': '/cookies'
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await emailjs.send(
        'service_ov629rm',
        'template_lwqkh1f',
        { to_email: 'traveligo00@gmail.com', from_email: email, website: 'Traveligo', reply_to: email },
        '37pN2ThzFwwhwk7ai'
      );
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } catch (err) {
      setError('Failed to subscribe. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Professional Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardHoverVariants = {
    rest: { 
      scale: 1, 
      y: 0
    },
    hover: { 
      scale: 1.02, 
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const linkHoverVariants = {
    rest: { 
      x: 0,
      color: "#9CA3AF"
    },
    hover: { 
      x: 4,
      color: "#EC4899",
      transition: {
        duration: 0.2
      }
    }
  };

  // Social media data
  const socialMedia = [
    { 
      icon: <FaFacebookF className="text-sm" />, 
      color: 'text-blue-500', 
      url: 'https://www.facebook.com/',
      name: 'Facebook'
    },
    { 
      icon: <FaTwitter className="text-sm" />, 
      color: 'text-black', 
      url: 'https://x.com/Traveligo159449',
      name: 'Twitter'
    },
    { 
      icon: <FaInstagram className="text-sm" />, 
      color: 'text-pink-600', 
      url: 'https://www.instagram.com/traveligo_',
      name: 'Instagram'
    },
    { 
      icon: <FaLinkedinIn className="text-sm" />, 
      color: 'text-blue-600', 
      url: 'https://www.linkedin.com/company/traveligo/',
      name: 'LinkedIn'
    },
    { 
      icon: <FaYoutube className="text-sm" />, 
      color: 'text-red-600', 
      url: 'https://youtube.com/@traveligoo',
      name: 'YouTube'
    }
  ];

  // Contact data
  const contactInfo = [
    { 
      icon: <FaPhone className="text-sm" />, 
      label: "Phone", 
      value: "+91 9796337997", 
      href: "tel:+919796337997" 
    },
    { 
      icon: <FaEnvelope className="text-sm" />, 
      label: "Email", 
      value: "info@traveligo.in", 
      href: "mailto:info@traveligo.in" 
    },
    { 
      label: "Website", 
      value: "www.traveligo.in" 
    },
    { 
      icon: <FaClock className="text-sm" />, 
      label: "Availability", 
      value: "24/7" 
    }
  ];

  // Trust badges data
  const trustBadges = [
    '5000+ Happy Travelers', 
    '50+ Destinations', 
    '24/7 Support', 
    'Best Price Guarantee'
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16 pb-12 overflow-hidden" ref={footerRef}>
      {/* Professional Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-blue-500/5" />
      </div>

      <motion.div 
        className="container mx-auto px-6 relative z-10"
        style={{ opacity, y: yTransform }}
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {/* Professional Header Section */}
        <header className="text-center mb-12">
          <motion.div className="flex flex-col items-center mb-8" variants={itemVariants}>
            {/* Professional Logo */}
            <motion.div 
              className="mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-md opacity-50"></div>
                <img 
                  src={logo} 
                  alt="Traveligo" 
                  className="w-20 h-20 object-contain relative z-10 mx-auto rounded-lg"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </motion.div>
            
            
            <motion.p 
              className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Your trusted partner for unforgettable travel experiences
            </motion.p>
          </motion.div>
          
          {/* Trust Badges */}
          <motion.div className="flex flex-wrap justify-center gap-6 mt-8" variants={itemVariants}>
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge}
                className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300 text-sm font-medium">{badge}</span>
              </motion.div>
            ))}
          </motion.div>
        </header>

        {/* Main Content Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Object.entries(links).map(([category, items], index) => (
            <motion.section
              key={category}
              variants={itemVariants}
              custom={index}
            >
              <motion.div 
                className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl border border-gray-700/30 hover:border-pink-500/20 transition-all duration-300 group h-full"
                variants={cardHoverVariants}
                whileHover="hover"
              >
                <header className="mb-4 pb-3 border-b border-gray-700/30">
                  <h2 className="font-semibold text-white text-lg uppercase tracking-wide">
                    {category}
                  </h2>
                </header>
                
                <nav>
                  <ul className="space-y-2">
                    {items.map((item, itemIndex) => (
                      <li key={item.name}>
                        <motion.button 
                          onClick={() => handleNavigation(item.path)}
                          className="text-gray-400 hover:text-white transition-colors duration-200 text-sm w-full text-left py-1.5 flex items-center gap-2 group/item"
                          variants={linkHoverVariants}
                          whileHover="hover"
                        >
                          <span className="text-pink-500 text-xs">›</span>
                          <span className="group-hover/item:translate-x-1 transition-transform duration-200">
                            {item.name}
                          </span>
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                </nav>
                
                {/* Quick Support for Support column */}
                {category === "Support" && (
                  <aside className="mt-4 pt-4 border-t border-gray-700/30">
                    <h3 className="font-medium text-white mb-3 text-sm">Quick Support</h3>
                    <nav className="space-y-2">
                      {[
                        { icon: '📧', label: 'Email', action: () => handleNavigation('/contact') },
                        { icon: '📞', label: 'Call', action: () => window.open('tel:+919796337997', '_self') },
                        { icon: '💬', label: 'Live Chat', action: () => handleNavigation('/contact') }
                      ].map((button, btnIndex) => (
                        <motion.button
                          key={button.label}
                          onClick={button.action}
                          className="w-full bg-gray-700/30 hover:bg-gray-700/50 text-gray-300 py-2 px-3 rounded text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-xs">{button.icon}</span>
                          {button.label}
                        </motion.button>
                      ))}
                    </nav>
                  </aside>
                )}
              </motion.div>
            </motion.section>
          ))}
        </section>

        {/* Professional Info Sections */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Company Info */}
          <motion.article variants={itemVariants}>
            <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl border border-gray-700/30 h-full">
              <h2 className="font-semibold text-white mb-4 text-lg">Company Information</h2>
              <dl className="space-y-3">
                {[
                  { label: "Company Name", value: "Traveligo" },
                  { label: "Founded", value: "2018" },
                  { label: "GSTIN", value: "01AHBPH33651Z7" },
                  { label: "Status", value: "Verified", color: "text-green-400" }
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center py-2 border-b border-gray-700/30 last:border-b-0"
                  >
                    <dt className="text-gray-400 text-sm">{item.label}</dt>
                    <dd className={`font-medium text-white text-sm ${item.color || ''}`}>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.article>

          {/* Contact Info */}
          <motion.section variants={itemVariants} className="lg:col-span-2">
            <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl border border-gray-700/30 h-full">
              <h2 className="font-semibold text-white mb-4 text-lg">Contact Details</h2>
              <address className="grid grid-cols-1 md:grid-cols-2 gap-4 not-italic">
                {contactInfo.map((contact, index) => (
                  <div
                    key={contact.label}
                    className="flex items-center gap-3 p-3 bg-gray-700/20 rounded-lg hover:bg-gray-700/30 transition-colors duration-200"
                  >
                    {contact.icon && <span className="text-gray-400">{contact.icon}</span>}
                    <div>
                      <div className="text-gray-400 text-xs">{contact.label}</div>
                      {contact.href ? (
                        <a href={contact.href} className="font-medium text-white text-sm hover:text-pink-400 transition-colors">
                          {contact.value}
                        </a>
                      ) : (
                        <span className="font-medium text-white text-sm">{contact.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </address>
            </div>
          </motion.section>
        </section>

        {/* Office Details Section */}
        <motion.section 
          className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl border border-gray-700/30 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-lg font-bold mb-4 text-white flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            <span>Our Offices</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Srinagar Office */}
            <article className="bg-gray-700/20 p-4 rounded-lg border border-gray-600/30">
              <div className="flex items-start">
                <div className="p-2 bg-gray-600/30 rounded-lg mr-3">
                  <FaMapMarkerAlt className="text-pink-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">Srinagar Office</h3>
                  <address className="text-gray-300 text-xs not-italic">
                    First Boulevard Road Lane, Dalgate<br />
                    Srinagar, Jammu & Kashmir<br />
                    190001, India
                  </address>
                </div>
              </div>
              <div className="flex justify-center mt-2">
                <a 
                  href="https://maps.google.com/?q=First+Boulevard+Road+Lane,+Dalgate,+Srinagar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 text-xs font-medium flex items-center transition-colors"
                >
                  View on Map <FaArrowRight className="ml-1 text-xs" />
                </a>
              </div>
            </article>
            
            {/* Delhi Office */}
            <article className="bg-gray-700/20 p-4 rounded-lg border border-gray-600/30">
              <div className="flex items-start">
                <div className="p-2 bg-gray-600/30 rounded-lg mr-3">
                  <FaMapMarkerAlt className="text-pink-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">Delhi Office</h3>
                  <address className="text-gray-300 text-xs not-italic">
                    Abul Fazal Enclave Part 2<br />
                    Jamia Nagar, Okhla<br />
                    New Delhi, 110025, India
                  </address>
                </div>
              </div>
              <div className="flex justify-center mt-2">
                <a 
                  href="https://maps.apple.com/?address=Abul%20Fazal%20Enclave%20Part%202,%20New%20Delhi,%20110025,%20Delhi,%20India&auid=3140475592879641277&ll=28.549413,77.304334&lsp=6489&q=Abul%20Fazal%20Enclave%20Part%202&t=m"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 text-xs font-medium flex items-center transition-colors"
                >
                  View on Map <FaArrowRight className="ml-1 text-xs" />
                </a>
              </div>
            </article>
          </div>
        </motion.section>

        {/* Professional Payment Methods */}
        <motion.section 
          className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl border border-gray-700/30 mb-8"
          variants={itemVariants}
        >
          <h2 className="font-semibold text-white mb-4 text-lg text-center">Accepted Payment Methods</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {Object.entries(paymentImages).map(([method, src]) => (
              <motion.figure
                key={method}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white p-3 rounded-lg shadow-lg"
              >
                <img 
                  src={src} 
                  alt={`${method} payment method`} 
                  className="h-6 object-contain"
                  onError={(e) => addFallbackSrc(e, method)}
                />
                <figcaption className="sr-only">{method} payment method</figcaption>
              </motion.figure>
            ))}
          </div>
          <p className="text-gray-400 text-center mt-4 text-sm">
            All transactions are secure and encrypted
          </p>
        </motion.section>

        {/* Footer Bottom Bar */}
        <footer className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            {socialMedia.map((social, i) => (
              <motion.a 
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.color} hover:scale-110 transition-transform relative group`}
                whileHover={{ 
                  y: -3, 
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  y: [0, -5, 0],
                  transition: { duration: 4, repeat: Infinity, delay: i * 0.5 }
                }}
                aria-label={`Follow us on ${social.name}`}
              >
                {social.icon}
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded-md transition-opacity duration-300 whitespace-nowrap">
                  {social.name}
                </span>
              </motion.a>
            ))}
          </div>
          
          <nav className="flex flex-wrap gap-4 text-sm justify-center mb-4 md:mb-0">
            {Object.entries(policyLinks).map(([policy, path], index) => (
              <motion.button 
                key={policy}
                onClick={() => handleNavigation(path)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {policy}
              </motion.button>
            ))}
          </nav>
          
          <div className="text-center md:text-right">
            <small className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Websy Technologies. All rights reserved.
            </small>
            <p className="text-gray-500 text-xs mt-1">Crafted with excellence</p>
          </div>
        </footer>
      </motion.div>

      {/* Professional Floating Action Buttons */}
      <AnimatePresence>
        {isVisible && (
          <aside className="fixed left-6 bottom-6 z-50 flex flex-col gap-3">
            {/* Contact Button */}
            <motion.button
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
              initial={{ scale: 0, opacity: 0, x: -50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0, opacity: 0, x: -50 }}
              whileHover={{ 
                scale: 1.1,
                y: -2
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleNavigation('/contact')}
              aria-label="Contact Us"
            >
              <FaEnvelope className="text-lg" />
              <motion.span 
                className="absolute left-full ml-3 bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap"
                initial={{ x: -10, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
              >
                Contact Us
              </motion.span>
            </motion.button>

            {/* Scroll to Top Button */}
            <motion.button
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
              initial={{ scale: 0, opacity: 0, x: -50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0, opacity: 0, x: -50 }}
              transition={{ delay: 0.1 }}
              whileHover={{ 
                scale: 1.1,
                y: -2
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
            >
              <span className="text-lg">↑</span>
              <motion.span 
                className="absolute left-full ml-3 bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap"
                initial={{ x: -10, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
              >
                Back to top
              </motion.span>
            </motion.button>
          </aside>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;