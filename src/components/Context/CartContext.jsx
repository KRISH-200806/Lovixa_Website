import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../../Axios/axiosInstance";
import URL from "../../Axios/URL";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Normalize an item to standard schema
  const normalizeItem = (item) => {
    if (!item) return null;

    const id = item.id || item.product_id;
    const productId = item.product_id || item.product || item.id;
    const name = item.product_name || item.name || "Product";
    const price = parseFloat(item.unit_price || item.effective_price || item.price || 0);
    const originalPrice = parseFloat(item.price || item.product_old_price || price);
    const quantity = parseInt(item.quantity || 1, 10);
    
    let image = item.product_image || item.image || item.primary_image || "/placeholder.svg";
    if (Array.isArray(image)) {
      image = image[0];
    }
    if (typeof image === "string" && !image.startsWith("http") && !image.startsWith("/placeholder")) {
      image = `${URL.PHOTO_URL}${image.startsWith("/") ? "" : "/"}${image}`;
    }

    return {
      id,
      product_id: productId,
      name,
      price,
      originalPrice,
      quantity,
      image,
      variant: item.variant || null,
      variant_name: item.variant_name || null,
      in_stock: item.in_stock ?? true,
      subtotal: parseFloat(item.subtotal || price * quantity),
    };
  };

  // Fetch cart items from API or localStorage
  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        setIsLoading(true);
        const res = await api.get("cart/");
        if (res.data?.status !== false) {
          const items = res.data.cart?.items || res.data.cart_items || [];
          const normalized = items.map(normalizeItem).filter(Boolean);
          setCartItems(normalized);
          setCartTotal(parseFloat(res.data.cart?.total_payable || res.data.total_payable || 0));
          return;
        }
      } catch (err) {
        console.error("Failed to fetch cart from server:", err);
      } finally {
        setIsLoading(false);
      }
    }

    // Guest fallback from localStorage
    try {
      const stored = localStorage.getItem("cartItems");
      if (stored) {
        const parsed = JSON.parse(stored);
        const normalized = parsed.map(normalizeItem).filter(Boolean);
        setCartItems(normalized);
        const total = normalized.reduce((acc, i) => acc + i.price * i.quantity, 0);
        setCartTotal(total);
      } else {
        setCartItems([]);
        setCartTotal(0);
      }
    } catch (err) {
      console.error("Failed parsing cartItems from localStorage:", err);
      setCartItems([]);
      setCartTotal(0);
    }
  }, []);

  // Initial cart load & listen for auth changes
  useEffect(() => {
    fetchCart();

    const handleAuthChange = () => {
      fetchCart();
    };

    window.addEventListener("auth-changed", handleAuthChange);
    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, [fetchCart]);

  // Sync to localStorage for guests
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Add item to cart
  const addToCart = async (product, quantity = 1, variantId = null) => {
    const token = localStorage.getItem("token");
    const productId = product.id || product.product_id;

    if (!productId) {
      console.error("Invalid product added to cart:", product);
      return { success: false, message: "Invalid product" };
    }

    setIsSyncing(true);

    if (token) {
      try {
        const res = await api.post("cart/add/", {
          product_id: productId,
          variant_id: variantId,
          quantity: quantity,
        });

        if (res.data?.status !== false) {
          await fetchCart();
          return { success: true, message: "Item added to cart!" };
        } else {
          return { success: false, message: res.data?.message || "Could not add item" };
        }
      } catch (err) {
        console.error("Error adding item to server cart:", err);
        const msg = err.response?.data?.message || "Failed to add item to cart.";
        return { success: false, message: msg };
      } finally {
        setIsSyncing(false);
      }
    }

    // Guest add to cart
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product_id === productId && i.variant === variantId
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        updated[existingIndex].subtotal =
          updated[existingIndex].price * updated[existingIndex].quantity;
        return updated;
      } else {
        const newItem = normalizeItem({
          id: `local-${Date.now()}`,
          product_id: productId,
          product_name: product.name || product.product_name,
          price: product.effective_price || product.discount_price || product.price || product.product_price,
          old_price: product.price || product.product_old_price,
          quantity: quantity,
          product_image: product.primary_image || product.images || product.image,
          variant: variantId,
        });
        return [...prev, newItem];
      }
    });

    setIsSyncing(false);
    return { success: true, message: "Item added to cart!" };
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      return removeFromCart(itemId);
    }

    const token = localStorage.getItem("token");
    setIsSyncing(true);

    if (token) {
      try {
        const res = await api.patch(`cart/items/${itemId}/`, {
          quantity: newQuantity,
        });

        if (res.data?.status !== false) {
          await fetchCart();
          return { success: true };
        }
      } catch (err) {
        console.error("Error updating cart quantity on server:", err);
      } finally {
        setIsSyncing(false);
      }
    }

    // Guest update
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
          : item
      )
    );
    setIsSyncing(false);
    return { success: true };
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    const token = localStorage.getItem("token");
    setIsSyncing(true);

    if (token) {
      try {
        const res = await api.delete(`cart/items/${itemId}/remove/`);
        if (res.data?.status !== false) {
          await fetchCart();
          return { success: true };
        }
      } catch (err) {
        console.error("Error removing cart item from server:", err);
      } finally {
        setIsSyncing(false);
      }
    }

    // Guest remove
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    setIsSyncing(false);
    return { success: true };
  };

  // Clear cart
  const clearCart = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await api.post("cart/clear/");
      } catch (err) {
        console.error("Error clearing server cart:", err);
      }
    }
    setCartItems([]);
    setCartTotal(0);
    localStorage.removeItem("cartItems");
  };

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const calculatedTotal = cartItems.reduce(
    (acc, item) => acc + (parseFloat(item.price || 0) * parseInt(item.quantity || 1, 10)),
    0
  );
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const effectiveCartTotal = token && cartTotal > 0 ? cartTotal : calculatedTotal;

  const value = {
    cartItems,
    setCartItems,
    cartTotal: effectiveCartTotal,
    cartCount,
    isLoading,
    isSyncing,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
