import api from "../../Axios/axiosInstance";

export const categoriesApi = {
  getCategories: () => api.get("catalog/categories/"),
  getCategoryById: (id) => api.get(`catalog/categories/${id}/`),
};

export default categoriesApi;
