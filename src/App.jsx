import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import PropTypes from "prop-types";

// Layout Components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import CartPanel from "./components/Navbar/CartPanel";
import ScrollToTop from "./ScrollToTop";
import BackToTop from "./components/BackToTop/BackToTop";
import NewPassword from "./components/Login/New_Psaaword";
import Address from "./components/Payment/Address";
import Checkout from "./components/Payment/Checkout";

// Loading and Context
import { LoadingProvider } from "./components/Context/LoadingContext";

// Home & Main Sections
import HeroSection from "./components/Hero_section/HeroSection";
import ViewAll from "./components/All_product/ViewAll";
import ProductPage from "./components/All_product/ProductPage";
import ProductCard from "./components/View_All_Product/ProductCard";
import BestSellers from "./components/Our_Best_Sellers/BestSellers";
import Video from "./components/Video_section/Video";
import WhyTrustUs from "./components/Why_Trust_Us/WhyTrustUs";
import Rating from "./components/Rating/ReviewSystem";
import FAQ from "./components/All_product/FAQ";

// Authentication Pages
import Login from "./components/Login/Login";
import UserForgotPassword from "./components/Login/UserForgotPassword";

// Static Pages
import PrivacyPolicy from "./components/Privacy_policy/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService/TermsOfService";
import ContactUs from "./components/ContactUs/ContactUs";
import AboutUs from "./components/AboutUs/AboutUs";
import ReturnRefundPolicy from "./components/Return/ReturnRefundPolicy";

// Marketing
import PerfumeMarketingPage from "./components/PerfumeMarketingPage/PerfumeMarketingPage";

// Layout to handle Navbar/Footer hiding logic
function Layout({ children }) {
  const location = useLocation();

  const hideNavbarFooter =
    location.pathname === "/login" ||
    location.pathname === "/UserForgotPassword" ||
    location.pathname === "/new-password";

  return (
    <React.Fragment>
      {!hideNavbarFooter && <Navbar />}
      {children}
      {!hideNavbarFooter && <Footer />}
      {!hideNavbarFooter && <BackToTop />}
    </React.Fragment>
  );
}

// Add prop types
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

// App with Router Wrapper
function AppWithRouter() {
  return (
    <LoadingProvider>
      <Layout>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<HeroSection />} />
          <Route path="/herosection" element={<HeroSection />} />
          <Route path="/cartpanel" element={<CartPanel />} />
          {/* <Route path="/viewall/all-products" element={<ViewAll />} /> */}
          <Route path="/viewall/:categoryName" element={<ViewAll />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/productcard" element={<ProductCard />} />
          <Route path="/bestsellers" element={<BestSellers />} />
          <Route path="/video" element={<Video />} />
          <Route path="/whytrustus" element={<WhyTrustUs />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/UserForgotPassword" element={<UserForgotPassword />} />
          <Route path="/new-password" element={<NewPassword />} />

          {/* Static Info Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/refund-policy" element={<ReturnRefundPolicy />} />

          {/* Marketing Pages */}
          <Route
            path="/perfumemarketingpage"
            element={<PerfumeMarketingPage />}
          />

          {/* Checkout Process */}
          <Route path="/address" element={<Address />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Layout>
    </LoadingProvider>
  );
}

// App Component
function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppWithRouter />
    </Router>
  );
}

export default App;
