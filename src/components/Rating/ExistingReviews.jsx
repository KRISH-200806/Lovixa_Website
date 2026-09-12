// File: src/components/ReviewSystem/ExistingReviews.js
import React, { useState, useEffect } from 'react';
import ReviewFormPopup from './ReviewFormPopup';

const ExistingReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState(0); // 0 means all ratings
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  
  useEffect(() => {
    // Fetch data from API
    const fetchReviews = async () => {
      try {
        // Replace with your actual API endpoint in production
        // const response = await fetch('https://your-api-endpoint/reviews');
        // const data = await response.json();
        
        // Sample data matching image
        // const data = [
        //   {
        //     id: 1,
        //     rating: 5,
        //     userName: "Inzamamul H.",
        //     date: '23/02/2025',
        //     comment: "Amazing nice fragrance Specially Shanaya Arabic vibe 🥰",
        //     imageUrl: '/api/placeholder/250/250',
        //     hasVideo: true
        //   },
        //   {
        //     id: 2,
        //     rating: 5,
        //     userName: "Akhil M.",
        //     date: '03/11/2024',
        //     comment: "",
        //     imageUrl: '/api/placeholder/250/250'
        //   },
        //   {
        //     id: 3,
        //     rating: 5,
        //     userName: "",
        //     date: '',
        //     comment: "",
        //     imageUrl: '/api/placeholder/250/250'
        //   },
        //   {
        //     id: 4,
        //     rating: 5,
        //     userName: "Arti C.",
        //     date: '08/10/2024',
        //     comment: "",
        //     imageUrl: '/api/placeholder/250/250'
        //   }
        // ];

        setReviews(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Handle opening the review form
  const handleOpenReviewForm = () => {
    setIsReviewFormOpen(true);
  };
  
  // Handle closing the review form
  const handleCloseReviewForm = () => {
    setIsReviewFormOpen(false);
  };
  
  // Handle submitting a new review
  const handleSubmitReview = (newReview) => {
    // In production, you'd send this to your API
    
    // Add the new review to the list with a mock ID and current date
    const currentDate = new Date().toLocaleDateString('en-GB');
    const reviewWithId = {
      id: reviews.length + 1,
      ...newReview,
      date: currentDate,
      // Create a mock image URL if media is provided
      imageUrl: newReview.media.length > 0 ? 'placeholder/250/250' : null,
      hasVideo: newReview.media.some(item => item.type === 'video')
    };
    
    setReviews([reviewWithId, ...reviews]);
  };

  // Rating counts based on image
  const ratingCounts = {
    5: 11,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };
  
  const totalReviews = 11;
  
  // Function to render star icons
  const renderStars = (count, filled = true) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push(
        <svg 
          key={`filled-${i}`}
          className="w-4 h-4 text-amber-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
        </svg>
      );
    }
    
    if (!filled) {
      for (let i = 0; i < 5 - count; i++) {
        stars.push(
          <svg 
            key={`empty-${i}`}
            className="w-4 h-4 text-gray-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
          </svg>
        );
      }
    }
    
    return stars;
  };

  // Render rating bars
  const RatingBar = ({ starCount, count }) => {
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    
    return (
      <button 
        className="flex items-center my-1 w-full hover:bg-gray-50 transition p-1 rounded"
        onClick={() => setFilterRating(starCount === filterRating ? 0 : starCount)}
      >
        <div className="flex mr-2">
          {renderStars(starCount)}
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

  // Filter reviews based on selected rating
  const filteredReviews = filterRating === 0 
    ? reviews 
    : reviews.filter(review => review.rating === filterRating);

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-white animate-fade-in">
      {/* Header with overall rating */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="flex items-center mb-1">
          <svg 
            className="w-8 h-8 text-amber-500 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
          </svg>
          <span className="text-3xl font-semibold">5.0</span>
        </div>
        <div className="flex mb-2">
          {renderStars(5)}
        </div>
        <div className="text-sm text-gray-600 mb-3">Based on {totalReviews} reviews</div>
        
        <button 
          onClick={handleOpenReviewForm}
          className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-6 rounded-lg font-medium transition shadow-sm"
        >
          Write a Review
        </button>
      </div>

      {/* Side by side layout for larger screens */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Rating breakdown */}
        <div className="w-full md:w-1/3">
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
                onClick={() => setFilterRating(0)}
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
        
        {/* Right side - Reviews list */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">
              {filterRating > 0 
                ? `Showing ${filteredReviews.length} ${filterRating}-star review${filteredReviews.length !== 1 ? 's' : ''}` 
                : 'All Reviews'}
            </h3>
            <select className="border rounded p-1 text-sm">
              <option>Most Recent</option>
              <option>Highest Rated</option>
              <option>Lowest Rated</option>
              <option>With Images</option>
            </select>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No reviews match your filter. Try adjusting your filter or be the first to leave a review!
            </div>
          ) : (
            <div className="space-y-6">
              {filteredReviews.map(review => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex items-start mb-3">
                    {/* User avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                      <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                      </svg>
                    </div>
                    
                    {/* Review header */}
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm font-medium">
                          {review.rating}/5
                        </span>
                      </div>
                      
                      {review.userName && (
                        <div className="text-sm font-medium mt-1">{review.userName}</div>
                      )}
                      
                      {review.date && (
                        <div className="text-xs text-gray-500 mt-1">Verified Purchase • {review.date}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Review content */}
                  {review.comment && (
                    <div className="mb-3">{review.comment}</div>
                  )}
                  
                  {/* Review media */}
                  {review.imageUrl && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <div className="relative group">
                        <img 
                          src={review.imageUrl} 
                          alt="Review" 
                          className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-90 transition"
                        />
                        {review.hasVideo && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Review actions */}
                  <div className="mt-3 flex text-sm">
                    <button className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                      </svg>
                      Helpful
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {filteredReviews.length > 0 && (
            <div className="flex justify-center mt-8">
              <button className="px-4 py-2 border rounded-l bg-gray-50 text-gray-600 hover:bg-gray-100"> 
                Previous
              </button>
              <button className="px-4 py-2 border-t border-b bg-amber-500 text-white">
                1
              </button>
              <button className="px-4 py-2 border-t border-b border-r bg-gray-50 text-gray-600 hover:bg-gray-100">
                2
              </button>
              <button className="px-4 py-2 border-t border-b border-r rounded-r bg-gray-50 text-gray-600 hover:bg-gray-100">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Review Form Popup */}
      <ReviewFormPopup 
        isOpen={isReviewFormOpen}
        onClose={handleCloseReviewForm}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default ExistingReviews;