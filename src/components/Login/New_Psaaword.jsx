import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../Axios/axiosInstance';

// Desktop images
import AQ365 from "../../assets/image/AQ365.jpg";
import combo from "../../assets/image/combo.jpg";
import combo2 from "../../assets/image/combo2.png";
import signature from "../../assets/image/signature.jpg";

// Mobile images
import AQ365Mobile from "../../assets/image/mobile/AQ365Mobile.png";
import comboMobile from "../../assets/image/mobile/comboMobile.png";
import combo2Mobile from "../../assets/image/mobile/combo2Mobile.png";
import signatureMobile from "../../assets/image/mobile/signatureMobile.png";

const NewPassword = () => {
  // State variables to handle input values and visibility
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Message state
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Slider states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();

  // Hero slider images
  const sliderContent = [
    { desktopImage: AQ365, mobileImage: AQ365Mobile, alt: "AQ365 Product" },
    { desktopImage: combo, mobileImage: comboMobile, alt: "Combo Product" },
    { desktopImage: combo2, mobileImage: combo2Mobile, alt: "Combo 2 Product" },
    { desktopImage: signature, mobileImage: signatureMobile, alt: "Signature Product" }
  ];

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Autoplay slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % sliderContent.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMessage('Please fill in both password fields.');
      setMessageType('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }

    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      setMessageType('error');
      return;
    }

    // Get email and token from localStorage or URL params
    const email = localStorage.getItem('resetEmail');
    const token = localStorage.getItem('resetToken') || new URLSearchParams(window.location.search).get('token');
    
    if (!email) {
      setMessage('Session expired. Please start the password reset process again.');
      setMessageType('error');
      return;
    }

    try {
      // Get JWT token from storage
      const jwtToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add Authorization header if JWT token exists
      if (jwtToken) {
        headers['Authorization'] = `Bearer ${jwtToken}`;
      }

      // Prepare payload
      const payload = {
        email: email,
        new_password: newPassword,
        password_confirmation: confirmPassword,
      };

      // Add reset token if available
      if (token) {
        payload.token = token;
      }

      // Make the API call
      const response = await api.post('new-password/', payload, {
        headers: headers,
      });

      if (response.status === 200 || response.status === 201) {
        setMessage(response.data.message || 'Password has been successfully reset.');
        setMessageType('success');
        setNewPassword('');
        setConfirmPassword('');

        // Clear reset-related data from storage
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('resetToken');

        // Redirect to login after delay
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setMessage(response.data.error || response.data.message || 'Failed to reset password.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      
      if (error.response) {
        // Handle specific error cases
        if (error.response.status === 403) {
          setMessage('Authentication required. Please try logging in again.');
          setTimeout(() => {
            navigate('/login');
          }, 1500);
          return;
        }

        const errorData = error.response.data;
        let errorMessage = 'Failed to reset password.';
        
        if (errorData.detail && Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map(err => err.msg || err.message || err).join(', ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
        
        setMessage(errorMessage);
      } else if (error.request) {
        setMessage('No response from server. Please check your connection.');
      } else {
        setMessage('Request error. Please try again later.');
      }
      
      setMessageType('error');
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gray-100">
      {/* Hero Slider Background */}
      <div className="absolute inset-0 z-0">
        {sliderContent.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <picture>
              <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
              <img 
                src={slide.desktopImage} 
                alt={slide.alt}
                className="w-full h-full object-cover filter blur-sm"
              />
            </picture>
          </div>
        ))}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-md overflow-hidden backdrop-blur-sm bg-opacity-90">
          {/* Left Side: Background (Visible on md+ screens) */}
          <div className="md:w-1/2 hidden md:block relative">
            <div className="w-full h-full flex items-center justify-center p-5">
              <div className="w-full h-full bg-gradient-to-br from-[#B4945E] to-[#8B7355] rounded-2xl flex items-center justify-center">
                <h2 className="text-white text-2xl font-bold text-center p-4">
                  Create a new secure password
                  <p className="text-sm font-normal mt-2">
                    Make sure it's different from previous passwords
                  </p>
                </h2>
              </div>
            </div>
          </div>

          {/* Right Side: Password Reset Form */}
          <div className="md:w-1/2 p-8 relative">
            <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

            {/* Message display component */}
            {message && (
              <div className={`mb-4 px-4 py-2 rounded-md text-center ${messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}

            {/* Password Reset Form */}
            <form onSubmit={handleSubmit}>
              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#B4945E] mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#B4945E] focus:border-[#B4945E]"
                    placeholder="Enter new password"
                    required
                  />
                  <span
                    className="absolute top-2.5 right-4 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#B4945E] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#B4945E] focus:border-[#B4945E]"
                    placeholder="Confirm new password"
                    required
                  />
                  <span
                    className="absolute top-2.5 right-4 text-gray-500 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#B4945E] text-white py-2 rounded-md hover:bg-[#8B7355] transition duration-300 mb-4"
              >
                Reset Password
              </button>

              {/* Back to Login Link */}
              <div className="text-center">
                <Link to="/login" className="text-md text-[#B4945E] hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;