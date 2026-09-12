// File: src/components/category/ProductCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, index, gridView, onAddToCart }) => {
    return (
        <div
            className={`group bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 ${!gridView && 'flex flex-col md:flex-row'} transform hover:-translate-y-1`}
            style={{
                animationDelay: `${(index + 1) * 100}ms`,
                animation: 'fade-in 0.6s ease-out forwards'
            }}
        >
            {/* Product Image with Overlay */}
            <div className={`relative ${!gridView && 'md:w-1/3'}`}>
                <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                    />
                </div>

                {/* Quick Shop Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500 flex items-center justify-center">
                    <Link className="bg-white/90 backdrop-blur-sm text-gray-800 font-medium px-4 py-2 rounded-full transform translate-y-8 group-hover:translate-y-0 transition duration-500 shadow-lg hover:bg-white" to="/product">
                        Quick View
                    </Link>
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                    {product.isNew && (
                        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-3 py-0.5 rounded-full font-medium shadow-sm">New</span>
                    )}
                    {product.isBestseller && (
                        <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-3 py-0.5 rounded-full font-medium shadow-sm">Bestseller</span>
                    )}
                </div>

                {/* Wishlist button */}
                <button className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-500 transform rotate-12 group-hover:rotate-0 hover:bg-slate-50">
                    <Heart size={16} className="text-gray-600 hover:text-slate-500 transition duration-300" />
                </button>
            </div>

            {/* Product Info */}
            <div className={`p-4 flex flex-col ${!gridView && 'md:w-2/3'}`}>
                <h3 className="font-medium text-gray-800 mb-1 text-sm md:text-base transition-colors duration-300 group-hover:text-slate-600">{product.name}</h3>

                {/* Rating */}
                <div className="flex items-center mb-2">
                    <div className="flex items-center text-amber-400">
                        <Star size={12} fill="currentColor" />
                        <span className="ml-1 text-xs font-medium">{product.rating}</span>
                    </div>
                    <span className="mx-1 text-gray-300">|</span>
                    <span className="text-xs text-gray-500">{product.reviewCount} reviews</span>
                </div>

                {/* Price */}
                <div className="flex items-center mb-3">
                    <span className="font-semibold text-gray-800">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                        <>
                            <span className="ml-2 text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                            <span className="ml-2 text-xs font-medium px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-sm">
                                {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                            </span>
                        </>
                    )}
                </div>

                {/* Add to cart button */}
                <button
                    onClick={() => onAddToCart(product)}
                    className="mt-auto w-full bg-[#B4945E] text-white py-2 px-4 rounded-md transition-all duration-500 text-sm flex items-center justify-center overflow-hidden relative"
                >
                    <span className="group-hover:translate-y-0 translate-y-0 transition-transform duration-300 flex items-center">
                        <ShoppingCart size={14} className="mr-2" />
                        Add to Cart
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;