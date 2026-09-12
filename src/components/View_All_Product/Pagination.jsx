// File: src/components/common/Pagination.jsx

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = () => {
    return (
        <div className="mt-12 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px overflow-hidden">
                <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-slate-50 transition duration-300">
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 bg-[#B4945E] text-sm font-medium text-white">1</button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-slate-50 transition duration-300">2</button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-slate-50 transition duration-300">3</button>
                <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-slate-50 transition duration-300">
                    Next
                    <ChevronRight size={16} className="ml-1" />
                </button>
            </nav>
        </div>
    );
};

export default Pagination;