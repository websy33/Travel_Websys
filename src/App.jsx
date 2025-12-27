import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

// Main Pages
import Home from './Pages/Home';
import Flights from './Pages/Flights';
import Hotels from './Pages/Hotels';
import Trains from './Pages/Trains';
import Cabs from './Pages/Cabs';
import Blog from './Pages/Blog.jsx'
// Components
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

// Footer Pages
import About from './Footer/about.jsx';
import Careers from './Footer/careers.jsx';
import Investors from './Footer/investors.jsx';
import TravelAgents from './Footer/travelagents.jsx';
import FAQs from './Footer/faqs.jsx';
import PrivacyPolicy from './Footer/privacy.jsx';
import TermsOfUse from './Footer/terms.jsx';
import Feedback from './Footer/feedback.jsx';
import InternationalHotels from './Footer/internationalhotels.jsx';
import HolidayPackages from './Footer/HolidayPackages.jsx';
import DealsOffers from './Footer/DealsOffers.jsx';
import BusinessTravel from './Footer/BusinessTravel.jsx';
import GiftCards from './Footer/giftcards.jsx';
import TravelGuide from './Footer/travelguide.jsx';
import CorporateTravel from './Footer/corporatetravel.jsx';
import ContactUs from './Footer/contact.jsx';
import BookingPolicy from './Footer/policy.jsx';
import HimachalManaliPackages from './Footer/Himachal.jsx';
import RajasthanPackages from './Footer/Rajasthan.jsx';
import Goa from './Footer/Goa.jsx';
import Kerala from './Footer/Kerala.jsx';
import Dubai from './Footer/Dubai.jsx';
import Bali from './Footer/Bali.jsx';
import ThailandPackages from './Footer/Thailand.jsx';
import KashmirPackage from './Footer/kashmir.jsx';
import LadakhAdventures from './Footer/ladkah.jsx';
import HoneymoonSpecials from './Footer/honeymoon.jsx';
import GangtokDarjeeling from './Footer/GangtokDarjeeling.jsx';
import Ourteam from './Footer/team.jsx';
import Testimonials from './Footer/Testimonials.jsx';
import LoginModal from './Components/LoginModal.jsx';
import AdminApprovalDashboard from './Components/AdminApprovalDashboard.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import Gallery from './Footer/Gallery.jsx';
import Womens from './Footer/Womens.jsx';
import Section from './Footer/Section.jsx';
import Weddings from './Footer/Weddings.jsx';
import Spiti from './Footer/Spiti.jsx';
import Andaman from './Footer/Andaman.jsx';
import Bhutan from './Footer/Bhutan.jsx';
import Meghalaya from './Footer/Meghalaya.jsx';
import Banglore from './Footer/Banglore.jsx';
import Lakshadweep from './Footer/Lakshadweep.jsx';
import Vietnam from './Footer/Vietnam.jsx';
import Singapore from './Footer/Singapore.jsx';
import Hong from './Footer/Hong.jsx';
import NewZealand from './Footer/NewZealand.jsx';
import SouthAfrica from './Footer/SouthAfrica.jsx';
import Azarbaijan from './Footer/Azarbaijan.jsx';
import Almaty from './Footer/Almaty.jsx';
import Georgia from './Footer/Georgia.jsx';
import Uzbekistan from './Footer/Uzbekistan.jsx';
import Kazakhstan from './Footer/Kazakhstan.jsx';
import South from './Footer/South.jsx';
import Srilanka from './Footer/Srilanka.jsx';
import Egypt from './Footer/Egypt.jsx';
import Russia from './Footer/Russia.jsx';
import Mauritius from './Footer/Mauritius.jsx';
import Turkey from './Footer/Turkey.jsx';
import MadhyaPradesh from './Footer/MadhyaPradesh.jsx';
import Utrakhand from './Footer/Utrakhand.jsx';
import Japan from './Footer/Japan.jsx';
import Azerbaijan from './Footer/Azarbaijan.jsx';
import Nepal from './Footer/Nepal.jsx';
import Cancellation from './Footer/Cancellation.jsx';
import Googleplacesapi from './Components/googleplacesapi.jsx';
import HotelRateExample from './examples/HotelRateExample.jsx';
import RateTestComponent from './Components/Hotels/auth/RateTestComponent.jsx';
import HotelDataViewer from './Components/Hotels/display/HotelDataViewer.jsx';

// Removed Mapbox-based HomeWithMap. Use original Home directly.

