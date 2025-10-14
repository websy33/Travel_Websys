import { FaFilm, FaGlobe, FaLightbulb, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaInstagram, FaYoutube, FaPenFancy, FaChartLine, FaLinkedin, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Er. Tahir Hussain",
      role: "Founder & CEO",
      bio: "Visionary entrepreneur redefining travel experiences through innovative technology and deep industry expertise. With a passion for excellence, he leads Traveligo to new heights in the tourism sector.",
      image: '/images/TahirHussain.jpeg',
      expertise: ["Strategic Planning", "Tech-Driven Solutions", "Business Development"],
      achievements: [
        "300+ successful travel campaigns",
        "5+ years in film production",
        "Recognized industry leader"
      ]
    },
   {
  "id": 2,
  "name": "Ms. Noora Noor-ul-Amin",
  "role": "Branding Consultant",
  "bio": "Creative digital strategist specializing in brand storytelling. Delivered 250% engagement growth through innovative social campaigns.",
  "image": "/images/noor.jpeg",
  "expertise": [
    "Brand Strategy",
    "Social Media Growth",
    "Content Creation", 
    "SEO Optimization"
  ]
},
    {
      id: 3,
      name: "Er.Farhat Reyaz",
      role: "Software Engineer",
      bio: "Tech innovator building seamless digital experiences. Specializes in creating responsive, user-friendly platforms that power Traveligo's exceptional service delivery.",
      image: '/images/Farhat.jpeg',
      expertise: ["Full Stack Development", "React & Node.js", "API Integration", "UI/UX"],
      techStack: ["JavaScript", "Python", "AWS", "MongoDB"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-32">
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Meet The <span className="text-yellow-300">Traveligo</span> Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Passionate professionals crafting unforgettable travel experiences
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </div>

       {/* Founder Section - All Original Text Preserved */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-1 shadow-xl"
          >
            <div className="bg-white rounded-3xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Founder Image */}
                <div className="relative h-[600px] lg:h-full">
                  <img 
                    src='/images/TahirHussain.jpeg'
                    alt="Er. Tahir Hussain"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent flex items-end p-8">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg w-full">
                      <h3 className="text-3xl font-bold text-gray-800">Er. Tahir Hussain</h3>
                      <div className="flex items-center mt-2">
                        <FaStar className="text-yellow-400 mr-2" />
                        <span className="text-blue-600 font-medium">Founder & CEO</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Founder Content - Original Text Fully Preserved */}
                <div className="p-10">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">Er. Tahir Hussain</h3>
                    <p className="text-lg text-gray-600 mb-6">
                      A dynamic entrepreneur and the visionary founder of Traveligo, Tahir has revolutionized travel experiences with his unique blend of creativity and precision.
                    </p>

                    <div className="space-y-6 mb-8">
                      <div className="flex items-start bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                        <div className="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0">
                          <FaFilm className="text-blue-600 text-xl" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 mb-2">Film Industry Expertise</h4>
                          <p className="text-gray-600">
                            Tahir's extensive experience as a line producer has been instrumental in his success. He has orchestrated intricate logistics, budgets, and schedules for numerous film productions, requiring meticulous planning and seamless coordination.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start bg-purple-50/50 p-5 rounded-xl border border-purple-100">
                        <div className="bg-purple-100 p-3 rounded-full mr-4 flex-shrink-0">
                          <FaGlobe className="text-purple-600 text-xl" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 mb-2">Travel Visionary</h4>
                          <p className="text-gray-600">
                            Under Tahir's leadership, Traveligo. has become renowned for tailor-made travel packages and customer-centric approach, reflecting his dedication to excellence and attention to detail.
                          </p>
                        </div>
                      </div>

                     
                    </div>

                    {/* Filmography Highlights - Original Text Preserved */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <h4 className="font-bold text-gray-800 mb-4">Filmography Highlights:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm font-medium mr-3">2024</span>
                          <span>"Songs of Paradise" - Line Producer & Producer</span>
                        </li>
                        <li className="flex items-center">
                          <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-sm font-medium mr-3">2023</span>
                          <span>"Hoshdar" (Music Video) - Producer</span>
                        </li>
                        <li className="flex items-center">
                          <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm font-medium mr-3">2019</span>
                          <span>"Jalwe" (Music Video) - Director & Assistant Director</span>
                        </li>
                        <li className="flex items-center">
                          <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-sm font-medium mr-3">2024</span>
                          <span>"Be Fine" ( Music Video) - Producer</span>
                        </li>
                        <li className="flex items-center">
                          <span className="bg-yellow-100 text-blue-400 px-2 py-1 rounded text-sm font-medium mr-3">2025</span>
                          <span>"Mauj Kasheer" (  Upcoming Music Video) - Producer</span>
                        </li>
                         <li className="flex items-center">
                          <span className="bg-yellow-100 text-pink-700 px-2 py-1 rounded text-sm font-medium mr-3">2025</span>
                          <span>"Chingari" (  Upcoming Music Video) - Producer</span>
                        </li>
                         <li className="flex items-center">
                          <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-sm font-medium mr-3">2025</span>
                          <span>"Maryo" (  Upcoming Music Video) - Producer</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Dream Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The talented individuals who make every journey extraordinary
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: member.id * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold">{member.name}</h3>
                    <p className="text-blue-200 font-medium">{member.role}</p>
                  </div>
                </div>

                <div className="bg-white p-6">
                  <p className="text-gray-600 mb-5">{member.bio}</p>
                  
                  {/* Special Sections */}
                  {member.socialMedia && (
                    <div className="mb-5">
                      <h4 className="text-sm font-semibold text-gray-500 mb-3">SOCIAL MEDIA</h4>
                      <div className="flex space-x-4">
                        {member.socialMedia.map((social, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div className="bg-gray-100 p-2 rounded-full">
                              {social.icon}
                            </div>
                            <span className="text-xs mt-1 text-gray-600">{social.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {member.techStack && (
                    <div className="mb-5">
                      <h4 className="text-sm font-semibold text-gray-500 mb-3">TECH STACK</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.techStack.map((tech, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-3">EXPERTISE</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 text-xs px-3 py-1 rounded-full border border-blue-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our <span className="text-blue-600">Core Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description: "Constantly pushing boundaries to create unique travel experiences",
                icon: "💡",
                color: "from-blue-100 to-blue-50"
              },
              {
                title: "Authenticity",
                description: "Genuine connections and real local experiences",
                icon: "🌍",
                color: "from-purple-100 to-purple-50"
              },
              {
                title: "Excellence",
                description: "Uncompromising quality in every detail",
                icon: "✨",
                color: "from-pink-100 to-pink-50"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-br ${value.color} p-1 rounded-2xl shadow-sm`}
              >
                <div className="bg-white rounded-xl p-8 h-full flex flex-col items-center text-center border border-gray-100">
                  <div className="text-6xl mb-6">{value.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600 flex-grow">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1000')] bg-cover bg-center opacity-20"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready for Your Next Adventure?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto"
          >
            Our team is standing by to craft your perfect travel experience
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto"
          >
            <div className="flex flex-col items-center p-4">
              <div className="bg-white/20 p-3 rounded-full mb-3">
                <FaPhone className="text-white text-xl" />
              </div>
              <h4 className="font-bold text-white mb-1">Call Us</h4>
              <p className="text-blue-100">+91 9796337997</p>
            </div>
            
            <div className="flex flex-col items-center p-4">
              <div className="bg-white/20 p-3 rounded-full mb-3">
                <FaEnvelope className="text-white text-xl" />
              </div>
              <h4 className="font-bold text-white mb-1">Email Us</h4>
              <p className="text-blue-100">enquiry@traveligo.in</p>
            </div>
            
            <div className="flex flex-col items-center p-4">
              <div className="bg-white/20 p-3 rounded-full mb-3">
                <FaMapMarkerAlt className="text-white text-xl" />
              </div>
              <h4 className="font-bold text-white mb-1">Visit Us</h4>
              <p className="text-blue-100 text-sm">Dalgate Bridge, Srinagar</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Link to="/contact">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-bold shadow-lg text-lg transition-all"
              >
                Get in Touch Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Team;