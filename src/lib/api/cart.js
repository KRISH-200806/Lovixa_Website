import api from "../../Axios/axiosInstance";

export const cartApi = {
  getCart: () => api.get("cart/"),
  addToCart: (productId, quantity = 1, variantId = null) =>
    api.post("cart/add/", {
      product_id: productId,
      quantity,
      variant_id: variantId,
    }),
  updateItemQuantity: (itemId, quantity) =>
    api.patch(`cart/items/${itemId}/`, { quantity }),
  removeItem: (itemId) => api.delete(`cart/items/${itemId}/remove/`),
  clearCart: () => api.post("cart/clear/"),
};

export default cartApi;
