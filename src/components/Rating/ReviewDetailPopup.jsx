import React, { useState, useEffect, useRef } from "react";
import StarRating from "../Rating/StarRating";
import defaultImage from "../../assets/image/agarbatti.png";
import api from "../../Axios/axiosInstance";

// Skeleton Loader for ReviewDetailPopup
const ReviewDetailSkeleton = ({ hasImages }) => (
  <div
    className={`relative bg-white rounded-lg shadow-xl w-full overflow-hidden ${
      hasImages
        ? "max-w-6xl h-[85vh] flex flex-col lg:flex-row"
        : "max-w-md max-h-[90vh]"
    }`}
  >
    {/* Image section skeleton */}
    {hasImages && (
      <div className="w-full lg:w-1/2 bg-gray-100 animate-pulse flex items-center justify-center">
        <svg
          className="w-16 h-16 text-gray-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 14V6H4v12h16zM6 10h12v2H6v-2zm0 4h8v2H6v-2z" />
        </svg>
      </div>
    )}

    {/* Review content skeleton */}
    <div
      className={`w-full ${hasImages ? "lg:w-1/2" : ""} flex flex-col ${
        hasImages ? "h-full" : ""
      }`}
    >
      <div className="p-6 overflow-y-auto flex-1">
        {/* User info skeleton */}
        <div className="flex items-start gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
                <div className="w-12 h-5 ml-2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Review title skeleton */}
        <div className="h-7 w-3/4 bg-gray-200 rounded animate-pulse mb-5"></div>

        {/* Review content skeleton */}
        <div className="space-y-3 mb-6">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Pros/Cons skeleton */}
        <div className="grid grid-cols-1 gap-4 mt-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer buttons skeleton */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ReviewDetailPopup = ({
  review,
  onClose,
  onEdit,
  onDelete,
  currentUser,
  allowActions = true,
  productId,
  PHOTO_URL = "https://perfume.flexioninfotech.com",
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [isHelpful, setIsHelpful] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const autoPlayTimeoutRef = useRef(null);
  const popupRef = useRef(null);

  // Get logged-in user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    setLoggedInUserId(storedUserId);

    // Simulate initial loading for better UX
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Handle null/undefined review
  if (!review) return null;

  // Transform API data to component format if needed
  const transformedReview = React.useMemo(() => {
    if (review.userName || review.comment) {
      return review;
    }

    return {
      id: review.id,
      userId: review.user_id,
      userName: review.name || "Anonymous",
      userProfileImage: review.profile_image
        ? `${PHOTO_URL}/${review.profile_image}`
        : null,
      rating: review.rating || 0,
      title: review.title || "",
      comment: review.note || "",
      date: formatApiDate(review.review_date),
      images: (review.photos_videos || []).map(
        (path) => `${path}`
      ),
      pros: review.pros || [],
      cons: review.cons || [],
      recommendationStatus: review.recommendationStatus || null,
      verifiedPurchase: review.verifiedPurchase || false,
    };
  }, [review, PHOTO_URL]);

  // Destructure with defaults
  const {
    id: reviewId,
    userName = "Anonymous",
    title = "",
    comment = "",
    rating = 0,
    images = [],
    date = new Date().toISOString(),
    pros = [],
    cons = [],
    recommendationStatus,
    verifiedPurchase = false,
    userProfileImage,
    userId,
  } = transformedReview;

  const hasImages = images?.length > 0;
  const isCurrentUserReview = currentUser && currentUser.id === userId;

  // Format API date (MM-DD-YYYY) to ISO string
  function formatApiDate(apiDate) {
    if (!apiDate) return new Date().toISOString();

    try {
      const [month, day, year] = apiDate.split("-");
      const date = new Date(year, month - 1, day);
      return date.toISOString();
    } catch (error) {
      console.warn("Error parsing date:", apiDate);
      return new Date().toISOString();
    }
  }

  // API Functions
  const deleteReview = async (reviewId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`delete-reviews/${reviewId}`, {
        data: { user_id: loggedInUserId },
      });

      if (response.status === 200 || response.data.status) {
        onDelete?.(transformedReview);
        onClose();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      setError("Failed to delete review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (updatedReviewData) => {
    try {
      setLoading(true);
      setError(null);

      // Include user ID in the request
      const dataToSend = {
        ...updatedReviewData,
        user_id: loggedInUserId,
      };

      const response = await api.put(
        `update-reviews/${reviewId}`,
        dataToSend
      );

      if (response.status === 200 || response.data.status) {
        onEdit?.(response.data);
        onClose();

      }
    } catch (error) {
      console.error("Error updating review:", error);
      setError("Failed to update review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewDetails = async (reviewId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`get-reviews/${reviewId}`);

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching review details:", error);
      setError("Failed to load review details.");
    } finally {
      setLoading(false);
    }
  };

  const reportReview = async (reviewId, reason) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(`report-reviews/`, {
        review_id: reviewId,
        reason,
        reported_by: currentUser?.id,
      });

      if (response.status === 200 || response.data.status) {
        setError("Review reported successfully. Thank you for your feedback.");
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error("Error reporting review:", error);
      setError("Failed to report review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleHelpful = async (reviewId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(`toggle-helpful-reviews/`, {
        review_id: reviewId,
        user_id: currentUser?.id,
      });

      if (response.status === 200 || response.data.status) {

        setIsHelpful(!isHelpful);
        setHelpfulCount((prev) => (isHelpful ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error("Error toggling helpful:", error);
      setError("Failed to update helpful status.");
    } finally {
      setLoading(false);
    }
  };

  // Handle image navigation
  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetAutoPlay();
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    resetAutoPlay();
  };

  const resetAutoPlay = () => {
    setIsAutoPlaying(false);
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
  };

  // Auto-play images if more than one
  useEffect(() => {
    if (!hasImages || images.length <= 1 || !isAutoPlaying) return;

    autoPlayTimeoutRef.current = setTimeout(() => {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [currentImageIndex, isAutoPlaying, hasImages, images.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []);

  // Format date
  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString;
    }
  };

  // Handle actions
  const handleEditClick = (e) => {
    e?.stopPropagation();

    if (!loggedInUserId || loggedInUserId !== userId.toString()) {
      setError("You can only edit your own reviews.");
      return;
    }

    // Pass the review data to the parent component for editing
    onEdit?.(transformedReview);
    onClose(); // Close the detail popup
  };

  const handleDeleteClick = async (e) => {
    e?.stopPropagation();

    if (!loggedInUserId || loggedInUserId !== userId.toString()) {
      setError("You can only delete your own reviews.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview(reviewId);
    }
  };

  const handleReportClick = async (e) => {
    e?.stopPropagation();
    const reason = prompt("Please provide a reason for reporting this review:");
    if (reason && reason.trim()) {
      await reportReview(reviewId, reason.trim());
    }
  };

  const handleHelpfulClick = async (e) => {
    e?.stopPropagation();
    await toggleHelpful(reviewId);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (hasImages && images.length > 1) {
      if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      }
    }
  };

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasImages, images.length]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-title"
    >
      {initialLoading ? (
        <ReviewDetailSkeleton hasImages={hasImages} />
      ) : (
        <div
          ref={popupRef}
          className={`relative bg-white rounded-lg shadow-xl w-full overflow-hidden ${
            hasImages
              ? "max-w-6xl h-[85vh] flex flex-col lg:flex-row"
              : "max-w-md max-h-[90vh]"
          }`}
        >
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-30">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className={`absolute top-4 left-4 right-4 px-4 py-3 rounded z-20 ${
                error.includes("successfully")
                  ? "bg-green-100 border border-green-400 text-green-700"
                  : "bg-red-100 border border-red-400 text-red-700"
              }`}
            >
              {error}
              <button
                onClick={() => setError(null)}
                className="float-right font-bold"
                aria-label="Close error message"
              >
                ×
              </button>
            </div>
          )}

          {/* Image Section - Fixed size with images */}
          {hasImages && (
            <div className="relative w-full lg:w-1/2 bg-gray-100 flex items-center justify-center h-64 lg:h-full">
              <img
                src={images[currentImageIndex] || defaultImage}
                alt={`Review image ${currentImageIndex + 1} by ${userName}`}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={handleImageError}
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md z-10 hover:bg-opacity-100 transition-all"
                    aria-label="Previous image"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md z-10 hover:bg-opacity-100 transition-all"
                    aria-label="Next image"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentImageIndex + 1} / {images.length}
              </div>

              {/* Auto-play toggle */}
              {images.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAutoPlaying(!isAutoPlaying);
                  }}
                  className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full text-sm hover:bg-opacity-90 transition-all"
                  aria-label={
                    isAutoPlaying ? "Pause slideshow" : "Play slideshow"
                  }
                >
                  {isAutoPlaying ? (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              )}

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                        resetAutoPlay();
                      }}
                      className={`flex-shrink-0 w-10 h-10 rounded border-2 overflow-hidden transition-all`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content Section - Fixed size and scrollable */}
          <div
            className={`w-full ${hasImages ? "lg:w-1/2" : ""} flex flex-col ${
              hasImages ? "h-full" : ""
            }`}
          >
            <div className="p-6 overflow-y-auto flex-1">
              {/* User Info and Rating */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0">
                  {userProfileImage ? (
                    <img
                      src={userProfileImage}
                      alt={userName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-lg">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        id="review-title"
                        className="text-lg font-bold text-gray-900"
                      >
                        {userName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(date)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <StarRating rating={rating} size="medium" readOnly />
                      <span className="text-base font-medium ml-2">
                        {rating.toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Title */}
              {title && (
                <h3 className="text-xl font-semibold mt-2 mb-3 text-gray-900">
                  {title}
                </h3>
              )}

              {/* Review Comment */}
              {comment && (
                <div className="prose max-w-none text-gray-700 mb-4">
                  {comment.split("\n").map((paragraph, i) => (
                    <p key={i} className="mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Pros and Cons */}
              {(pros.length > 0 || cons.length > 0) && (
                <div className="grid grid-cols-1 gap-4 mt-6 mb-6">
                  {pros.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-bold text-green-700 mb-2 flex items-center">
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Pros
                      </h4>
                      <ul className="space-y-1">
                        {pros.map((pro, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              className="w-4 h-4 mt-1 mr-2 text-green-500 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {cons.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h4 className="font-bold text-red-700 mb-2 flex items-center">
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Cons
                      </h4>
                      <ul className="space-y-1">
                        {cons.map((con, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              className="w-4 h-4 mt-1 mr-2 text-red-500 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Recommendation Status */}
              {recommendationStatus && (
                <div className="mt-6 p-3 bg-gray-50 rounded-lg border">
                  <p className="text-sm font-medium">
                    {recommendationStatus === "yes" ? (
                      <span className="text-green-600 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Would recommend this product
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Would not recommend this product
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Verified Purchase Badge */}
              {verifiedPurchase && (
                <div className="mt-4 flex items-center text-sm text-green-700 bg-green-50 p-2 rounded-lg border border-green-200">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified Purchase
                </div>
              )}
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                {/* User Actions (Edit/Delete) */}
                {loggedInUserId && loggedInUserId === userId.toString() && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleEditClick}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      aria-label="Edit review"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      disabled={loading}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      aria-label="Delete review"
                    >
                      Delete
                    </button>
                  </div>
                )}

                {/* Other User Actions */}
                {!isCurrentUserReview && currentUser && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleHelpfulClick}
                      disabled={loading}
                      className={`px-3 py-1 rounded-md transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                        isHelpful
                          ? "bg-green-200 text-green-800 hover:bg-green-300"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                      aria-label="Mark as helpful"
                    >
                      👍 Helpful {helpfulCount > 0 && `(${helpfulCount})`}
                    </button>
                    <button
                      onClick={handleReportClick}
                      disabled={loading}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Report review"
                    >
                      🚩 Report
                    </button>
                  </div>
                )}

                {/* Guest user message */}
                {!currentUser && (
                  <p className="text-sm text-gray-500 italic">
                    Sign in to interact with reviews
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDetailPopup;
