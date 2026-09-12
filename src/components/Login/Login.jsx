import React, { useEffect, useRef, useState, useCallback } from "react";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Axios/axiosInstance";

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
import logo from "../../assets/image/rimlogo.png";

// Input field component
const InputGroup = ({ icon, type, placeholder, value, onChange, required }) => (
  <div className="input-group">
    <i>{icon}</i>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
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
  const mainContainerRef = useRef(null);

  const [formMode, setFormMode] = useState("sign-in");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

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
  }, []);

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

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", loginForm.email);
      formData.append("password", loginForm.password);

      const res = await api.post("login/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_id", res.data.user_id);
      setLoginMessage({ type: "success", text: "Login successful!" });
      setTimeout(() => navigate("/herosection"), 1000);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setLoginMessage({ type: "error", text: msg });
    }
  };

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("first_name", registerForm.firstName);
      formData.append("last_name", registerForm.lastName);
      formData.append("email", registerForm.email);
      formData.append("password", registerForm.password);

      await api.post("register/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSignUpMessage({
        type: "success",
        text: "Registration successful! Please sign in.",
      });
      setTimeout(() => toggleForm(), 1000);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Signup failed. Please try again.";
      setSignUpMessage({ type: "error", text: msg });
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
      <main className="main-container  " ref={mainContainerRef}>
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
                <h2>Welcome to Our Platform</h2>
                <p>Join thousands of satisfied customers using our services.</p>
              </div>
            </div>
          )}

          <div className="forms-wrapper">
            {/* Sign Up */}
            <div className="form-panel sign-up ">
              <form onSubmit={handleRegister} aria-labelledby="signup-heading">
                <img src={logo} alt="Company Logo" className="form-logo" />
                <h2 id="signup-heading">Create Account</h2>
                <InputGroup
                  icon={<FiUser />}
                  type="text"
                  placeholder="First Name"
                  value={registerForm.firstName}
                  onChange={(val) => handleRegisterChange("firstName", val)}
                  required
                />
                <InputGroup
                  icon={<FiUser />}
                  type="text"
                  placeholder="Last Name"
                  value={registerForm.lastName}
                  onChange={(val) => handleRegisterChange("lastName", val)}
                  required
                />
                <InputGroup
                  icon={<FiMail />}
                  type="email"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={(val) => handleRegisterChange("email", val)}
                  required
                />
                <InputGroup
                  icon={<FiLock />}
                  type="password"
                  placeholder="Password"
                  value={registerForm.password}
                  onChange={(val) => handleRegisterChange("password", val)}
                  required
                />
                <FormMessage {...signUpMessage} />
                <button type="submit">Sign Up</button>
                <p>
                  Already have an account?{" "}
                  <b className="pointer" onClick={toggleForm}>
                    Sign in
                  </b>
                </p>
              </form>
            </div>

            {/* Sign In */}
            <div className="form-panel sign-in">
              <form onSubmit={handleLogin} aria-labelledby="signin-heading">
                <img src={logo} alt="Company Logo" className="form-logo" />
                <h2 id="signin-heading">Welcome Back</h2>
                <InputGroup
                  icon={<FiMail />}
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(val) => handleLoginChange("email", val)}
                  required
                />
                <InputGroup
                  icon={<FiLock />}
                  type="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(val) => handleLoginChange("password", val)}
                  required
                />
                <FormMessage {...loginMessage} />
                <button type="submit">Sign In</button>
                <p>
                  <Link
                    to="/UserForgotPassword"
                    className="text-[#B4945E] hover:text-[#8B7355] font-semibold"
                  >
                    Forgot Password?
                  </Link>
                </p>
                <p>
                  Don't have an account?{" "}
                  <b className="pointer" onClick={toggleForm}>
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
          filter: blur(8px);
          transform: scale(1.1);
        }

        .main-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          font-family: "Poppins", sans-serif;
        }
        .form-container {
          display: flex;
          width: 90%;
          max-width: 1000px;
          overflow: hidden;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(5px);
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
        }

        .image-panel {
          width: 40%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
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
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 2rem;
          text-align: center;
          z-index: 2;
        }

        .forms-wrapper {
          width: 60%;
          display: flex;
          position: relative;
          overflow: hidden;
        }
        .form-panel {
          width: 100%;
          height: 700px;
          padding: 2rem;
          transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
          position: absolute;
        }
        .form-panel form {
          display: flex;
          flex-direction: column;
          gap: ;
          width: 100%;
          height: 500px;
        }
        .form-logo {
          width: 120px;
          margin: 0 auto 1rem;
          display: block;
        }

        .input-group {
          position: relative;
          width: 100%;
        }
        .input-group i {
          position: absolute;
          top: 50%;
          left: 10px;
          transform: translateY(-50%);
          color: #555;
          z-index: 1;
        }
        .input-group input {
          width: 100%;
          padding: 0.7rem 2.5rem;
          border-radius: 5px;
          border: 1px solid #ddd;
          background: rgba(255, 255, 255, 0.8);
        }
        .input-group input:focus {
          outline: none;
          border-color: #b4945e;
          box-shadow: 0 0 0 2px rgba(78, 166, 133, 0.2);
        }

        button {
          padding: 0.8rem;
          background: #b4945e;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        button:hover {
          background: #8b7355;
        }
        button:active {
          transform: scale(0.98);
        }

        p {
          font-size: 0.9rem;
          text-align: center;
          margin: 0.5rem 0;
        }
        b.pointer {
          cursor: pointer;
          color: #b4945e;
        }
        b.pointer:hover {
          color: #8b7355;
          text-decoration: underline;
        }

        .success {
          color: #2e844a;
          text-align: center;
          font-weight: 500;
        }
        .error {
          color: #c41e3a;
          text-align: center;
          font-weight: 500;
        }

        /* Form transitions */
        .main-container.sign-in .form-panel.sign-in {
          transform: translateX(0);
          opacity: 1;
          position: relative;
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
          position: relative;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .form-container {
            flex-direction: column;
            width: 95%;
            max-width: 400px;
          }
          .image-panel {
            display: none;
          }
          .forms-wrapper {
            width: 100%;
          }
          .form-panel {
            padding: 1.5rem;
          }
          .form-logo {
            width: 100px;
          }
          .input-group input {
            padding: 0.6rem 2.5rem;
          }
          button {
            padding: 0.7rem;
          }
          h2 {
            font-size: 1.5rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
