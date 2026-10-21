import React, { useState, useEffect, useRef } from "react";
import CartPanel from "./CartPanel";
import logo from "../../assets/image/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import api from "../../Axios/axiosInstance";
import UserDropdown from "./Userdropdown";
import { FiSearch, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { cartCount } = useCart();
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Fetch categories on mount
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await api.get("catalog/categories/");
        if (isMounted) {
          if (res.data?.results) {
            setCategories(res.data.results);
          } else if (Array.isArray(res.data)) {
            setCategories(res.data);
          }
        }
      } catch (error) {
        console.error("Category fetch failed:", error);
      }
    };

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Search products with debounce
  useEffect(() => {
    if (!searchText.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await api.get(`catalog/products/?search=${encodeURIComponent(searchText.trim())}`);
        if (res.data?.results) {
          setSearchResults(res.data.results.slice(0, 6));
          setShowResults(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchResultClick = (product) => {
    setShowResults(false);
    setSearchText("");
    setIsSearchVisible(false);
    navigate(`/product/${product.id || product.slug}`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-xs fixed top-0 z-40 w-full border-b border-border font-['Urbanist'] transition-all">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-text-main hover:text-brand rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-2 group transition-transform hover:scale-105 duration-300">
              <img src={logo} alt="Lovixa Logo" className="h-9 sm:h-11 md:h-12 w-auto object-contain" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center max-w-2xl mx-auto">
            <ul className="flex items-center space-x-6 xl:space-x-8">
              <li>
                <Link
                  to="/"
                  onClick={scrollToTop}
                  className="text-sm font-semibold text-text-main hover:text-brand transition-colors py-1 block relative group"
                >
                  Home
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand scale-x-0 transition-transform origin-left duration-300 group-hover:scale-x-100 rounded-full"></span>
                </Link>
              </li>
              {categories.map((category) => {
                const targetSlug = category.slug || category.name.toLowerCase().replace(/\s+/g, "-");
                return (
                  <li key={category.id} className="relative group">
                    <Link
                      to={`/viewall/${targetSlug}`}
                      state={{ categoryId: category.id, categoryName: category.name }}
                      className="text-sm font-medium text-text-secondary hover:text-brand transition-colors py-1 block whitespace-nowrap relative"
                    >
                      {category.name}
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand scale-x-0 transition-transform origin-left duration-300 group-hover:scale-x-100 rounded-full"></span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  to="/bestsellers"
                  className="text-sm font-medium text-text-secondary hover:text-brand transition-colors py-1 block relative group"
                >
                  Best Sellers
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand scale-x-0 transition-transform origin-left duration-300 group-hover:scale-x-100 rounded-full"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Side Icons (Search, Cart, User) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Search */}
            <div className="hidden md:block relative" ref={searchContainerRef}>
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search products..."
                  className="w-48 lg:w-64 pl-10 pr-4 py-2 text-xs rounded-full border border-border bg-warm focus:bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all shadow-2xs"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-brand rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Search Dropdown Results */}
              {showResults && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-card-hover border border-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {searchResults.length > 0 ? (
                    <div className="divide-y divide-warm-300 max-h-80 overflow-y-auto">
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleSearchResultClick(product)}
                          className="p-3 flex items-center gap-3 hover:bg-warm/80 cursor-pointer transition-colors group"
                        >
                          <div className="w-10 h-10 bg-warm rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-border">
                            {product.primary_image ? (
                              <img
                                src={
                                  product.primary_image.startsWith("http")
                                    ? product.primary_image
                                    : `${URL.PHOTO_URL}${product.primary_image.startsWith("/") ? "" : "/"}${product.primary_image}`
                                }
                                alt={product.name}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <span className="text-[10px] text-gray-400">Lovixa</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-text-main group-hover:text-brand transition-colors truncate">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-brand font-bold">
                              ₹{product.effective_price || product.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-text-secondary">
                      No products found for "{searchText}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              className="md:hidden p-2 text-text-secondary hover:text-brand rounded-full hover:bg-warm transition-colors"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              aria-label="Toggle Search"
            >
              <FiSearch size={18} />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-text-main hover:text-brand rounded-full hover:bg-warm transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Shopping Cart"
            >
              <FiShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4.5 min-w-[18px] px-1 rounded-full bg-brand text-[10px] font-bold text-white flex items-center justify-center shadow-brand/40 animate-pulse-subtle">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            <UserDropdown />
          </div>
        </div>

        {/* Mobile Search Bar Expandable */}
        {isSearchVisible && (
          <div className="p-3 border-t border-border md:hidden animate-fade-in bg-white">
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border border-border bg-warm focus:bg-white focus:outline-none focus:border-brand"
                autoFocus
              />
            </div>
            {showResults && searchResults.length > 0 && (
              <div className="mt-2 bg-white rounded-lg shadow-card border border-border divide-y divide-warm-300 max-h-60 overflow-y-auto">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSearchResultClick(product)}
                    className="p-2.5 flex items-center gap-3 hover:bg-warm cursor-pointer transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-main truncate">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-brand font-bold">
                        ₹{product.effective_price || product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                  <img src={logo} alt="Lovixa Logo" className="h-12 w-auto" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-full text-text-secondary hover:text-text-main hover:bg-warm transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <ul className="space-y-4">
                  <li>
                    <Link
                      to="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-sm font-semibold text-text-main hover:text-brand transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  {categories.map((category) => {
                    const targetSlug = category.slug || category.name.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <li key={category.id}>
                        <Link
                          to={`/viewall/${targetSlug}`}
                          state={{ categoryId: category.id, categoryName: category.name }}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-sm font-medium text-text-secondary hover:text-brand transition-colors"
                        >
                          {category.name}
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <Link
                      to="/bestsellers"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-sm font-medium text-text-secondary hover:text-brand transition-colors"
                    >
                      Best Sellers
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-border">
                <Link
                  to="/checkout"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-brand text-white rounded-lg text-center text-xs font-semibold block hover:bg-brand-hover shadow-brand/20 transition-all duration-300"
                >
                  My Orders & Addresses
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Global Slide-In Cart Panel */}
        <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </nav>
    </header>
  );
}

export default Header;
