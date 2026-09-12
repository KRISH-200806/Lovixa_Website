// import React from 'react';
// import { Link } from 'react-router-dom';
// import logo from "../../assets/image/rimlogo.png";
// import { motion } from 'framer-motion';

// const Footer = () => {
//     return (
//         <motion.footer
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             className='w-full bg-[#1C1D1C] py-16 px-4 mt-0 '
//         >
//             <div className='max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-5 md:max-w-[1200px] m-auto '>
//                 <div className='md:col-span-1'>
//                     <img src={logo} alt="Rimzim Logo" className='w-28 h-16 mt-6 md:mt-10 bg-white'/>
//                     <p className="py-2 text-[#8f96a0] hover:text-white cursor-pointer">info@rimzim.com</p>
//                     <p className="py-2 text-[#8f96a0] hover:text-white cursor-pointer">+91 1234567891</p>
//                 </div>

//                 <div className='md:col-span-1'>
//                     <h3 className="font-bold text-light text-2xl mt-6 md:mt-10 text-white">CATEGORIES</h3>
//                     <ul className="py-3 text-[#8f96a0] ">
//                         <Link to="/attar" className="py-2 hover:text-white cursor-pointer block">Attar</Link>
//                         <Link to="/perfume-spray" className="py-2 hover:text-white cursor-pointer block">Perfume Spray</Link>
//                         <Link to="/body-spray" className="py-2 hover:text-white cursor-pointer block">Body Spray</Link>
//                         <Link to="/new-arrival" className="py-2 hover:text-white cursor-pointer block">New Arrival</Link>
//                         <Link to="/track-order" className="py-2 hover:text-white cursor-pointer block">Track Order</Link>
//                         <Link to="/store-locator" className="py-2 hover:text-white cursor-pointer block">Store Locator</Link>
//                     </ul>
//                 </div>

//                 <div className='md:col-span-1'>
//                     <h3 className="font-bold text-light text-2xl mt-6 md:mt-10 text-white">QUICK LINKS</h3>
//                     <ul className="py-3 text-[#8f96a0] ">
//                         {/* <Link to="/account" className="py-2 hover:text-white cursor-pointer block">Account</Link> */}
//                         <Link to="/about-us" className="py-2 hover:text-white cursor-pointer block">About Us</Link>
//                         <Link to="/contact-us" className="py-2 hover:text-white cursor-pointer block">Contact Us</Link>
//                         {/* <Link to="/store-locator" className="py-2 hover:text-white cursor-pointer block">Store Locator</Link> */}
//                         <Link to="/refund-policy" className="py-2 hover:text-white cursor-pointer block">Refunds & Cancellations Policy</Link>
//                         <Link to="/privacy-policy" className="py-2 hover:text-white cursor-pointer block">Privacy Policy</Link>
//                         <Link to="/terms-of-service" className="py-2 hover:text-white cursor-pointer block">Terms of Service</Link>
//                     </ul>
//                 </div>

//                 <div className='md:col-span-2'>
//                     <h3 className="font-bold text-light text-2xl mt-6 md:mt-10 text-white">SUBSCRIBE NEWSLETTER</h3>
//                     <p className="py-2 text-[#8f96a0] hover:text-white">
//                         Subscribe to receive updates and new deals as they become available.
//                     </p>
//                     <form className='flex flex-col sm:flex-row items-center gap-2 mt-4'>
//                         <input
//                             type="text"
//                             className="w-full px-5 py-3 border border-neutral-300 bg-transparent text-neutral-400 outline-none placeholder:text-neutral-500"
//                             placeholder='Enter your email address here'
//                         />
//                         <button className="h-12 w-full sm:w-52 bg-white text-black rounded-lg mt-7 sm:mt-0">
//                             Subscribe
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </motion.footer>
//     );
// }

