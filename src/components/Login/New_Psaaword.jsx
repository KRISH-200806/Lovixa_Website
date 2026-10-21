import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiLock, FiArrowLeft, FiLoader } from "react-icons/fi";
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

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in both password fields.");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setMessageType("error");
      return;
    }

    const email = localStorage.getItem("resetEmail");
    const token = localStorage.getItem("resetToken");

    if (!email) {
      setMessage("Reset session expired. Please start the password reset process again.");
      setMessageType("error");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const payload = {
        email: email,
        new_password: newPassword,
        password_confirmation: confirmPassword,
      };

      if (token) {
        payload.token = token;
      }

      const response = await api.post("auth/new-password/", payload);

      if (response.data && response.data.status !== false) {
        setMessage("Password has been successfully reset. Redirecting to login...");
        setMessageType("success");
        toast.success("Password reset successfully! Please sign in.");

        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetToken");

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        const errorMsg = response.data?.message || "Failed to reset password.";
        setMessage(errorMsg);
        setMessageType("error");
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Password reset error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to reset password. Please try again.";
      setMessage(errorMsg);
      setMessageType("error");
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
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
          {/* Left Side: Gradient Promo */}
          <div className="md:w-1/2 hidden md:block relative bg-gradient-to-br from-brand to-forest-dark text-white p-8 flex flex-col justify-center">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <FiLock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold font-serif">Create New Password</h2>
              <p className="text-sm text-white/80 max-w-xs mx-auto">
                Ensure your new password contains at least 8 characters with a mix of letters and numbers.
              </p>
            </div>
          </div>

          {/* Right Side: Password Reset Form */}
          <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
            <div className="text-center mb-6">
              <img src={logo} alt="Lovixa Logo" className="w-24 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter your new password to regain account access.
              </p>
            </div>

            {message && (
              <div
                className={`mb-4 p-3 rounded-lg text-xs font-medium ${messageType === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                  }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand text-sm"
                    placeholder="Enter new password (min. 8 chars)"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand text-sm"
                    placeholder="Re-enter new password"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-brand text-white py-2.5 rounded-xl hover:bg-brand/90 transition font-semibold text-sm flex items-center justify-center shadow-button disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin mr-2" /> Resetting Password...
                  </>
                ) : (
                  "Reset Password & Sign In"
                )}
              </button>
            </form>

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

export default NewPassword;