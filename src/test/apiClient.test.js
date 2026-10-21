import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../Axios/axiosInstance";
import { authApi, productsApi, categoriesApi, cartApi, ordersApi } from "../lib/api";

describe("Centralized API Client & Modular Domain APIs", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should have correct axios default configurations", () => {
    expect(api.defaults.baseURL).toBeDefined();
    expect(api.defaults.headers["Content-Type"]).toBe("application/json");
  });

  it("should attach Authorization Bearer token when token exists in localStorage", async () => {
    localStorage.setItem("token", "mock-jwt-access-token");

    const config = { headers: {} };
    // Get the request interceptor handler
    const requestHandler = api.interceptors.request.handlers[0].fulfilled;
    const modifiedConfig = requestHandler(config);

    expect(modifiedConfig.headers.Authorization).toBe("Bearer mock-jwt-access-token");
  });

  it("should not attach Authorization Bearer token when no token in localStorage", async () => {
    const config = { headers: {} };
    const requestHandler = api.interceptors.request.handlers[0].fulfilled;
    const modifiedConfig = requestHandler(config);

    expect(modifiedConfig.headers.Authorization).toBeUndefined();
  });

  it("should call authApi endpoints properly", () => {
    const postSpy = vi.spyOn(api, "post").mockResolvedValue({ data: { success: true } });
    const getSpy = vi.spyOn(api, "get").mockResolvedValue({ data: { user: { id: 1 } } });

    authApi.login({ email: "test@example.com", password: "Password123!" });
    expect(postSpy).toHaveBeenCalledWith("auth/login/", {
      email: "test@example.com",
      password: "Password123!",
    });

    authApi.getProfile();
    expect(getSpy).toHaveBeenCalledWith("auth/profile/");
  });

  it("should call productsApi, categoriesApi, cartApi and ordersApi properly", () => {
    const getSpy = vi.spyOn(api, "get").mockResolvedValue({ data: [] });
    const postSpy = vi.spyOn(api, "post").mockResolvedValue({ data: { success: true } });

    productsApi.getProductById(42);
    expect(getSpy).toHaveBeenCalledWith("catalog/products/42/");

    categoriesApi.getCategories();
    expect(getSpy).toHaveBeenCalledWith("catalog/categories/");

    cartApi.addToCart(10, 2, 5);
    expect(postSpy).toHaveBeenCalledWith("cart/add/", {
      product_id: 10,
      quantity: 2,
      variant_id: 5,
    });

    ordersApi.createOrder({ items: [] });
    expect(postSpy).toHaveBeenCalledWith("orders/create/", { items: [] });
  });
});
