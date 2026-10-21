import axios from "axios";
import URL from "./URL";

const api = axios.create({
  baseURL: URL.BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag to prevent multiple concurrent token refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor: handle 401 with automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh attempt for auth endpoints (login, register, token refresh)
    const isAuthEndpoint =
      originalRequest.url?.includes("auth/login") ||
      originalRequest.url?.includes("auth/register") ||
      originalRequest.url?.includes("auth/token/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      const refreshToken = localStorage.getItem("refresh");

      if (!refreshToken) {
        // No refresh token available, logout user
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user_id");
        window.dispatchEvent(new Event("auth-changed"));
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshEndpoint = URL.BASE_URL.endsWith("/")
          ? `${URL.BASE_URL}auth/token/refresh/`
          : `${URL.BASE_URL}/auth/token/refresh/`;
        const response = await axios.post(refreshEndpoint, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem("token", newAccessToken);

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user_id");
        window.dispatchEvent(new Event("auth-changed"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
