import axios from "axios";

const api = axios.create({
  baseURL: "https://perfume.flexioninfotech.com/api/",
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Log the exact request URL and method
    console.log(
      `Making ${config.method.toUpperCase()} request to: ${config.url}`
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("No authentication token found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx

    return response;
  },
  (error) => {
    // Any status codes outside the range of 2xx
    console.error("API response error:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error URL:", error.config.url);
      console.error("Full Error URL:", error.config.baseURL + error.config.url);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
