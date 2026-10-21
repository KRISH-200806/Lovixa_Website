import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Axios/axiosInstance";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";

const Address = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    label: "Home",
    fullName: user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: user?.phone || "",
    isDefault: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address line 1 is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "PIN Code is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        if (isAuthenticated) {
          await api.post("auth/addresses/", {
            label: formData.label,
            full_name: formData.fullName,
            phone: formData.phone,
            line1: formData.addressLine1,
            line2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postalCode,
            country: formData.country,
            is_default: formData.isDefault,
          });
          toast.success("Shipping address saved.");
        }

        navigate("/checkout");
      } catch (error) {
        console.error("Error saving address:", error);
        toast.error("Failed to save address. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-16 font-['Urbanist']">
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white rounded-3xl border border-border shadow-card">
        <h1 className="text-2xl font-bold text-text-main mb-6">Delivery Address</h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Label */}
          <div>
            <label className="block text-text-main font-bold mb-1">Address Label</label>
            <select
              name="label"
              value={formData.label}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-lightBg/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-text-main"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-text-main font-bold mb-1">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 border rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-text-main ${
                errors.fullName ? "border-rose-400" : "border-stone-200"
              }`}
              placeholder="Recipient name"
            />
            {errors.fullName && <p className="text-rose-500 text-[10px] mt-1">{errors.fullName}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-text-main font-bold mb-1">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 border rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-text-main ${
                errors.phone ? "border-rose-400" : "border-stone-200"
              }`}
              placeholder="10-digit mobile number"
            />
            {errors.phone && <p className="text-rose-500 text-[10px] mt-1">{errors.phone}</p>}
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-text-main font-bold mb-1">Address Line 1 *</label>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 border rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-text-main ${
                errors.addressLine1 ? "border-rose-400" : "border-stone-200"
              }`}
              placeholder="Flat, House no., Building, Street"
            />
            {errors.addressLine1 && <p className="text-rose-500 text-[10px] mt-1">{errors.addressLine1}</p>}
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-text-main font-bold mb-1">Address Line 2 (Optional)</label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-text-main"
              placeholder="Apartment, Landmark, Area"
            />
          </div>

          {/* City, State, Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-text-main font-bold mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 border rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-text-main ${
                  errors.city ? "border-rose-400" : "border-stone-200"
                }`}
                placeholder="City"
              />
              {errors.city && (
                <p className="text-rose-500 text-[10px] mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-text-main font-bold mb-1">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 border rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-text-main ${
                  errors.state ? "border-rose-400" : "border-stone-200"
                }`}
                placeholder="State"
              />
              {errors.state && (
                <p className="text-rose-500 text-[10px] mt-1">{errors.state}</p>
              )}
            </div>

            <div>
              <label className="block text-text-main font-bold mb-1">PIN Code *</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 border rounded-xl bg-stone-50/50 focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-text-main ${
                  errors.postalCode ? "border-rose-400" : "border-stone-200"
                }`}
                placeholder="6-digit PIN"
              />
              {errors.postalCode && (
                <p className="text-rose-500 text-[10px] mt-1">{errors.postalCode}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-brand hover:bg-brand/90 text-white rounded-xl text-xs font-bold transition shadow-button disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save & Proceed to Checkout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Address;