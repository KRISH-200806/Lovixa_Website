import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import api from '../../Axios/axiosInstance';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Constants
const MAX_COMMENT_LENGTH = 500;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
const MAX_MEDIA_UPLOADS = 5;

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Custom hook for form validation
const useFormValidation = (comment, rating) => {
  return useMemo(() => {
    const errors = [];
    
    if (!comment.trim()) errors.push('Please enter your review');
    if (comment.length > MAX_COMMENT_LENGTH) {
      errors.push(`Review exceeds ${MAX_COMMENT_LENGTH} characters`);
    }
    if (rating === 0) errors.push('Please select a rating');
    
    return errors;
  }, [comment, rating]);
};

// Custom hook for media file management
const useMediaFiles = (initialImages = [], PHOTO_URL) => {
  const [previews, setPreviews] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [removedExistingImages, setRemovedExistingImages] = useState([]);
  const previewCleanupRef = useRef(new Set());

  // Initialize with existing images
  useEffect(() => {
    if (previews.length === 0 && initialImages && initialImages.length > 0) {
      const timestamp = new Date().getTime();
      
      const existingImages = initialImages.map((imageUrl, index) => {
        let fullUrl;
        
        if (typeof imageUrl === 'string') {
          if (imageUrl.startsWith('http')) {
            fullUrl = `${imageUrl}?t=${timestamp}`;
          } else {
            fullUrl = `${PHOTO_URL}/${imageUrl}?t=${timestamp}`;
          }
        } else if (imageUrl && imageUrl.path) {
          fullUrl = imageUrl.path.startsWith('http') 
            ? `${imageUrl.path}?t=${timestamp}`
            : `${PHOTO_URL}/${imageUrl.path}?t=${timestamp}`;
        } else {
          return null;
        }
        
        return {
          id: `existing-${index}`,
          name: `Image ${index + 1}`,
          type: 'image',
          objectUrl: fullUrl,
          isExisting: true,
          path: typeof imageUrl === 'string' ? imageUrl : (imageUrl.path || '')
        };
      }).filter(Boolean);
      
      setPreviews(existingImages);
    }
  }, [initialImages, PHOTO_URL, previews.length]);

  // Cleanup function for object URLs
  const cleanupPreview = useCallback((objectUrl) => {
    if (objectUrl && !objectUrl.startsWith('http') && previewCleanupRef.current.has(objectUrl)) {
      URL.revokeObjectURL(objectUrl);
      previewCleanupRef.current.delete(objectUrl);
    }
  }, []);

  // Clean up all previews on unmount
  useEffect(() => {
    return () => {
      previewCleanupRef.current.forEach(url => {
        URL.revokeObjectURL(url);
      });
      previewCleanupRef.current.clear();
    };
  }, []);

  const addMediaFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    
    if (previews.length + fileArray.length > MAX_MEDIA_UPLOADS) {
      throw new Error(`You can upload a maximum of ${MAX_MEDIA_UPLOADS} files.`);
    }
    
    const invalidFiles = fileArray.filter(file => 
      !ALLOWED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE
    );
    
    if (invalidFiles.length > 0) {
      throw new Error('Please upload only images (JPEG, PNG, GIF) or videos (MP4) under 5MB.');
    }

    const newPreviews = fileArray.map(file => {
      const objectUrl = URL.createObjectURL(file);
      previewCleanupRef.current.add(objectUrl);
      
      return { 
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: file.type.includes('video') ? 'video' : 'image',
        objectUrl,
        file
      };
    });
    
    setPreviews(prev => [...prev, ...newPreviews]);
    setMediaFiles(prev => [...prev, ...fileArray]);
  }, [previews.length]);  

  const removeMedia = useCallback((mediaId) => {
    setPreviews(prev => {
      const previewToRemove = prev.find(item => item.id === mediaId);
      
      if (!previewToRemove) return prev;
      
      if (previewToRemove.isExisting) {
        setRemovedExistingImages(prevRemoved => [...prevRemoved, previewToRemove.path]);
      } else {
        cleanupPreview(previewToRemove.objectUrl);
        setMediaFiles(prevFiles => 
          prevFiles.filter(file => file !== previewToRemove.file)
        );
      }
      
      return prev.filter(item => item.id !== mediaId);
    });
  }, [cleanupPreview]);

  const resetMedia = useCallback(() => {
    previews.forEach(preview => {
      if (!preview.isExisting) {
        cleanupPreview(preview.objectUrl);
      }
    });
    
    setPreviews([]);
    setMediaFiles([]);
    setRemovedExistingImages([]);
  }, [previews, cleanupPreview]);

  const shufflePreviews = useCallback(() => {
    setPreviews(prev => shuffleArray([...prev]));
  }, []);

  return {
    previews,
    mediaFiles,
    removedExistingImages,
    addMediaFiles,
    removeMedia,
    resetMedia,
    shufflePreviews
  };
};

