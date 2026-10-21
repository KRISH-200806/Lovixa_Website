import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function handleLogout() {
    logout();
    closeDropdown();
    toast.info("You have been signed out.");
    navigate("/login");
  }

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user?.email?.split("@")[0] || "User";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 hover:text-black dark:text-gray-300 transition-colors p-1 rounded-full"
        aria-label="User menu"
      >
        <span className="overflow-hidden rounded-full h-9 w-9 bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700">
          <svg
            className="w-5 h-5 text-gray-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 flex flex-col rounded-xl border border-border bg-white p-2 shadow-card-hover z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {isAuthenticated ? (
            <>
              {/* User Info Section */}
              <div className="px-3 py-2.5 border-b border-border">
                <p className="font-semibold text-text-main text-sm truncate">
                  {displayName}
                </p>
                <p className="text-xs text-text-secondary truncate mt-0.5">
                  {user?.email}
                </p>
                {user?.role && user.role !== "customer" && (
                  <span className="inline-block mt-1.5 px-2 py-0.5 bg-gold/15 text-gold-dark border border-gold/30 text-[10px] font-semibold rounded-full uppercase tracking-wider">
                    {user.role}
                  </span>
                )}
              </div>

              <div className="py-1">
                <Link
                  to="/checkout"
                  onClick={closeDropdown}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-main rounded-full hover:bg-warm hover:text-brand transition-colors"
                >
                  <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  My Orders & Addresses
                </Link>
              </div>

              {/* Sign Out Button */}
              <div className="border-t border-border pt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 w-full text-left text-xs font-medium text-red-600 rounded-full hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="py-1">
              <Link
                to="/login"
                onClick={closeDropdown}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-main rounded-full hover:bg-brand hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In / Register
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}