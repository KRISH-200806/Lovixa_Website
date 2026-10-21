import React, { useEffect, useRef, useState, useCallback } from "react";
import { FiUser, FiMail, FiLock, FiLoader } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
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

// Input field component
const InputGroup = ({ icon, type, placeholder, value, onChange, required, disabled }) => (
  <div className="input-group">
    <i>{icon}</i>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
      aria-label={placeholder}
    />
  </div>
);

// Form message (success/error)
const FormMessage = ({ type, text }) =>
  text ? (
    <p className={type} role="status">
      {text}
    </p>
  ) : null;

const Login = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const mainContainerRef = useRef(null);

  const [formMode, setFormMode] = useState("sign-in");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginMessage, setLoginMessage] = useState({ type: "", text: "" });

  // Sign-up form state
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [signUpMessage, setSignUpMessage] = useState({ type: "", text: "" });

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Hero slider images
  const sliderContent = [
    { desktopImage: AQ365, mobileImage: AQ365Mobile, alt: "AQ365 Product" },
    { desktopImage: combo, mobileImage: comboMobile, alt: "Combo Product" },
    { desktopImage: combo2, mobileImage: combo2Mobile, alt: "Combo 2 Product" },
    {
      desktopImage: signature,
      mobileImage: signatureMobile,
      alt: "Signature Product",
    },
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
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderContent.length]);

  // Initial form animation
  useEffect(() => {
    if (mainContainerRef.current) {
      mainContainerRef.current.classList.remove("sign-in", "sign-up");
      mainContainerRef.current.classList.add(formMode);
    }
  }, [formMode]);

  // Switch forms
  const toggleForm = useCallback(() => {
    setLoginMessage({ type: "", text: "" });
    setSignUpMessage({ type: "", text: "" });

    setFormMode((prev) => (prev === "sign-in" ? "sign-up" : "sign-in"));
    if (mainContainerRef.current) {
      mainContainerRef.current.classList.toggle("sign-in");
      mainContainerRef.current.classList.toggle("sign-up");
    }
  }, []);

  // Handle login input
  const handleLoginChange = useCallback((field, value) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Handle register input
  const handleRegisterChange = useCallback((field, value) => {
    setRegisterForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Handle login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginMessage({ type: "", text: "" });

    const result = await login({
      email: loginForm.email.trim(),
      password: loginForm.password,
    });

    setIsSubmitting(false);

    if (result.success) {
      setLoginMessage({ type: "success", text: "Login successful! Redirecting..." });
      toast.success("Welcome back to Lovixa!");
      setTimeout(() => navigate("/"), 800);
    } else {
      setLoginMessage({ type: "error", text: result.message });
      toast.error(result.message);
    }
  };

  // Handle register submit
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSignUpMessage({ type: "", text: "" });

    const result = await register({
      first_name: registerForm.firstName.trim(),
      last_name: registerForm.lastName.trim(),
      email: registerForm.email.trim(),
      password: registerForm.password,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSignUpMessage({
        type: "success",
        text: "Registration successful! You are now logged in.",
      });
      toast.success("Account created successfully!");
      setTimeout(() => navigate("/"), 800);
    } else {
      setSignUpMessage({ type: "error", text: result.message });
      toast.error(result.message);
    }
  };

  return (
    <div className="hero-background">
      {/* Hero Image Slider */}
      <div className="hero-slider" aria-hidden="true">
        {sliderContent.map((slide, index) => (
          <div
            key={index}
            className={`slide ${currentSlide === index ? "active" : ""}`}
          >
            <picture>
              <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
              <img
                src={slide.desktopImage}
                alt={slide.alt}
                className="slide-image"
              />
            </picture>
          </div>
        ))}
      </div>

      {/* Main Container */}
      <main className="main-container" ref={mainContainerRef}>
        <div className="form-container">
          {!isMobile && (
            <div className="image-panel">
              <img
                src={sideImage}
                alt=""
                className="side-image"
                aria-hidden="true"
              />
              <div className="image-overlay">
                <h2>Welcome to Lovixa</h2>
                <p>Pure, luxurious fragrances & organic skincare crafted for your radiance.</p>
              </div>
            </div>
          )}

          <div className="forms-wrapper">
            {/* Sign Up */}
            <div className="form-panel sign-up">
              <form onSubmit={handleRegister} aria-labelledby="signup-heading">
                <img src={logo} alt="Lovixa Logo" className="form-logo" />
                <h2 id="signup-heading">Create Account</h2>
                <InputGroup
                  icon={<FiUser />}
                  type="text"
                  placeholder="First Name"
                  value={registerForm.firstName}
                  onChange={(val) => handleRegisterChange("firstName", val)}
                  required
                  disabled={isSubmitting}
                />
                <InputGroup
                  icon={<FiUser />}
                  type="text"
                  placeholder="Last Name"
                  value={registerForm.lastName}
                  onChange={(val) => handleRegisterChange("lastName", val)}
                  required
                  disabled={isSubmitting}
                />
                <InputGroup
                  icon={<FiMail />}
                  type="email"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={(val) => handleRegisterChange("email", val)}
                  required
                  disabled={isSubmitting}
                />
                <InputGroup
                  icon={<FiLock />}
                  type="password"
                  placeholder="Password"
                  value={registerForm.password}
                  onChange={(val) => handleRegisterChange("password", val)}
                  required
                  disabled={isSubmitting}
                />
                <FormMessage {...signUpMessage} />
                <button type="submit" disabled={isSubmitting} className="flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin mr-2" /> Creating Account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>
                <p>
                  Already have an account?{" "}
                  <b className="pointer" onClick={!isSubmitting ? toggleForm : undefined}>
                    Sign in
                  </b>
                </p>
              </form>
            </div>

            {/* Sign In */}
            <div className="form-panel sign-in">
              <form onSubmit={handleLogin} aria-labelledby="signin-heading">
                <img src={logo} alt="Lovixa Logo" className="form-logo" />
                <h2 id="signin-heading">Welcome Back</h2>
                <InputGroup
                  icon={<FiMail />}
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(val) => handleLoginChange("email", val)}
                  required
                  disabled={isSubmitting}
                />
                <InputGroup
                  icon={<FiLock />}
                  type="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(val) => handleLoginChange("password", val)}
                  required
                  disabled={isSubmitting}
                />
                <FormMessage {...loginMessage} />
                <button type="submit" disabled={isSubmitting} className="flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin mr-2" /> Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
                <p>
                  <Link
                    to="/UserForgotPassword"
                    className="text-brand hover:text-brand/80 font-semibold"
                  >
                    Forgot Password?
                  </Link>
                </p>
                <p>
                  Don't have an account?{" "}
                  <b className="pointer" onClick={!isSubmitting ? toggleForm : undefined}>
                    Sign up
                  </b>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Styles */}
      <style jsx="true">{`
        .hero-background {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
        .hero-slider {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        .slide {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1s ease;
        }
        .slide.active {
          opacity: 1;
        }
        .slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: blur(6px);
          transform: scale(1.05);
        }

        .main-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: rgba(0, 0, 0, 0.45);
          font-family: "Urbanist", sans-serif;
        }
        .form-container {
          display: flex;
          width: 90%;
          max-width: 950px;
          overflow: hidden;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(16px);
          box-shadow: 0 25px 50px -12px rgba(36, 92, 74, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.6);
        }

        .image-panel {
          width: 45%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #1B5E20;
        }
        .side-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(14, 51, 16, 0.95), transparent);
          color: white;
          padding: 2rem;
          text-align: center;
          z-index: 2;
        }
        .image-overlay h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          font-family: 'Playfair Display', serif;
        }
        .image-overlay p {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .forms-wrapper {
          width: 55%;
          display: flex;
          position: relative;
          overflow: hidden;
          min-height: 520px;
          background: #ffffff;
        }
        .form-panel {
          width: 100%;
          padding: 2.5rem;
          transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .form-panel form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }
        .form-logo {
          width: 110px;
          margin: 0 auto 0.5rem;
          display: block;
        }

        .input-group {
          position: relative;
          width: 100%;
        }
        .input-group i {
          position: absolute;
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
          color: #758077;
          z-index: 1;
        }
        .input-group input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border-radius: 12px;
          border: 1px solid #C8E6C9;
          background: #E8F5E9;
          font-size: 0.95rem;
          color: #1A1D1A;
          transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
        }
        .input-group input:focus {
          outline: none;
          border-color: #1B5E20;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(27, 94, 32, 0.18);
        }

        button[type="submit"] {
          padding: 0.85rem;
          background: #1B5E20;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(27, 94, 32, 0.3);
        }
        button[type="submit"]:hover:not(:disabled) {
          background: #144A18;
          box-shadow: 0 6px 18px rgba(27, 94, 32, 0.4);
          transform: translateY(-1px);
        }
        button[type="submit"]:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        p {
          font-size: 0.875rem;
          text-align: center;
          margin: 0.25rem 0;
          color: #555E57;
        }
        b.pointer {
          cursor: pointer;
          color: #1B5E20;
        }
        b.pointer:hover {
          color: #144A18;
          text-decoration: underline;
        }

        .success {
          color: #15803d;
          text-align: center;
          font-weight: 500;
          font-size: 0.875rem;
          background: #f0fdf4;
          padding: 0.5rem;
          border-radius: 6px;
        }
        .error {
          color: #b91c1c;
          text-align: center;
          font-weight: 500;
          font-size: 0.875rem;
          background: #fef2f2;
          padding: 0.5rem;
          border-radius: 6px;
        }

        /* Form transitions */
        .main-container.sign-in .form-panel.sign-in {
          transform: translateX(0);
          opacity: 1;
          pointer-events: auto;
        }
        .main-container.sign-in .form-panel.sign-up {
          transform: translateX(100%);
          opacity: 0;
          pointer-events: none;
        }
        .main-container.sign-up .form-panel.sign-in {
          transform: translateX(-100%);
          opacity: 0;
          pointer-events: none;
        }
        .main-container.sign-up .form-panel.sign-up {
          transform: translateX(0);
          opacity: 1;
          pointer-events: auto;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .form-container {
            flex-direction: column;
            width: 95%;
            max-width: 420px;
          }
          .image-panel {
            display: none;
          }
          .forms-wrapper {
            width: 100%;
            min-height: 480px;
          }
          .form-panel {
            padding: 2rem 1.5rem;
          }
          h2 {
            font-size: 1.35rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
