import React, { useState } from 'react';
import { FiBriefcase, FiDollarSign, FiClock, FiUsers, FiAward, FiGlobe, FiMail, FiPhone, FiUser, FiFileText } from 'react-icons/fi';

const careers = () => {
  const [activeTab, setActiveTab] = useState('openings');
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    resume: null,
    coverLetter: '',
    linkedin: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const jobOpenings = [
    {
      id: 1,
      title: 'Frontend Developer',
      type: 'Full-time',
      location: 'Remote',
      department: 'Engineering',
      description: 'We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces and implementing features for our web applications.',
      responsibilities: [
        'Develop new user-facing features',
        'Build reusable components and front-end libraries',
        'Optimize applications for maximum speed and scalability',
        'Collaborate with back-end developers and designers'
      ],
      requirements: [
        '3+ years experience with React.js',
        'Proficient in JavaScript, HTML5, and CSS3',
        'Experience with Redux or similar state management',
        'Familiarity with RESTful APIs',
        'Knowledge of modern authorization mechanisms'
      ],
      salary: '$90,000 - $120,000'
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      type: 'Full-time',
      location: 'New York, NY',
      department: 'Design',
      description: 'We are seeking a creative UX/UI Designer to create amazing user experiences for our digital products.',
      responsibilities: [
        'Create user-centered designs by understanding business requirements',
        'Develop UI mockups and prototypes',
        'Identify and troubleshoot UX problems',
        'Adhere to style standards on fonts, colors and images'
      ],
      requirements: [
        'Proven work experience as a UI/UX Designer',
        'Portfolio of design projects',
        'Knowledge of wireframe tools',
        'Team spirit and strong communication skills',
        'Up-to-date with the latest UI trends'
      ],
      salary: '$85,000 - $110,000'
    },
    {
      id: 3,
      title: 'Digital Marketing Specialist',
      type: 'Full-time',
      location: 'Remote',
      department: 'Marketing',
      description: 'We are looking for an experienced Digital Marketing Specialist to help grow our online presence and customer base.',
      responsibilities: [
        'Plan and execute digital marketing campaigns',
        'Manage SEO and SEM strategies',
        'Measure and report performance of campaigns',
        'Identify trends and insights to optimize spend'
      ],
      requirements: [
        'Proven experience in digital marketing',
        'Experience with SEO/SEM and marketing tools',
        'Strong analytical skills',
        'Excellent communication skills',
        'BSc degree in Marketing or relevant field'
      ],
      salary: '$70,000 - $95,000'
    }
  ];

  const benefits = [
    {
      icon: <FiDollarSign className="text-3xl text-pink-500" />,
      title: 'Competitive Salary',
      description: 'We offer industry-leading compensation packages with regular performance reviews.'
    },
    {
      icon: <FiClock className="text-3xl text-pink-500" />,
      title: 'Flexible Hours',
      description: 'Work when youre most productive with our flexible scheduling options.'
    },
    {
      icon: <FiUsers className="text-3xl text-pink-500" />,
      title: 'Team Culture',
      description: 'Join a supportive team that values collaboration and innovation.'
    },
    {
      icon: <FiAward className="text-3xl text-pink-500" />,
      title: 'Career Growth',
      description: 'Continuous learning opportunities with training budgets and mentorship.'
    },
    {
      icon: <FiBriefcase className="text-3xl text-pink-500" />,
      title: 'Remote Options',
      description: 'Work from anywhere with our remote-friendly policies.'
    },
    {
      icon: <FiGlobe className="text-3xl text-pink-500" />,
      title: 'Global Impact',
      description: 'Contribute to products used by millions worldwide.'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setApplicationForm(prev => ({
      ...prev,
      [e.target.name]: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Application submitted:', applicationForm);
    setSubmitted(true);
    // Reset form after submission
    setApplicationForm({
      name: '',
      email: '',
      phone: '',
      position: '',
      resume: null,
      coverLetter: '',
      linkedin: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
        <p className="text-xl max-w-2xl mx-auto">Help us build the future. Explore rewarding career opportunities with our growing team.</p>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`py-4 px-6 font-medium ${activeTab === 'openings' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('openings')}
          >
            Open Positions
          </button>
          <button
            className={`py-4 px-6 font-medium ${activeTab === 'benefits' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('benefits')}
          >
            Our Benefits
          </button>
          <button
            className={`py-4 px-6 font-medium ${activeTab === 'apply' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('apply')}
          >
            Apply Now
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === 'openings' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Job Openings</h2>
              {jobOpenings.map(job => (
                <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-sm bg-pink-100 text-pink-800 px-2 py-1 rounded">{job.type}</span>
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{job.location}</span>
                          <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">{job.department}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-800">{job.salary}</p>
                        <button 
                          className="mt-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                          onClick={() => {
                            setActiveTab('apply');
                            setApplicationForm(prev => ({ ...prev, position: job.title }));
                          }}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-800 mb-2">Job Description</h4>
                      <p className="text-gray-600 mb-4">{job.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Responsibilities</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            {job.responsibilities.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Requirements</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            {job.requirements.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'benefits' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Why Work With Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4">{benefit.icon}</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Our Culture</h3>
                <p className="text-gray-600 mb-4">
                  At our company, we believe that great work happens when people feel supported and empowered. 
                  We foster a culture of innovation, collaboration, and continuous learning.
                </p>
                <p className="text-gray-600">
                  We value diversity and inclusion, and we're committed to creating an environment where everyone 
                  can thrive and do their best work.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'apply' && (
            <div className="max-w-3xl mx-auto">
              {submitted ? (
                <div className="bg-green-50 p-8 rounded-lg text-center border border-green-100">
                  <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="mt-4 text-xl font-medium text-green-800">Application Submitted!</h3>
                  <p className="mt-2 text-green-700">Thank you for applying. We've received your application.</p>
                  <p className="mt-2 text-sm text-green-600">Our team will review your information and get back to you soon.</p>
                  <button
                    className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
                    onClick={() => setSubmitted(false)}
                  >
                    Apply for Another Position
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Job Application</h2>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Position Applying For</label>
                          <input
                            type="text"
                            name="position"
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                            value={applicationForm.position}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiUser className="text-gray-400" />
                              </div>
                              <input
                                type="text"
                                name="name"
                                required
                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                value={applicationForm.name}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiMail className="text-gray-400" />
                              </div>
                              <input
                                type="email"
                                name="email"
                                required
                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                value={applicationForm.email}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiPhone className="text-gray-400" />
                              </div>
                              <input
                                type="tel"
                                name="phone"
                                required
                                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                value={applicationForm.phone}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
                            <input
                              type="url"
                              name="linkedin"
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                              value={applicationForm.linkedin}
                              onChange={handleInputChange}
                              placeholder="https://linkedin.com/in/yourprofile"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Resume/CV</label>
                          <div className="flex items-center">
                            <label className="flex flex-col items-center px-4 py-2 bg-white rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50">
                              <FiFileText className="text-gray-500 mr-2" />
                              <span className="text-sm text-gray-600">
                                {applicationForm.resume ? applicationForm.resume.name : 'Choose file'}
                              </span>
                              <input
                                type="file"
                                name="resume"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={handleFileChange}
                                required
                              />
                            </label>
                            <span className="ml-2 text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                          <textarea
                            name="coverLetter"
                            rows="4"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                            value={applicationForm.coverLetter}
                            onChange={handleInputChange}
                            placeholder="Tell us why you'd be a great fit for this position..."
                          ></textarea>
                        </div>

                        <div className="pt-4">
                          <button
                            type="submit"
                            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                          >
                            <FiMail className="mr-2" />
                            Submit Application
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default careers;