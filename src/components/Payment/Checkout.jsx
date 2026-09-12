import { useState, useEffect } from "react";
import { MapPin, Plus, Edit, Trash2, Tag } from "lucide-react";
import api from "../../Axios/axiosInstance";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState([]);
  const [AddressForm, setAddressForm] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [addressFormData, setAddressFormData] = useState({
    full_name: "",
    house_no: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile_number: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const getAddress = async () => {
      try {
        const response = await api.get("addresses/");
        setAddressForm(response.data.addresses);
        if (response.data.addresses.length > 0 && !selectedAddress) {
          setSelectedAddress(response.data.addresses[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAddress();
  }, []);

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const response = await api.get("get-cart-item/");
        if (response.data && response.data.cart_items) {
          setCartItems(response.data.cart_items);
          setTotalAmount(
            response.data.total_payable ||
              response.data.cart_items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              )
          );
        }
      } catch {
        // Handle silently
      }
    };
    getCartItems();
  }, []);

  useEffect(() => {
    const getCouponCode = async () => {
      try {
        const response = await api.get("get-available-coupons/");
        setCouponCode(response.data.coupons);
      } catch (error) {
        console.log(error);
      }
    };
    getCouponCode();
  }, []);

  // Handle address selection
  const handleAddressSelection = (address) => {
    setSelectedAddress(address);
  };

  // Handle coupon application
  const handleApplyCoupon = (couponId) => {
    const coupon = couponCode.find((c) => c.id === couponId);
    if (!coupon) return;

    // Check minimum order amount
    if (totalAmount < coupon.min_order_amount) {
      return; // Not enough order amount
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === "percentage") {
      discountAmount = (totalAmount * coupon.discount_amount) / 100;
    } else {
      discountAmount = coupon.discount_amount;
    }

    // Cap the discount at the total amount
    discountAmount = Math.min(discountAmount, totalAmount);

    // Store the applied coupon including its ID
    setAppliedCoupon({
      ...coupon,
      id: coupon.id,
      discountAmount: discountAmount,
    });
  };

  // Handle remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculate discount amount
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    let discount = 0;
    if (appliedCoupon.type === "percentage") {
      discount = (totalAmount * appliedCoupon.discount_amount) / 100;
    } else {
      discount = appliedCoupon.discount_amount;
    }

    // Don't allow discount greater than the total amount
    return Math.min(discount, totalAmount);
  };

  // Calculate final amount after discount
  const finalAmount = totalAmount - calculateDiscount();

  // Handle address form changes
  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData({
      ...addressFormData,
      [name]: value,
    });

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Validate address form
  const validateAddressForm = () => {
    const newErrors = {};

    if (!addressFormData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!addressFormData.house_no.trim()) {
      newErrors.house_no = "House number is required";
    }

    if (!addressFormData.area.trim()) {
      newErrors.area = "Area is required";
    }

    if (!addressFormData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!addressFormData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!addressFormData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(addressFormData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (!addressFormData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!addressFormData.mobile_number.trim()) {
      newErrors.mobile_number = "Mobile number is required";
    } else if (!/^\d{10}$/.test(addressFormData.mobile_number)) {
      newErrors.mobile_number = "Mobile number must be 10 digits";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle address form submission
  const handleAddressFormSubmit = async (e) => {
    e.preventDefault();

    if (validateAddressForm()) {
      try {
        setIsLoading(true);

        // Create object with all required fields
        const addressData = {
          full_name: addressFormData.full_name,
          house_no: addressFormData.house_no,
          area: addressFormData.area,
          city: addressFormData.city,
          state: addressFormData.state,
          pincode: addressFormData.pincode,
          country: addressFormData.country,
          mobile_number: addressFormData.mobile_number,
        };


        // Convert data to URLSearchParams for form submission
        const params = new URLSearchParams();
        Object.entries(addressData).forEach(([key, value]) => {
          params.append(key, value);
        });

        let response;
        if (isEditMode && addressToEdit) {
          // Update existing address
          response = await api.put(
            `update-address/${addressToEdit.id}`,
            params,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );


          const updatedAddress = { ...addressData, id: addressToEdit.id };
          const updatedAddresses = AddressForm.map((addr) =>
            addr.id === addressToEdit.id ? updatedAddress : addr
          );

          setAddressForm(updatedAddresses);

          if (selectedAddress && selectedAddress.id === addressToEdit.id) {
            setSelectedAddress(updatedAddress);
          }
        } else {
          // Add new address
          response = await api.post("add-address/", params, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });


          // Get the ID from the response (handle different response formats)
          let newAddressId;
          if (response.data.id) {
            newAddressId = response.data.id;
          } else if (response.data.address && response.data.address.id) {
            newAddressId = response.data.address.id;
          } else if (response.data.address_id) {
            newAddressId = response.data.address_id;
          } else {
            newAddressId = Date.now(); // Fallback
          }

          const newAddress = { ...addressData, id: newAddressId };
          const updatedAddresses = [...AddressForm, newAddress];

          setAddressForm(updatedAddresses);

          if (!selectedAddress) {
            setSelectedAddress(newAddress);
          }
        }

        setShowAddressPopup(false);
        resetAddressForm();
      } catch (error) {
        console.error("Error saving address:", error);
        if (error.response) {
          console.error("Error response data:", error.response.data);
        }
        alert("Failed to save address. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Reset address form
  const resetAddressForm = () => {
    setAddressFormData({
      full_name: "",
      house_no: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      mobile_number: "",
    });
    setFormErrors({});
    setIsEditMode(false);
    setAddressToEdit(null);
  };

  // Handle edit address
  const handleEditAddress = (address) => {
    setAddressToEdit(address);
    setAddressFormData({
      full_name: address.full_name,
      house_no: address.house_no,
      area: address.area,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      mobile_number: address.mobile_number,
    });
    setIsEditMode(true);
    setShowAddressPopup(true);
  };

  // Handle delete address
  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await api.delete(`delete-address/${addressId}`);
        const updatedAddresses = AddressForm.filter(
          (addr) => addr.id !== addressId
        );
        setAddressForm(updatedAddresses);

        if (selectedAddress && selectedAddress.id === addressId) {
          setSelectedAddress(
            updatedAddresses.length > 0 ? updatedAddresses[0] : null
          );
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        alert("Failed to delete address. Please try again.");
      }
    }
  };

  // Handle add new address
  const handleAddNewAddress = () => {
    resetAddressForm();
    setShowAddressPopup(true);
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!selectedAddress || cartItems.length === 0) {
      return;
    }

    try {
      setIsLoading(true);

      // Get the coupon ID from the applied coupon
      const couponId = appliedCoupon ? appliedCoupon.id : null;

      // Ensure address_id is a valid value
      const addressId = selectedAddress.id;
      if (!addressId) {
        return;
      }

      // Create form data for checkout
      const formData = new URLSearchParams();
      formData.append("address_id", addressId.toString());

      // If coupon is applied, include coupon_id and discount_amount
      if (couponId) {
        formData.append("coupon_id", couponId.toString());
        formData.append("discount_amount", calculateDiscount().toString());
      }

      // Always include total_amount
      formData.append("total_amount", finalAmount.toString());

      // Send the checkout request
      const response = await api.post("checkout/", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Handle successful response
      if (response.data && response.data.status === true) {
        // Clear the cart items after successful order placement
        try {
          // Store cart items to remove them one by one
          const itemsToRemove = [...cartItems];
          
          // Remove each item from the cart
          for (const item of itemsToRemove) {
            const itemId = item.id || item.product_id;
            if (itemId) {
              try {
                await api.delete(`remove-cart-item/${itemId}/`);
              } catch (removeError) {
                console.error(`Error removing item ${itemId}:`, removeError);
              }
            }
          }
          
          // Update local cart state
          setCartItems([]);
          setTotalAmount(0);
        } catch (error) {
          console.error("Error clearing cart:", error);
        }
        
        // Check if payment link is available
        if (response.data.payment_link) {
          // Store payment link
          const paymentLink = response.data.payment_link;

          // Open the payment link in the same window
          window.location.href = paymentLink;
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Address and Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <MapPin className="h-6 w-6 text-[#B4945E] mr-2  " />
                <h2 className="text-xl font-semibold text-[#B4945E] ">
                  Delivery Address
                </h2>
              </div>

              <div className="space-y-4">
                {AddressForm.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => handleAddressSelection(address)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedAddress && selectedAddress.id === address.id
                        ? "border-[#B4945E] bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {selectedAddress &&
                            selectedAddress.id === address.id && (
                              <div className="w-4 h-4 bg-[#8B7355]  rounded-full flex items-center justify-center mr-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          <h3 className="font-semibold text-[#B4945E] ">
                            {address.full_name}
                          </h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {address.house_no}, {address.area}
                          <br />
                          {address.city}, {address.state} {address.pincode}
                          <br />
                          {address.country}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Phone: {address.mobile_number}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(address);
                          }}
                          className="p-2 text-[#8B7355]  hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleAddNewAddress}
                  className="w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#B4945E] hover:text-[#8B7355]  transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Address
                </button>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Tag className="h-6 w-6 text-[#B4945E] mr-2" />
                <h2 className="text-xl font-semibold text-[#B4945E] ">
                  Apply Coupon
                </h2>
              </div>

              {appliedCoupon && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-green-800">
                        {appliedCoupon.code} Applied!
                      </p>
                      <p className="text-sm text-green-600">
                        You saved ₹{calculateDiscount().toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-medium text-gray-700 mb-3">
                  Available Coupons:
                </h3>
                {couponCode.map((coupon) => (
                  <div
                    key={coupon.id}
                    className={`border rounded-lg p-4 transition-all ${
                      appliedCoupon && appliedCoupon.id === coupon.id
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg text-[#8B7355] ">
                          {coupon.code}
                        </p>
                        <p className="text-sm text-gray-600">
                          {coupon.type === "percentage"
                            ? `${coupon.discount_amount}% off`
                            : `₹${coupon.discount_amount} off`}{" "}
                          on orders above ₹{coupon.min_order_amount}
                        </p>
                        {totalAmount < coupon.min_order_amount && (
                          <p className="text-xs text-red-500 mt-1">
                            Add ₹{coupon.min_order_amount - totalAmount} more to
                            use this coupon
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleApplyCoupon(coupon.id)}
                        disabled={
                          totalAmount < coupon.min_order_amount ||
                          (appliedCoupon && appliedCoupon.id === coupon.id)
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          appliedCoupon && appliedCoupon.id === coupon.id
                            ? "bg-green-100 text-green-800 cursor-not-allowed"
                            : totalAmount < coupon.min_order_amount
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-[#8B7355]  text-white hover:bg-[#B4945E] active:transform active:scale-95"
                        }`}
                      >
                        {appliedCoupon && appliedCoupon.id === coupon.id
                          ? "Applied"
                          : "Apply"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-[#B4945E]  mb-6">
                Order Summary
              </h3>

              {selectedAddress && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">
                    Shipping to:
                  </h4>
                  <p className="text-sm font-medium">
                    {selectedAddress.full_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.house_no}, {selectedAddress.area}
                    <br />
                    {selectedAddress.city}, {selectedAddress.state}{" "}
                    {selectedAddress.pincode}
                  </p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                {/* Display cart items */}
                {cartItems.length > 0 ? (
                  <div className="mb-4">
                    <h4 className="font-medium text-[#B4945E]  mb-3">Items:</h4>
                    {cartItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {item.product_name || item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          ₹{((item.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Your cart is empty. Please add items to your cart before
                      checkout.
                    </p>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span>
                    Subtotal (
                    {cartItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                    items):
                  </span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping & handling:</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedCoupon.code}):</span>
                    <span>-₹{calculateDiscount().toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{finalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-green-800">
                      Free shipping eligible
                    </p>
                    <p className="text-xs text-green-600">
                      Your order qualifies for free delivery
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={
                  isLoading || !selectedAddress || cartItems.length === 0
                }
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  isLoading || !selectedAddress || cartItems.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed "
                    : "bg-gradient-to-r bg-[#B4945E] hover:bg-[#8B7355] text-white active:transform active:scale-95 shadow-lg hover:shadow-xl"
                }`}
              >
                {isLoading
                  ? "Processing..."
                  : cartItems.length === 0
                  ? "Add items to cart"
                  : !selectedAddress
                  ? "Select delivery address"
                  : "Place Order & Proceed to Payment"}
              </button>

              <div className="mt-4 text-xs text-center text-gray-500">
                By placing your order, you agree to our{" "}
                <a href="#" className="text-[#8B7355]  hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#8B7355]  hover:underline">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Form Popup */}
      {showAddressPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#B4945E] ">
                {isEditMode ? "Update Address" : "Add New Address"}
              </h3>
              <button
                onClick={() => setShowAddressPopup(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddressFormSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={addressFormData.full_name}
                  onChange={handleAddressFormChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#B4945E] focus:border-transparent transition-all ${
                    formErrors.full_name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {formErrors.full_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.full_name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    House No *
                  </label>
                  <input
                    type="text"
                    name="house_no"
                    value={addressFormData.house_no}
                    onChange={handleAddressFormChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#B4945E] focus:border-transparent transition-all ${
                      formErrors.house_no ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="House/Flat No"
                  />
                  {formErrors.house_no && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.house_no}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={addressFormData.area}
                    onChange={handleAddressFormChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#B4945E] focus:border-transparent transition-all ${
                      formErrors.area ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Area/Locality"
                  />
                  {formErrors.area && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.area}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={addressFormData.city}
                    onChange={handleAddressFormChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#B4945E] focus:border-transparent transition-all ${
                      formErrors.city ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="City"
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={addressFormData.state}
                    onChange={handleAddressFormChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#B4945E] focus:border-transparent transition-all ${
                      formErrors.state ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="State"
                  />
                  {formErrors.state && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={addressFormData.pincode}
                    onChange={handleAddressFormChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#B4945E] focus:border-transparent transition-all ${
                      formErrors.pincode ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="6-digit pincode"
                  />
                  {formErrors.pincode && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.pincode}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={addressFormData.country}
                    onChange={handleAddressFormChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#B4945E] focus:border-transparent transition-all ${
                      formErrors.country ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="country"
                  />
                  {formErrors.country && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.country}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={addressFormData.mobile_number}
                    onChange={handleAddressFormChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#B4945E] focus:border-transparent transition-all ${
                      formErrors.mobile_number
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="10-digit mobile number"
                  />
                  {formErrors.mobile_number && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.mobile_number}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddressPopup(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    isLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#8B7355]  text-white hover:bg-[#B4945E] active:transform active:scale-95"
                  }`}
                >
                  {isLoading
                    ? "Saving..."
                    : isEditMode
                    ? "Update Address"
                    : "Save Address"}
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
