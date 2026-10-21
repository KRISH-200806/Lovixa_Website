import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Address from "../components/Payment/Address";
import { CartProvider } from "../components/Context/CartContext";
import { AuthProvider } from "../components/Context/AuthContext";
import api from "../Axios/axiosInstance";

describe("Address & Checkout Flow Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("validates empty address fields on submit and displays validation errors", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <Address />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button", { name: /save & proceed to checkout/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/address line 1 is required/i)).toBeInTheDocument();
      expect(screen.getByText(/city is required/i)).toBeInTheDocument();
      expect(screen.getByText(/pin code is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    });
  });

  it("fills out address fields and submits successfully", async () => {
    localStorage.setItem("token", "auth-token");
    vi.spyOn(api, "get").mockResolvedValue({
      data: {
        data: {
          id: 1,
          email: "aarav@lovixa.com",
          first_name: "Aarav",
        },
      },
    });
    vi.spyOn(api, "post").mockResolvedValue({ data: { status: true } });

    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <Address />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // Wait for AuthProvider profile initialization
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/recipient name/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/recipient name/i), {
      target: { value: "Aarav Mehta" },
    });
    fireEvent.change(screen.getByPlaceholderText(/flat, house no/i), {
      target: { value: "Villa 14, Royal Palm" },
    });
    fireEvent.change(screen.getByPlaceholderText(/city/i), {
      target: { value: "Mumbai" },
    });
    fireEvent.change(screen.getByPlaceholderText(/state/i), {
      target: { value: "Maharashtra" },
    });
    fireEvent.change(screen.getByPlaceholderText(/6-digit pin/i), {
      target: { value: "400001" },
    });
    fireEvent.change(screen.getByPlaceholderText(/10-digit mobile number/i), {
      target: { value: "9876543210" },
    });

    const submitBtn = screen.getByRole("button", { name: /save & proceed to checkout/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("auth/addresses/", expect.objectContaining({
        full_name: "Aarav Mehta",
        line1: "Villa 14, Royal Palm",
        city: "Mumbai",
        state: "Maharashtra",
        postal_code: "400001",
        phone: "9876543210",
      }));
    });
  });
});
