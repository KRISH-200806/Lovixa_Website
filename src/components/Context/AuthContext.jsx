import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../../Axios/axiosInstance";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user profile from backend
  const fetchUserProfile = useCallback(async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const res = await api.get("auth/profile/");
      if (res.data?.data) {
        setUser(res.data.data);
        return res.data.data;
      } else if (res.data?.user) {
        setUser(res.data.user);
        return res.data.user;
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      // If unauthorized, clear tokens
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user_id");
        setUser(null);
        setToken(null);
      }
    } finally {
      setIsLoading(false);
    }
    return null;
  }, []);

  // Initialize profile on mount & listen for auth events
  useEffect(() => {
    fetchUserProfile();

    const handleAuthChange = () => {
      const currentToken = localStorage.getItem("token");
      setToken(currentToken);
      if (currentToken) {
        fetchUserProfile();
      } else {
        setUser(null);
        setIsLoading(false);
      }
    };

    window.addEventListener("auth-changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [fetchUserProfile]);

  // Login handler
  const login = async ({ email, password }) => {
    try {
      const res = await api.post("auth/login/", { email, password });
      if (res.data && res.data.status !== false && res.data.access) {
        const { access, refresh, user_id } = res.data;
        localStorage.setItem("token", access);
        if (refresh) localStorage.setItem("refresh", refresh);
        if (user_id) localStorage.setItem("user_id", user_id);

        setToken(access);
        const profile = await fetchUserProfile();

        window.dispatchEvent(new Event("auth-changed"));
        return { success: true, message: res.data.message || "Login successful!", user: profile };
      } else {
        return {
          success: false,
          message: res.data?.message || res.data?.detail || "Invalid credentials",
        };
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Login failed. Please check your credentials.";
      return { success: false, message: errorMsg };
    }
  };

  // Register handler
  const register = async ({ first_name, last_name, email, password }) => {
    try {
      const res = await api.post("auth/register/", {
        first_name,
        last_name,
        email,
        password,
      });

      if (res.data && res.data.status !== false) {
        if (res.data.access) {
          localStorage.setItem("token", res.data.access);
          if (res.data.refresh) localStorage.setItem("refresh", res.data.refresh);
          if (res.data.user_id) localStorage.setItem("user_id", res.data.user_id);
          setToken(res.data.access);
          await fetchUserProfile();
          window.dispatchEvent(new Event("auth-changed"));
        }
        return {
          success: true,
          message: res.data.message || "Registration successful!",
        };
      } else {
        return {
          success: false,
          message: res.data?.message || "Registration failed",
        };
      }
    } catch (err) {
      let errorMsg = "Registration failed. Please try again.";
      if (err.response?.data) {
        const d = err.response.data;
        if (d.message) errorMsg = d.message;
        else if (d.detail) errorMsg = d.detail;
        else if (d.errors && typeof d.errors === "object") {
          const firstKey = Object.keys(d.errors)[0];
          errorMsg = `${firstKey}: ${d.errors[firstKey]}`;
        }
      }
      return { success: false, message: errorMsg };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_id");
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("auth-changed"));
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    register,
    logout,
    refreshProfile: fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
