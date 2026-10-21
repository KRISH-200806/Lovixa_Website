import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import api from "../../Axios/axiosInstance";
import URL from "../../Axios/URL";
import { useCart } from "../Context/CartContext";
import { toast } from "react-toastify";
import LoadingState from "../ui/LoadingState";
import EmptyState from "../ui/EmptyState";

import fallbackImg from "../../assets/image/lazina.jpg";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);
  const [addingId, setAddingId] = useState(null);

  const { addToCart } = useCart();
  const carouselRef = useRef(null);
  const location = useLocation();
  const isStandalonePage = location.pathname === "/bestsellers";

  // Responsive items count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setVisibleItems(4);
      } else if (window.innerWidth >= 1024) {
        setVisibleItems(3);
      } else if (window.innerWidth >= 640) {
        setVisibleItems(2);
      } else {
        setVisibleItems(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch best sellers / new arrivals from backend
  useEffect(() => {
    let isMounted = true;

    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        // Try new-arrivals first or all products
        let res = await api.get("catalog/products/new-arrivals/");
        let items = res.data?.results || (Array.isArray(res.data) ? res.data : []);

        if (items.length === 0) {
          res = await api.get("catalog/products/");
          items = res.data?.results || (Array.isArray(res.data) ? res.data : []);
        }

        if (isMounted) {
          setProducts(items);
        }
      } catch (err) {
        console.error("Error fetching best sellers:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBestSellers();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.in_stock) {
      toast.warning("This item is currently out of stock.");
      return;
    }

    setAddingId(product.id);
    const res = await addToCart(product, 1);
    setAddingId(null);

    if (res.success) {
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error(res.message || "Failed to add to cart.");
    }
  };

  const next = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, products.length - visibleItems);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prev = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, products.length - visibleItems);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const getProductImage = (product) => {
    if (product.primary_image) {
      if (product.primary_image.startsWith("http")) return product.primary_image;
      return `${URL.PHOTO_URL}${product.primary_image.startsWith("/") ? "" : "/"}${product.primary_image}`;
    }
    if (Array.isArray(product.images) && product.images.length > 0) {
      const img = product.images[0].image || product.images[0];
      if (typeof img === "string") {
        if (img.startsWith("http")) return img;
        return `${URL.PHOTO_URL}${img.startsWith("/") ? "" : "/"}${img}`;
      }
    }
    return fallbackImg;
  };

  // If loading on standalone page, show full loading state
  if (loading && isStandalonePage) {
    return <LoadingState message="Curating Best Sellers..." subtitle="Fetching top-rated customer favorites" cardCount={4} />;
  }

  // If empty on standalone page, show full empty state with CTA
  if (!loading && products.length === 0 && isStandalonePage) {
    return (
      <EmptyState
        title="Best Sellers Being Updated"
        description="We are refreshing our top trending catalog. Explore our full range of luxury attars and perfumes."
        buttonText="Explore All Products"
        buttonLink="/viewall/all-products"
      />
    );
  }

  // If embedded and no products after load, hide section gracefully
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white font-['Urbanist'] overflow-hidden border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-brand uppercase tracking-widest flex items-center gap-1.5 bg-emerald-50 text-brand px-3 py-1 rounded-full w-max border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
              Trending & Loved
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-main mt-2">
              Our Best Sellers
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/viewall/all-products"
              className="text-xs font-bold text-brand hover:text-brand-hover mr-3 transition-colors group flex items-center gap-1"
            >
              <span>View All Products</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <button
              onClick={prev}
              disabled={products.length <= visibleItems}
              className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center text-text-secondary bg-white hover:bg-brand hover:text-white hover:border-brand disabled:opacity-40 transition-all shadow-xs hover:scale-105"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              disabled={products.length <= visibleItems}
              className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center text-text-secondary bg-white hover:bg-brand hover:text-white hover:border-brand disabled:opacity-40 transition-all shadow-xs hover:scale-105"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel / Product Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-stone-100 p-4 animate-pulse space-y-3 shadow-xs"
              >
                <div className="aspect-square bg-emerald-50/70 rounded-xl"></div>
                <div className="h-4 bg-emerald-50/70 rounded w-3/4"></div>
                <div className="h-3 bg-emerald-50/70 rounded w-1/2"></div>
                <div className="h-9 bg-emerald-50/70 rounded-xl w-full mt-2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden" ref={carouselRef}>
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
              }}
            >
              {products.map((product) => {
                const img = getProductImage(product);
                const price = parseFloat(product.price || 0);
                const effectivePrice = parseFloat(product.effective_price || product.discount_price || price);
                const hasDiscount = effectivePrice < price;

                return (
                  <div
                    key={product.id}
                    className="flex-shrink-0 px-3"
                    style={{ width: `${100 / visibleItems}%` }}
                  >
                    <div className="group bg-white rounded-2xl border border-stone-200/80 p-4 hover:shadow-card-hover hover:border-brand/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full shadow-card">
                      <div>
                        {/* Image */}
                        <Link
                          to={`/product/${product.id || product.slug}`}
                          className="block relative aspect-square rounded-xl overflow-hidden bg-emerald-50/30 mb-3 border border-stone-100"
                        >
                          <img
                            src={img}
                            alt={product.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = fallbackImg;
                            }}
                            className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-500"
                            loading="lazy"
                          />
                          {hasDiscount && (
                            <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-full uppercase shadow-xs">
                              Sale
                            </span>
                          )}
                        </Link>

                        {/* Title & Brand */}
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold text-brand uppercase tracking-wider truncate">
                            {product.category_name || "Lovixa Exclusive"}
                          </p>
                          <Link
                            to={`/product/${product.id || product.slug}`}
                            className="block text-sm font-bold text-text-main group-hover:text-brand transition-colors line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <div className="flex items-center gap-1 text-gold text-xs font-semibold">
                            <Star size={13} fill="currentColor" />
                            <span>{parseFloat(product.average_rating || 5.0).toFixed(1)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Add to Cart */}
                      <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <div className="text-base font-extrabold text-brand">
                            ₹{effectivePrice.toFixed(2)}
                          </div>
                          {hasDiscount && (
                            <span className="text-xs text-text-secondary line-through">
                              ₹{price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={!product.in_stock || addingId === product.id}
                          className={`p-2.5 rounded-full transition-all shadow-button active:scale-95 ${
                            !product.in_stock
                              ? "bg-stone-200 text-text-secondary cursor-not-allowed"
                              : addingId === product.id
                              ? "bg-brand-dark text-white"
                              : "bg-brand hover:bg-brand/90 text-white hover:scale-105"
                          }`}
                          aria-label="Add to cart"
                        >
                          <ShoppingCart size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellers;