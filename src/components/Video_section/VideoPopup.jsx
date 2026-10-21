import React, { useEffect, useRef } from 'react';
import { useCart } from "../Context/CartContext";
import { toast } from "react-toastify";

const VideoPopup = ({ product, onClose }) => {
  const { addToCart } = useCart();
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
            <span className="text-2xl font-bold text-brand">₹{product.currentPrice}</span>
            <span className="ml-2 text-lg text-text-secondary line-through">₹{product.originalPrice}</span>
            <span className="ml-2 bg-sage/15 text-sage-dark border border-sage/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {Math.round((product.originalPrice - product.currentPrice) / product.originalPrice * 100)}% OFF
            </span>
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold text-text-main mb-1">Description</h3>
            <p className="text-text-secondary text-sm">{product.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-text-main mb-2">Features</h3>
            <ul className="list-disc pl-5 space-y-1">
              {product.features.map((feature, index) => (
                <li key={index} className="text-text-secondary text-xs">{feature}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="flex-1 bg-brand hover:bg-brand-hover text-white py-3 px-4 rounded-xl font-bold text-xs transition-all shadow-brand/30 hover:scale-105 active:scale-95"
              onClick={async () => {
                const res = await addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.currentPrice,
                  effective_price: product.currentPrice,
                  image: product.videoUrl,
                }, 1);
                if (res.success) {
                  toast.success(`${product.name} added to bag!`);
                  onClose();
                } else {
                  toast.error(res.message || "Failed to add to cart");
                }
              }}
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