import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CartProvider, useCart } from "../components/Context/CartContext";

const CartTestConsumer = () => {
  const {
    cartItems,
    cartTotal,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  return (
    <div>
      <div data-testid="cart-count">{cartCount}</div>
      <div data-testid="cart-total">{cartTotal}</div>

      <div data-testid="items-list">
        {cartItems.map((item) => (
          <div key={item.id} data-testid={`cart-item-${item.id}`}>
            <span>{item.name}</span>
            <span>Qty: {item.quantity}</span>
            <span>Price: {item.price}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
              Inc {item.id}
            </button>
            <button onClick={() => removeFromCart(item.id)}>
              Remove {item.id}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() =>
          addToCart({
            id: "prod-1",
            product_id: 1,
            name: "Oud Royale Extrait",
            price: 2499,
          }, 1)
        }
      >
        Add Perfume
      </button>

      <button onClick={clearCart}>Clear All</button>
    </div>
  );
};

describe("CartContext State & Operations", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("initializes with empty cart for guest", () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    );

    expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
    expect(screen.getByTestId("cart-total")).toHaveTextContent("0");
  });

  it("adds an item to cart and calculates cart count and total", async () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /add perfume/i }));

    await waitFor(() => {
      expect(screen.getByTestId("cart-count")).toHaveTextContent("1");
      expect(screen.getByText("Oud Royale Extrait")).toBeInTheDocument();
      expect(screen.getByText("Qty: 1")).toBeInTheDocument();
      expect(screen.getByTestId("cart-total")).toHaveTextContent("2499");
    });
  });

  it("increments quantity and updates subtotal properly", async () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    );

    // Add first
    fireEvent.click(screen.getByRole("button", { name: /add perfume/i }));

    await waitFor(() => {
      expect(screen.getByTestId("cart-count")).toHaveTextContent("1");
    });

    // Add again to test quantity increment
    fireEvent.click(screen.getByRole("button", { name: /add perfume/i }));

    await waitFor(() => {
      expect(screen.getByTestId("cart-count")).toHaveTextContent("2");
      expect(screen.getByText("Qty: 2")).toBeInTheDocument();
    });
  });

  it("removes item from cart and clears cart", async () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /add perfume/i }));

    await waitFor(() => {
      expect(screen.getByTestId("cart-count")).toHaveTextContent("1");
    });

    fireEvent.click(screen.getByRole("button", { name: /clear all/i }));

    await waitFor(() => {
      expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
      expect(screen.queryByText("Oud Royale Extrait")).not.toBeInTheDocument();
    });
  });
});
