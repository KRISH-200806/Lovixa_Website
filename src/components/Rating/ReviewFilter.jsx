import React from 'react';
import StarRating from './StarRating';

const ReviewFilter = ({ ratingCounts, totalReviews, filterRating, onSetFilter, onClearFilter }) => {
  // Render rating bars
  const RatingBar = ({ starCount, count }) => {
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    
    return (
      <button 
        className="flex items-center my-1.5 w-full hover:bg-stone-100 transition p-1.5 px-3 rounded-full text-left cursor-pointer"
        onClick={() => onSetFilter(starCount)}
      >
        <div className="flex mr-3">
          <StarRating rating={starCount} size="small" />
        </div>
        <div className="relative h-3 bg-stone-200 rounded-full flex-grow overflow-hidden">
          <div 
            className={`absolute h-full rounded-full transition-all duration-700 ease-out ${
              filterRating === starCount ? 'bg-brand' : 'bg-sage'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="ml-3 text-xs font-semibold text-text-secondary min-w-8 text-right">({count})</div>
      </button>
    );
  };

  return (
    <div className="bg-warm p-5 rounded-2xl border border-stone-200/60">
      <h3 className="font-bold text-sm text-text-main mb-3">Rating Breakdown</h3>
      <div className="space-y-1">
        {[5, 4, 3, 2, 1].map(rating => (
          <RatingBar key={rating} starCount={rating} count={ratingCounts[rating]} />
        ))}
      </div>
      
      {filterRating > 0 && (
        <button 
          className="mt-3 text-xs font-bold text-brand hover:underline"
          onClick={onClearFilter}
        >
          Clear filter
        </button>
      )}
    </div>
  );
};

export default ReviewFilter;