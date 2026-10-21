import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import api from '../../Axios/axiosInstance';

const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }) => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Fetch cart data from API
  useEffect(() => {
    if (isOpen) {
      fetchCartData();
    }
  }, [isOpen]);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/get-cart-item');
      setCartData(response.data.items || response.data || []);
    } catch (err) {
      console.error('Error fetching cart data:', err);
      setError('Failed to load cart data');
      // Fall back to props data if API fails
      setCartData(items || []);
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity via API
  

  // Remove item from cart via API
  const handleRemoveItem = async (Id) => {
    setUpdatingItemId(Id);
    try {
      // Update local state without API call
      setCartData(prevItems => prevItems.filter(item => item.id !== Id));
      
      // Also call the prop function if provided
      if (onRemoveItem) {
        onRemoveItem(Id);
      }
    } catch (err) {
      console.error('Error removing item:', err);
      // Show error message
      setError(`Failed to remove item. ${err.message}`);
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Process checkout via API
  const handleCheckout = async () => {
    if (!cartItems.length) return;
    
    setIsCheckingOut(true);
    setError(null);
    
    try {
      // Call API to process checkout
      const response = await api.post('/api/checkout/', {
        items: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity
        })),
        total: subtotal
      });
      
      // Handle successful checkout
      setCheckoutSuccess(true);
      
      // Clear cart after successful checkout
      setCartData([]);
      
      // Show success message
      setTimeout(() => {
        setCheckoutSuccess(false);
        onClose();
      }, 3000);
      
    } catch (err) {
      console.error('Error processing checkout:', err);
      setError(`Checkout failed. ${err.message}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Use API data if available, otherwise fall back to props
  const cartItems = cartData.length > 0 ? cartData : (items || []);

  // Calculate subtotal with fallback for missing price property
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.price || item.discountedPrice || 0;
    return total + (price * item.quantity);
  }, 0);

  // Format currency to exactly 2 decimal places
  const formatCurrency = (amount) => {
    return parseFloat(amount.toFixed(2));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold flex items-center">
          <ShoppingBag className="mr-2" size={20} />
          Your Cart
        </h2>
        <button 
          onClick={onClose}
          disabled={isCheckingOut}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
        >
          <X size={24} />
        </button>
      </div>

      {/* Checkout Success Message */}
      {checkoutSuccess && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-90">
          <div className="text-center p-6 rounded-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-600">Thank you for your purchase.</p>
          </div>
        </div>
      )}

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading && !cartItems.length ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading cart...</p>
          </div>
        ) : error && !cartItems.length ? (
          <div className="flex flex-col items-center justify-center h-full text-red-500">
            <p>{error}</p>
            <button 
              onClick={fetchCartData}
              className="mt-4 text-indigo-600 hover:text-indigo-800"
            >
              Try again
            </button>
          </div>
        ) : !cartItems || cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ShoppingBag size={48} />
            <p className="mt-4 text-lg">Your cart is empty</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex border-b pb-4">
                {/* Product Image */}
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Product Details */}
                <div className="ml-4 flex flex-1 flex-col">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>{item.name}</h3>
                    <p className="ml-4">₹{formatCurrency(item.price || item.discountedPrice || 0)}</p>
                  </div>
                  {item.variant && (
                    <p className="mt-1 text-sm text-gray-500">{item.variant}</p>
                  )}
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center mt-2">
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingItemId === item.id || isCheckingOut}
                      className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="mx-2 w-8 text-center">
                      {updatingItemId === item.id ? 
                        <div className="w-full h-5 flex justify-center items-center">
                          <div className="animate-pulse h-2 w-2 bg-gray-500 rounded-full"></div>
                        </div> : 
                        item.quantity
                      }
                    </span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={updatingItemId === item.id || isCheckingOut}
                      className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Plus size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updatingItemId === item.id || isCheckingOut}
                      className="ml-auto text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                    >
                      {updatingItemId === item.id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Error message */}
      {error && cartItems.length > 0 && (
        <div className="px-4 py-2 bg-red-50 text-red-700 text-sm">
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-red-800 font-medium hover:underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
          <p>Subtotal</p>
          <p>₹{formatCurrency(subtotal)}</p>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Shipping and taxes calculated at checkout.
        </p>
        <button
          onClick={handleCheckout}
          disabled={!cartItems || cartItems.length === 0 || loading || isCheckingOut}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed relative"
        >
          {isCheckingOut ? (
            <>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              </span>
              <span className="opacity-0">Checkout</span>
            </>
          ) : (
            'Checkout'
          )}
        </button>
        <button
          onClick={onClose}
          disabled={isCheckingOut}
          className="w-full mt-2 text-indigo-600 py-2 px-4 rounded-md border border-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Cart;