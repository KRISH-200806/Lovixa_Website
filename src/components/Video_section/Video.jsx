import React, { useState, useRef } from "react";
import Sample1 from "../../assets/Video/sample1.mp4";
import Sample2 from "../../assets/Video/sample2.mp4";
import Sample3 from "../../assets/Video/sample3.mp4";
import Sample4 from "../../assets/Video/sample4.mp4";
import Sample5 from "../../assets/Video/sample5.mp4";
import VideoPopup from "./VideoPopup"; // Importing the popup component

const Video = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Sample product data (Replace with API data later)
  const sampleProducts = [
    {
      id: 1,
      name: "Captivating Trio 3 Pcs Set of Premium Perfume Spray",
      currentPrice: 999,
      originalPrice: 1499,
      videoUrl: Sample1,
      description: "Experience luxury with our premium perfume spray set that brings together three captivating fragrances.",
      features: [
        "Long-lasting fragrance",
        "Premium quality ingredients",
        "Beautiful packaging",
        "Perfect gift option"
      ]
    },
    {
      id: 2,
      name: "Top 5 Attars",
      currentPrice: 399,
      originalPrice: 599,
      videoUrl: Sample2,
      description: "A collection of our top 5 attar fragrances, perfect for those who appreciate traditional scents.",
      features: [
        "100% Pure Premium Quality Non-Alcoholic Attar",
        "Long-lasting aroma",
        "Natural ingredients",
        "Luxury packaging"
      ]
    },
    {
      id: 3,
      name: "Assorted Luxury Attar Perfume Gift Set (6 × 5.5Ml)",
      currentPrice: 1499,
      originalPrice: 2099,
      videoUrl: Sample3,
      description: "An elegant gift set featuring six luxurious attar perfumes in convenient 5.5ml bottles.",
      features: [
        "6 different premium fragrances",
        "Elegant gift packaging",
        "Non-alcoholic formula",
        "Concentrated perfume oils"
      ]
    },
    {
      id: 4,
      name: "Captivating Trio 3 Pcs Set of Premium Perfume Spray",
      currentPrice: 999,
      originalPrice: 1499,
      videoUrl: Sample4,
      description: "Our best-selling trio of premium perfume sprays, each with its unique captivating scent.",
      features: [
        "Convenient spray bottle",
        "Travel-friendly size",
        "Premium fragrance notes",
        "Long-lasting effect"
      ]
    },
    {
      id: 5,
      name: "Top 5 Attars",
      currentPrice: 399,
      originalPrice: 599,
      videoUrl: Sample5,
      description: "A new range of luxurious-looking bottles that are filled with premium attar gives you a royal feeling.",
      features: [
        "100% Pure Premium Quality Non-Alcoholic Attar",
        "Unique blend of fragrances",
        "Attractive packaging",
        "Long-lasting aroma"
      ]
    },
  ];

  const handleVideoClick = (product) => {

    
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto p-4 py-8 font-['Urbanist']">
      <div className="text-center mb-8">
        <span className="text-sage text-xs font-bold uppercase tracking-widest block mb-1">
          Fragrance in Motion
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-main">
          Lovixa Premium Fragrance Showcase
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} onClick={() => handleVideoClick(product)} />
        ))}
      </div>

      {showPopup && selectedProduct && (
        <VideoPopup product={selectedProduct} onClose={closePopup} />
      )}
    </div>
  );
};

// ProductCard Component (Prevents Video Refresh on Render)
const ProductCard = ({ product, onClick }) => {
  return (
    <div className="cursor-pointer shadow-card hover:shadow-lg rounded-2xl bg-pure border border-stone-200/70 overflow-hidden transform hover:-translate-y-1 transition duration-300" onClick={onClick}>
      <div className="relative">
        <video autoPlay loop muted playsInline className="w-full h-80 object-cover">
          <source src={product.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-text-main line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center mt-1.5">
          <span className="text-base font-extrabold text-brand">₹{product.currentPrice}</span>
          <span className="ml-2 text-xs text-text-secondary line-through">₹{product.originalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default Video;