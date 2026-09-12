import React, { useEffect, useRef } from 'react';

const VideoPopup = ({ product, onClose }) => {
  const videoRef = useRef(null);
  const popupRef = useRef(null);

  // Play video when popup opens and ensure seamless looping
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      // Start playing the video

      
      
      // Handle seamless looping for the popup video too
      const handleEnded = () => {
        videoElement.currentTime = 0;
        videoElement.play().catch(e => {

          
          videoElement.currentTime = 0;
        });
      };
      
      videoElement.addEventListener('ended', handleEnded);
      
      // Close popup when clicking outside
      const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        videoElement.removeEventListener('ended', handleEnded);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div 
        ref={popupRef}
        className="bg-white rounded-lg overflow-hidden max-w-3xl w-full relative flex flex-col md:flex-row"
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
          aria-label="Close popup"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* Video section - takes up left half on desktop, full width on mobile */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            controls
            autoPlay
            muted
            playsInline
            loop
          >
            <source src={product.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Product details section - takes up right half on desktop */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-xl font-bold mb-2">{product.name}</h2>
          
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-amber-800">₹{product.currentPrice}</span>
            <span className="ml-2 text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
            <span className="ml-2 bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
              {Math.round((product.originalPrice - product.currentPrice) / product.originalPrice * 100)}% OFF
            </span>
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Features</h3>
            <ul className="list-disc pl-5">
              {product.features.map((feature, index) => (
                <li key={index} className="text-gray-700">{feature}</li>
              ))}
            </ul>
            <button 
              className="text-blue-600 text-sm mt-2 hover:underline"
              onClick={() => {/* Handle read more */}}
            >
              Read more
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded"
              onClick={() => {/* Handle more info action */}}
            >
              More info
            </button>
            <button 
              className="flex-1 bg-black hover:bg-gray-900 text-white py-2 px-4 rounded"
              onClick={() => {/* Handle add to cart action */}}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  ); 
};

export default VideoPopup;