import React, { useState, useEffect } from 'react';
import ReviewItem from './ReviewItem';
import ReviewDetailPopup from './ReviewDetailPopup';
import api from '../../Axios/axiosInstance';

const ReviewList = ({ 
  loading, 
  reviews, 
  filteredCount, 
  filterRating, 
  onReviewClick, 
  reviewsPerPage = 20,
  id // Add id prop
}) => {
  const [sortOption, setSortOption] = useState('All Reviews');
  const [sortedReviews, setSortedReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState(20);

  // Sort reviews based on selected option and update API
  const handleSortChange = async (newSortOption) => {
    setSortOption(newSortOption);
    if (!id) return; // Guard clause for missing id

    try {
      const sortParam = newSortOption === 'All Reviews' ? '' : 
                     newSortOption === 'Newest' ? 'newest' :
                     newSortOption === 'Highest Rated' ? 'highest_rated' : 'lowest_rated';

      const response = await api.get(`get-reviews/${id}`, {
        params: {
          sort: sortParam,
          rating: filterRating 
        }
      });

      setSortedReviews(response.data.reviews || []);
    } catch (err) {
      console.error('Error sorting reviews:', err);
    }
  };

  // Initialize sorted reviews when reviews prop changes
  useEffect(() => {
    setSortedReviews(reviews || []);
  }, [reviews]);

  // Load all reviews on initial mount
  useEffect(() => {
    if (id) {
      handleSortChange('All Reviews');
    }
  },[id]); // Only run when id changes

  const handleShowMore = () => {
    setVisibleReviews(prev => prev + 20);
  };

  const handleReviewClick = (review) => {
    setSelectedReview(review);
    if (onReviewClick) onReviewClick(review);
  };

  const handleClosePopup = () => {
    setSelectedReview(null);
  };

  const handleClickOutside = (e) => {
    if (e.target.classList.contains('popup-overlay')) {
      handleClosePopup();
    }
  };

  // Handle review deletion
  const handleReviewDelete = (deletedReview) => {
  
    
    // Remove the deleted review from the list
    setSortedReviews(prevReviews => {
      const newReviews = prevReviews.filter(review => review.id !== deletedReview.id);

      return newReviews;
    });
    
    // Close the popup
    setSelectedReview(null);
  };

  // Get current visible reviews
  const currentReviews = sortedReviews.slice(0, visibleReviews);
  const hasMoreReviews = sortedReviews.length > visibleReviews;

  return (
    <div className="review-list">
      <div className="review-header flex justify-between items-center mb-4">
        <div className="filter-info text-sm text-gray-600">
          {filterRating > 0
            ? `Showing ${filteredCount} ${filterRating}-star review${filteredCount !== 1 ? 's' : ''}`
            : `Showing ${sortedReviews.length} reviews`}
        </div>
        
        <div className="sort-options flex">
          <select 
            className="border rounded px-2 py-1 text-sm"
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="All Reviews">All Reviews</option>
            <option value="Newest">Newest</option>
            <option value="Highest Rated">Highest Rated</option>
            <option value="Lowest Rated">Lowest Rated</option>
          </select>
        </div>
      </div>
      
      <div className="reviews-grid columns-1 md:columns-2 lg:columns-3 gap-6 p-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredCount === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No reviews match your filter. Try adjusting your filter or be the first to leave a review!
          </div>
        ) : (
          <>
            {currentReviews.map((review) => (
              <div 
                key={review.id} 
                className="mb-6 break-inside-avoid bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleReviewClick(review)}
              >
                <ReviewItem review={review} />
              </div>
            ))}
            
            {/* Show More Button */}
            {hasMoreReviews && (
              <div className="col-span-full flex justify-center mt-8">
                <button
                  onClick={handleShowMore}
                  className="px-6 py-2 bg-[#B4945E] text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Show More Reviews
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedReview && (
        <div 
          className="popup-overlay fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={handleClickOutside}
        >
          <ReviewDetailPopup 
            review={selectedReview} 
            onClose={handleClosePopup} 
            onDelete={handleReviewDelete}
            currentUser={{ id: localStorage.getItem('user_id') }}
            allowActions={true}
            productId={id}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewList;