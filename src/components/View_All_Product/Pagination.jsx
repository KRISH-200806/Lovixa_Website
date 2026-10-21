import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = () => {
    return (
        <div className="mt-12 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-xl shadow-xs -space-x-px overflow-hidden border border-stone-200">
                <button className="relative inline-flex items-center px-3 py-2 bg-pure text-xs font-semibold text-text-secondary hover:bg-stone-50 transition duration-300">
                    <ChevronLeft size={14} className="mr-1" />
                    Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 bg-brand text-xs font-bold text-white shadow-xs">1</button>
                <button className="relative inline-flex items-center px-4 py-2 bg-pure text-xs font-semibold text-text-main hover:bg-stone-50 transition duration-300">2</button>
                <button className="relative inline-flex items-center px-4 py-2 bg-pure text-xs font-semibold text-text-main hover:bg-stone-50 transition duration-300">3</button>
                <button className="relative inline-flex items-center px-3 py-2 bg-pure text-xs font-semibold text-text-secondary hover:bg-stone-50 transition duration-300">
                    Next
                    <ChevronRight size={14} className="ml-1" />
                </button>
            </nav>
        </div>
    );
};

export default Pagination;