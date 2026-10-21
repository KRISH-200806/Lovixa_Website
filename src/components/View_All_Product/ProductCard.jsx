// File: src/components/category/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, index, gridView, onAddToCart }) => {
    return (
        <div
            className={`group bg-white border border-border rounded-card overflow-hidden shadow-xs hover:shadow-card-hover transition-all duration-500 ${!gridView && 'flex flex-col md:flex-row'} transform hover:-translate-y-1.5`}
            style={{
                animationDelay: `${(index + 1) * 100}ms`,
                animation: 'fade-in 0.6s ease-out forwards'
            }}
        >
            {/* Product Image with Overlay */}
            <div className={`relative ${!gridView && 'md:w-1/3'}`}>
                <div className="aspect-square overflow-hidden bg-warm">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-108 transition duration-700"
                    />
                </div>

                {/* Quick Shop Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500 flex items-center justify-center">
                    <Link className="bg-white/95 backdrop-blur-xs text-text-main font-semibold px-4 py-2 rounded-full transform translate-y-8 group-hover:translate-y-0 transition duration-500 shadow-card hover:bg-brand hover:text-white" to="/product">
                        Quick View
                    </Link>
                </div>

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col space-y-1">
                    {product.isNew && (
                        <span className="bg-brand text-white text-xs px-3 py-0.5 rounded-full font-bold shadow-xs">New</span>
                    )}
                    {product.isBestseller && (
                        <span className="bg-gold text-white text-xs px-3 py-0.5 rounded-full font-bold shadow-xs">Bestseller</span>
                    )}
                </div>

                {/* Wishlist button */}
                <button className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs rounded-full p-2 shadow-xs opacity-0 group-hover:opacity-100 transition-all duration-500 transform rotate-12 group-hover:rotate-0 hover:bg-warm">
                    <Heart size={16} className="text-text-secondary hover:text-brand transition duration-300" />
                </button>
            </div>

            {/* Product Info */}
            <div className={`p-5 flex flex-col ${!gridView && 'md:w-2/3'}`}>
                <h3 className="font-semibold text-text-main mb-1 text-sm md:text-base transition-colors duration-300 group-hover:text-brand">{product.name}</h3>

                {/* Rating */}
                <div className="flex items-center mb-2">
                    <div className="flex items-center text-gold">
                        <Star size={12} fill="currentColor" />
                        <span className="ml-1 text-xs font-semibold">{product.rating}</span>
                    </div>
                    <span className="mx-1 text-border">|</span>
                    <span className="text-xs text-text-secondary">{product.reviewCount} reviews</span>
                </div>

                {/* Price */}
                <div className="flex items-center mb-3">
                    <span className="font-bold text-brand text-base">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                        <>
                            <span className="ml-2 text-xs text-text-secondary line-through">₹{product.originalPrice}</span>
                            <span className="ml-2 text-xs font-bold px-2 py-0.5 bg-sage/15 text-sage-dark border border-sage/30 rounded-full">
                                {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                            </span>
                        </>
                    )}
                </div>

                {/* Add to cart button */}
                <button
                    onClick={() => onAddToCart(product)}
                    className="mt-auto w-full bg-brand hover:bg-brand-hover text-white py-2.5 px-4 rounded-full transition-all duration-300 text-xs font-bold flex items-center justify-center overflow-hidden shadow-brand/20 hover:scale-102 active:scale-98"
                >
                    <span className="flex items-center gap-1.5">
                        <ShoppingCart size={14} />
                        Add to Cart
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;