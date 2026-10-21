import api from "../../Axios/axiosInstance";

export const authApi = {
  login: (credentials) => api.post("auth/login/", credentials),
  register: (userData) => api.post("auth/register/", userData),
  getProfile: () => api.get("auth/profile/"),
  forgotPassword: (email) => api.post("auth/forgot-password/", { email }),
  resetPassword: (payload) => api.post("auth/reset-password/", payload),
  refreshToken: (refreshToken) => api.post("auth/token/refresh/", { refresh: refreshToken }),
};

export default authApi;
