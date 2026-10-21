import api from "../../Axios/axiosInstance";

export const productsApi = {
  getProducts: (params = {}) => api.get("catalog/products/", { params }),
  getProductById: (id) => api.get(`catalog/products/${id}/`),
  getBestSellers: () => api.get("catalog/products/?is_best_seller=true"),
  searchProducts: (query) => api.get(`catalog/products/?search=${encodeURIComponent(query)}`),
  getProductReviews: (productId) => api.get(`catalog/products/${productId}/reviews/`),
  submitReview: (productId, reviewData) => api.post(`catalog/products/${productId}/reviews/`, reviewData),
};

export default productsApi;