// Star Rating Component
const StarRating = React.memo(({ rating, hoveredRating, onRatingChange, onMouseEnter, onMouseLeave, onMouseMove, disabled }) => {
  const displayRating = hoveredRating || rating;
  
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <div key={star} className="relative">
          <button
            type="button"
            onClick={() => onRatingChange(hoveredRating || star)}
            onMouseEnter={() => onMouseEnter(star)}
            onMouseMove={(e) => onMouseMove(e, star)}
            onMouseLeave={onMouseLeave}
            className="text-2xl focus:outline-none transition-transform hover:scale-110 relative cursor-pointer focus:ring-2 focus:ring-amber-300 rounded"
            disabled={disabled}
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <svg 
              className={`w-8 h-8 transition-colors duration-200 ${
                star <= Math.ceil(displayRating) && displayRating > 0 ? 'text-amber-500' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              {star <= Math.floor(displayRating) && displayRating > 0 ? (
                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
              ) : star === Math.ceil(displayRating) && !Number.isInteger(displayRating) && displayRating > 0 ? (
                <>
                  <defs>
                    <linearGradient id={`half-${star}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="rgb(209 213 219)" />
                    </linearGradient>
                  </defs>
                  <path 
                    fill={`url(#half-${star})`}
                    d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" 
                  />
                </>
              ) : (
                <path 
                  fill="none"
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" 
                />
              )}
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
});

StarRating.displayName = 'StarRating';

// Media Preview Component
const MediaPreview = React.memo(({ item, onRemove, disabled }) => (
  <div className="relative group cursor-default">
    {item.type === 'image' ? (
      <img 
        src={item.objectUrl} 
        alt={item.name || "Preview"} 
        className="w-full h-24 object-cover rounded-lg"
        loading="lazy"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    ) : (
      <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
        </svg>
      </div>
    )}
    <div className="w-full h-24 bg-gray-100 rounded-lg items-center justify-center hidden">
      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
      </svg>
    </div>
    
    <button
      type="button"
      onClick={() => onRemove(item.id)}
      className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-75 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer focus:ring-2 focus:ring-red-300"
      disabled={disabled}
      aria-label={`Remove ${item.name}`}
    >
      &times;
    </button>
    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate rounded-b-lg">
      {item.isExisting ? 'Existing image' : item.name}
    </div>
  </div>
));

MediaPreview.displayName = 'MediaPreview';

