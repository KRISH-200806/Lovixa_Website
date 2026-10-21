import React from 'react';

const Pagination = ({ reviewsPerPage, totalReviews, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalReviews / reviewsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-8" aria-label="Reviews pagination">
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-full text-xs font-semibold border ${
            currentPage === 1
              ? 'bg-warm text-stone-300 border-stone-200 cursor-not-allowed'
              : 'bg-pure text-text-main border-stone-200 hover:bg-stone-50 cursor-pointer'
          }`}
        >
          Previous
        </button>

        {/* Page numbers */}
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`w-9 h-9 rounded-full text-xs font-semibold border flex items-center justify-center cursor-pointer ${
              currentPage === number
                ? 'bg-brand border-brand text-white shadow-button'
                : 'bg-pure border-stone-200 text-text-main hover:bg-stone-50'
            }`}
          >
            {number}
          </button>
        ))}

        {/* Next button */}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === pageNumbers.length}
          className={`px-4 py-2 rounded-full text-xs font-semibold border ${
            currentPage === pageNumbers.length
              ? 'bg-warm text-stone-300 border-stone-200 cursor-not-allowed'
              : 'bg-pure text-text-main border-stone-200 hover:bg-stone-50 cursor-pointer'
          }`}
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default Pagination;