  import React, { useState, useEffect, useContext, useRef } from "react";
  import CartPanel from "./CartPanel";
  import SearchIcon from "../../assets/image/search-icon.svg";
  import logo from "../../assets/image/rimlogo.png";
  import { Link, useNavigate } from "react-router-dom";
  import { CartContext } from "../Context/CartContext";
  import { useLoading } from "../Context/LoadingContext";
  import api from "../../Axios/axiosInstance";
  import UserDropdown from "./Userdropdown";

  // Icons
  const UserIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const ShoppingBagIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  );

  const MenuIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );

  const XIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  // Reusable Button Component
  const Button = ({ children, className, onClick }) => {
    return (
      <button
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors ${
          className || ""
        }`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  // Search Input Field
  

  // Header Component
  function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [visibleItems, setVisibleItems] = useState([]);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const { cartItems, setCartItems } = useContext(CartContext);
    const { setIsLoading } = useLoading();
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const navigation = [
      { name: "Attar", href: "/attar" },
      { name: "Perfume Spray", href: "/perfume-spray" },
      { name: "Body Spray", href: "/body-spray" },
      { name: "Bakhoor", href: "/bakhoor" },
      { name: "Incense Sticks", href: "/incense-sticks" },
      { name: "New Arrival", href: "/new-arrival" },
      { name: "Diffuser Oil", href: "/diffuser-oil" },
      { name: "Track Order", href: "/track" },
      { name: "Return Your Order", href: "/returns" },
      { name: "Store Locator", href: "/stores" },
    ];

    const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState(null);


    const inputRef = useRef(null);
  const resultsRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    // Get all text content from the page
    const pageContent = document.body.innerText;
    const words = pageContent.split(/\s+/);
    // Find matching words
    const matches = words.filter((word) =>
      word.toLowerCase().includes(text.toLowerCase())
    );
    // Create unique results with context
    const results = [...new Set(matches)].map((match) => {
      const index = pageContent.toLowerCase().indexOf(match.toLowerCase());
      const start = Math.max(0, index - 20);
      const end = Math.min(pageContent.length, index + match.length + 20);
      const context = pageContent.substring(start, end);
      return {
        text: match,
        context: context,
        index: index,
      };
    });
    setSearchResults(results);
    setShowResults(true);
  };
  const scrollToText = (text, index) => {
    // Remove previous highlight if exists
    if (highlightedElement) {
      highlightedElement.classList.remove("search-highlight");
    }
    // Find the element containing the text
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node;
    let found = false;
    while ((node = walker.nextNode())) {
      if (node.textContent.toLowerCase().includes(text.toLowerCase())) {
        const parent = node.parentElement;
        parent.classList.add("search-highlight");
        setHighlightedElement(parent);
        // Scroll to the element
        parent.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        found = true;
        break;
      }
    }
    if (found) {
      // Remove highlight after 10 seconds
      setTimeout(() => {
        if (highlightedElement) {
          highlightedElement.classList.remove("search-highlight");
          setHighlightedElement(null);
        }
      }, 200);
    }
    setShowResults(false);
  };
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200 dark:bg-yellow">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  // Add styles for search highlight
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .search-highlight {
        background-color: rgba(255, 255, 0, 0.3);
        transition: background-color 0.3s ease;
      }
      .dark .search-highlight {
        background-color: rgba(255, 255, 0, 0.2);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);






    // Fetch user data from API on mount
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const res = await api.get("get-categories/");
          if (res.data?.categories) {
            setCategories(res?.data?.categories);
          }
        } catch (error) {
          console.error("Category fetch failed:", error);
        } finally {
          setLoadingUser(false);
        }
      };

      fetchCategories();
    }, []);
    useEffect(() => {
      if (isMobileMenuOpen) {
        setVisibleItems([]);
        const allItems = [...navigation];
        const initialDelay = 100;
        allItems.forEach((item, index) => {
          setTimeout(() => {
            setVisibleItems((prev) => [...prev, item.name]);
          }, initialDelay + index * 100);
        });
        document.body.style.overflow = "hidden";
      } else {
        setVisibleItems([]);
        document.body.style.overflow = "auto";
      }

      return () => {
        document.body.style.overflow = "auto";
      };
    }, [isMobileMenuOpen]);

    const handleUpdateQuantity = (id, quantity) => {
      if (quantity <= 0) {
        handleRemoveItem(id);
      } else {
        const updatedItems = cartItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
        setCartItems(updatedItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      }
    };

    const handleRemoveItem = (id) => {
      const updatedItems = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    };

    const toggleSearchInput = () => {
      setIsSearchVisible(!isSearchVisible);
    };

    const [categetyId, setCategeryId] = useState(null);


    const handleCategoryClick = (id) => {
      setCategeryId(id);
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
      setLoadingUser(true);

      try {
        const res = await api.get(`get-products/`, {
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
        setLoadingUser(false);
        // The loading state will be handled by the LoadingContext when the route changes
      }
    };

    // Function to scroll to top
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    return (
      <header className="bg-white shadow-sm fixed top-0 z-10 w-full">
        <nav className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Mobile Menu Button */}
            <Button
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </Button>

            {/* Logo */}
            <div className="flex-shrink-0 -ml-6 sm:ml-0">
              <Link to="/" onClick={scrollToTop}>
                <img src={logo} alt="Adil Qadri" className="h-20 w-auto" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block flex-1 max-w-4xl mx-auto">
              <ul className="flex flex-wrap justify-center space-x-4 xl:space-x-6">
                {categories.map((category) => (
                  <li key={category.id} className="group relative">
                    <Link
                      to={`/viewall/${category.name.toLowerCase()}`}
                      onClick={() => handleCategoryClick(category.id)}
                      className="text-xs xl:text-sm font-medium text-gray-700 hover:text-gray-900 py-1 block whitespace-nowrap"
                    >
                      {category.name}
                    </Link>
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-700 scale-x-0 transition-transform origin-left duration-300 group-hover:scale-x-100"></span>
                  </li>
                ))}
              </ul>
            </div>
              
            {/* Right Side Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Search Button */}
              <Button className="md:hidden" onClick={toggleSearchInput}>
                <img src={SearchIcon} alt="search" className="h-4 w-4" />
              </Button>
              
              {/* Desktop Search Input */}
              <div className="hidden lg:block relative" ref={resultsRef}>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="relative">
                    {/* Search Icon */}
                    <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                      <svg
                        className="fill-gray-500 dark:fill-gray-400"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                          fill=""
                        />
                      </svg>
                    </span>

                    {/* Search Input */}
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchText}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search or type command..."
                      className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-black dark:placeholder:text-black dark:focus:border-brand-800 xl:w-[430px]"
                    />

                    {/* Keyboard Shortcut Hint */}
                    <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                      <span>⌘</span>
                      <span>K</span>
                    </button>
                  </div>
                </form>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-white rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => scrollToText(result.text, result.index)}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-white border-b border-gray-200 dark:border-gray-700 last:border-b-0 cursor-pointer"
                      >
                        <div className="text-sm text-gray-900 dark:text-black">
                          {highlightText(result.text, searchText)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-600 mt-1">
                          {highlightText(result.context, searchText)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Shopping Cart Button */}
              <Button
                className="relative rounded-sm px-2 py-1"
                onClick={() => setIsCartOpen(true)}
              >
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <ShoppingBagIcon />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 left-3 h-4 w-4 rounded-full bg-[#B4945E] text-xs font-bold text-white flex items-center justify-center">
                        {cartItems.reduce(
                          (total, item) => total + item.quantity,
                          0
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </Button>
                  
              {/* User Dropdown */}
              <UserDropdown />
            </div>
          </div>

          {/* Mobile Drawer */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 lg:hidden ${
              isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            className={`fixed top-0 left-0 bottom-0 w-72 sm:w-80 bg-white z-30 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto max-h-screen ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <Link to="/" onClick={() => { scrollToTop(); setIsMobileMenuOpen(false); }}>
                <img src={logo} alt="Adil Qadri" className="h-16 w-24" />
              </Link>
              <Button onClick={() => setIsMobileMenuOpen(false)}>
                <XIcon />
              </Button>
            </div>
            <div className="p-4">
              
              <ul className="space-y-4">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="transform transition-all duration-500 ease-out translate-x-0  opacity-100"
                  >
                    <Link
                      to={`/category/${category.name.toLowerCase()}`}
                      onClick={() => {
                        handleCategoryClick(category.id);
                        setIsMobileMenuOpen(false); // optionally close drawer
                      }}
                      className="block py-2 text-base font-medium text-gray-700 hover:text-gray-900 border-b border-gray-100"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 border-t border-gray-200">
              <Button className="w-full py-2 text-center bg-gray-900 text-white rounded-md hover:bg-gray-800">
                <UserIcon />
                <span className="ml-2">{user ? user.name : "My Account"}</span>
              </Button>
            </div>
          </div>

          {/* Mobile search */}
          <div
            className={`fixed inset-x-0 top-16 bg-white p-4 shadow-md transition-all duration-300 transform z-10 md:hidden ${
              isSearchVisible
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex items-center">
              <div className="flex-1 relative" ref={resultsRef}>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="relative">
                    {/* Search Icon */}
                    <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                      <svg
                        className="fill-gray-500 dark:fill-gray-400"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                          fill=""
                        />
                      </svg>
                    </span>

                    {/* Search Input */}
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchText}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search or type command..."
                      className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-black dark:placeholder:text-black dark:focus:border-brand-800"
                    />

                    {/* Keyboard Shortcut Hint */}
                    <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                      <span>⌘</span>
                      <span>K</span>
                    </button>
                  </div>
                </form>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-white rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => scrollToText(result.text, result.index)}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-white border-b border-gray-200 dark:border-gray-700 last:border-b-0 cursor-pointer"
                      >
                        <div className="text-sm text-gray-900 dark:text-black">
                          {highlightText(result.text, searchText)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-600 mt-1">
                          {highlightText(result.context, searchText)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button className="ml-2" onClick={toggleSearchInput}>
                <XIcon />
              </Button>
            </div>
          </div>

          {/* Cart Panel */}
          <CartPanel
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCartUpdate={setCartItems}
          />
        </nav>
      </header>
    );
  }

  export default Header;
