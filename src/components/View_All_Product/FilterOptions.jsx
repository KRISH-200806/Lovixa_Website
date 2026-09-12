import React, { useState, useEffect } from 'react';

const FilterOptions = ({ 
  priceRange, 
  setPriceRange, 
  categories, 
  setCategories, 
  scentProfiles, 
  setScentProfiles,
  onFilterChange,
  isLoading = false
}) => {
  const [selectedCategories, setSelectedCategories] = useState({});
  const [selectedScents, setSelectedScents] = useState({});
  const [localPriceRange, setLocalPriceRange] = useState(priceRange || [0, 2000]);
  
  // Initialize from props or fetch from API
  useEffect(() => {
    if (priceRange) {
      setLocalPriceRange(priceRange);
    }
    
    // Initialize selected categories from props
    if (categories) {
      const initialCategories = {};
      categories.forEach(cat => {
        initialCategories[cat.name] = cat.selected || false;
      });
      setSelectedCategories(initialCategories);
    }   
    
    // Initialize selected scent profiles from props
    if (scentProfiles) {
      const initialScents = {};
      scentProfiles.forEach(scent => {
        initialScents[scent.name] = scent.selected || false;
      });
      setSelectedScents(initialScents);
    }
  }, [priceRange, categories, scentProfiles]);

  // Handle category selection
  const handleCategoryChange = (name) => {
    const updated = {
      ...selectedCategories,
      [name]: !selectedCategories[name]
    };
    setSelectedCategories(updated);
    
    // Notify parent component about filter change
    if (onFilterChange) {
      onFilterChange({
        type: 'category',
        value: {
          name,
          selected: updated[name]
        }
      });
    }
  };

  // Handle scent profile selection
  const handleScentChange = (name) => {
    const updated = {
      ...selectedScents,
      [name]: !selectedScents[name]
    };
    setSelectedScents(updated);
    
    // Notify parent component about filter change
    if (onFilterChange) {
      onFilterChange({
        type: 'scent',
        value: {
          name,
          selected: updated[name]
        }
      });
    }
  };

  // Handle price range change
  const handlePriceChange = (index, value) => {
    const newRange = [...localPriceRange];
    newRange[index] = parseInt(value);
    
    // Ensure min <= max
    if (index === 0 && value > localPriceRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < localPriceRange[0]) {
      newRange[0] = value;
    }
    
    setLocalPriceRange(newRange);
    
    // Update parent component
    if (setPriceRange) {
      setPriceRange(newRange);
    }
    
    // Notify parent component about filter change
    if (onFilterChange) {
      onFilterChange({
        type: 'price',
        value: newRange
      });
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    // Reset price range
    const defaultRange = [0, 2000];
    setLocalPriceRange(defaultRange);
    if (setPriceRange) {
      setPriceRange(defaultRange);
    }
    
    // Reset categories
    const clearedCategories = {};
    Object.keys(selectedCategories).forEach(key => {
      clearedCategories[key] = false;
    });
    setSelectedCategories(clearedCategories);
    
    // Reset scent profiles
    const clearedScents = {};
    Object.keys(selectedScents).forEach(key => {
      clearedScents[key] = false;
    });
    setSelectedScents(clearedScents);
    
    // Notify parent component
    if (onFilterChange) {
      onFilterChange({
        type: 'clear',
        value: null
      });
    }
  };

  // Default categories if not provided
  const defaultCategories = [
    { name: 'Roll On', count: 24 },
    { name: 'Spray', count: 18 },
    { name: 'Traditional', count: 12 }
  ];

  // Default scent profiles if not provided
  const defaultScentProfiles = [
    { name: 'Woody', count: 15, color: 'bg-amber-700' },
    { name: 'Floral', count: 22, color: 'bg-pink-400' },
    { name: 'Oriental', count: 18, color: 'bg-purple-600' },
    { name: 'Citrus', count: 10, color: 'bg-yellow-400' }
  ];

  const categoryList = categories || defaultCategories;
  const scentList = scentProfiles || defaultScentProfiles;

  return (
    <div className={`transition duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      {/* Price Range - Modern Dual Range Slider Look */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Price Range
        </h4>
        <div className="flex items-center justify-between mb-2 text-sm font-medium">
          <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700">₹{localPriceRange[0]}</span>
          <span className="text-gray-400 text-xs">to</span>
          <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700">₹{localPriceRange[1]}</span>
        </div>
        
        {/* Min price slider */}
        <div className="relative mb-4">
          <input
            type="range"
            min="0"
            max="2000"
            value={localPriceRange[0]}
            onChange={(e) => handlePriceChange(0, e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#B4945E]"
          />
          <div className="absolute inset-0 flex items-center pointer-events-none">
            <div
              className="h-2 bg-gray-200 rounded-lg"
              style={{ width: `${(localPriceRange[0] / 2000) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Max price slider */}
        <div className="relative">
          <input
            type="range"
            min="0"
            max="2000"
            value={localPriceRange[1]}
            onChange={(e) => handlePriceChange(1, e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#B4945E]"
          />
          <div className="absolute inset-0 flex items-center pointer-events-none">
            <div
              className="h-2 bg-gradient-to-r from-slate-300 to-[#B4945E] rounded-lg"
              style={{ width: `${(localPriceRange[1] / 2000) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Categories - Enhanced with icons */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Categories
        </h4>
        <div className="space-y-2">
          {categoryList.map((category, idx) => (
            <label key={idx} className="flex items-center group cursor-pointer transition duration-300">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-slate-500 rounded      duration-300"
                checked={selectedCategories[category.name] || false}
                onChange={() => handleCategoryChange(category.name)}
              />
              <span className="ml-2 text-gray-700 text-sm group-hover:text-slate-600 transition duration-300">
                {category.name}
              </span>
              <span className="ml-auto text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 group-hover:bg-slate-100 group-hover:text-slate-600 transition duration-300">
                {category.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Scent Profiles - With color indicators */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Scent Profiles
        </h4>
        <div className="space-y-2">
          {scentList.map((scent, idx) => (
            <label key={idx} className="flex items-center group cursor-pointer">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-4 w-4 text-slate-500 rounded"
                  checked={selectedScents[scent.name] || false}
                  onChange={() => handleScentChange(scent.name)}
                />
                <div className={`ml-2 h-3 w-3 rounded-full ${scent.color}`}></div>
                <span className="ml-2 text-gray-700 text-sm group-hover:text-slate-600 transition duration-300">
                  {scent.name}
                </span>
              </div>
              <span className="ml-auto text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 group-hover:bg-slate-100 ">
                {scent.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear All button - Fancy hover effect */}
      <button 
        onClick={clearAllFilters}
        className="w-full py-2 text-slate-500 border border-slate-400 rounded-md hover:bg-slate-50 transition duration-300 text-sm font-medium group relative overflow-hidden"
      >
        <span className="relative z-10 group-hover:text-white transition duration-500">Clear All Filters</span>
        <span className="absolute inset-0 bg-slate-500 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
      </button>
    </div>
  );
};

export default FilterOptions;