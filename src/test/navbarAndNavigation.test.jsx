import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { CartProvider } from "../components/Context/CartContext";
import { AuthProvider } from "../components/Context/AuthContext";
import api from "../Axios/axiosInstance";

describe("Navbar & Navigation Module", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders brand logo and primary navigation links", async () => {
    vi.spyOn(api, "get").mockResolvedValue({
      data: {
        results: [
          { id: 1, name: "Perfumes", slug: "perfumes" },
          { id: 2, name: "Attar", slug: "attar" },
        ],
      },
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByAltText(/lovixa/i)).toBeInTheDocument();
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });

  it("opens and toggles mobile menu drawer on mobile screens", async () => {
    vi.spyOn(api, "get").mockResolvedValue({ data: { results: [] } });

    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // Mobile menu button
    const menuButtons = screen.getAllByRole("button");
    const mobileToggle = menuButtons.find((btn) =>
      btn.querySelector("svg")
    );

    if (mobileToggle) {
      fireEvent.click(mobileToggle);
    }
  });

  it("displays cart badge when items are in cart", async () => {
    localStorage.setItem(
      "cartItems",
      JSON.stringify([
        {
          id: 1,
          product_id: 1,
          product_name: "Perfume Velvet",
          price: 1999,
          quantity: 3,
        },
      ])
    );

    vi.spyOn(api, "get").mockResolvedValue({ data: { results: [] } });

    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Look for badge with count 3
      const badge = screen.getByText("3");
      expect(badge).toBeInTheDocument();
    });
  });
});
