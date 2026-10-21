import React, { useState, useEffect } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../Axios/axiosInstance";
import URL from "../../Axios/URL";

// High quality fallback images for cosmetics categories
import skincareImg from "../../assets/image/lazina.jpg";
import perfumeImg from "../../assets/image/satwan.png";
import comboImg from "../../assets/image/combo.png";
import signatureImg from "../../assets/image/signature.jpg";

const fallbackCategoryImages = {
  skincare: skincareImg,
  "lip-care": comboImg,
  "mother-baby-care": skincareImg,
  fragrances: perfumeImg,
  default: signatureImg,
};

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("catalog/categories/");
        
        if (isMounted) {
          if (response.data && Array.isArray(response.data.results)) {
            setCategories(response.data.results);
          } else if (Array.isArray(response.data)) {
            setCategories(response.data);
          } else {
            setCategories([]);
          }
        }
      } catch (err) {
        console.error("Error fetching categories from backend:", err);
        if (isMounted) {
          setError("Failed to load categories.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Card tilt effect handler
  const handleMouseMove = (e, index) => {
    const card = document.querySelector(`.category-card-${index}`);
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 12;
    const rotateY = (centerX - x) / 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const handleMouseLeave = (index) => {
    const card = document.querySelector(`.category-card-${index}`);
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  const getCategoryImage = (cat, index) => {
    if (cat.image) {
      if (cat.image.startsWith("http")) return cat.image;
      return `${URL.PHOTO_URL}${cat.image.startsWith("/") ? "" : "/"}${cat.image}`;
    }
    const slugKey = cat.slug || "";
    if (fallbackCategoryImages[slugKey]) return fallbackCategoryImages[slugKey];

    const fallbackList = [skincareImg, comboImg, signatureImg, perfumeImg];
    return fallbackList[index % fallbackList.length];
  };

  return (
    <section className="py-20 relative overflow-hidden bg-white font-['Urbanist'] border-b border-border">
      {/* Background Decorative Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-10 w-96 h-96 rounded-full bg-brand/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-[500px] h-[500px] rounded-full bg-brand/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-badge bg-lightBg text-brand border border-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} className="text-gold" />
            Pure & Organic Collections
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-main tracking-tight">
            Shop By Category
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-sm md:text-base">
            Explore our curated collections of radiant skincare, artisanal fragrances, and gentle mother care formulations.
          </p>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-card bg-lightBg animate-pulse relative overflow-hidden"
              >
                <div className="absolute inset-x-0 bottom-0 p-6 space-y-3">
                  <div className="h-6 bg-brand/10 rounded w-3/4"></div>
                  <div className="h-4 bg-brand/10 rounded w-1/2"></div>
                  <div className="h-8 bg-brand/10 rounded w-28 mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error && categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-card border border-border p-8 max-w-lg mx-auto shadow-card">
            <p className="text-text-secondary mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-brand text-white rounded-full text-sm font-semibold hover:bg-brand-hover transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const bgImg = getCategoryImage(category, index);
              const targetSlug = category.slug || category.name.toLowerCase().replace(/\s+/g, "-");

              return (
                <div
                  key={category.id}
                  className="perspective-container"
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => {
                    setActiveIndex(null);
                    handleMouseLeave(index);
                  }}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                >
                  <Link
                    to={`/viewall/${targetSlug}`}
                    state={{ categoryId: category.id, categoryName: category.name }}
                    className={`category-card-${index} block relative h-96 rounded-card overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 group border border-border/60`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${bgImg})` }}
                    ></div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

                    {/* Badge */}
                    {category.products_count !== undefined && (
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold rounded-full uppercase tracking-wider border border-white/30 shadow-xs">
                          {category.products_count} {category.products_count === 1 ? "Product" : "Products"}
                        </span>
                      </div>
                    )}

                    {/* Decorative Corner Element */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/30 transform group-hover:rotate-45 transition-transform duration-500 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    </div>

                    {/* Card Content */}
                    <div
                      className="absolute inset-x-0 bottom-0 z-20 p-6 transform transition-all duration-500"
                      style={{ transform: activeIndex === index ? "translateZ(30px)" : "translateZ(0)" }}
                    >
                      <h3 className="text-2xl font-bold text-white mb-1.5 group-hover:text-gold transition-colors">
                        {category.name}
                      </h3>

                      <p className="text-white/80 text-xs line-clamp-2 mb-4 leading-relaxed font-light">
                        {category.description || "Discover premium skincare, fragrances & beauty care tailored for you."}
                      </p>

                      <div className="inline-flex items-center text-xs font-semibold text-white bg-brand px-5 py-2.5 rounded-full group-hover:bg-brand-hover transition-all duration-300 shadow-brand/40 group-hover:scale-105 active:scale-95">
                        <span>Explore Collection</span>
                        <ChevronRight size={14} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Category;