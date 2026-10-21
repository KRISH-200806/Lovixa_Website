import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = () => {
    return (
        <div className="mt-12 flex items-center justify-center gap-1.5">
            <button className="inline-flex items-center px-4 py-2 bg-pure text-xs font-semibold text-text-secondary hover:bg-stone-50 border border-stone-200 rounded-full transition duration-300 cursor-pointer">
                <ChevronLeft size={14} className="mr-1" />
                Previous
            </button>
            <button className="w-9 h-9 inline-flex items-center justify-center bg-brand text-xs font-bold text-white rounded-full shadow-xs cursor-pointer">1</button>
            <button className="w-9 h-9 inline-flex items-center justify-center bg-pure text-xs font-semibold text-text-main hover:bg-stone-50 border border-stone-200 rounded-full transition duration-300 cursor-pointer">2</button>
            <button className="w-9 h-9 inline-flex items-center justify-center bg-pure text-xs font-semibold text-text-main hover:bg-stone-50 border border-stone-200 rounded-full transition duration-300 cursor-pointer">3</button>
            <button className="inline-flex items-center px-4 py-2 bg-pure text-xs font-semibold text-text-secondary hover:bg-stone-50 border border-stone-200 rounded-full transition duration-300 cursor-pointer">
                Next
                <ChevronRight size={14} className="ml-1" />
            </button>
        </div>
    );
};

export default Pagination;