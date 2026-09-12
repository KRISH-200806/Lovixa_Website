import React, { useState } from "react";
import StarRating from "./StarRating";
import AQ365 from "../../assets/image/AQ365.jpg";
import api from "../../Axios/axiosInstance";

const ReviewItem = ({ review, onReviewClick, currentUser }) => {
  if (!review) return null;

  // Handle fallback for broken images
  const handleImageError = (e) => {
    e.target.src = AQ365;
  };

  // Improved image URL handling
  const getImageUrl = (image) => {
    const PHOTO_URL = 'https://git-hub-adil-qadri.onrender.com';
    
    if (typeof image === "string") {
      // If it's already a full URL, return as is
      if (image.startsWith('http')) return image;
      // Otherwise, prepend the base URL
      return `${PHOTO_URL}/${image}`;
    }
    if (image?.url) return image.url;
    if (image?.objectUrl) return image.objectUrl;
    if (image?.src) return image.src;
    return AQ365;
  };

  // Improved data normalization
  const reviewData = {
    id: review.id || review._id,
    rating: review.rating || review.five_star || 0,
    name: review.name || review.title || "Anonymous",
    comment: review.comment || review.note || "",
    images: review.images || review.photos_videos || review.media || [],
    profile_image: review.profile_image ? `https://git-hub-adil-qadri.onrender.com/${review.profile_image}` : null,
    verifiedPurchase: review.verifiedPurchase || false,
    createdAt: review.createdAt || review.date || review.review_date || new Date().toISOString(),
    helpfulCount: review.helpfulCount || 0,
    isHelpful: review.isHelpful || false,
    hasVideo: review.hasVideo || false
  };

  // Get the first letter of the name for avatar fallback
  const getInitial = () => {
    if (!reviewData.name || reviewData.name === "Anonymous") return "A";
    return reviewData.name.charAt(0).toUpperCase();
  };

  // Check if image is video
  const isVideoFile = (image) => {
    if (typeof image === "object" && image?.type) {
      return image.type === "video" || image.type.includes("video");
    }
    if (typeof image === "string") {
      return /\.(mp4|webm|ogg|mov|avi)$/i.test(image);
    }
    return false;
  };

  // Format date properly
  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch (error) {
      // Handle MM-DD-YYYY format if needed
      if (dateString && dateString.includes("-")) {
        const parts = dateString.split("-");
        if (parts.length === 3) {
          return new Date(`${parts[2]}-${parts[0]}-${parts[1]}`).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
          });
        }
      }
      return "Date not available";
    }
  };

  // Local state
  const [helpfulCount, setHelpfulCount] = useState(reviewData.helpfulCount);
  const [isHelpful, setIsHelpful] = useState(reviewData.isHelpful);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helpful button handler
  const handleHelpfulClick = async (e) => {
    e.stopPropagation();
    if (!currentUser || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.post(`get-reviews/${id}/helpful`);
      setHelpfulCount((prev) => prev + 1);
      setIsHelpful(true);
    } catch (error) {
      console.error("Error marking review as helpful:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Report button handler
  const handleReportClick = async (e) => {
    e.stopPropagation();
    if (!currentUser || isSubmitting) return;

    const confirmReport = window.confirm("Are you sure you want to report this review?");
    if (!confirmReport) return;

    setIsSubmitting(true);
    try {
      await api.post(`get-reviews/${id}/report`);
      alert("Review reported successfully. Thank you for your feedback.");
    } catch (error) {
      console.error("Error reporting review:", error);
      alert("Failed to report review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Featured Image - Shows first image prominently */}
      {reviewData.images?.length > 0 && (
        <div className="mb-4 rounded-lg overflow-hidden">
          {isVideoFile(reviewData.images[0]) ? (
            <div className="relative pt-[56.25%] bg-gray-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
                </svg>
              </div>
            </div>
          ) : (
            <img 
              src={getImageUrl(reviewData.images[0])} 
              alt="Review featured image" 
              className="w-full h-48 object-cover rounded-lg"
              onError={handleImageError}
            />
          )}
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
          {reviewData.profile_image ? (
            <img
              src={reviewData.profile_image}
              alt={`${reviewData.name}'s profile`}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <span className="text-lg font-medium text-gray-700">
              {getInitial()}
            </span>
          )}
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div className="flex-1">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRating rating={reviewData.rating} size="small" />
                <span className="text-sm font-medium text-gray-700">
                  {reviewData.rating ? reviewData.rating.toFixed(1) : "0.0"}/5
                </span>
              </div>

              {/* Name */}
              <div className="text-sm font-medium text-gray-900 mt-1">
                {reviewData.name}
              </div>

              {/* Purchase Info and Date */}
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                {reviewData.verifiedPurchase && (
                  <span className="inline-flex items-center text-green-600">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified Purchase
                  </span>
                )}
                <span>{formatDate(reviewData.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Review Comment */}
          {reviewData.comment && (
            <div
              onClick={() => onReviewClick?.(review)}
              className="mt-3 text-gray-700 cursor-pointer leading-relaxed"
            >
              {reviewData.comment.length > 150 ? (
                <>
                  {reviewData.comment.substring(0, 150)}...
                  <span className="text-blue-600 hover:underline ml-1 font-medium">
                    Read more
                  </span>
                </>
              ) : (
                reviewData.comment
              )}
            </div>
          )}

          {/* Additional Media Images/Videos */}
           

   
          {/* Action Buttons */}
          <div className="mt-4 flex items-center gap-4 text-sm">
            <button
              onClick={handleHelpfulClick}
              className={`flex items-center transition-colors ${
                isHelpful
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!currentUser || isSubmitting}
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              Helpful {helpfulCount > 0 && `(${helpfulCount})`}
            </button>

            <button
              onClick={handleReportClick}
              className={`text-gray-600 hover:text-red-600 transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!currentUser || isSubmitting}
            >
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;







          // {/* Additional Media Images/Videos */}
          // {reviewData.images?.length > 1 && (
          //   <div 
          //     onClick={() => onReviewClick?.(review)} 
          //     className="mt-3 flex flex-wrap gap-2 cursor-pointer"
          //   >
          //     {reviewData.images.slice(1, 4).map((image, index) => {
          //       const imageUrl = getImageUrl(image);
          //       const isVideo = isVideoFile(image);

          //       return (
          //         <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden">
          //           {isVideo ? (
          //             <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          //               <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          //                 <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
          //               </svg>
          //             </div>
          //           ) : (
          //             <img
          //               src={imageUrl}
          //               alt={`Review media ${index + 2}`}
          //               className="w-full h-full object-cover hover:opacity-90 transition-opacity"
          //               onError={handleImageError}
          //             />
          //           )}
                    
          //           {/* Show "+X more" indicator if there are more than 3 additional images */}
          //           {index === 2 && reviewData.images.length > 4 && (
          //             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs font-medium">
          //               +{reviewData.images.length - 4} more
          //             </div>
          //           )}
          //         </div>
          //       );
          //     })}
          //   </div>
          // )}