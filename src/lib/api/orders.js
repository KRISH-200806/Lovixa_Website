import api from "../../Axios/axiosInstance";

export const ordersApi = {
  getOrders: () => api.get("orders/"),
  getOrderById: (orderId) => api.get(`orders/${orderId}/`),
  createOrder: (orderData) => api.post("orders/create/", orderData),
  cancelOrder: (orderId) => api.post(`orders/${orderId}/cancel/`),
};

export default ordersApi;