// Skeleton for Edit Review Form
const EditReviewFormSkeleton = () => (
  <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-screen overflow-y-auto">
    <div className="p-4 border-b sticky top-0 bg-white z-10">
      <div className="flex justify-between items-center">
        <div className="h-7 w-40 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
    
    <div className="p-4">
      <div className="mb-6">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse mb-1"></div>
        <div className="flex justify-end">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <div className="w-10 h-10 mx-auto bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-48 mx-auto bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-4 w-32 mx-auto bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 border-t pt-4">
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

const EditReviewFormPopup = ({ isOpen, onClose, id, reviewData, PHOTO_URL = 'https://git-hub-adil-qadri.onrender.com' }) => {
  const navigate = useNavigate();
  const [initialLoading, setInitialLoading] = useState(true);
  
  useEffect(() => {
    if (isOpen && reviewData) {
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, reviewData]);
  
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [touched, setTouched] = useState({
    name: false,
    comment: false
  });

  const { 
    previews, 
    mediaFiles, 
    removedExistingImages,
    addMediaFiles, 
    removeMedia, 
    resetMedia, 
    shufflePreviews 
  } = useMediaFiles(reviewData?.images, PHOTO_URL);
  
  const formErrors = useFormValidation(comment, rating);
  const commentLength = comment.length;
  const isFormValid = formErrors.length === 0;

  const resetForm = useCallback(() => {
    setRating(0);
    setHoveredRating(0);
    setComment('');
    setName('');
    setError(null);
    setSuccess(null);
    setTouched({
      name: false,
      comment: false
    });
    resetMedia();
  }, [resetMedia]);

  useEffect(() => {
    if (reviewData && isOpen) {
      const extractedRating = reviewData.rating || reviewData.five_star || 0;
      const extractedComment = reviewData.comment || reviewData.note || '';
      const extractedName = reviewData.userName || reviewData.title || reviewData.name || '';
      
      setRating(extractedRating);
      setComment(extractedComment);
      setName(extractedName);
      setError(null);
      setSuccess(null);
      setTouched({
        name: false,
        comment: false
      });
    }
  }, [reviewData, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleRatingChange = useCallback((newRating) => {
    setRating(newRating);
    setError(null);
  }, []);

  const handleMouseEnter = useCallback((star) => {
    setHoveredRating(star);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredRating(0);
  }, []);

  const handleMouseMove = useCallback((e, star) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const halfPoint = rect.left + rect.width / 2;
    const newRating = e.clientX < halfPoint ? star - 0.5 : star;
    setHoveredRating(newRating);
  }, []);

  const handleMediaUpload = useCallback((e) => {
    try {
      setError(null);
      
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
      const remainingSlots = MAX_MEDIA_UPLOADS - previews.length;
      if (remainingSlots <= 0) {
        setError(`You can upload a maximum of ${MAX_MEDIA_UPLOADS} files.`);
        return;
      }
      
      const filesToProcess = Array.from(e.target.files).slice(0, remainingSlots);
      
      const invalidFiles = filesToProcess.filter(file => 
        !ALLOWED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE
      );
      
      if (invalidFiles.length > 0) {
        setError('Please upload only images (JPEG, PNG, GIF) or videos (MP4) under 5MB.');
        return;
      }
      
      addMediaFiles(filesToProcess);
      e.target.value = '';
    } catch (err) {
      console.error('Error uploading media:', err);
      setError(err.message || 'Failed to upload media. Please try again.');
      if (e.target) {
        e.target.value = '';
      }
    }
  }, [addMediaFiles, previews.length]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      try {
        setError(null);
        
        const remainingSlots = MAX_MEDIA_UPLOADS - previews.length;
        if (remainingSlots <= 0) {
          setError(`You can upload a maximum of ${MAX_MEDIA_UPLOADS} files.`);
          return;
        }
        
        const filesToProcess = Array.from(e.dataTransfer.files).slice(0, remainingSlots);
        
        const invalidFiles = filesToProcess.filter(file => 
          !ALLOWED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE
        );
        
        if (invalidFiles.length > 0) {
          setError('Please upload only images (JPEG, PNG, GIF) or videos (MP4) under 5MB.');
          return;
        }
        
        addMediaFiles(filesToProcess);
      } catch (err) {
        console.error('Error uploading media:', err);
        setError(err.message || 'Failed to upload media. Please try again.');
      }
    }
  }, [addMediaFiles, previews.length]);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const handleCommentChange = useCallback((e) => {
    setComment(e.target.value);
    setError(null);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setError(formErrors.join('. '));
      return;
    }

    try { 
      setIsSubmitting(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('id', id);
      formData.append('review_id', reviewData.id);
      formData.append('five_star', rating);
      formData.append('note', comment);
      formData.append('title', name || 'Anonymous');
      formData.append('user_id', localStorage.getItem('user_id'));
      
      const remainingExistingImages = previews
        .filter(preview => preview.isExisting)
        .map(preview => {
          const path = preview.path;
          if (!path) return '';
          
          let cleanPath = path;
          if (cleanPath.includes('?')) {
            cleanPath = cleanPath.split('?')[0];
          }
          if (cleanPath.includes('/')) {
            cleanPath = cleanPath.split('/').pop();
          }
          return cleanPath;
        })
        .filter(Boolean);
      
      formData.append('existing_photos', JSON.stringify(remainingExistingImages || []));
      formData.append('removed_photos', JSON.stringify(removedExistingImages || []));
      
      if (mediaFiles.length > 0) {
        mediaFiles.forEach((file) => {
          formData.append('photos_videos', file);
        });
      }

      const response = await api.put(`edit-reviews/${reviewData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data?.success || response.status === 200 || response.status === 201) {
        setSuccess('Review updated successfully!');
        onClose();
        
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        setError('Review update failed. Please try again.');
      }
    } catch (err) {
      console.error('Error updating review:', err);
      setError(err.response?.data?.message || 'Failed to update review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [isFormValid, formErrors, id, rating, comment, name, mediaFiles, removedExistingImages, onClose, reviewData, previews]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && !isSubmitting) {
      onClose();
    }
  }, [onClose, isSubmitting]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-form-title"
      onClick={(e) => e.target === e.currentTarget && !isSubmitting && onClose()}
    >
      {initialLoading ? (
        <EditReviewFormSkeleton />
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-screen overflow-y-auto">
          <div className="p-4 border-b sticky top-0 bg-white z-10">
            <div className="flex justify-between items-center">
              <h2 id="review-form-title" className="text-xl font-semibold">Edit Your Review</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors focus:ring-2 focus:ring-gray-300 rounded"
                disabled={isSubmitting}
                aria-label="Close review form"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200" role="alert">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200" role="alert">
                {success}
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Your Rating
                <span className="text-red-500 ml-1">*</span>
              </label>
              <StarRating
                rating={rating}
                hoveredRating={hoveredRating}
                onRatingChange={handleRatingChange}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                disabled={isSubmitting}
              />
              <div className="mt-2 text-sm text-gray-600">
                {rating > 0 ? (
                  `Rating: ${rating} star${rating !== 1 ? 's' : ''}`
                ) : (
                  'No rating selected'
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="comment" className="block text-gray-700 mb-2 font-medium">
                Your Review
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={handleCommentChange}
                onBlur={() => handleBlur('comment')}
                className={`w-full p-3 border rounded-lg  focus:ring-[#B4945E] focus:border-[#8B7355]   transition-colors ${
                  touched.comment && !comment ? 'border-red-300' : 'border-gray-300'
                }`}
                rows="5"
                placeholder="Share your experience..."
                required
                disabled={isSubmitting}
                aria-describedby="comment-help comment-error"
                aria-invalid={touched.comment && !comment}
              />
              <div className="flex justify-between mt-1">
                {touched.comment && !comment && (
                  <p id="comment-error" className="text-sm text-red-500">Please enter your review</p>
                )}
                <span 
                  id="comment-help"
                  className={`text-sm ml-auto ${
                    commentLength > MAX_COMMENT_LENGTH ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  {commentLength}/{MAX_COMMENT_LENGTH}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Photos or Videos
                <span className="block text-sm font-normal text-gray-500 mt-1">
                  Maximum {MAX_MEDIA_UPLOADS} files (JPEG, PNG, GIF, MP4 under 5MB)
                </span>
              </label>
              
              {previews.length > 0 && (
                <div className="mt-4 mb-4">
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {previews.map(item => (
                      <MediaPreview
                        key={item.id}
                        item={item}
                        onRemove={removeMedia}
                        disabled={isSubmitting}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {previews.length < MAX_MEDIA_UPLOADS && (
                <div 
                  className="relative cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,video/mp4"
                    onChange={handleMediaUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    multiple
                    disabled={isSubmitting || previews.length >= MAX_MEDIA_UPLOADS}
                    id="media-upload"
                    aria-describedby="media-help"
                  />
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-amber-300 transition-colors cursor-pointer">
                    <svg 
                      className="w-10 h-10 mx-auto text-gray-400 mb-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600">
                      {previews.length >= MAX_MEDIA_UPLOADS ? (
                        'Maximum files uploaded'
                      ) : (
                        'Click to browse or drag and drop files'
                      )}
                    </p>
                    <p id="media-help" className="text-sm text-gray-500 mt-1">
                      {previews.length} of {MAX_MEDIA_UPLOADS} files selected
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 border-t pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-300"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#B4945E] text-white font-medium rounded-lg hover:bg-[#8B7355]   transition-colors flex items-center justify-center min-w-32 focus:ring-2 "
                disabled={isSubmitting || !isFormValid}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating... 
                  </>
                ) : (
                  'Update Review'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

EditReviewFormPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  reviewData: PropTypes.object.isRequired,
  PHOTO_URL: PropTypes.string
};

export default EditReviewFormPopup;