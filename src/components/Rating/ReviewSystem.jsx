import React, { useState, useEffect } from "react";
import ReviewList from "../Rating/ReviewList";
import ReviewFilter from "../Rating/ReviewFilter";
import ReviewFormPopup from "../Rating/ReviewFormPopup";
import ReviewDetailPopup from "../Rating/ReviewDetailPopup";
import EditReviewFormPopup from "../Rating/EditReviewFormPopup";
import Pagination from "../Rating/Pagination";
import api from "../../Axios/axiosInstance";
import { toast } from "react-toastify"; // 🟡 Make sure to install this
import "react-toastify/dist/ReactToastify.css";

// Skeleton Loader Components
const SkeletonReview = () => (
  <div className="animate-pulse bg-white p-4 rounded-lg shadow mb-4">
    <div className="flex items-center mb-3">
      <div className="rounded-full bg-gray-200 h-10 w-10 mr-3"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
    </div>
    <div className="mt-4 flex space-x-2">
      <div className="h-20 bg-gray-200 rounded w-1/5"></div>
      <div className="h-20 bg-gray-200 rounded w-1/5"></div>
    </div>
  </div>
);

const SkeletonFilter = () => (
  <div className="animate-pulse bg-white p-4 rounded-lg mb-4">
    <div className="flex justify-between items-center mb-3">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/6"></div>
    </div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center">
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
          <div className="h-2 bg-gray-200 rounded w-1/4 ml-auto"></div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonHeader = () => (
  <div className="animate-pulse flex flex-col items-center justify-center mb-6">
    <div className="flex items-center mb-3">
      <div className="h-8 w-8 bg-gray-200 rounded mr-2"></div>
      <div className="h-8 bg-gray-200 rounded w-12"></div>
    </div>
    <div className="flex mb-2 space-x-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 w-4 bg-gray-200 rounded"></div>
      ))}
    </div>
    <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
    <div className="h-10 bg-gray-200 rounded w-32"></div>
  </div>
);

