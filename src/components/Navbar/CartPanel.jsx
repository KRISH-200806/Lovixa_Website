import React, { useState, useEffect, useContext } from "react";
import {
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import gpay from "../../assets/image/payment/gpay.png";
import phonepe from "../../assets/image/payment/phonepe.png";
import paypal from "../../assets/image/payment/paypal.png";
import bhim from "../../assets/image/payment/bhim.png";
import api from "../../Axios/axiosInstance";
import URL from "../../Axios/URL";
import { CartContext } from "../Context/CartContext";

const CartPanel = ({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onCartUpdate,
  onAddToCart,
}) => {
  // Get cart data from CartContext
  const { cartItems: contextCartItems, setCartItems: setContextCartItems } =
    useContext(CartContext);

  // State variables
  const [cartItems, setCartItems] = useState([]);
  const [totalPayable, setTotalPayable] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  // Error state is used in try/catch blocks for error handling logic
  // even though we don't display errors in the UI
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);

  // Payment methods
  const paymentImages = [
    { name: "Google Pay", src: gpay },
    { name: "Phonepe", src: phonepe },
    { name: "PayPal", src: paypal },
    { name: "Bhim", src: bhim },
  ];

  // Normalize cart item format - Updated to handle your API response format
  const normalizeCartItem = (item) => {
    if (!item) return null;

    // Extract ID
    const itemId = item.product_id || item.id || "unknown";

    // Extract price information - keep original values from API
    const price = parseFloat(item.price || 0);
    const originalPrice = parseFloat(
      item.old_price || item.originalPrice || price
    );

    // Extract quantity
    const quantity = parseInt(item.quantity || 1);

    // Extract image - handle array format
    let image = item.image;
    if (Array.isArray(image)) {
      image = image[0]; // Take first image if it's an array
    }

    return {
      id: itemId,
      product_id: itemId, // Keep product_id for API calls
      name: item.name || "Unknown Product",
      price: price,
      originalPrice: originalPrice,
      old_price: originalPrice, // Keep old_price for consistency
      quantity: quantity,
      image: image || "/placeholder.svg",
      discount_percentage: item.discount_percentage || 0,
      rupees_saved: item.rupees_saved || 0,
    };
  };

  // Initialize cart from CartContext on component mount
  useEffect(() => {
    // First check if we have items in the context
    if (contextCartItems && contextCartItems.length > 0) {
      const normalizedItems = contextCartItems
        .map(normalizeCartItem)
        .filter(Boolean);
      setCartItems(normalizedItems);

      // Calculate total payable from context items
      const total = normalizedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotalPayable(total);
    }
    // If context is empty but we have items from props, use those
    else if (items && items.length > 0) {
      const normalizedItems = items.map(normalizeCartItem).filter(Boolean);
      setCartItems(normalizedItems);

      // Calculate total payable from props items
      const total = normalizedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotalPayable(total);
    }
    // Otherwise, try to fetch from API when component mounts
    else {
      fetchCartItems();
    }
  }, []);

  // Open and close animations
  useEffect(() => {
    // When cart panel opens
    if (isOpen) {
      // Start the opening animation
      setIsAnimating(true);

      // Fetch latest cart data
      fetchCartItems();
    }
    // When cart panel closes
    else {
      // Add delay before stopping animation to allow close animation to complete
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // 300ms matches CSS transition duration

      // Cleanup timer on unmount or when effect re-runs
      return () => clearTimeout(timer);
    }

    const handleStorageChange = () => {
      fetchCartItems();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isOpen]); // Re-run effect when isOpen changes
  // Fetch cart items from API
  const fetchCartItems = async () => {
    setIsLoading(true);
    setError(null);

    // Check if user is authenticated
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      setIsLogin(false);
      setCartItems([]);
      console.log("User not authenticated, using local cart data");
      setIsLoading(false);
      return;
    }
    setIsLogin(true);
    setIsLoading(true);
    try {
      const response = await api.get("get-cart-item/");

      // Handle cart items from response
      if (
        response.data &&
        response.data.status &&
        Array.isArray(response.data.cart_items)
      ) {
        const normalizedItems = response.data.cart_items
          .map(normalizeCartItem)
          .filter(Boolean);
          setCartItems(normalizedItems);
          console.log(normalizedItems);
          
        // Set total payable from API response
        setTotalPayable(parseFloat(response.data.total_payable || 0));

        // Update the CartContext
        if (setContextCartItems) {
          setContextCartItems(normalizedItems);
        }

        // Notify parent component
        if (onCartUpdate) {
          onCartUpdate(normalizedItems);
        }
      } else {
        // Fallback to empty cart
        setCartItems([]);
        setTotalPayable(0);
      }
    } catch (error) {
      console.error("Failed to fetch cart items from API:", error);
      setError("Failed to load cart items. Please try again later.");
      // Use items from props as last resort
      const fallbackItems = items.map(normalizeCartItem).filter(Boolean);
      setCartItems(fallbackItems);
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const handleQuantityChange = async (itemId, newQty) => {
    // Ensure quantity never goes below 1
    if (newQty < 1) newQty = 1;

    // Get current quantity before update
    const currentItem = cartItems.find(
      (item) => item.id === itemId || item.product_id === itemId
    );
    if (!currentItem) return;

    const currentQty = currentItem.quantity;
    const quantityChange = newQty - currentQty;

    // Update the UI immediately for better user experience
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId || item.product_id === itemId
          ? { ...item, quantity: newQty }
          : item
      )
    );

    // Also update the CartContext
    if (setContextCartItems) {
      setContextCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId || item.product_id === itemId
            ? { ...item, quantity: newQty }
            : item
        )
      );
    }

    // Set loading state for this specific item
    setLoadingItemId(itemId);
    setError(null);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("quantity_change", quantityChange);

      // Make API call to update item using FormData
      const response = await api.patch(`update-cart-item/${itemId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update from API response
      if (
        response.data &&
        response.data.status &&
        Array.isArray(response.data.cart_items)
      ) {
        // Use the full cart items array from API response for most accurate data
        const normalizedItems = response.data.cart_items
          .map(normalizeCartItem)
          .filter(Boolean);
        setCartItems(normalizedItems);

        // Also update the CartContext
        if (setContextCartItems) {
          setContextCartItems(normalizedItems);
        }

        // Update total payable from API response
        if (response.data.total_payable !== undefined) {
          setTotalPayable(parseFloat(response.data.total_payable || 0));
        }

        // Notify parent component
        if (onCartUpdate) {
          onCartUpdate(normalizedItems);
        }
      } else {
        // If no specific response format, refresh the entire cart
        console.log("No specific response format, refreshing cart data");
        await fetchCartItems();
      }

      // Notify parent component
      if (onUpdateQuantity) {
        setTimeout(() => {
          onUpdateQuantity(itemId, newQty);
        }, 0);
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
      setError("Failed to update cart item. Please try again.");

      // Revert UI state on error and refresh from server
      await fetchCartItems();
    } finally {
      // Clear loading state for this item
      setLoadingItemId(null);
    }
  };

  // Increment quantity by 1
  const incrementQuantity = async (itemId) => {
    const item = cartItems.find(
      (item) => item.id === itemId || item.product_id === itemId
    );
    if (item) {
      const newQuantity = item.quantity + 1;
      await handleQuantityChange(itemId, newQuantity);
    }
  };

  // Decrement quantity by 1, but not below 1
  const decrementQuantity = async (itemId) => {
    const item = cartItems.find(
      (item) => item.id === itemId || item.product_id === itemId
    );
    if (item && item.quantity > 1) {
      const newQuantity = Math.max(1, item.quantity - 1);
      await handleQuantityChange(itemId, newQuantity);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (itemId) => {
    // Store the item before removal in case we need to restore it
    const itemToRemove = cartItems.find(
      (item) => item.id === itemId || item.product_id === itemId
    );
    if (!itemToRemove) return;

    // Update the UI immediately for better user experience
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => item.id !== itemId && item.product_id !== itemId
      )
    );

    // Also update the CartContext
    if (setContextCartItems) {
      setContextCartItems((prevItems) =>
        prevItems.filter(
          (item) => item.id !== itemId && item.product_id !== itemId
        )
      );
    }

    // Set loading state
    setLoadingItemId(itemId);
    setError(null);

    try {
      // Make API call to remove item

      const response = await api.delete(`remove-cart-item/${itemId}`);

      // Update cart from API response if available
      if (
        response.data &&
        response.data.status &&
        Array.isArray(response.data.cart_items)
      ) {
        const normalizedItems = response.data.cart_items
          .map(normalizeCartItem)
          .filter(Boolean);
        setCartItems(normalizedItems);

        // Also update the CartContext
        if (setContextCartItems) {
          setContextCartItems(normalizedItems);
        }

        // Update total payable from API response
        if (response.data.total_payable !== undefined) {
          setTotalPayable(parseFloat(response.data.total_payable || 0));
        }

        // Notify parent component
        if (onCartUpdate) {
          onCartUpdate(normalizedItems);
        }
      } else {
        // Refresh cart data if no specific response format
        await fetchCartItems();
      }

      // Notify parent components about the removal
      if (onRemoveItem) {
        setTimeout(() => {
          onRemoveItem(itemId);
        }, 0);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Failed to remove cart item. Please try again.");

      // Restore the item in the UI if API call fails
      if (itemToRemove) {
        setCartItems((prevItems) => [...prevItems, itemToRemove]);

        // Also restore in CartContext
        if (setContextCartItems) {
          setContextCartItems((prevItems) => [...prevItems, itemToRemove]);
        }
      }

      // Try to fetch cart items again to ensure UI is in sync
      await fetchCartItems();
    } finally {
      // Clear loading state
      setLoadingItemId(null);
    }
  };

  const handleCheckout = () => {
    // Navigate to checkout page with animation
    setIsCheckingOut(true);
    setTimeout(() => {
      window.location.href = "/checkout";
    }, 500);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Add to cart function for parent components to use
  const handleAddToCart = async (product) => {
    if (!product) {
      console.error("Cannot add null or undefined product to cart");
      return;
    }

    // Extract product ID
    const productId = product.id || product.product_id || `temp-${Date.now()}`;

    // Set loading state
    setLoadingItemId(productId);
    setError(null);

    try {
      const response = await api.post("add-to-cart/" + productId);

      // Update cart items from response
      if (
        response.data &&
        response.data.status &&
        Array.isArray(response.data.cart_items)
      ) {
        const normalizedItems = response.data.cart_items
          .map(normalizeCartItem)
          .filter(Boolean);
        setCartItems(normalizedItems);

        // Also update the CartContext
        if (setContextCartItems) {
          setContextCartItems(normalizedItems);
        }

        // Update total payable from API response
        if (response.data.total_payable !== undefined) {
          setTotalPayable(parseFloat(response.data.total_payable || 0));
        }
      } else {
        // Refresh cart data after adding item
        await fetchCartItems();
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      setError("Failed to add item to cart. Please try again.");
    } finally {
      // Clear loading state
      setLoadingItemId(null);
    }
  };

  // Export functions for use in other components
  useEffect(() => {
    if (onAddToCart) {
      onAddToCart(handleAddToCart);
    }
  }, [onAddToCart]);

  // Don't render if not open and not animating
  if (!isOpen && !isAnimating) return null;

  // Use cartItems from state or fallback to contextCartItems if available
  const displayCartItems = isLogin
    ? cartItems.length > 0
      ? cartItems
      : contextCartItems && contextCartItems.length > 0
      ? contextCartItems.map(normalizeCartItem).filter(Boolean)
      : []
    : [];

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`w-full max-w-md bg-white h-full transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto scrollbar-hide`}
        style={{
          scrollbarWidth: "none" /* Firefox */,
          msOverflowStyle: "none" /* Internet Explorer 10+ */,
        }}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Your Cart
              {displayCartItems.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (
                  {displayCartItems.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}{" "}
                  items)
                </span>
              )}
            </h2>
            <div className="flex items-center">
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Empty Cart */}
        {!isLoading && displayCartItems.length === 0 && (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Your Cart is empty</h3>
            <p className="text-gray-500 mt-1 mb-4">
              Add items to your cart to shop
            </p>
            <div className="flex flex-col gap-2 items-center">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#B4945E] hover:bg-[#8B7355] text-black font-medium rounded transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
            <div className="mt-4 text-sm text-blue-600">
              <a
                href="/login"
                className="hover:underline hover:text-orange-600"
              >
                Sign in to your account
              </a>
              <p className="text-gray-500 text-xs mt-2">to see saved items</p>
            </div>
          </div>
        )}

        {/* Cart Items */}
        {displayCartItems.length > 0 && (
          <>
            <div className="divide-y">
              {displayCartItems.map((item) => (
                <div key={item.product_id || item.id} className="p-4 flex">
                  {/* Item Image */}
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={`${URL.PHOTO_URL}${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  </div>

                  {/* Item Details */}
                  <div className="ml-4 flex-grow">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.name}
                    </h3>

                    <div className="mt-1">
                      <span className="text-xs text-green-700 font-medium">
                        In Stock
                      </span>
                      {item.discount_percentage > 0 && (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-1 rounded">
                          {item.discount_percentage}% OFF
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{item.price.toFixed(2)}
                      </span>
                      {item.old_price && item.old_price !== item.price && (
                        <>
                          <span className="ml-2 text-xs text-gray-500 line-through">
                            ₹{item.old_price.toFixed(2)}
                          </span>
                          {item.rupees_saved > 0 && (
                            <span className="ml-2 text-xs text-green-600">
                              Save ₹{item.rupees_saved.toFixed(2)}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Quantity Controls & Remove Button */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <label className="text-xs text-gray-600 mr-2">
                          Qty:
                        </label>
                        <div className="relative flex items-center rounded-md border">
                          <button
                            className="h-8 w-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() =>
                              decrementQuantity(item.product_id || item.id)
                            }
                            aria-label="Decrease quantity"
                            disabled={
                              loadingItemId === (item.product_id || item.id) ||
                              item.quantity <= 1
                            }
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              if (val >= 1) {
                                handleQuantityChange(
                                  item.product_id || item.id,
                                  val
                                );
                              }
                            }}
                            className="h-8 w-12 border-x text-center text-sm focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none disabled:bg-gray-100"
                            min="1"
                            disabled={
                              loadingItemId === (item.product_id || item.id)
                            }
                          />
                          <button
                            className="h-8 w-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() =>
                              incrementQuantity(item.product_id || item.id)
                            }
                            aria-label="Increase quantity"
                            disabled={
                              loadingItemId === (item.product_id || item.id)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="border-l pl-3">
                        <button
                          onClick={() =>
                            handleRemoveItem(item.product_id || item.id)
                          }
                          className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed p-1 rounded hover:bg-red-50 transition-colors"
                          disabled={
                            loadingItemId === (item.product_id || item.id)
                          }
                          title="Remove item from cart"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary & Checkout */}
            <div className="p-4 pt-0 bg-gray-50 sticky bottom-0">
              {/* Subtotal */}
              <div className="p-4 border-t bg-gray-50">
                <div className="text-right text-lg font-medium">
                  <span>
                    Subtotal (
                    {displayCartItems.reduce(
                      (total, item) => total + (Number(item.quantity) || 0),
                      0
                    )}{" "}
                    items):{" "}
                  </span>
                  <span className="font-bold">₹{totalPayable.toFixed(2)}</span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={`w-full my-2 py-2 bg-[#B4945E] hover:bg-[#8B7355] text-white rounded transition-colors duration-300 ${
                  isCheckingOut ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isCheckingOut ? "Processing..." : "Proceed to Buy"}
              </button>

              {/* Free delivery notification */}
              <div className="bg-[#f3f3f3] p-3 rounded-md mt-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 rounded-full text-white bg-[#B4945E] flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                      ✓
                    </div>
                  </div>
                  <div className="ml-2">
                    <p className="font-medium text-sm">
                      Your order qualifies for FREE Delivery
                    </p>
                    <p className="text-xs text-gray-600">
                      Select this option at checkout
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2 text-center">
                  Secure Payment Options
                </p>
                <div className="flex justify-center space-x-2">
                  {paymentImages.map((payment) => (
                    <div
                      key={payment.name}
                      className="w-12 h-8 bg-white rounded border flex items-center justify-center"
                    >
                      <img
                        src={payment.src}
                        alt={payment.name}
                        className="h-5 object-contain"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t text-xs text-center text-gray-500">
                  The price and availability of items are subject to change. The
                  shopping cart is a temporary place to store a list of your
                  items and reflects each item&apos;s most recent price.
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

CartPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  items: PropTypes.array,
  onUpdateQuantity: PropTypes.func,
  onRemoveItem: PropTypes.func,
  onCartUpdate: PropTypes.func,
  onAddToCart: PropTypes.func,
};

export default CartPanel;
