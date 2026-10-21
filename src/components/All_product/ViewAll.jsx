import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight, Star, ShoppingCart, Filter, LayoutGrid, List, SlidersHorizontal, Check, RefreshCw } from "lucide-react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import api from "../../Axios/axiosInstance";
import URL from "../../Axios/URL";
import { useCart } from "../Context/CartContext";
import { toast } from "react-toastify";
import LoadingState from "../ui/LoadingState";
import EmptyState from "../ui/EmptyState";

// Fallback cosmetic placeholder
import fallbackProductImg from "../../assets/image/lazina.jpg";

const ViewAll = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // URL / State parameters
  const currentCategorySlug = params.categoryName || "";
  const initialCategoryId = location.state?.categoryId || null;
  const initialCategoryName = location.state?.categoryName || "";

  // Component States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [categoryTitle, setCategoryTitle] = useState(initialCategoryName || "All Products");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gridView, setGridView] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter & Sorting States
  const [ordering, setOrdering] = useState("-created_at");
  const [onlyNewArrivals, setOnlyNewArrivals] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [addingProductId, setAddingProductId] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch all categories for sidebar
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("catalog/categories/");
        if (res.data?.results) {
          setCategories(res.data.results);
        } else if (Array.isArray(res.data)) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Error loading categories in ViewAll:", err);
      }
    };
    loadCategories();
  }, []);

  // Sync category slug from URL
  useEffect(() => {
    if (categories.length > 0 && currentCategorySlug) {
      if (currentCategorySlug === "all" || currentCategorySlug === "all-products") {
        setSelectedCategory(null);
        setCategoryTitle("All Products");
      } else {
        const matched = categories.find(
          (c) =>
            c.slug === currentCategorySlug ||
            c.name.toLowerCase().replace(/\s+/g, "-") === currentCategorySlug
        );
        if (matched) {
          setSelectedCategory(matched.id);
          setCategoryTitle(matched.name);
        }
      }
    }
  }, [currentCategorySlug, categories]);

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (selectedCategory) {
        queryParams.append("category", selectedCategory);
      }
      if (ordering) {
        queryParams.append("ordering", ordering);
      }
      if (onlyNewArrivals) {
        queryParams.append("new_arrival", "true");
      }
      if (currentPage > 1) {
        queryParams.append("page", currentPage);
      }

      const res = await api.get(`catalog/products/?${queryParams.toString()}`);

      if (res.data && res.data.status !== false) {
        let results = res.data.results || [];

        // Client-side in-stock filter if needed
        if (onlyInStock) {
          results = results.filter((p) => p.in_stock);
        }

        // Client-side price filter if specified
        if (priceRange.min) {
          results = results.filter((p) => parseFloat(p.effective_price || p.price) >= parseFloat(priceRange.min));
        }
        if (priceRange.max) {
          results = results.filter((p) => parseFloat(p.effective_price || p.price) <= parseFloat(priceRange.max));
        }

        setProducts(results);
        setTotalCount(res.data.count || results.length);
        setTotalPages(res.data.total_pages || 1);
      } else {
        setProducts([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please check your connection.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, ordering, onlyNewArrivals, onlyInStock, priceRange, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Add to cart
  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.in_stock) {
      toast.warning("This product is currently out of stock.");
      return;
    }

    setAddingProductId(product.id);
    const result = await addToCart(product, 1);
    setAddingProductId(null);

    if (result.success) {
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error(result.message || "Failed to add to cart.");
    }
  };

  const handleCategorySelect = (cat) => {
    if (!cat) {
      setSelectedCategory(null);
      setCategoryTitle("All Products");
      navigate("/viewall/all-products");
    } else {
      setSelectedCategory(cat.id);
      setCategoryTitle(cat.name);
      navigate(`/viewall/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}`, {
        state: { categoryId: cat.id, categoryName: cat.name },
      });
    }
    setCurrentPage(1);
    setMobileFilterOpen(false);
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setCategoryTitle("All Products");
    setOnlyNewArrivals(false);
    setOnlyInStock(false);
    setPriceRange({ min: "", max: "" });
    setOrdering("-created_at");
    setCurrentPage(1);
    navigate("/viewall/all-products");
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
    return fallbackProductImg;
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 font-['Urbanist']">
      {/* Top Banner & Breadcrumb */}
      <div className="bg-white border-b border-border py-6 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-xs text-text-secondary mb-2 space-x-1.5">
            <Link to="/" className="hover:text-brand transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-text-secondary">Collections</span>
            <ChevronRight size={12} />
            <span className="text-text-main font-semibold">{categoryTitle}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight">
                {categoryTitle}
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Showing {products.length} of {totalCount} items
              </p>
            </div>

            {/* View Mode & Filter Trigger Buttons */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-lightBg hover:bg-brand/10 text-brand rounded-full text-xs font-semibold transition-colors border border-brand/20 shadow-2xs"
              >
                <Filter size={14} /> Filter
              </button>

              <div className="flex items-center border border-border rounded-full p-0.5 overflow-hidden bg-white shadow-2xs">
                <button
                  onClick={() => setGridView(true)}
                  className={`p-2 transition-colors ${gridView ? "bg-brand text-white" : "text-text-secondary hover:text-text-main"}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setGridView(false)}
                  className={`p-2 transition-colors ${!gridView ? "bg-brand text-white" : "text-text-secondary hover:text-text-main"}`}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>

              {/* Ordering Dropdown */}
              <div className="relative">
                <select
                  value={ordering}
                  onChange={(e) => {
                    setOrdering(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-border text-text-main text-xs font-medium rounded-full px-4 py-2 focus:outline-none focus:border-brand shadow-2xs"
                >
                  <option value="-created_at">Newest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-8">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
            <div className="bg-white p-5 rounded-card border border-border shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="font-bold text-text-main text-sm flex items-center gap-1.5">
                  <SlidersHorizontal size={16} className="text-brand" /> Filters
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-brand font-semibold hover:underline"
                >
                  Reset All
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3">
                  Categories
                </h4>
                <ul className="space-y-1.5">
                  <li>
                    <button
                      onClick={() => handleCategorySelect(null)}
                      className={`w-full text-left px-3 py-1.5 rounded-full text-xs transition-colors flex items-center justify-between ${
                        selectedCategory === null
                          ? "bg-brand/10 text-brand font-bold"
                          : "text-text-secondary hover:bg-warm hover:text-text-main"
                      }`}
                    >
                      <span>All Products</span>
                      {selectedCategory === null && <Check size={12} />}
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => handleCategorySelect(cat)}
                        className={`w-full text-left px-3 py-1.5 rounded-full text-xs transition-colors flex items-center justify-between ${
                          selectedCategory === cat.id
                            ? "bg-brand/10 text-brand font-bold"
                            : "text-text-secondary hover:bg-warm hover:text-text-main"
                        }`}
                      >
                        <span>{cat.name}</span>
                        {selectedCategory === cat.id && <Check size={12} />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status checkboxes */}
              <div className="pt-4 border-t border-border space-y-3">
                <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2">
                  Availability & Tags
                </h4>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-text-main">
                  <input
                    type="checkbox"
                    checked={onlyNewArrivals}
                    onChange={(e) => {
                      setOnlyNewArrivals(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="rounded text-brand focus:ring-brand w-4 h-4"
                  />
                  <span>New Arrivals Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-text-main">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="rounded text-brand focus:ring-brand w-4 h-4"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid / List Section */}
          <main className="flex-1 min-w-0">
            {loading ? (
              /* Skeletons */
              <div
                className={`grid ${
                  gridView ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                } gap-6`}
              >
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-card border border-border p-4 animate-pulse space-y-3"
                  >
                    <div className="aspect-square bg-lightBg rounded-xl"></div>
                    <div className="h-4 bg-lightBg rounded w-3/4"></div>
                    <div className="h-3 bg-lightBg rounded w-1/2"></div>
                    <div className="h-8 bg-lightBg rounded w-full mt-4"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-card border border-red-100 p-8 text-center space-y-4 shadow-xs">
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-full text-xs font-semibold hover:bg-brand-hover shadow-brand/20 transition-all"
                >
                  <RefreshCw size={14} /> Retry Loading
                </button>
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                title="No products found"
                description="We couldn't find any products matching your current category or filters. Try adjusting your selections."
                buttonText="Reset All Filters"
                onAction={clearAllFilters}
              />
            ) : (
              <div
                className={`grid ${
                  gridView ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                } gap-6`}
              >
                {products.map((product) => {
                  const productImg = getProductImage(product);
                  const price = parseFloat(product.price || 0);
                  const effectivePrice = parseFloat(product.effective_price || product.discount_price || price);
                  const hasDiscount = effectivePrice < price;
                  const discountPercent = hasDiscount
                    ? Math.round(((price - effectivePrice) / price) * 100)
                    : 0;

                  return (
                    <div
                      key={product.id}
                      className={`group bg-white rounded-card border border-border overflow-hidden shadow-xs hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex ${
                        !gridView ? "flex-col sm:flex-row items-center p-4 gap-6" : "flex-col"
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <Link
                        to={`/product/${product.id || product.slug}`}
                        className={`relative block overflow-hidden bg-warm flex-shrink-0 ${
                          !gridView ? "w-full sm:w-48 h-48 rounded-xl" : "aspect-square w-full"
                        }`}
                      >
                        <img
                          src={productImg}
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackProductImg;
                          }}
                          className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-500"
                          loading="lazy"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {product.new_arrival && (
                            <span className="px-2.5 py-0.5 bg-brand text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-xs">
                              New
                            </span>
                          )}
                          {hasDiscount && (
                            <span className="px-2.5 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-xs">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        {!product.in_stock && (
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="p-5 flex-1 flex flex-col justify-between w-full">
                        <div>
                          <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                            <span className="font-semibold text-sage-dark uppercase tracking-wider truncate max-w-[150px]">
                              {product.category_name || "Cosmetics"}
                            </span>
                            <div className="flex items-center gap-1 text-gold font-semibold">
                              <Star size={13} fill="currentColor" />
                              <span>{parseFloat(product.average_rating || 5.0).toFixed(1)}</span>
                            </div>
                          </div>

                          <Link
                            to={`/product/${product.id || product.slug}`}
                            className="block font-bold text-text-main text-sm md:text-base group-hover:text-brand transition-colors line-clamp-2"
                          >
                            {product.name}
                          </Link>

                          {!gridView && product.description && (
                            <p className="text-xs text-text-secondary line-clamp-2 mt-2 leading-relaxed">
                              {product.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-base sm:text-lg font-bold text-brand">
                                ₹{effectivePrice.toFixed(2)}
                              </span>
                              {hasDiscount && (
                                <span className="text-xs text-text-secondary line-through">
                                  ₹{price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={!product.in_stock || addingProductId === product.id}
                            className={`p-2.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-brand/20 ${
                              !product.in_stock
                                ? "bg-warm-300 text-text-secondary cursor-not-allowed"
                                : addingProductId === product.id
                                ? "bg-brand-dark text-white opacity-90"
                                : "bg-brand hover:bg-brand-hover text-white hover:scale-105 active:scale-95"
                            }`}
                          >
                            <ShoppingCart size={14} />
                            <span className="hidden sm:inline">
                              {addingProductId === product.id ? "Adding..." : "Add to Cart"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-1.5 border border-border rounded-full text-xs font-medium text-text-main hover:bg-warm disabled:opacity-40 transition-colors bg-white cursor-pointer"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      currentPage === i + 1
                        ? "bg-brand text-white shadow-brand/30"
                        : "bg-white border border-border text-text-main hover:bg-warm"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-1.5 border border-border rounded-full text-xs font-medium text-text-main hover:bg-warm disabled:opacity-40 transition-colors bg-white cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Drawer Filter */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] lg:hidden flex justify-end animate-fade-in"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className="w-80 bg-white h-full p-6 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                <h3 className="font-bold text-text-main text-base flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-brand" /> Filter Products
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-text-main hover:bg-lightBg transition-colors"
                  aria-label="Close Filter"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3">
                    Categories
                  </h4>
                  <ul className="space-y-1.5">
                    <li>
                      <button
                        onClick={() => handleCategorySelect(null)}
                        className={`w-full text-left px-3.5 py-2 rounded-full text-xs transition-colors flex items-center justify-between ${
                          selectedCategory === null ? "bg-lightBg text-brand font-bold" : "text-text-secondary hover:bg-lightBg/50"
                        }`}
                      >
                        <span>All Products</span>
                        {selectedCategory === null && <Check size={14} />}
                      </button>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <button
                          onClick={() => handleCategorySelect(cat)}
                          className={`w-full text-left px-3.5 py-2 rounded-full text-xs transition-colors flex items-center justify-between ${
                            selectedCategory === cat.id ? "bg-lightBg text-brand font-bold" : "text-text-secondary hover:bg-lightBg/50"
                          }`}
                        >
                          <span>{cat.name}</span>
                          {selectedCategory === cat.id && <Check size={14} />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-2">
                    Availability
                  </h4>
                  <label className="flex items-center gap-2.5 text-xs text-text-main cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyNewArrivals}
                      onChange={(e) => {
                        setOnlyNewArrivals(e.target.checked);
                        setCurrentPage(1);
                      }}
                      className="rounded text-brand focus:ring-brand accent-[#1B5E20] w-4 h-4"
                    />
                    <span>New Arrivals Only</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-text-main cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="rounded text-brand focus:ring-brand accent-[#1B5E20] w-4 h-4"
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border mt-6">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-brand hover:bg-brand-hover text-white rounded-full text-xs font-bold shadow-brand/30 transition-all hover:scale-102 active:scale-98"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAll;