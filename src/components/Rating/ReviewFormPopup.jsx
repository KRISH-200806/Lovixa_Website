import React, { useState, useEffect, useCallback } from 'react';
import api from '../../Axios/axiosInstance';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Constants (could be moved to a separate config file)
const MAX_COMMENT_LENGTH = 500;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
const MAX_MEDIA_UPLOADS = 5;

const ReviewFormPopup = ({ isOpen, onClose, id }) => {
  const navigate = useNavigate();
  
  // Form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Preview state for images and media
  const [previews, setPreviews] = useState([]);
  
  // Validation state
  const [commentLength, setCommentLength] = useState(0);
  const [touched, setTouched] = useState({
    name: false,
    comment: false
  });

  // Update comment length counter
  useEffect(() => {
    setCommentLength(comment.length);
  }, [comment]);

  // Reset form when closing
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previews.forEach(preview => {
        if (preview.objectUrl) {
          URL.revokeObjectURL(preview.objectUrl);
        }
      });
    };
  }, [previews]);

  const resetForm = useCallback(() => {
    setRating(0);
    setHoveredRating(0);
    setComment('');
    setName('');
    setMediaFiles([]);
    setPreviews([]);
    setError(null);
    setSuccess(null);
    setTouched({
      name: false,
      comment: false
    });
  }, []);

  // Star rating handlers
  const handleRatingChange = useCallback((newRating) => {
    setRating(newRating);
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
    const newRating = e.clientX < halfPoint ? star - 1 : star;
    setHoveredRating(newRating);
  }, []);

  const handleMediaUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    
    if (mediaFiles.length + files.length > MAX_MEDIA_UPLOADS) {
      setError(`You can upload a maximum of ${MAX_MEDIA_UPLOADS} files.`);
      return;
    }
    
    const invalidFiles = files.filter(file => 
      !ALLOWED_FILE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE
    );
    
    if (invalidFiles.length > 0) {
      setError(`Please upload only images (JPEG, PNG, GIF) or videos (MP4) under 5MB.`);
      return;
    }

    try {
      setError(null);
      
      // Create previews with unique IDs
      const newPreviews = files.map(file => {
        return {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          type: file.type.includes('video') ? 'video' : 'image',
          objectUrl: URL.createObjectURL(file),
          file // Store the file reference
        };
      });
      
      setPreviews(prev => [...prev, ...newPreviews]);
      setMediaFiles(prev => [...prev, ...files]);
    } catch (err) {
      console.error('Error uploading media:', err);
      setError('Failed to upload media. Please try again.');
    }
  }, [mediaFiles.length]);

  const handleRemoveMedia = useCallback((mediaId) => {
    // Find and remove the preview
    const previewToRemove = previews.find(item => item.id === mediaId);
    
    if (previewToRemove) {
      // Clean up object URL
      if (previewToRemove.objectUrl) {
        URL.revokeObjectURL(previewToRemove.objectUrl);
      }
      
      // Remove from both states
      setPreviews(prev => prev.filter(item => item.id !== mediaId));
      setMediaFiles(prev => prev.filter((_, index) => 
        index !== previews.findIndex(p => p.id === mediaId)
      ));
    }
  }, [previews]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.files = e.dataTransfer.files;
      const event = { target: input };
      handleMediaUpload(event);
    }
  }, [handleMediaUpload]);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validateForm = useCallback(() => {
    const errors = [];
    
    if (!comment.trim()) errors.push('Please enter your review');
    if (comment.length > MAX_COMMENT_LENGTH) {
      errors.push(`Review exceeds ${MAX_COMMENT_LENGTH} characters`);
    }
    if (rating === 0) errors.push('Please select a rating');
    
    return errors;
  }, [comment, rating]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (formErrors.length > 0) {
      setError(formErrors.join('. '));
      return;
    }

    try { 
      setIsSubmitting(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('id', id);
      formData.append('five_star', rating);
      formData.append('note', comment);
      formData.append('title', name || 'Anonymous');
      
      // Append all media files with proper naming
      mediaFiles.forEach((file, index) => {
        formData.append('photos_videos', file); // Changed to match API expectation
      });

      const response = await api.post(`add-reviews/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data?.success || response.status === 200 || response.status === 201) {
        setSuccess('Review submitted successfully!');
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1500);
      } else {
        setError('Review submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, id, rating, comment, name, mediaFiles, onClose]);

  if (!isOpen) return null;
  
  // Use hoveredRating for display if available, otherwise use rating
  const displayRating = hoveredRating || rating;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-form-title"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-screen overflow-y-auto">
        <div className="p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <h2 id="review-form-title" className="text-xl font-semibold">Write a Review</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
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
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
              {success}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <div key={star} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      const newRating = hoveredRating || star;
                      handleRatingChange(newRating);
                    }}
                    onMouseEnter={() => handleMouseEnter(star)}
                    onMouseMove={(e) => handleMouseMove(e, star)}
                    onMouseLeave={handleMouseLeave}
                    className="text-2xl focus:outline-none transition-transform hover:scale-110 relative cursor-pointer"
                    disabled={isSubmitting}
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
              onChange={(e) => setComment(e.target.value)}
              onBlur={() => handleBlur('comment')}
              className={`w-full p-3 border rounded-lg focus:ring-[#B4945E] focus:border-[#8B7355]   ${
                touched.comment && !comment ? 'border-red-300' : 'border-gray-300'
              }`}
              rows="5"
              placeholder="Share your experience..."
              required
              disabled={isSubmitting}
              aria-describedby="comment-help comment-error"
              aria-invalid={touched.comment && !comment}
            ></textarea>
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
              Add Photos or Videos (Optional)
              <span className="block text-sm font-normal text-gray-500 mt-1">
                Maximum {MAX_MEDIA_UPLOADS} files (JPEG, PNG, GIF, MP4 under 5MB)
              </span>
            </label>
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
            
            {previews.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Media:</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {previews.map(item => (
                    <div key={item.id} className="relative group cursor-default">
                      {item.type === 'image' ? (
                        <img 
                          src={item.objectUrl} 
                          alt={item.name || "Preview"} 
                          className="w-full h-24 object-cover rounded-lg"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
                          </svg>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(item.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-75 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
                        disabled={isSubmitting}
                        aria-label={`Remove ${item.name}`}
                      >
                        &times;
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate rounded-b-lg">
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#B4945E]  text-white font-medium rounded-lg hover:bg-[#8B7355] transition-colors flex items-center justify-center min-w-32"
              disabled={isSubmitting || !comment.trim() || commentLength > MAX_COMMENT_LENGTH || rating === 0}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting... 
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ReviewFormPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

export default ReviewFormPopup;