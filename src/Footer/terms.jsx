import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaMoneyBillWave, FaLock, FaQuestionCircle, FaUmbrellaBeach, FaPlane, FaHotel } from 'react-icons/fa';

const terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-pink-100 opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-pink-200 opacity-15 blur-xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden z-10">
        {/* Pink header section */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 sm:p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Traveligo</h1>
              <p className="text-pink-100 font-medium">Terms of Service</p>
            </div>
            <div className="text-pink-200">
              <p className="text-sm">Last Updated:</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6 sm:p-8">
          {/* Introduction */}
          <div className="mb-10 p-6 bg-pink-50 rounded-xl border-l-4 border-pink-500">
            <p className="text-gray-700">
              Welcome to <span className="font-semibold text-pink-600">Traveligo</span>! These Terms of Service ("Terms") govern your use of our 
              website and services. By accessing or using Traveligo, you agree to comply with these Terms.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <div className="group p-5 hover:bg-pink-50 rounded-xl transition-colors duration-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 mr-4 bg-pink-100 rounded-lg text-pink-600">
                  <FaShieldAlt className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">1. Acceptance of Terms</h2>
                  <p className="mt-2 text-gray-600">
                    By using Traveligo, you confirm that you're at least 18 years old and agree to these Terms. 
                    If you're booking for others, you're responsible for their compliance too.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="group p-5 hover:bg-pink-50 rounded-xl transition-colors duration-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 mr-4 bg-pink-100 rounded-lg text-pink-600">
                  <FaMoneyBillWave className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">2. Bookings & Payments</h2>
                  <ul className="mt-2 text-gray-600 list-disc pl-5 space-y-2">
                    <li>All prices are displayed in your local currency but may be processed in USD</li>
                    <li>You authorize us to charge the payment method you provide</li>
                    <li>Bookings are confirmed only after full payment is received</li>
                    <li>Service fees may apply and are non-refundable</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3 - With travel icons */}
            <div className="group p-5 hover:bg-pink-50 rounded-xl transition-colors duration-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 mr-4 bg-pink-100 rounded-lg text-pink-600">
                  <FaLock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">3. Cancellations & Refunds</h2>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-3 text-pink-500">
                        <FaPlane />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-700">Flights</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Subject to airline policies, most tickets are non-refundable. Changes may incur fees.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-3 text-pink-500">
                        <FaHotel />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-700">Hotels</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Free cancellation up to 24-72 hours before check-in (varies by property).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-3 text-pink-500">
                        <FaUmbrellaBeach />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-700">Activities</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Typically refundable if cancelled at least 48 hours in advance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="group p-5 hover:bg-pink-50 rounded-xl transition-colors duration-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 mr-4 bg-pink-100 rounded-lg text-pink-600">
                  <FaQuestionCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">4. Limitations of Liability</h2>
                  <div className="mt-2 text-gray-600 space-y-3">
                    <p>
                      Traveligo acts as an intermediary between you and travel service providers. We're not responsible for:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Travel disruptions (flight delays, hotel overbookings)</li>
                      <li>Injuries, losses, or damages during your trip</li>
                      <li>Accuracy of third-party information</li>
                      <li>Force majeure events (natural disasters, pandemics)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-10 p-6 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border border-pink-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2 text-pink-600">✉️</span> Contact Our Legal Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-pink-600 mb-2">Email</h3>
                  <p className="text-gray-700">info@traveligo.in,enquiry@traveligo.in</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-medium text-pink-600 mb-2">Phone</h3>
                  <p className="text-gray-700">+91 9796337997</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm md:col-span-2">
                  <h3 className="font-medium text-pink-600 mb-2">Mailing Address</h3>
                  <p className="text-gray-700">First Boulevard road lane Dalgate Srinagar 190001<br />Srinagar Jammu and Kashmir</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-pink-50 px-6 py-4 border-t border-pink-100">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-2 sm:mb-0">
              &copy; {new Date().getFullYear()} Traveligo. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/privacy" className="text-pink-600 hover:text-pink-800 text-sm font-medium">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-pink-600 hover:text-pink-800 text-sm font-medium">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default terms;