const ReviewSystem = ({ id }) => {

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState(0);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(4);
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews from API or fallback
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await api.get(`get-reviews/${id}`);

        setReviews(response.data.reviews);

      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  

  // Calculate breakdown by star ratings
  const calculateRatingCounts = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      if (counts[review.rating] !== undefined) {
        counts[review.rating]++;
      }
    });
    return counts;
  };

  const ratingCounts = calculateRatingCounts();
  const totalReviews = reviews.length;

  // Average rating
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        ).toFixed(1)
      : "0.0";

  // Filtered + paginated reviews
  const filteredReviews =
    filterRating === 0
      ? reviews
      : reviews.filter((review) => review.rating === filterRating);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  // Pagination handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Open/close form
  const handleOpenReviewForm = () => setIsReviewFormOpen(true);
  const handleCloseReviewForm = () => setIsReviewFormOpen(false);
  
  // Edit form handlers
  const handleOpenEditForm = (review) => {

    
    // Make sure we have all the required data and transform it if needed
    const normalizedReview = {
      id: review.id,
      rating: review.rating || review.five_star || 0,
      comment: review.comment || review.note || '',
      userName: review.userName || review.title || review.name || 'Anonymous',
      user_id: review.userId || review.user_id || localStorage.getItem('user_id'),
      // Handle different image formats
      images: review.images || (review.photos_videos ? 
        (Array.isArray(review.photos_videos) ? review.photos_videos : [review.photos_videos]) : 
        [])
    };
    

    
    setReviewToEdit(normalizedReview);
    setIsEditFormOpen(true);
    setSelectedReview(null); // Close the detail popup
  };
  
  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
    setReviewToEdit(null);
  };

  // Submit a new review
  const handleSubmitReview = async (newReview) => {
    try {
      setSubmitting(true);
      const response = await api.post("submit-review/", {
        product_id: id,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      if (response.data?.success) {
        const currentDate = new Date()
          .toLocaleDateString("en-GB")
          .replace(/\//g, "/");

        const reviewWithId = {
          id: reviews.length + 1,
          ...newReview,
          date: currentDate,
          verifiedPurchase: true,
          images:
            newReview.media?.length > 0
              ? newReview.media.map(() => "placeholder/250/250")
              : [],
          hasVideo: newReview.media?.some((item) => item.type === "video"),
        };

        setReviews([reviewWithId, ...reviews]);
        setIsReviewFormOpen(false);
        setCurrentPage(1);
        toast.success("Review submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Detail view handlers
  const handleOpenReviewDetail = (review) => setSelectedReview(review);
  const handleCloseReviewDetail = () => setSelectedReview(null);
  
  // Handle review deletion
  const handleDeleteReview = (deletedReview) => {
    setReviews(prevReviews => 
      prevReviews.filter(review => review.id !== deletedReview.id)
    );
    toast.success("Review deleted successfully!");
  };

  // Filter rating change
  const handleClearFilter = () => {
    setFilterRating(0);
    setCurrentPage(1);
  };

  const handleSetFilter = (rating) => {
    setFilterRating(rating === filterRating ? 0 : rating);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto p-4 max-w-4xl bg-white">
      {/* Header with Skeleton */}
      {loading ? (
        <SkeletonHeader />
      ) : (
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex items-center mb-1">
            <svg
              className="w-8 h-8 text-amber-500 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
            </svg>
            <span className="text-3xl font-semibold">{averageRating}</span>
          </div>
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 text-amber-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
              </svg>
            ))}
          </div>
          <div className="text-sm text-gray-600 mb-3">{totalReviews} Reviews</div>

          <button
            onClick={handleOpenReviewForm}
            className="bg-[#B4945E] hover:bg-[#8B7355]  text-white py-2 px-6 rounded-lg font-medium transition shadow-sm"
          >
            Write a Review
          </button>
        </div>
      )}

      {/* Filters and reviews */}
      <div className="flex flex-col gap-6">
        {/* Filter with Skeleton */}
        <div className="w-full">
          {loading ? (
            <SkeletonFilter />
          ) : (
            <ReviewFilter
              ratingCounts={ratingCounts}
              totalReviews={totalReviews}
              filterRating={filterRating}
              onSetFilter={handleSetFilter}
              onClearFilter={handleClearFilter}
            />
          )}
        </div>

        {/* Reviews with Skeleton */}
        <div className="w-full">
          {loading ? (
            <div>
              {[...Array(reviewsPerPage)].map((_, index) => (
                <SkeletonReview key={index} />
              ))}
            </div>
          ) : (
            <>
              <ReviewList
                loading={loading}
                reviews={currentReviews}
                filteredCount={filteredReviews.length}
                filterRating={filterRating}
                onReviewClick={handleOpenReviewDetail}
                reviewsPerPage={reviewsPerPage}
                id={id}
              />

              {/* No reviews fallback */}
              {!loading && filteredReviews.length === 0 && (
                <div className="text-center text-gray-500">
                  No reviews found for this rating.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Pagination with Skeleton */}
      {!loading && filteredReviews.length > reviewsPerPage && (
        <div className="mt-6 flex justify-center">
          <Pagination
            itemsPerPage={reviewsPerPage}
            totalItems={filteredReviews.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      )}

      {/* Popups */}
      <ReviewFormPopup
        isOpen={isReviewFormOpen}
        onClose={handleCloseReviewForm}
        onSubmit={handleSubmitReview}
        submitting={submitting}
        id={id}
      />
      
      {/* Edit Review Popup */}
      {reviewToEdit && (
        <EditReviewFormPopup
          isOpen={isEditFormOpen}
          onClose={handleCloseEditForm}
          id={id}
          reviewData={reviewToEdit}
        />
      )}

      {selectedReview && (
        <ReviewDetailPopup
          review={selectedReview}
          onClose={handleCloseReviewDetail}
          onEdit={handleOpenEditForm}
          onDelete={handleDeleteReview}
          currentUser={{ id: localStorage.getItem('user_id') }}
        />
      )}
    </div>
  );
};

export default ReviewSystem;