// export default Footer;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/image/rimlogo.png";
import { motion } from "framer-motion";
import api from "../../Axios/axiosInstance";
import { useLoading } from "../Context/LoadingContext";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("get-categories/");
        if (res.data?.categories) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        console.error("Category fetch failed:", error);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (id) => {
    setCategoryId(id);
    // Set loading state when category is clicked
    setIsLoading(true);
    SingleDataget(id);
  };

  const SingleDataget = async (id, name) => {
    // Validate inputs
    if (!id) {
      console.error("No category ID provided");
      setIsLoading(false); // End loading if no ID
      return;
    }

    // Set loading state
    setLoading(true);

    try {
      const res = await api.get(`get-categories/`, {
        params: { category_id: id },
      });

      if (!res.data?.results) {
        throw new Error("Invalid response structure");
      }

      // Use the provided name or fallback to 'all-products'
      const category_name = name?.toLowerCase() || "all-products";

      // Navigate with state and URL params
      navigate(`/viewall/${category_name}`, {
        state: {
          data: res.data.results,
          categoryId: id,
          categoryName: name || "All Products",
        },
      });
    } catch (error) {
      console.error("Failed to fetch products:", error);

      // Show error to user (you could add a toast/notification here)
      navigate("/viewall/all-products", {
        state: {
          error: "Failed to load products",
          categoryId: id,
        },
      });
    } finally {
      setLoading(false);
      // The loading state will be handled by the LoadingContext when the route changes
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1C1D1C] py-16 px-4 mt-0 "
    >
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-5 md:max-w-[1200px] m-auto ">
        <div className="md:col-span-1">
          <img
            src={logo}
            alt="Rimzim Logo"
            className="w-28 h-16 mt-6 md:mt-10 bg-white"
          />
          <p className="py-2 text-[#8f96a0] hover:text-white cursor-pointer">
            info@rimzim.com
          </p>
          <p className="py-2 text-[#8f96a0] hover:text-white cursor-pointer">
            +91 1234567891
          </p>
        </div>

        <div className="md:col-span-1">
          <h3 className="font-bold text-light text-2xl mt-6 md:mt-10 text-white">
            CATEGORIES
          </h3>
          <ul className="py-3 text-[#8f96a0] ">
            {loading ? (
              <li className="py-2">Loading...</li>
            ) : error ? (
              <li className="py-2 text-red-400">{error}</li>
            ) : (
              <>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/viewall/${category.name.toLowerCase()}`}
                    onClick={() => handleCategoryClick(category.id)}
                    className="py-2 hover:text-white cursor-pointer block"
                  >
                    {category.name}
                  </Link>
                ))}
              </>
            )}
          </ul>
        </div>

        <div className="md:col-span-1">
          <h3 className="font-bold text-light text-2xl mt-6 md:mt-10 text-white">
            QUICK LINKS
          </h3>
          <ul className="py-3 text-[#8f96a0] ">
            <Link
              to="/about-us"
              className="py-2 hover:text-white cursor-pointer block"
            >
              About Us
            </Link>
            <Link
              to="/contact-us"
              className="py-2 hover:text-white cursor-pointer block"
            >
              Contact Us
            </Link>
            <Link
              to="/refund-policy"
              className="py-2 hover:text-white cursor-pointer block"
            >
              Refunds & Cancellations Policy
            </Link>
            <Link
              to="/privacy-policy"
              className="py-2 hover:text-white cursor-pointer block"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="py-2 hover:text-white cursor-pointer block"
            >
              Terms of Service
            </Link>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="font-bold text-light text-2xl mt-6 md:mt-10 text-white">
            SUBSCRIBE NEWSLETTER
          </h3>
          <p className="py-2 text-[#8f96a0] hover:text-white">
            Subscribe to receive updates and new deals as they become available.
          </p>
          <form className="flex flex-col sm:flex-row items-center gap-2 mt-4">
            <input
              type="text"
              className="w-full px-5 py-3 border border-neutral-300 bg-transparent text-neutral-400 outline-none placeholder:text-neutral-500"
              placeholder="Enter your email address here"
            />
            <button className="h-12 w-full sm:w-52 bg-white text-black rounded-lg mt-7 sm:mt-0">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
