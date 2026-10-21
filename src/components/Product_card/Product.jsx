import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../Axios/axiosInstance";
import URL from "../../Axios/URL";
import { useCart } from "../Context/CartContext";
import { toast } from "react-toastify";

import frist from "../../assets/image/Product/product1.svg";
import second from "../../assets/image/Product/product2.svg";

const Product = () => {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        const res = await api.get("catalog/products/");
        if (isMounted && res.data?.results && res.data.results.length >= 2) {
          setFeaturedProducts(res.data.results.slice(0, 2));
        }
      } catch (err) {
        console.error("Error fetching featured showcase products:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const showcaseItems =
    featuredProducts.length >= 2
      ? featuredProducts.map((p, idx) => ({
          id: p.id,
          name: p.name,
          tagline: p.brand || "Lovixa Signature",
          description: p.description || (idx === 0 ? "A fragrance that feels right every day occasion or not." : "A bold and majestic formulation crafted for radiance."),
          image: p.primary_image ? (p.primary_image.startsWith("http") ? p.primary_image : `${URL.PHOTO_URL}${p.primary_image}`) : (idx === 0 ? frist : second),
          price: p.effective_price || p.price,
          rawProduct: p,
        }))
      : [
          {
            id: 1,
            name: "Radiance Vitamin C Serum",
            tagline: "Cellular Glow Magic",
            description: "Deep hydration infused with botanical Kakadu Plum extracts.",
            image: frist,
            price: 699,
          },
          {
            id: 5,
            name: "Jasmine Bloom Eau De Parfum",
            tagline: "Lovixa Noir Signature",
            description: "A bold and majestic scent crafted for every special occasion.",
            image: second,
            price: 1199,
          },
        ];

  const [addingId, setAddingId] = useState(null);

  const handleAddToCart = async (item) => {
    setAddingId(item.id);
    const res = await addToCart(item.rawProduct || item, 1);
    setAddingId(null);
    if (res.success) {
      toast.success(`${item.name} added to cart!`);
    } else {
      toast.error(res.message || "Could not add to cart");
    }
  };

  return (
    <div className="w-full bg-white py-16 px-4 font-['Urbanist'] border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {showcaseItems.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-card shadow-card group h-96 hover:shadow-card-hover transition-all duration-500"
            >
              <div className="relative h-full w-full bg-black">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = frist;
                  }}
                  className="w-full h-full object-cover opacity-75 group-hover:scale-108 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                  <span className="text-gold text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                    {item.tagline}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">{item.name}</h2>
                  <p className="text-xs text-white/80 mb-4 line-clamp-2 max-w-md">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      disabled={addingId === item.id}
                      className="bg-brand hover:bg-brand-hover text-white py-3 px-6 rounded-full font-bold text-xs transition-all duration-300 shadow-brand/40 hover:shadow-brand/60 hover:scale-105 active:scale-95 disabled:opacity-70 flex items-center gap-2"
                      onClick={() => handleAddToCart(item)}
                    >
                      <span>{addingId === item.id ? "Adding..." : `Shop Now — ₹${item.price}`}</span>
                    </button>
                    <Link
                      to={`/product/${item.id}`}
                      className="text-xs text-white/85 hover:text-white underline font-semibold transition-colors hover:translate-x-0.5"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
