import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/image/logo.png";
import { motion } from "framer-motion";
import api from "../../Axios/axiosInstance";
import { toast } from "react-toastify";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await api.get("catalog/categories/");
        if (isMounted) {
          const catList = res.data?.results || (Array.isArray(res.data) ? res.data : []);
          setCategories(catList.slice(0, 6));
        }
      } catch (error) {
        console.error("Footer category fetch failed:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast.warning("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    toast.success("Thank you for subscribing to Lovixa updates!");
    setNewsletterEmail("");
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-lightBg py-16 px-4 font-['Urbanist'] text-text-main border-t border-emerald-200/80"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand Info */}
        <div className="md:col-span-1 flex flex-col items-start">
          <Link to="/" className="inline-block mb-4">
            <img
              src={logo}
              alt="Lovixa Logo"
              className="w-[140px] h-auto object-contain"
            />
          </Link>
          <p className="text-xs text-text-secondary mb-4 leading-relaxed">
            Pure, luxury fragrances & artisanal cosmetics crafted with the finest natural botanicals to elevate your aura.
          </p>
          <p className="text-xs py-1 text-text-secondary hover:text-brand transition cursor-pointer">
            lovixacosmetic@gmail.com
          </p>
          <p className="text-xs py-1 text-text-secondary hover:text-brand transition cursor-pointer">
            +91 88859 78692
          </p>
        </div>

        {/* Categories */}
        <div className="md:col-span-1">
          <h3 className="font-bold text-brand text-sm tracking-wider uppercase mb-4">
            Categories
          </h3>
          <ul className="space-y-2 text-xs text-text-secondary">
            {loading ? (
              <li className="text-gray-400 animate-pulse">Loading categories...</li>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/viewall/${category.slug || category.name.toLowerCase()}`}
                    className="hover:text-brand transition-colors block py-0.5"
                  >
                    {category.name}
                  </Link>
                </li>
              ))
            ) : (
              <>
                <li>
                  <Link to="/viewall/attar" className="hover:text-brand transition-colors block py-0.5">
                    Attar
                  </Link>
                </li>
                <li>
                  <Link to="/viewall/perfume-spray" className="hover:text-brand transition-colors block py-0.5">
                    Perfume Spray
                  </Link>
                </li>
                <li>
                  <Link to="/viewall/body-spray" className="hover:text-brand transition-colors block py-0.5">
                    Body Spray
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-1">
          <h3 className="font-bold text-brand text-sm tracking-wider uppercase mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-xs text-text-secondary">
            <li>
              <Link to="/about-us" className="hover:text-brand transition-colors block py-0.5">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="hover:text-brand transition-colors block py-0.5">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-brand transition-colors block py-0.5">
                FAQ & Help
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-brand transition-colors block py-0.5">
                Refunds & Returns
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-brand transition-colors block py-0.5">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="hover:text-brand transition-colors block py-0.5">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="md:col-span-2">
          <h3 className="font-bold text-brand text-sm tracking-wider uppercase mb-2">
            Subscribe Newsletter
          </h3>
          <p className="text-xs text-text-secondary mb-4">
            Subscribe to receive exclusive offers, new arrival alerts, and royal fragrance updates.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-text-main outline-none placeholder:text-gray-400 text-xs focus:border-brand focus:ring-2 focus:ring-brand/20 shadow-2xs"
              placeholder="Enter your email address"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition duration-300 shadow-brand/20 whitespace-nowrap active:scale-95"
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p className="text-xs text-brand mt-2 font-semibold">✓ Subscribed successfully!</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-emerald-200/70 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-text-secondary">
        <p>© {new Date().getFullYear()} Lovixa Luxury Fragrances. All rights reserved.</p>
        <p className="mt-2 md:mt-0 font-medium">Crafted with Pure Ingredients.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;
