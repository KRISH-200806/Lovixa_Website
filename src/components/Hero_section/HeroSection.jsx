import React, { useState, useEffect } from "react";
import {
  Truck,
  RefreshCw,
  Banknote,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import AQ365 from "../../assets/image/AQ365.jpg";
import combo from "../../assets/image/combo.jpg";
import combo2 from "../../assets/image/combo2.png";
import signature from "../../assets/image/signature.jpg";
// Import mobile versions of images
import AQ365Mobile from "../../assets/image/mobile/AQ365Mobile.png";
import comboMobile from "../../assets/image/mobile/comboMobile.png";
import combo2Mobile from "../../assets/image/mobile/combo2Mobile.png";
import signatureMobile from "../../assets/image/mobile/signatureMobile.png";
import Category from "../Category/Category";
// import ProductPage from '../All_product/ProductPage';
import BestSellers from "../Our_Best_Sellers/BestSellers";
// import Video from '../Video_section/Video';
import Product from "../Product_card/Product";
import axios from "axios";
// import Login from '../Login/Login';
// import Main from '../View_All_Product/Main';

const features = [
  {
    name: "Free Shipping",
    icon: Truck,
  },
  {
    name: "Easy Returns",
    icon: RefreshCw,
  },
  {
    name: "COD Available",
    icon: Banknote,
  },
  {
    name: "Secure Payments",
    icon: ShieldCheck,
  },
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [deviceSize, setDeviceSize] = useState("lg");
  const isMobile = deviceSize === "xs" || deviceSize === "sm";

  const viewdata = async () => {
    try {
      const response = await axios.get(
        "https://perfume.flexioninfotech.com/api/get-products/?category_id=1"
      );
      console.log("========>", response.data);
    } catch (error) {
      console.log("error---->", error);
    }
  };

  useEffect(() => {
    viewdata();
  }, []);

  // Check device size with multiple breakpoints
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 480) {
        setDeviceSize("xs");
      } else if (window.innerWidth < 768) {
        setDeviceSize("sm");
      } else if (window.innerWidth < 1024) {
        setDeviceSize("md");
      } else {
        setDeviceSize("lg");
      }
    };

    // Check on initial load
    checkScreenSize();

    // Add resize listener with debounce for better performance
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkScreenSize, 100);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Hero slider content with both mobile and desktop images
  const sliderContent = [
    {
      desktopImage: AQ365,
      mobileImage: AQ365Mobile,
      overlayColor: "bg-black bg-opacity-10",
      alt: "AQ365 Product",
    },
    {
      desktopImage: combo,
      mobileImage: comboMobile,
      overlayColor: "bg-black bg-opacity-10",
      alt: "Combo Product",
    },
    {
      desktopImage: combo2,
      mobileImage: combo2Mobile,
      overlayColor: "bg-black bg-opacity-10",
      alt: "Combo2 Product",
    },
    {
      desktopImage: signature,
      mobileImage: signatureMobile,
      overlayColor: "bg-black bg-opacity-10",
      alt: "Signature Product",
    },
  ];

  // Auto slider functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderContent.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [sliderContent.length]);

  // Manual navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Full Screen Hero Slider */}
      <section className="relative h-screen">
        {/* Slider */}
        <div className="h-full relative overflow-hidden">
          {sliderContent.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentSlide === index ? "opacity-100 z-0" : "opacity-0 z-0"
              }`}
            >
              {/* Optimized image rendering based on device size */}
              <picture>
                <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
                <img
                  src={slide.desktopImage}
                  alt={slide.alt}
                  className={`w-full h-full object-cover  ${
                    deviceSize === "xs"
                      ? "object-center"
                      : deviceSize === "sm"
                      ? "object-center"
                      : "object-center"
                  }`}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </picture>

              {/* Optional overlay for better text visibility if needed */}
              <div className={`absolute inset-0 ${slide.overlayColor}`}></div>
            </div>
          ))}

          {/* Dot indicators - made larger and more visible on mobile */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2  flex space-x-3">
            {sliderContent.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  isMobile
                    ? `h-3 rounded-full ${
                        currentSlide === index
                          ? "bg-white w-6"
                          : "bg-white/50 w-3"
                      }`
                    : `h-3 rounded-full ${
                        currentSlide === index
                          ? "bg-white w-8"
                          : "bg-white/50 w-3"
                      }`
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with responsive sizing */}
      <div className="bg-white py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="mx-auto max-w-xs sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="flex flex-col items-center justify-center text-center p-2 sm:p-3 transition-all duration-300 hover:bg-gray-50 rounded-lg"
              >
                <feature.icon
                  className={`
                                    ${
                                      deviceSize === "xs"
                                        ? "h-5 w-5"
                                        : deviceSize === "sm"
                                        ? "h-6 w-6"
                                        : deviceSize === "md"
                                        ? "h-7 w-7"
                                        : "h-8 w-8"
                                    }
                                    text-gray-600
                                `}
                />
                <h3
                  className={`
                                    mt-2 font-medium text-gray-900
                                    ${
                                      deviceSize === "xs"
                                        ? "text-xs"
                                        : deviceSize === "sm"
                                        ? "text-sm"
                                        : "text-base"
                                    }
                                `}
                >
                  {feature.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shop By Category Component */}
      <Category />
      <BestSellers />
      {/* <Main/> */}
      {/* <Video/> */}
      <Product />
    </div>
  );
}

export default Home;
