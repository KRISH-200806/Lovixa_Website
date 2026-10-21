import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiKey, FiArrowLeft, FiLoader } from "react-icons/fi";
import api from "../../Axios/axiosInstance";
import { toast } from "react-toastify";

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
import logo from "../../assets/image/logo.png";

const UserForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
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
    { desktopImage: signature, mobileImage: signatureMobile, alt: "Signature Product" },
  ];

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Autoplay slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderContent.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderContent.length]);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setMessageType("error");
      setMessage("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("auth/forgot-password/", {
        email: cleanEmail,
      });

      if (response.data && response.data.status !== false) {
        setMessageType("success");
        setMessage(response.data.message || `OTP sent to ${cleanEmail}`);
        toast.success(`OTP sent to ${cleanEmail}`);
        localStorage.setItem("resetEmail", cleanEmail);
        setStep(2);
      } else {
        const errorMsg = response.data?.message || "Failed to send OTP.";
        setMessageType("error");
        setMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Email address not registered.";
      setMessageType("error");
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const cleanOtp = otp.trim();

    if (!cleanOtp) {
      setMessageType("error");
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("auth/verify-otp/", {
        email: email.trim(),
        otp: cleanOtp,
      });

      if (response.data && response.data.status !== false) {
        setMessageType("success");
        setMessage("OTP verified successfully. Redirecting...");
        toast.success("OTP verified!");
        if (response.data.token) {
          localStorage.setItem("resetToken", response.data.token);
        }
        setTimeout(() => navigate("/new-password"), 800);
      } else {
        const errorMsg = response.data?.message || "Invalid OTP.";
        setMessageType("error");
        setMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Invalid or expired OTP. Please try again.";
      setMessageType("error");
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setStep(1);
    setOtp("");
    setMessage("");
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gray-100 font-['Urbanist']">
      {/* Hero Slider Background */}
      <div className="absolute inset-0 z-0">
        {sliderContent.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
          >
            <picture>
              <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
              <img
                src={slide.desktopImage}
                alt={slide.alt}
                className="w-full h-full object-cover filter blur-[6px]"
              />
            </picture>
          </div>
        ))}
        <div className="absolute inset-0 bg-black/45"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
          {/* Image Section */}
          <div className="md:w-1/2 hidden md:block relative bg-gradient-to-br from-amber-50 to-orange-50">
            <img
              src={sideImage}
              alt="Forgot Password"
              className="w-full h-full p-8 object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6 text-center">
              <h2 className="text-xl font-bold mb-1">Reset Your Password</h2>
              <p className="text-xs text-white/80">Follow simple steps to securely regain access to your account</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
            <div className="text-center mb-6">
              <img src={logo} alt="Lovixa Logo" className="w-24 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                {step === 1 ? "Forgot Password" : "Verify OTP Code"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {step === 1
                  ? "Enter your registered email to receive a reset code."
                  : `Enter the OTP sent to ${email}`}
              </p>
            </div>

            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {message && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium ${messageType === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"
                      }`}
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-brand text-white py-3 px-6 rounded-full hover:bg-brand/90 transition font-semibold text-sm flex items-center justify-center shadow-button disabled:opacity-60 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" /> Sending Code...
                    </>
                  ) : (
                    "Send OTP Code"
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP Code
                  </label>
                  <div className="relative">
                    <FiKey className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input
                      id="otp"
                      type="text"
                      maxLength={6}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand text-sm tracking-widest font-mono"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {message && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium ${messageType === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"
                      }`}
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-brand text-white py-3 px-6 rounded-full hover:bg-brand/90 transition font-semibold text-sm flex items-center justify-center shadow-button disabled:opacity-60 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" /> Verifying...
                    </>
                  ) : (
                    "Verify & Proceed"
                  )}
                </button>

                <div className="flex justify-between items-center text-xs pt-2">
                  <button
                    type="button"
                    className="text-brand hover:underline font-semibold"
                    onClick={handleResendOtp}
                    disabled={loading}
                  >
                    Change Email / Resend
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center border-t pt-4">
              <Link
                to="/login"
                className="inline-flex items-center text-xs font-semibold text-gray-600 hover:text-brand transition"
              >
                <FiArrowLeft className="mr-1" /> Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForgotPassword;