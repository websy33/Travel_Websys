import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiHeart, FiCalendar, FiPackage, FiChevronDown, FiX } from 'react-icons/fi';
import emailjs from '@emailjs/browser';

const Weddings = () => {
  const [activeTab, setActiveTab] = useState('kashmir');
  const [expandedService, setExpandedService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formDestination, setFormDestination] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    weddingDate: '',
    guests: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const formRef = useRef();

  // EmailJS configuration
  const emailjsConfig = {
    serviceId: 'service_9jzlq6q',
    templateId: 'template_fkm3hio',
    publicKey: '127OFHb2IQq0zSiFJ'
  };

  // Using direct image URLs from Unsplash
  const locations = {
    kashmir: {
      name: "Kashmir",
      highlights: ["Dal Lake houseboats", "Pahalgam meadows", "Mughal gardens", "Snow-capped mountains"],
      image: "https://cdn0.weddingwire.in/article/1991/3_2/960/jpg/81991-intercultural-wedding-of-kashmiri-bride-pahadi-groom-lightbucket-productions-abhishek-samridhi.jpeg",
      tagline: "The Venice of the East",
      formImage: "https://kashmirscanmagazine.com/wp-content/uploads/2023/11/kashmiri-wedding-1-1024x529.jpg"
    },
    rajasthan: {
      name: "Rajasthan",
      highlights: ["Palace weddings", "Desert safaris", "Forts & havelis", "Royal heritage"],
      image: "data:image/jpeg;base64,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",
      tagline: "Regal Weddings Fit for Kings",
      formImage: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
  };

  const services = [
    {
      title: "Cultural Wedding Specialists",
      description: "Authentic Kashmiri and Rajasthani wedding traditions with modern touches",
      icon: <FiHeart className="text-2xl" />
    },
    {
      title: "Luxury Venue Selection",
      description: "From Srinagar houseboats to Rajasthan palaces",
      icon: <FiMapPin className="text-2xl" />
    },
    {
      title: "Complete Guest Experience",
      description: "Shikara rides, desert camps, and cultural performances",
      icon: <FiCalendar className="text-2xl" />
    },
    {
      title: "Custom Indian Packages",
      description: "Mehndi, Sangeet & Pheras in dream locations",
      icon: <FiPackage className="text-2xl" />
    }
  ];

  // Special Indian wedding features with images
  const indianFeatures = [
    {
      title: "Traditional Mehndi by Lake",
      description: "Intricate henna ceremonies with Kashmiri motifs",
      image: "https://cdn0.weddingwire.in/vendor/1642/3_2/960/jpeg/whatsapp-image-2022-07-26-at-4-51-26-pm-1_15_411642-166185750249659.jpeg"
    },
    {
      title: "Royal Processions",
      description: "Elephant or horse entries in Rajasthan forts",
      image: "https://content.jdmagicbox.com/v2/comp/srinagar/u4/9999px194.x194.170827180003.i6u4/catalogue/greenath-kashmir-event-management-and-destination-wedding-planners-lal-bazar-srinagar-event-organisers-wavnytbxf9.jpg"
    },
    {
      title: "Pahalgam Meadow Ceremonies",
      description: "Vows amidst Himalayan wildflowers",
      image: "https://www.trvme.com/img/tours/kashmir-destination-wedding-im1-1.jpg"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs.sendForm(
      emailjsConfig.serviceId, 
      emailjsConfig.templateId, 
      formRef.current, 
      emailjsConfig.publicKey
    )
    .then((result) => {
      console.log(result.text);
      setSubmitMessage(`Thank you! We will contact you shortly with ${formDestination} wedding packages.`);
      setFormData({
        name: '',
        email: '',
        phone: '',
        weddingDate: '',
        guests: '',
        message: ''
      });
      setTimeout(() => {
        setShowForm(false);
        setSubmitMessage('');
      }, 3000);
    }, (error) => {
      console.log(error.text);
      setSubmitMessage('Error sending message. Please try again later.');
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  const openForm = (destination) => {
    setFormDestination(destination);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* Form Image */}
            <div className="hidden md:block md:w-1/3 relative">
              <img 
                src={locations[formDestination.toLowerCase()]?.formImage} 
                alt={formDestination} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">{formDestination} Wedding</h3>
                  <p className="text-amber-200">{locations[formDestination.toLowerCase()]?.tagline}</p>
                </div>
              </div>
            </div>
            
            {/* Form Content */}
            <div className="md:w-2/3 relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
              >
                <FiX className="text-2xl" />
              </button>
              
              <div className="p-8">
                <h3 className="text-3xl font-bold text-amber-700 mb-2">{formDestination} Wedding Packages</h3>
                <p className="text-gray-600 mb-6">Fill this form to receive our exclusive {formDestination} wedding packages</p>
                
                {submitMessage ? (
                  <div className="bg-green-100 text-green-700 p-4 rounded-lg">
                    {submitMessage}
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-700 mb-1 font-medium">Full Name*</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition duration-300"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-1 font-medium">Email*</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition duration-300"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-1 font-medium">Phone Number*</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition duration-300"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-700 mb-1 font-medium">Preferred Wedding Date</label>
                          <input
                            type="date"
                            name="weddingDate"
                            value={formData.weddingDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition duration-300"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-1 font-medium">Approximate Number of Guests</label>
                          <select
                            name="guests"
                            value={formData.guests}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition duration-300"
                          >
                            <option value="">Select</option>
                            <option value="1-50">1-50</option>
                            <option value="50-100">50-100</option>
                            <option value="100-200">100-200</option>
                            <option value="200+">200+</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-1 font-medium">Wedding Type</label>
                          <select
                            name="weddingType"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition duration-300"
                          >
                            <option value="">Select</option>
                            <option value="Traditional">Traditional</option>
                            <option value="Modern">Modern</option>
                            <option value="Fusion">Fusion</option>
                            <option value="Interfaith">Interfaith</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-gray-700 mb-1 font-medium">Additional Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition duration-300"
                        placeholder="Tell us about your dream wedding..."
                      ></textarea>
                    </div>
                    
                    <input type="hidden" name="destination" value={formDestination} />
                    
                    <div className="mt-8">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300 disabled:opacity-70 flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="https://kashmirscanmagazine.com/wp-content/uploads/2023/11/kashmiri-wedding-1-1024x529.jpg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          `Get ${formDestination} Packages`
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="https://cdn0.weddingwire.in/vendor/5353/3_2/960/jpeg/458f9999-0728-43d3-9e41-fca56d6936df_15_365353-163390124139513.jpeg" 
          alt="Wedding background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif">
            <span className="text-amber-300">Indian</span> Destination Weddings
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
            Celebrate your union amidst Himalayan peaks or royal palaces
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transition-colors duration-300"
            onClick={() => openForm('Kashmir')}
          >
            Explore Indian Destinations
          </motion.button>
        </motion.div>
      </section>

      {/* Location Tabs */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Featured Indian Wedding Destinations</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From the valleys of Kashmir to the deserts of Rajasthan, we create unforgettable Indian weddings
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            {Object.keys(locations).map((locationKey) => (
              <button
                key={locationKey}
                onClick={() => setActiveTab(locationKey)}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${activeTab === locationKey ? 'bg-white shadow text-amber-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                {locations[locationKey].name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">{locations[activeTab].name} Weddings</h3>
            <p className="text-xl text-amber-600 mb-6 italic">{locations[activeTab].tagline}</p>
            <p className="text-gray-600 mb-6">
              Experience the magic of {locations[activeTab].name} with our exclusive wedding packages that blend traditional Indian ceremonies with breathtaking landscapes.
            </p>
            <ul className="grid grid-cols-2 gap-4 mb-8">
              {locations[activeTab].highlights.map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-amber-500 mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{highlight}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => openForm(locations[activeTab].name)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              Plan {locations[activeTab].name} Wedding
            </button>
          </div>
          <div className="rounded-xl overflow-hidden shadow-xl">
            <img 
              src={locations[activeTab].image} 
              alt={locations[activeTab].name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Indian Wedding Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive services tailored for traditional Indian weddings in spectacular locations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-amber-500 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Features */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Unique Indian Wedding Experiences</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Traditional elements reimagined in breathtaking destinations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {indianFeatures.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              </div>
              <div className="bg-white p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Plan Your Dream Indian Wedding?</h2>
          <p className="text-xl text-amber-100 mb-8">
            Our wedding specialists will create a customized package for your perfect destination wedding
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => openForm('Kashmir')}
              className="bg-white text-amber-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-colors duration-300"
            >
              Kashmir Wedding Inquiry
            </button>
            <button
              onClick={() => openForm('Rajasthan')}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-amber-600 font-bold py-4 px-8 rounded-lg transition-colors duration-300"
            >
              Rajasthan Wedding Inquiry
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Weddings;