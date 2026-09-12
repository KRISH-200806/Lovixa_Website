import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Others
import sideImage from "../../assets/image/UserAuthentication/container.svg";

const UserForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessageType('error');
      setMessage('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append('email', email);

      const response = await api.post("forgot-password/", form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        setMessageType('success');
        setMessage(response.data.message || `OTP sent to ${email}`);
        localStorage.setItem('resetEmail', email);
        setStep(2);
      } else {
        setMessageType('error');
        setMessage(response.data.error || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessageType('error');
      setMessage('Email not found.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setMessageType('error');
      setMessage('Please enter the OTP.');
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append('email', email);
      form.append('otp', otp);

      const response = await api.post('verify-otp/', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        setMessageType('success');
        setMessage('OTP verified successfully. Redirecting...');
        setTimeout(() => navigate('/new-password'), 1000);
      } else {
        setMessageType('error');
        setMessage(response.data.error || 'Invalid OTP.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessageType('error');
      setMessage('There was an error verifying your OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Optional resend OTP handler
  const handleResendOtp = async () => {
    setStep(1);
    setMessage('');
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
                className="w-full h-full object-cover"
              />
            </picture>
          </div>
        ))}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-md overflow-hidden backdrop-blur-sm bg-opacity-90">
          {/* Image Section */}
          <div className="md:w-1/2 hidden md:block relative">
            <img
              src={sideImage}
              alt="Forgot Password"
              className="w-full h-full p-5 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-8 text-center">
              <h2 className="text-xl font-bold mb-2">Reset Your Password</h2>
              <p>Follow the steps to regain access to your account</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-bold text-center mb-6">
              {step === 1 ? 'Forgot Password' : 'Verify OTP'}
            </h2>

            {step === 1 ? (
              <form onSubmit={handleSendOtp}>
                <label htmlFor="email" className="block text-sm font-medium text-[#B4945E] mb-1 ">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#B4945E] focus:border-[#B4945E] mb-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#B4945E] text-white py-2 rounded-md hover:bg-[#8B7355] transition disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <label htmlFor="otp" className="block text-sm font-medium text-[#B4945E] mb-1">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#B4945E] focus:border-[#B4945E] mb-4"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP sent to your email"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#B4945E] text-white py-2 rounded-md hover:bg-[#8B7355] transition disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <button
                  type="button"
                  className="w-full mt-3 text-sm text-[#B4945E] underline hover:text-[#8B7355]"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </button>
              </form>
            )}

            {message && (
              <p className={`mt-4 text-center text-sm ${messageType === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForgotPassword;





  // import React, { useState } from 'react';
  // import { useNavigate } from 'react-router-dom';
  // import sampleImage from '../../assets/image/UserAuthentication/container.svg';
  // import api from '../../Axios/axiosInstance';

  // const UserForgotPassword = () => {
  //   const [email, setEmail] = useState('');
  //   const [otp, setOtp] = useState('');
  //   const [message, setMessage] = useState('');
  //   const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  //   const [step, setStep] = useState(1);
  //   const [loading, setLoading] = useState(false);
  //   const navigate = useNavigate();

  //   // Step 1: Send OTP
  //   const handleSendOtp = async (e) => {
  //     e.preventDefault();

  //     if (!email) {
  //       setMessageType('error');
  //       setMessage('Please enter your email address.');
  //       return;
  //     }

  //     try {
  //       setLoading(true);
  //       const form = new FormData();
  //       form.append('email', email);

  //       const response = await api.post("/api/forgot-password", form, {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //       });

  //       if (response.status === 200) {
  //         setMessageType('success');
  //         setMessage(response.data.message || `OTP sent to ${email}`);
  //         localStorage.setItem('resetEmail', email);
  //         setStep(2);
  //       } else {
  //         setMessageType('error');
  //         setMessage(response.data.error || 'Failed to send OTP.');
  //       }
  //     } catch (error) {
  //       console.error('Error sending OTP:', error);
  //       setMessageType('error');
  //       setMessage('Server error. Please try again later.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   // Step 2: Verify OTP
  //   const handleVerifyOtp = async (e) => {
  //     e.preventDefault();

  //     if (!otp) {
  //       setMessageType('error');
  //       setMessage('Please enter the OTP.');
  //       return;
  //     }

  //     try {
  //       setLoading(true);
  //       const form = new FormData();
  //       form.append('email', email);
  //       form.append('otp', otp);

  //       const response = await api.post('/api/verify-otp', form, {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //       });

  //       if (response.status === 200) {
  //         setMessageType('success');
  //         setMessage('OTP verified successfully. Redirecting...');
  //         setTimeout(() => navigate('/new-password'), 1000); // Redirect after 2 seconds
  //       } else {
  //         setMessageType('error');
  //         setMessage(response.data.error || 'Invalid OTP.');
  //       }
  //     } catch (error) {
  //       console.error('Error verifying OTP:', error);
  //       setMessageType('error');
  //       setMessage('Server error. Please try again.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   // Optional resend OTP handler
  //   const handleResendOtp = async () => {
  //     setStep(1);
  //     setMessage('');
  //   };

  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
  //       <div className="flex flex-col md:flex-row max-w-5xl w-full bg-white rounded-xl shadow-md overflow-hidden">
  //         {/* Image Section */}
  //         <div className="md:w-1/2">
  //           <img
  //             src={sampleImage}
  //             alt="Forgot Password"
  //             className="w-full h-full p-5 object-cover"
  //           />
  //         </div>

  //         {/* Form Section */}
  //         <div className="md:w-1/2 p-8">
  //           <h2 className="text-2xl font-bold text-center mb-6">
  //             {step === 1 ? 'Forgot Password' : 'Verify OTP'}
  //           </h2>

  //           {step === 1 ? (
  //             <form onSubmit={handleSendOtp}>
  //               <label htmlFor="email" className="block text-sm font-medium text-[#B4945E] mb-1">
  //                 Email address
  //               </label>
  //               <input
  //                 id="email"
  //                 type="email"
  //                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#B4945E] focus:border-[#B4945E] mb-4"
  //                 value={email}
  //                 onChange={(e) => setEmail(e.target.value)}
  //                 placeholder="Enter your email"
  //                 required
  //               />
  //               <button
  //                 type="submit"
  //                 className="w-full bg-[#B4945E] text-white py-2 rounded-md hover:bg-[#8B7355] transition disabled:opacity-60"
  //                 disabled={loading}
  //               >
  //                 {loading ? 'Sending...' : 'Send OTP'}
  //               </button>
  //             </form>
  //           ) : (
  //             <form onSubmit={handleVerifyOtp}>
  //               <label htmlFor="otp" className="block text-sm font-medium text-[#B4945E] mb-1">
  //                 Enter OTP
  //               </label>
  //               <input
  //                 id="otp"
  //                 type="text"
  //                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#B4945E] focus:border-[#B4945E] mb-4"
  //                 value={otp}
  //                 onChange={(e) => setOtp(e.target.value)}
  //                 placeholder="Enter the OTP sent to your email"
  //                 required
  //               />
  //               <button
  //                 type="submit"
  //                 className="w-full bg-[#B4945E] text-white py-2 rounded-md hover:bg-[#8B7355] transition disabled:opacity-60"
  //                 disabled={loading}
  //               >
  //                 {loading ? 'Verifying...' : 'Verify OTP'}
  //               </button>

  //               <button
  //                 type="button"
  //                 className="w-full mt-3 text-sm text-[#B4945E] underline hover:text-[#8B7355]"
  //                 onClick={handleResendOtp}
  //               >
  //                 Resend OTP
  //               </button>
  //             </form>
  //           )}

  //           {message && (
  //             <p className={`mt-4 text-center text-sm ${messageType === 'error' ? 'text-red-600' : 'text-green-600'}`}>
  //               {message}
  //             </p>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // export default UserForgotPassword;