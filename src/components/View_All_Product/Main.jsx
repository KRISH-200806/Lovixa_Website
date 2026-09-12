// File: src/components/category/Main.jsx

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Filter, Star, ShoppingCart, Heart, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// Component imports

import ProductCard from "../View_All_Product/ProductCard";
import FilterSidebar from "../View_All_Product/FilterSidebar";
import MobileFilterDrawer from "../View_All_Product/MobileFilterDrawer";
import Pagination from "../View_All_Product/Pagination";



// Import product data
// import { products } from '../../data/productData';


const Main = () => {
    // --- State Management ---
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [sortBy, setSortBy] = useState('featured');
    const [gridView, setGridView] = useState(true);
    
    // Cart state
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    // --- Cart Functions ---
    const addToCart = (product) => {
        const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

        if (existingItemIndex >= 0) {
            const updatedItems = [...cartItems];
            updatedItems[existingItemIndex].quantity += 1;
            setCartItems(updatedItems);
        } else {
            setCartItems([...cartItems, {
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                variant: 'Default',
                quantity: 1
            }]);
        }

        setIsCartOpen(true);
    };

    const updateQuantity = (id, newQuantity) => {
        const updatedItems = cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    // --- Scroll Position Management ---
    useEffect(() => {
        const handleBeforeUnload = () => {
            sessionStorage.setItem('scrollPosition', window.scrollY);
        };

        const restoreScrollPosition = () => {
            const scrollPosition = sessionStorage.getItem('scrollPosition');
            if (scrollPosition) {
                window.scrollTo(0, parseInt(scrollPosition));
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        setTimeout(restoreScrollPosition, 100);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // --- Render Functions ---
    const renderHeader = () => (
        <div className="bg-white py-6 shadow-lg border-b-4 border-[#B4945E]">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-r from-slate-500 to-purple-600 bg-clip-text text-transparent">
                    Attar Collection
                </h1>
                <p className="text-center mt-4 max-w-3xl mx-auto text-gray-600 text-sm md:text-base italic">
                    Discover our exclusive range of traditional and modern attars, crafted with the finest natural ingredients for a lasting fragrance experience.
                </p>
            </div>
        </div>
    );

    const renderBreadcrumbs = () => (
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center text-sm text-gray-500">
                <a href="#" className="hover:text-slate-500 transition duration-300">Home</a>
                <ChevronRight size={14} className="mx-2" />
                <span className="font-medium text-gray-800">Attar Collection</span>
            </div>
        </div>
    );

    const renderMobileFilterToggle = () => (
        <div className="lg:hidden sticky top-0 z-10 bg-gray-50 pb-4">
            <button
                className="w-full flex items-center justify-between bg-white p-3 border rounded-md shadow-sm hover:shadow-md transition duration-300"
                onClick={() => setFiltersOpen(!filtersOpen)}
            >
                <span className="flex items-center font-medium">
                    <Filter size={16} className="mr-2 text-slate-500" />
                    Filters & Sort
                </span>
                {filtersOpen ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
            </button>
        </div>
    );

    const renderSortingControls = () => (
        <div className="hidden md:flex justify-between items-center mb-6 bg-white p-4 border rounded-lg shadow-sm">
            <div>
                <label className="text-gray-700 mr-2">Sort by:</label>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-md p-1.5 text-gray-600 focus:outline-none focus:ring-1 focus:ring-slate-500 bg-gray-50"
                >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                </select>
            </div>

            <div className="flex items-center">
                <span className="text-gray-700 mr-3">View:</span>
                <div className="flex border rounded-md overflow-hidden">
                    <button
                        className={`p-2 ${gridView ? 'bg-slate-100 text-slate-500' : 'bg-white text-gray-500'} transition duration-300`}
                        onClick={() => setGridView(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <button
                        className={`p-2 ${!gridView ? 'bg-slate-100 text-slate-500' : 'bg-white text-gray-500'} transition duration-300`}
                        onClick={() => setGridView(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );

    // const renderProductsGrid = () => (
    //     <div className={`grid ${gridView ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
    //         {products.map((product, index) => (
    //             <ProductCard 
    //                 key={product.id}
    //                 product={product} 
    //                 index={index}
    //                 gridView={gridView}
    //                 onAddToCart={addToCart}
    //             />
    //         ))}
    //     </div>
    // );

    // --- Main Render ---
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Header */}
            {renderHeader()}

            {/* Breadcrumb */}
            {renderBreadcrumbs()}

            {/* Product Filtering and Listing */}
            <div className="container mx-auto px-4 py-6 md:py-8">
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                    {/* Mobile Filters Toggle */}
                    {renderMobileFilterToggle()}

                    {/* Mobile Filters Drawer */}
                    <MobileFilterDrawer 
                        isOpen={filtersOpen}
                        onClose={() => setFiltersOpen(false)}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                    />

                    {/* Desktop Filters - Sidebar */}
                    <FilterSidebar 
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                    />

                    {/* Product List */}
                    <div className="flex-1">
                        {/* Desktop Sorting and View Options */}
                        {renderSortingControls()}

                        {/* Products Results Counter */}
                        {/* <div className="mb-4 text-sm text-gray-600">
                            Showing <span className="font-semibold text-slate-600">{products.length}</span> products
                        </div> */}

                        {/* Products Grid/List */}
                        {/* {renderProductsGrid()} */}

                        {/* Pagination */}
                        <Pagination />
                    </div>
                </div>
            </div>

            {/* Cart Panel */}
            {/* <CartPanel
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
            /> */}

            {/* CSS for animations */}
            <style jsx>{`
                @keyframes fade-in {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Main;