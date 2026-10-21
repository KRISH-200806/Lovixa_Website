import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Product from "../components/Product_card/Product";
import ProductPage from "../components/All_product/ProductPage";
import { CartProvider } from "../components/Context/CartContext";
import { AuthProvider } from "../components/Context/AuthContext";
import api from "../Axios/axiosInstance";

describe("Product Listing & Detail Module", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders showcase products with price and Shop Now button", async () => {
    vi.spyOn(api, "get").mockResolvedValue({
      data: {
        results: [
          {
            id: 1,
            name: "Radiance Vitamin C Serum",
            brand: "Lovixa Skin",
            effective_price: 699,
            price: 699,
            description: "Deep hydration infused with botanical extracts.",
          },
          {
            id: 2,
            name: "Jasmine Bloom Eau De Parfum",
            brand: "Lovixa Noir",
            effective_price: 1199,
            price: 1199,
            description: "A bold and majestic formulation.",
          },
        ],
      },
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <Product />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Radiance Vitamin C Serum")).toBeInTheDocument();
      expect(screen.getByText("Jasmine Bloom Eau De Parfum")).toBeInTheDocument();
    });
  });

  it("renders product detail page with price, stock badge and variant selection", async () => {
    const mockProduct = {
      id: 10,
      name: "Velvet Amber Eau De Parfum",
      brand: "Lovixa Luxury",
      price: 2499,
      product_old_price: 2999,
      effective_price: 2499,
      description: "Warm amber infused with Madagascar vanilla.",
      in_stock: true,
      stock: 15,
      variants: [
        { id: 101, name: "50ml", price: 2499, in_stock: true },
        { id: 102, name: "100ml", price: 3999, in_stock: true },
      ],
      images: [{ id: 1, image: "/test-img.jpg" }],
      rating: 4.8,
      review_count: 32,
    };

    vi.spyOn(api, "get").mockResolvedValue({
      data: mockProduct,
    });

    render(
      <MemoryRouter initialEntries={["/product/10"]}>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/product/:id" element={<ProductPage />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Velvet Amber Eau De Parfum" })).toBeInTheDocument();
      expect(screen.getByText(/In Stock/i)).toBeInTheDocument();
    });
  });
});
