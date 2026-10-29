import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, Check, Sparkles } from "lucide-react";
import api from "../../Axios/axiosInstance";
import URL from "../../Axios/URL";
import { useCart } from "../Context/CartContext";
import { toast } from "react-toastify";

// Payment Badges
import gpay from "../../assets/image/payment/gpay.png";
import phonepe from "../../assets/image/payment/phonepe.png";
import paypal from "../../assets/image/payment/paypal.png";
import bhim from "../../assets/image/payment/bhim.png";

// Additional Subcomponents
import FAQ from "./FAQ";
import Rating from "../Rating/ReviewSystem";
import fallbackImg from "../../assets/image/lazina.jpg";

function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const paymentBadges = [
    { name: "Google Pay", src: gpay },
    { name: "PhonePe", src: phonepe },
    { name: "PayPal", src: paypal },
    { name: "BHIM UPI", src: bhim },
  ];

  // Fetch Product Data
  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`catalog/products/${id}/`);
        if (isMounted) {
          if (res.data) {
            setProduct(res.data);
            if (Array.isArray(res.data.variants) && res.data.variants.length > 0) {
              setSelectedVariant(res.data.variants[0]);
            }
          }
        }
      } catch (err) {
        console.error("Error loading product detail:", err);
        if (isMounted) {
          setError("Could not load product details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Gallery image helper
  const getImages = () => {
    if (!product) return [fallbackImg];
    const list = [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach((imgObj) => {
        let src = typeof imgObj === "string" ? imgObj : imgObj.image;
        if (src) {
          if (!src.startsWith("http") && !src.startsWith("/placeholder")) {
            src = `${URL.PHOTO_URL}${src.startsWith("/") ? "" : "/"}${src}`;
          }
          list.push(src);
        }
      });
    } else if (product.primary_image) {
      let src = product.primary_image;
      if (!src.startsWith("http") && !src.startsWith("/placeholder")) {
        src = `${URL.PHOTO_URL}${src.startsWith("/") ? "" : "/"}${src}`;
      }
      list.push(src);
    }
    return list.length > 0 ? list : [fallbackImg];
  };

  const images = getImages();

  // Price calculations
  const basePrice = parseFloat(
    selectedVariant?.price || product?.effective_price || product?.discount_price || product?.price || 0
  );
  const originalPrice = parseFloat(product?.price || basePrice);
  const hasDiscount = originalPrice > basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - basePrice) / originalPrice) * 100)
    : 0;

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (!product) return;
    if (!product.in_stock && (!selectedVariant || selectedVariant.stock_quantity <= 0)) {
      toast.warning("This product is currently out of stock.");
      return;
    }

    setIsAdding(true);
    const result = await addToCart(product, quantity, selectedVariant?.id || null);
    setIsAdding(false);

    if (result.success) {
      toast.success(`${product.name} added to your cart!`);
    } else {
      toast.error(result.message || "Failed to add to cart.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-16 font-['Urbanist']">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-lightBg rounded-card animate-pulse"></div>
              <div className="flex gap-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-lightBg rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6 animate-pulse">
              <div className="h-4 bg-lightBg rounded w-1/3"></div>
              <div className="h-8 bg-lightBg rounded w-3/4"></div>
              <div className="h-6 bg-lightBg rounded w-1/4"></div>
              <div className="h-24 bg-lightBg rounded w-full"></div>
              <div className="h-12 bg-lightBg rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-16 flex items-center justify-center font-['Urbanist']">
        <div className="bg-white rounded-card border border-border p-10 text-center max-w-md shadow-card space-y-4">
          <h2 className="text-2xl font-bold text-text-main">Product Not Found</h2>
          <p className="text-text-secondary text-sm">
            {error || "The product you are looking for is unavailable or removed."}
          </p>
          <Link
            to="/viewall/all-products"
            className="inline-block px-7 py-3 bg-brand text-white rounded-full text-sm font-semibold hover:bg-brand-hover shadow-brand/20 transition-all"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 font-['Urbanist']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-xs text-text-secondary mb-8 space-x-1.5 overflow-hidden">
          <Link to="/" className="hover:text-brand transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link
            to={`/viewall/${product.category?.slug || "all-products"}`}
            className="hover:text-brand transition-colors truncate max-w-[150px]"
          >
            {product.category?.name || "Catalog"}
          </Link>
          <ChevronRight size={12} />
          <span className="text-text-main font-semibold truncate">{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Gallery (5 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square bg-white rounded-card overflow-hidden border border-border shadow-card">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackImg;
                }}
                className="w-full h-full object-cover"
              />

              {/* Tag Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.new_arrival && (
                  <span className="px-3 py-1 bg-brand text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-brand/20">
                    New Arrival
                  </span>
                )}
                {hasDiscount && (
                  <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-xs">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Selectors */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? "border-brand scale-105 shadow-xs"
                        : "border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackImg;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Buy Box (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-0.5 bg-sage/15 text-sage-dark border border-sage/30 text-xs font-semibold rounded-full uppercase tracking-wider">
                  {product.brand || "Lovixa Beauty"}
                </span>
                {product.sku && (
                  <span className="text-xs text-text-secondary">SKU: {product.sku}</span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-main leading-tight">
                {product.name}
              </h1>

              {/* Rating Summary */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-gold font-bold text-sm">
                  <Star size={16} fill="currentColor" />
                  <span className="ml-1">{parseFloat(product.average_rating || 5.0).toFixed(1)}</span>
                </div>
                <span className="text-border">|</span>
                <span className="text-xs text-text-secondary">
                  {product.total_reviews || 0} Verified Ratings
                </span>
                <span className="text-border">|</span>
                <span
                  className={`text-xs font-bold ${
                    product.in_stock ? "text-brand" : "text-red-500"
                  }`}
                >
                  {product.in_stock ? "✓ In Stock" : "✕ Out of Stock"}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-white rounded-card border border-border shadow-xs space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-brand">
                  ₹{basePrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-text-secondary line-through">
                      ₹{originalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-sage-dark bg-sage/15 border border-sage/30 px-2 py-0.5 rounded">
                      Save ₹{(originalPrice - basePrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-text-secondary">MRP Inclusive of all taxes</p>
            </div>

            {/* Variants Picker if available */}
            {Array.isArray(product.variants) && product.variants.length > 0 && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-text-main uppercase tracking-wider">
                  Select Size / Variant:
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                        selectedVariant?.id === v.id
                          ? "border-brand bg-brand/10 text-brand shadow-xs scale-102"
                          : "border-border bg-white text-text-main hover:border-brand/40"
                      }`}
                    >
                      {v.variant_name} — ₹{parseFloat(v.price).toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                {/* Quantity Control */}
                <div className="flex items-center border border-border rounded-full bg-white overflow-hidden shadow-xs px-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-11 flex items-center justify-center text-text-secondary hover:bg-warm disabled:opacity-40 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-bold text-sm text-text-main">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-11 flex items-center justify-center text-text-secondary hover:bg-warm transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock || isAdding}
                  className={`flex-1 h-11 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-brand/30 hover:shadow-brand/50 ${
                    !product.in_stock
                      ? "bg-warm-300 text-text-secondary cursor-not-allowed"
                      : isAdding
                      ? "bg-brand-dark text-white opacity-90"
                      : "bg-brand hover:bg-brand-hover text-white hover:scale-102 active:scale-98"
                  }`}
                >
                  <ShoppingCart size={18} />
                  <span>{isAdding ? "Adding to Cart..." : "Add to Cart"}</span>
                </button>
              </div>

              {/* Delivery info */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                <div className="p-3 bg-white rounded-xl border border-border shadow-2xs flex flex-col items-center">
                  <Truck size={18} className="text-brand mb-1" />
                  <span className="text-[11px] font-semibold text-text-main">Fast Delivery</span>
                  <span className="text-[10px] text-text-secondary">Within 3-5 days</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-border shadow-2xs flex flex-col items-center">
                  <ShieldCheck size={18} className="text-brand mb-1" />
                  <span className="text-[11px] font-semibold text-text-main">100% Authentic</span>
                  <span className="text-[10px] text-text-secondary">Pure & Certified</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-border shadow-2xs flex flex-col items-center">
                  <RotateCcw size={18} className="text-brand mb-1" />
                  <span className="text-[11px] font-semibold text-text-main">Easy Returns</span>
                  <span className="text-[10px] text-text-secondary">7-Day Guarantee</span>
                </div>
              </div>

              {/* UPI & Payment Perks */}
              <div className="p-4 bg-gradient-to-r from-brand-dark to-brand rounded-card text-white flex items-center justify-between shadow-brand/20">
                <div>
                  <p className="text-xs font-bold text-gold flex items-center gap-1">
                    <Sparkles size={14} /> Instant UPI Discounts
                  </p>
                  <p className="text-[11px] text-white/80">Use coupon WELCOME10 at checkout</p>
                </div>
                <div className="flex gap-1.5">
                  {paymentBadges.map((p, i) => (
                    <div key={i} className="w-8 h-6 bg-white rounded flex items-center justify-center p-0.5 shadow-2xs">
                      <img src={p.src} alt={p.name} className="h-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-card border border-border space-y-3 shadow-card">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">
                Product Description & Care
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                {product.description ||
                  "Formulated with premium botanical extracts and natural oils to provide unmatched elegance and nourishment. Dermatologically tested for daily application."}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Ratings */}
        <div className="mt-16 pt-12 border-t border-border">
          <Rating id={product.id} />
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <FAQ />
        </div>
      </div>
    </div>
  );
}

export default ProductPage;