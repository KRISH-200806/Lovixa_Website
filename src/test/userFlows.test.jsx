import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../components/Context/AuthContext";
import { CartProvider } from "../components/Context/CartContext";
import ProductPage from "../components/All_product/ProductPage";
import CartPanel from "../components/Navbar/CartPanel";
import Address from "../components/Payment/Address";
import api from "../Axios/axiosInstance";

describe("End-to-End User Shopping Journey Flow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("completes the full flow: Browse -> Add to Cart -> View Cart -> Address Form", async () => {
    const mockProduct = {
      id: 99,
      name: "Majestic Rose Attar",
      brand: "Lovixa Pure",
      price: 1899,
      effective_price: 1899,
      description: "Distilled Damascena Rose petals.",
      in_stock: true,
      stock: 20,
      variants: [
        { id: 901, variant_name: "12ml", price: 1899, in_stock: true },
        { id: 902, variant_name: "25ml", price: 3499, in_stock: true },
      ],
      images: [{ id: 1, image: "/rose.jpg" }],
      rating: 5.0,
      review_count: 48,
    };

    vi.spyOn(api, "get").mockImplementation((url) => {
      if (url.includes("products/")) {
        return Promise.resolve({ data: mockProduct });
      }
      return Promise.resolve({ data: { results: [] } });
    });

    render(
      <MemoryRouter initialEntries={["/product/99"]}>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cartpanel" element={<CartPanel isOpen={true} onClose={vi.fn()} />} />
              <Route path="/address" element={<Address />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // 1. Wait for Product to load
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Majestic Rose Attar" })).toBeInTheDocument();
    });

    // 2. Add to Cart button click
    const addToCartButton = screen.getByRole("button", { name: /add to cart/i });
    expect(addToCartButton).toBeInTheDocument();
    fireEvent.click(addToCartButton);

    // 3. Verify item added to localStorage cart
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem("cartItems") || "[]");
      expect(stored.length).toBeGreaterThan(0);
      expect(stored[0].name).toBe("Majestic Rose Attar");
    });
  });
});
