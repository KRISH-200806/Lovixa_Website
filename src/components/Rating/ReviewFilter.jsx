import React from 'react';
import StarRating from './StarRating';

const ReviewFilter = ({ ratingCounts, totalReviews, filterRating, onSetFilter, onClearFilter }) => {
  // Render rating bars
  const RatingBar = ({ starCount, count }) => {
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    
    return (
      <button 
        className="flex items-center my-1 w-full hover:bg-gray-50 transition p-1 rounded"
        onClick={() => onSetFilter(starCount)}
      >
        <div className="flex mr-2">
          <StarRating rating={starCount} />
        </div>
        <div className="relative h-6 bg-gray-200 rounded-sm flex-grow overflow-hidden">
          <div 
            className={`absolute h-full transition-all duration-1000 ease-out ${
              filterRating === starCount ? 'bg-amber-500' : 'bg-gray-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="ml-2 text-sm text-gray-600 min-w-8 text-center">({count})</div>
      </button>
    );
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold mb-3">Rating Breakdown</h3>
      <div className="space-y-1">
        {[5, 4, 3, 2, 1].map(rating => (
          <RatingBar key={rating} starCount={rating} count={ratingCounts[rating]} />
        ))}
      </div>
      
      {filterRating > 0 && (
        <button 
          className="mt-4 text-sm text-blue-600 hover:underline"
          onClick={onClearFilter}
        >
          Clear filter
        </button>
      )}
    </div>
  );
};

export default ReviewFilter;