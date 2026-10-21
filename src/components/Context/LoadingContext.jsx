import React, { createContext, useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Create context
export const LoadingContext = createContext();

// Create provider component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Always set loading to false
  useEffect(() => {
    setIsLoading(false);
  }, [location.pathname]);

  // The context value that will be supplied to any descendants of this provider
  const contextValue = {
    isLoading,
    setIsLoading,
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook for using the loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