function App() {
  useEffect(() => {
    // Load Shapo script once
    if (!document.getElementById('shapo-embed-js')) {
      const script = document.createElement('script');
      script.id = 'shapo-embed-js';
      script.src = 'https://cdn.shapo.io/js/embed.js';
      script.defer = true;
      document.body.appendChild(script);
    }

    // Load Google Reviews script once
    if (!document.getElementById('google-reviews-script')) {
      const script = document.createElement('script');
      script.id = 'google-reviews-script';
      script.src = 'https://static.elfsight.com/platform/platform.js';
      script.defer = true;
      script.dataset.useServiceCore = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Main Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/flights" element={<Flights />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/partner-login" element={<Hotels showAdminLogin={true} />} />
              <Route path="/partner-register" element={<Hotels showRegister={true} />} />
              <Route path="/holidays" element={<HolidayPackages />} />
              <Route path="/Trains" element={<Trains />} />
              <Route path="/Cabs" element={<Cabs />} />
              <Route path="/Blog" element={<Blog />} />
              {/* Footer Routes */}
              <Route path="/about" element={<About />} />
              <Route path="/Gallery" element={<Gallery />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/investors" element={<Investors />} />
              <Route path="/travel-agents" element={<TravelAgents />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/internationalhotels" element={<InternationalHotels />} />
              <Route path="/holiday-packages" element={<HolidayPackages />} />
              <Route path="/deals-offers" element={<DealsOffers />} />
              <Route path="/business-travel" element={<BusinessTravel />} />
              <Route path="/gift-cards" element={<GiftCards />} />
              <Route path="/travel-guide" element={<TravelGuide />} />
              <Route path="/corporate-travel" element={<CorporateTravel />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/policy" element={<BookingPolicy />} />
              <Route path="/Himachal" element={<HimachalManaliPackages />} />
              <Route path="/Rajasthan" element={<RajasthanPackages />} />
              <Route path="/Goa" element={<Goa />} />
              <Route path="/Kerala" element={<Kerala />} />
              <Route path="/Dubai" element={<Dubai />} />
              <Route path="/Bali" element={<Bali />} />
              <Route path="/Thailand" element={<ThailandPackages />} />
              <Route path="/kashmir" element={<KashmirPackage />} />
              <Route path="/ladakh" element={<LadakhAdventures />} />
              <Route path="/honeymoon" element={<HoneymoonSpecials />} />
              <Route path="/team" element={<Ourteam />} />
              <Route path="/GangtokDarjeeling" element={<GangtokDarjeeling />} />
              <Route path="/Testimonials" element={<Testimonials />} />
              <Route path="/LoginModal" element={<LoginModal />} />
              <Route path="/admin/approvals" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminApprovalDashboard />
                </ProtectedRoute>
              } />
              <Route path="/Womens" element={<Womens />} />
              <Route path="/Section" element={<Section />} />
              <Route path="/Weddings" element={<Weddings />} />
              <Route path="/Spiti" element={<Spiti />} />
              <Route path="/Andaman" element={<Andaman />} />
              <Route path="/Bhutan" element={<Bhutan />} />
              <Route path="/Meghalaya" element={<Meghalaya />} />
              <Route path="/Banglore" element={<Banglore />} />
              <Route path="/Lakshadweep" element={<Lakshadweep />} />
              <Route path="/Vietnam" element={<Vietnam />} />
              <Route path="/Singapore" element={<Singapore />} />
              <Route path="/Hong" element={<Hong />} />
              <Route path="/NewZealand" element={<NewZealand />} />
              <Route path="/SouthAfrica" element={<SouthAfrica />} />
              <Route path="/Azarbaijan" element={<Azarbaijan />} />
              <Route path="/Almaty" element={<Almaty />} />
              <Route path="/Georgia" element={<Georgia />} />
              <Route path="/Uzbekistan" element={<Uzbekistan />} />
              <Route path="/Kazakhstan" element={<Kazakhstan />} />
              <Route path="/South" element={<South />} />
              <Route path="/Srilanka" element={<Srilanka />} />
              <Route path="/Egypt" element={<Egypt />} />
              <Route path="/Russia" element={<Russia />} />
              <Route path="/Mauritius" element={<Mauritius />} />
              <Route path="/Turkey" element={<Turkey />} />
              <Route path="/MadhyaPradesh" element={<MadhyaPradesh />} />
              <Route path="/Utrakhand" element={<Utrakhand />} />
              <Route path="/Japan" element={<Japan />} />
              <Route path="/Azerbaijan" element={<Azerbaijan />} />
              <Route path="/Nepal" element={<Nepal />} />
              <Route path="/Cancellation" element={<Cancellation />} />
              <Route path="/googleplacesapi" element={<Googleplacesapi />} />
              <Route path="/hotel-rates-demo" element={<HotelRateExample />} />
              <Route path="/rate-test" element={<RateTestComponent />} />
              <Route path="/hotel-data" element={<HotelDataViewer />} />
            </Routes>
          </main>

          {/* ✅ Single Shapo Widget Container */}
          <div
            id="shapo-widget-b33b95e2144c34fb2f12"
            style={{
              bottom: '10px',
              right: '20px',
              zIndex: '1000'
            }}
          ></div>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;