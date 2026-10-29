import React, { useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";

import gpay from "../../assets/image/payment/gpay.png";
import phonepe from "../../assets/image/payment/phonepe.png";
import paypal from "../../assets/image/payment/paypal.png";
import bhim from "../../assets/image/payment/bhim.png";

const CartPanel = ({ isOpen = true, onClose = () => {} }) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, isSyncing } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [operatingItemId, setOperatingItemId] = useState(null);

  const paymentMethods = [
    { name: "Google Pay", src: gpay },
    { name: "PhonePe", src: phonepe },
    { name: "PayPal", src: paypal },
    { name: "BHIM", src: bhim },
  ];

  const handleUpdateQty = async (itemId, newQty) => {
    setOperatingItemId(itemId);
    await updateQuantity(itemId, newQty);
    setOperatingItemId(null);
  };

  const handleRemove = async (itemId) => {
    setOperatingItemId(itemId);
    await removeFromCart(itemId);
    setOperatingItemId(null);
  };

  const handleProceedToCheckout = () => {
    onClose();
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-xs transition-opacity font-['Urbanist'] animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 overflow-hidden relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-brand flex items-center justify-center border border-emerald-100">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-text-main">Your Shopping Bag</h2>
              <p className="text-[11px] text-text-secondary">
                {cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0)} items in bag
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-main hover:bg-stone-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Delivery Indicator */}
        <div className="px-5 py-2.5 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between text-xs">
          <span className="text-brand font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
            Reliable Pan-India Tracked Delivery
          </span>
          <span className="text-[10px] uppercase font-bold text-brand bg-white px-2 py-0.5 rounded-full border border-emerald-200">
            FAST DISPATCH
          </span>
        </div>

        {/* Cart Item List / Empty State */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
              <div className="w-20 h-20 bg-emerald-50 text-brand rounded-full flex items-center justify-center animate-pulse-subtle border border-emerald-100">
                <ShoppingBag size={36} />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-text-main">Your bag is empty</h3>
                <p className="text-xs text-text-secondary mt-1 max-w-xs leading-relaxed">
                  Explore our pure botanical attars, perfume sprays, and luxury cosmetic essentials.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate("/viewall/all-products");
                }}
                className="px-6 py-3 bg-brand hover:bg-brand/90 text-white text-xs font-bold rounded-full transition-all shadow-button active:scale-95 uppercase tracking-wider"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const isItemBusy = operatingItemId === item.id;
              const hasDiscount = item.originalPrice > item.price;

              return (
                <div key={item.id} className="py-4 flex gap-3.5 first:pt-0 last:pb-0">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-emerald-50/40 rounded-2xl overflow-hidden flex-shrink-0 border border-stone-100 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = gpay;
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-text-main truncate">
                        {item.name}
                      </h4>
                      {item.variant_name && (
                        <p className="text-[11px] text-text-secondary">{item.variant_name}</p>
                      )}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-extrabold text-brand">
                          ₹{item.price.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-[11px] text-text-secondary line-through">
                            ₹{item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Selector & Trash */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded-full px-1 overflow-hidden bg-white">
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                          disabled={isItemBusy || isSyncing || item.quantity <= 1}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-text-secondary hover:bg-emerald-50 disabled:opacity-30 transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-text-main">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                          disabled={isItemBusy || isSyncing}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-text-secondary hover:bg-emerald-50 disabled:opacity-30 transition-colors"
                          aria-label="Increase"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={isItemBusy || isSyncing}
                        className="text-rose-400 hover:text-rose-600 p-1.5 rounded-full hover:bg-rose-50 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-stone-100 bg-white space-y-4 sticky bottom-0 z-20">
            <div className="space-y-1.5 text-xs text-text-secondary">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-text-main">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-brand font-semibold">
                <span>Shipping</span>
                <span>{cartTotal >= 499 ? "FREE" : "₹50.00"}</span>
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between text-base font-extrabold text-text-main">
                <span>Estimated Total</span>
                <span className="text-brand">₹{(cartTotal + (cartTotal >= 499 ? 0 : 50)).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-brand hover:bg-brand/90 text-white rounded-full text-xs font-bold transition flex items-center justify-center gap-2 shadow-button active:scale-98 uppercase tracking-wider"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </button>

            {/* Payment Icons */}
            <div className="pt-2 flex items-center justify-center gap-3 opacity-60">
              {paymentMethods.map((pm, idx) => (
                <img
                  key={idx}
                  src={pm.src}
                  alt={pm.name}
                  className="h-4 object-contain grayscale hover:grayscale-0 transition-all"
                />
              ))}
            </div>

            <div className="text-center text-[10px] text-text-secondary/70 flex items-center justify-center gap-1">
              <ShieldCheck size={12} className="text-brand" /> 100% Secure Checkout &amp; Authenticity Guaranteed
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPanel;
