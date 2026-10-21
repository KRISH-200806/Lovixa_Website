import React, { useState, useEffect } from "react";
import { MapPin, Plus, Edit2, Trash2, Tag, Check, ArrowRight, ShieldCheck, CheckCircle, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Axios/axiosInstance";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [addressToEditId, setAddressToEditId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    full_name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    is_default: false,
  });

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponValidating, setCouponValidating] = useState(false);

  // Checkout Placement State
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch addresses on mount
  useEffect(() => {
    let isMounted = true;
    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const res = await api.get("auth/addresses/");
        if (isMounted) {
          const list = res.data?.results || (Array.isArray(res.data) ? res.data : []);
          setAddresses(list);
          if (list.length > 0) {
            const defaultAddr = list.find((a) => a.is_default) || list[0];
            setSelectedAddressId(defaultAddr.id);
          }
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
      } finally {
        if (isMounted) {
          setLoadingAddresses(false);
        }
      }
    };

    fetchAddresses();
    return () => {
      isMounted = false;
    };
  }, []);

  // Validate and Apply Coupon
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (cartTotal <= 0) {
      toast.warning("Add items to your cart to apply coupon.");
      return;
    }

    try {
      setCouponValidating(true);
      const res = await api.post("promotions/validate/", {
        code,
        subtotal: cartTotal,
      });

      if (res.data && res.data.valid) {
        setAppliedCoupon({
          code: res.data.code,
          discount_applied: parseFloat(res.data.discount_applied || 0),
          message: res.data.message || `Coupon ${code} applied!`,
        });
        toast.success(res.data.message || `Coupon ${code} applied!`);
        setCouponInput("");
      } else {
        toast.error(res.data?.message || "Invalid coupon code.");
      }
    } catch (err) {
      console.error("Coupon validation error:", err);
      const msg = err.response?.data?.message || err.response?.data?.detail || "Invalid or expired coupon.";
      toast.error(msg);
    } finally {
      setCouponValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.info("Coupon removed.");
  };

  // Discount and Final Total
  const discountAmount = appliedCoupon ? appliedCoupon.discount_applied : 0;
  const finalPayable = Math.max(0, cartTotal - discountAmount);

  // Address Handlers
  const handleOpenNewAddress = () => {
    setAddressForm({
      label: "Home",
      full_name: user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "",
      phone: user?.phone || "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      is_default: addresses.length === 0,
    });
    setIsEditMode(false);
    setAddressToEditId(null);
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr) => {
    setAddressForm({
      label: addr.label || "Home",
      full_name: addr.full_name || "",
      phone: addr.phone || "",
      line1: addr.line1 || "",
      line2: addr.line2 || "",
      city: addr.city || "",
      state: addr.state || "",
      postal_code: addr.postal_code || "",
      country: addr.country || "India",
      is_default: addr.is_default || false,
    });
    setIsEditMode(true);
    setAddressToEditId(addr.id);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await api.delete(`auth/addresses/${addrId}/`);
      setAddresses((prev) => prev.filter((a) => a.id !== addrId));
      if (selectedAddressId === addrId) {
        const remaining = addresses.filter((a) => a.id !== addrId);
        setSelectedAddressId(remaining.length > 0 ? remaining[0].id : null);
      }
      toast.success("Address deleted.");
    } catch (err) {
      console.error("Error deleting address:", err);
      toast.error("Could not delete address.");
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.line1 || !addressForm.city || !addressForm.state || !addressForm.postal_code) {
      toast.error("Please fill in all required address fields.");
      return;
    }

    try {
      if (isEditMode && addressToEditId) {
        const res = await api.put(`auth/addresses/${addressToEditId}/`, addressForm);
        setAddresses((prev) =>
          prev.map((a) => (a.id === addressToEditId ? res.data : a))
        );
        toast.success("Address updated successfully.");
      } else {
        const res = await api.post("auth/addresses/", addressForm);
        setAddresses((prev) => [...prev, res.data]);
        setSelectedAddressId(res.data.id);
        toast.success("Address added successfully.");
      }
      setShowAddressModal(false);
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error("Failed to save address.");
    }
  };

  // Place Order Handler
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select or add a shipping address.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setIsPlacingOrder(true);
      const payload = {
        shipping_address_id: selectedAddressId,
        coupon_code: appliedCoupon ? appliedCoupon.code : undefined,
      };

      const res = await api.post("orders/checkout/", payload);

      if (res.data && res.data.status !== false && res.data.order) {
        setPlacedOrder(res.data.order);
        await clearCart();
        toast.success("Order placed successfully!");
      } else {
        toast.error(res.data?.message || "Failed to place order.");
      }
    } catch (err) {
      console.error("Order placement error:", err);
      const msg = err.response?.data?.message || err.response?.data?.detail || "Order checkout failed. Try again.";
      toast.error(msg);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Success Confirmation Screen
  if (placedOrder) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-16 font-['Urbanist']">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-border p-8 text-center shadow-card space-y-6 animate-scale-up">
            <div className="w-16 h-16 bg-lightBg text-brand rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={36} />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-main">Order Confirmed!</h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Thank you for your purchase. We are carefully handcrafting and preparing your order for shipment.
              </p>
            </div>

            <div className="p-5 bg-lightBg/50 rounded-2xl border border-border text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary">Order Number:</span>
                <span className="font-bold text-text-main">{placedOrder.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Paid:</span>
                <span className="font-bold text-brand text-sm">₹{parseFloat(placedOrder.total || finalPayable).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Payment Status:</span>
                <span className="font-bold text-brand uppercase tracking-wider">{placedOrder.payment_status || "Pending / COD"}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="px-6 py-3 bg-brand text-white rounded-xl text-xs font-bold hover:bg-brand-hover transition shadow-button"
              >
                Back to Home
              </Link>
              <Link
                to="/viewall/all-products"
                className="px-6 py-3 bg-lightBg text-brand border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 font-['Urbanist']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-8">
          Checkout & Order Confirmation
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Address Selection & Coupons (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <MapPin className="text-brand w-5 h-5" />
                  <h2 className="text-base font-bold text-text-main">Delivery Address</h2>
                </div>
                <button
                  onClick={handleOpenNewAddress}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-hover transition"
                >
                  <Plus size={14} /> Add New
                </button>
              </div>

              {loadingAddresses ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-4 rounded-xl border border-stone-100 bg-stone-50 animate-pulse h-24"></div>
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-stone-200 rounded-2xl space-y-3 bg-warm/40">
                  <p className="text-xs text-text-secondary">No saved addresses found.</p>
                  <button
                    onClick={handleOpenNewAddress}
                    className="px-4 py-2 bg-brand text-white text-xs font-bold rounded-xl hover:bg-brand/90 transition shadow-button"
                  >
                    Add Delivery Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start justify-between ${
                          isSelected
                            ? "border-brand bg-brand/5 shadow-xs"
                            : "border-stone-200 hover:border-brand/40 bg-pure"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-text-main">
                              {addr.full_name || addr.label || "Shipping Address"}
                            </span>
                            {addr.label && (
                              <span className="px-2 py-0.5 bg-sage/15 text-brand text-[10px] font-bold rounded-md uppercase">
                                {addr.label}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-secondary">
                            {addr.line1} {addr.line2 && `, ${addr.line2}`}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {addr.city}, {addr.state} - {addr.postal_code}, {addr.country}
                          </p>
                          {addr.phone && (
                            <p className="text-[11px] text-text-secondary/70">Phone: {addr.phone}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditAddress(addr);
                            }}
                            className="p-1.5 text-text-secondary hover:text-brand transition rounded-md"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(addr.id);
                            }}
                            className="p-1.5 text-rose-400 hover:text-rose-600 transition rounded-md"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Coupons & Promo Codes */}
            <div className="bg-pure p-6 rounded-2xl border border-stone-200/70 shadow-card space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                <Tag className="text-brand w-5 h-5" />
                <h2 className="text-base font-bold text-text-main">Apply Promo Coupon</h2>
              </div>

              {appliedCoupon ? (
                <div className="p-3.5 bg-sage/10 border border-sage/30 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="text-brand w-4 h-4" />
                    <div>
                      <p className="text-xs font-bold text-brand">{appliedCoupon.code} Applied!</p>
                      <p className="text-[11px] text-brand/80">
                        You saved ₹{appliedCoupon.discount_applied.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs text-brand font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand uppercase tracking-wider"
                  />
                  <button
                    type="submit"
                    disabled={couponValidating || !couponInput.trim()}
                    className="px-5 py-2.5 bg-brand hover:bg-brand/90 text-white text-xs font-bold rounded-xl transition shadow-button disabled:opacity-50"
                  >
                    {couponValidating ? "Checking..." : "Apply"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Order Summary (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-pure p-6 rounded-2xl border border-stone-200/70 shadow-card space-y-6 sticky top-24">
              <h3 className="text-base font-bold text-text-main flex items-center gap-2">
                <Package className="w-5 h-5 text-brand" /> Order Summary
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-stone-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg bg-warm flex-shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-bold text-text-main truncate">{item.name}</p>
                        <p className="text-text-secondary text-[11px]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-text-main flex-shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2 pt-4 border-t border-stone-100 text-xs text-text-secondary">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text-main">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-sage">FREE</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-brand font-semibold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-extrabold text-text-main">
                  <span>Total Amount</span>
                  <span className="text-brand">₹{finalPayable.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || cartItems.length === 0 || !selectedAddressId}
                className="w-full py-3.5 bg-brand hover:bg-brand/90 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-button active:scale-98 disabled:opacity-50"
              >
                {isPlacingOrder ? "Placing Order..." : "Confirm & Place Order"}
                <ArrowRight size={14} />
              </button>

              <div className="pt-2 text-center text-[10px] text-text-secondary/70 flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-brand" /> 256-Bit SSL Encrypted & Protected Checkout
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Edit / Add Modal */}
      {showAddressModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowAddressModal(false)}
        >
          <div
            className="bg-pure rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto border border-stone-200/80 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold font-serif text-text-main">
              {isEditMode ? "Edit Address" : "Add New Address"}
            </h3>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="block text-text-main font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={addressForm.full_name}
                  onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  placeholder="Recipient Name"
                />
              </div>

              <div>
                <label className="block text-text-main font-bold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  placeholder="10-digit mobile"
                />
              </div>

              <div>
                <label className="block text-text-main font-bold mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  value={addressForm.line1}
                  onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  placeholder="Flat, House no., Building, Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-main font-bold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-text-main font-bold mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-main font-bold mb-1">Postal Code (PIN) *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.postal_code}
                    onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-text-main font-bold mb-1">Address Label</label>
                  <select
                    value={addressForm.label}
                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border border-stone-200 text-text-secondary rounded-xl font-bold hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand text-white rounded-xl font-bold hover:bg-brand/90 transition shadow-button"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
