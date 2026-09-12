import React, { useState, useEffect } from 'react';
import api from '../../Axios/axiosInstance';
import ReviewList from './ReviewList';

const ReviewContainer = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterRating, setFilterRating] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);

  // Fetch reviews from API
  const fetchReviews = async (rating = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`reviews/${productId}`, {
        params: {
          rating: rating || undefined
        }
      });

      setReviews(response.data.reviews || []);
      setFilteredCount(response.data.totalCount || response.data.reviews.length);
    } catch (err) {
      setError('Failed to load reviews. Please try again later.');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // Fetch when filter rating changes
  useEffect(() => {
    fetchReviews(filterRating);
  }, [filterRating]);

  const handleFilterChange = (rating) => {
    setFilterRating(rating);
  };

  const handleReviewClick = (review) => {
    // Handle review click if needed
    console.log('Review clicked:', review);
  };

  return (
    <div className="review-container">
      {/* Star Rating Filter Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        {[5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => handleFilterChange(filterRating === rating ? 0 : rating)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterRating === rating
                ? 'bg-[#B4945E] text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {rating} Star{rating === 1 ? '' : 's'}
          </button>
        ))}
      </div>

      {/* Review List Component */}
      <ReviewList
        loading={loading}
        reviews={reviews}
        filteredCount={filteredCount}
        filterRating={filterRating}
        onReviewClick={handleReviewClick}
        reviewsPerPage={20}
      />

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-500 mt-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default ReviewContainer; 