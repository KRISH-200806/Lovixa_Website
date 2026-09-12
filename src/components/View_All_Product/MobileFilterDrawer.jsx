// File: src/components/category/MobileFilterDrawer.jsx

import React from 'react';
import { X } from 'lucide-react';
import FilterOptions from './FilterOptions';

const MobileFilterDrawer = ({ isOpen, onClose, sortBy, setSortBy, priceRange, setPriceRange }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300" onClick={onClose}>
            <div
                className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-4 overflow-y-auto transform transition-transform duration-500"
                style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-600">Refine Results</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 hover:bg-slate-100 transition-colors duration-300"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Sort Options */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-medium mb-3 text-gray-700">Sort by</h4>
                    <div className="space-y-2">
                        {['Featured', 'Price: Low to High', 'Price: High to Low', 'Highest Rated', 'Newest'].map((option, idx) => (
                            <label key={idx} className="flex items-center">
                                <input
                                    type="radio"
                                    name="sortMobile"
                                    className="form-radio h-4 w-4 text-slate-500"
                                    checked={sortBy === option.toLowerCase().replace(/:\s+/g, '-')}
                                    onChange={() => setSortBy(option.toLowerCase().replace(/:\s+/g, '-'))}
                                />
                                <span className="ml-2 text-gray-700">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Filter Options */}
                <FilterOptions priceRange={priceRange} setPriceRange={setPriceRange} />

                <div className="mt-6 sticky bottom-0 bg-white pt-4 pb-4">
                    <button
                        className="w-full py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-md font-medium hover:from-slate-600 hover:to-slate-700 transition duration-300 shadow-md"
                        onClick={onClose}
                    >
                        Show Results
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileFilterDrawer;