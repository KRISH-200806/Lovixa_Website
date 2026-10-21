import React, { useState, useEffect } from "react";
import ReviewList from "../Rating/ReviewList";
import ReviewFilter from "../Rating/ReviewFilter";
import ReviewFormPopup from "../Rating/ReviewFormPopup";
import ReviewDetailPopup from "../Rating/ReviewDetailPopup";
import EditReviewFormPopup from "../Rating/EditReviewFormPopup";
import Pagination from "../Rating/Pagination";
import api from "../../Axios/axiosInstance";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";
import StarRating from "./StarRating";

const ReviewSystem = ({ id }) => {
  const { isAuthenticated, user } = useAuth();

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

  // Fetch reviews from API
  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await api.get(`reviews/?product=${id}`);
        if (isMounted) {
          const items = response.data?.results || (Array.isArray(response.data) ? response.data : []);
          setReviews(items);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReviews();
    return () => {
      isMounted = false;
    };
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
          reviews.reduce((sum, review) => sum + (review.rating || 5), 0) / totalReviews
        ).toFixed(1)
      : "5.0";

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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpenReviewForm = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to write a review.");
      return;
    }
    setIsReviewFormOpen(true);
  };

  const handleCloseReviewForm = () => setIsReviewFormOpen(false);

  const handleOpenEditForm = (review) => {
    const normalizedReview = {
      id: review.id,
      rating: review.rating || 5,
      comment: review.comment || "",
      userName: review.user_name || review.userName || "Customer",
      user_id: review.user || review.user_id,
      images: review.images || [],
    };
    setReviewToEdit(normalizedReview);
    setIsEditFormOpen(true);
    setSelectedReview(null);
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
    setReviewToEdit(null);
  };

  // Submit a new review
  const handleSubmitReview = async (newReview) => {
    try {
      setSubmitting(true);
      const response = await api.post("reviews/", {
        product: id,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      if (response.data) {
        const addedReview = response.data.review || response.data;
        setReviews((prev) => [addedReview, ...prev]);
        setIsReviewFormOpen(false);
        setCurrentPage(1);
        toast.success("Thank you for your review!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "You have already reviewed this product or must be logged in.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReviewDetail = (review) => setSelectedReview(review);
  const handleCloseReviewDetail = () => setSelectedReview(null);

  const handleDeleteReview = async (deletedReview) => {
    try {
      await api.delete(`reviews/${deletedReview.id}/`);
      setReviews((prev) => prev.filter((r) => r.id !== deletedReview.id));
      setSelectedReview(null);
      toast.success("Review deleted.");
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Could not delete review.");
    }
  };

  const handleClearFilter = () => {
    setFilterRating(0);
    setCurrentPage(1);
  };

  const handleSetFilter = (rating) => {
    setFilterRating(rating === filterRating ? 0 : rating);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto max-w-4xl bg-pure p-6 sm:p-8 rounded-3xl border border-stone-200/70 shadow-card font-['Urbanist']">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="flex items-center mb-1">
          <StarRating rating={parseFloat(averageRating)} size="large" />
          <span className="text-3xl font-extrabold text-text-main ml-3">{averageRating}</span>
        </div>
        <div className="text-xs text-text-secondary mb-4">{totalReviews} Verified Customer Reviews</div>

        <button
          onClick={handleOpenReviewForm}
          className="bg-brand hover:bg-brand/90 text-white py-2.5 px-6 rounded-xl font-bold text-xs transition shadow-button active:scale-95"
        >
          Write a Review
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="w-full">
          <ReviewFilter
            ratingCounts={ratingCounts}
            totalReviews={totalReviews}
            filterRating={filterRating}
            onSetFilter={handleSetFilter}
            onClearFilter={handleClearFilter}
          />
        </div>

        <div className="w-full">
          <ReviewList
            loading={loading}
            reviews={currentReviews}
            filteredCount={filteredReviews.length}
            filterRating={filterRating}
            onReviewClick={handleOpenReviewDetail}
            reviewsPerPage={reviewsPerPage}
            id={id}
          />

          {!loading && filteredReviews.length === 0 && (
            <div className="text-center py-8 text-xs text-text-secondary bg-warm rounded-2xl border border-stone-100">
              No customer reviews found for this filter.
            </div>
          )}
        </div>
      </div>

      {!loading && filteredReviews.length > reviewsPerPage && (
        <div className="mt-6 flex justify-center">
          <Pagination
            reviewsPerPage={reviewsPerPage}
            totalReviews={filteredReviews.length}
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
          currentUser={{ id: user?.id || localStorage.getItem("user_id") }}
        />
      )}
    </div>
  );
};

export default ReviewSystem;
