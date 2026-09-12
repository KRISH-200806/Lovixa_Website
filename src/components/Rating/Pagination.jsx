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
          className={`px-3 py-2 rounded-l-md border ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>

        {/* Page numbers */}
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 border-t border-b ${
              currentPage === number
                ? 'bg-[#B4945E] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {number}
          </button>
        ))}

        {/* Next button */}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === pageNumbers.length}
          className={`px-3 py-2 rounded-r-md border ${
            currentPage === pageNumbers.length
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default Pagination;