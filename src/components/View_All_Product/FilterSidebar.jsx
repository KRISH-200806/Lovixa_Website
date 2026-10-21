// File: src/components/category/FilterSidebar.jsx

import React from 'react';
import FilterOptions from './FilterOptions';

const FilterSidebar = ({ priceRange, setPriceRange }) => {
    return (
        <aside className="hidden lg:block w-64 sticky top-4 self-start transition-all duration-500">
            <div className="bg-white p-5 border rounded-lg shadow-sm hover:shadow-md transition duration-300">
                <h3 className="font-semibold text-lg mb-4 pb-2 border-b border-gray-100 text-slate-600">Filter Products</h3>
                <FilterOptions priceRange={priceRange} setPriceRange={setPriceRange} />
            </div>
        </aside>
    );
};

export default FilterSidebar;