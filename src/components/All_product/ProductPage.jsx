// import React, { useState, useEffect, useContext } from "react";
// import { useParams } from "react-router-dom";
// import api from "../../Axios/axiosInstance";
// import { CartContext } from "../Context/CartContext";
// import CartPanel from "../Navbar/CartPanel";
// // Added missing import

// // Payment images
// import gpay from "../../assets/image/payment/gpay.png";
// import phonepe from "../../assets/image/payment/phonepe.png";
// import paypal from "../../assets/image/payment/paypal.png";
// import bhim from "../../assets/image/payment/bhim.png";

// // Additional components
// import FAQ from "./FAQ";
// import Rating from "../Rating/ReviewSystem";
// import PerfumeMarketingPage from "../PerfumeMarketingPage/PerfumeMarketingPage";

// function ProductPage() {
//   const { id } = useParams();
//   const [quantity, setQuantity] = useState(1);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  
//   const { cartItems, setCartItems } = useContext(CartContext);
  
//   // Check if user is logged in
//   const isLoggedIn = !!localStorage.getItem("token");
  
//   // Button should be disabled if not logged in or product unavailable
//   const isDisabled = !isLoggedIn || (product && !product.availability);

//   const paymentImages = [
//     { name: "Google Pay", src: gpay },
//     { name: "Phonepe", src: phonepe },
//     { name: "PayPal", src: paypal },
//     { name: "Bhim", src: bhim },
//   ];

//   // Function to render product labels based on API data
//   const renderProductLabel = () => {
//     if (!product) return null;

//     if (product.new_arrival) {
//       return (
//         <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
//           New Arrival
//         </span>
//       );
//     }

//     if (product.is_trending) {
//       return (
//         <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
//           Trending
//         </span>
//       );
//     }

//     if (product.is_sale) {
//       return (
//         <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
//           Sale
//         </span>
//       );
//     }

//     return null;
//   };

//   // Fetch product by ID
//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`get-product-by-id/`, {
//           params: { product_id: id }
//         });
//         if (response.data && response.data.product) {
//           setProduct(response.data.product);
//           if (response.data.product.availability === false) {
//             setShowOutOfStockPopup(true);
//           }
//         } else {
//           console.error("Product data not found in response");
//         }
//       } catch (error) {
//         console.error("Error fetching product data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchProductData();
//   }, [id]);

//   // Add to cart function
//   const addToCart = async () => {
//     if (!product || !product.availability) {
//       setShowOutOfStockPopup(true);
//       return;
//     }
    
//     const price = product.product_price || 0;
//     const originalPrice = product.product_old_price || price;
//     const image = product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg';
    
//     try {
//       // First try to add via API if logged in
//       if (isLoggedIn) {
//         for (let i = 0; i < quantity; i++) {
//           await api.post('add-to-cart/' + product.id);
//         }
//       }
      
//       // Update local cart state
//       const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
      
//       if (existingItemIndex >= 0) {
//         const updatedItems = [...cartItems];
//         updatedItems[existingItemIndex].quantity += quantity;
//         setCartItems(updatedItems);
//       } else {
//         setCartItems([...cartItems, {
//           id: product.id,
//           name: product.product_name,
//           price: price,
//           discountedPrice: price,
//           originalPrice: originalPrice,
//           image: image,
//           variant: 'Default',
//           quantity: quantity
//         }]);
//       }
      
//       // Save to localStorage
//       localStorage.setItem('cartItems', JSON.stringify(cartItems));
//       setIsCartOpen(true);
//     } catch (error) {
//       console.error('Error adding item to cart:', error);
//       // Fallback to local storage if API fails
//       const updatedItems = existingItemIndex >= 0 
//         ? cartItems.map(item => 
//             item.id === product.id 
//               ? {...item, quantity: item.quantity + quantity} 
//               : item
//           )
//         : [...cartItems, {
//             id: product.id,
//             name: product.product_name,
//             price: price,
//             discountedPrice: price,
//             originalPrice: originalPrice,
//             image: image,
//             variant: 'Default',
//             quantity: quantity
//           }];
      
//       setCartItems(updatedItems);
//       localStorage.setItem('cartItems', JSON.stringify(updatedItems));
//       setIsCartOpen(true);
//     }
//   };

//   // Handle updating quantity in cart
//   const handleUpdateQuantity = async (id, newQuantity) => {
//     if (newQuantity < 1) return;
    
//     const updatedItems = cartItems.map(item =>
//       item.id === id ? { ...item, quantity: newQuantity } : item
//     );
//     setCartItems(updatedItems);
//     localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
//     // Also update on server if logged in
//     if (isLoggedIn) {
//       try {
//         await api.put(`update-cart-item/${id}`, { quantity: newQuantity });
//       } catch (error) {
//         console.error("Error updating cart item quantity:", error);
//       }
//     }
//   };

//   // Handle removing item from cart
//   const handleRemoveItem = async (id) => {
//     const updatedItems = cartItems.filter(item => item.id !== id);
//     setCartItems(updatedItems);
//     localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
//     // Also remove from server if logged in
//     if (isLoggedIn) {
//       try {
//         await api.delete(`remove-from-cart/${id}`);
//       } catch (error) {
//         console.error("Error removing item from cart:", error);
//       }
//     }
//   };

//   // Skeleton loading component
//   const ProductSkeleton = () => {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-6 h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
        
//         <div className="grid gap-8 md:grid-cols-2 mt-20">
//           <div className="space-y-4">
//             <div className="relative aspect-square overflow-hidden rounded-xl border bg-gray-200 animate-pulse"></div>
//             <div className="flex gap-4 overflow-x-auto pb-2">
//               {[1, 2, 3].map((_, i) => (
//                 <div key={i} className="h-20 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
//               ))}
//             </div>
//           </div>
          
//           <div className="space-y-6">
//             <div className="flex items-center gap-2 mb-2">
//               <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
//             </div>
            
//             <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
            
//             <div className="flex gap-2">
//               {[1, 2, 3].map((_, i) => (
//                 <div key={i} className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
//               ))}
//             </div>
            
//             <div className="space-y-2">
//               <div className="flex items-baseline gap-2">
//                 <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
//               </div>
//               <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
//             </div>
            
//             <div className="space-y-4">
//               <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
//               <div className="grid grid-cols-2 gap-4">
//                 {[1, 2].map((_, i) => (
//                   <div key={i} className="rounded-lg border p-4 h-40 bg-gray-100">
//                     <div className="mx-auto mb-2 h-24 w-24 bg-gray-200 rounded animate-pulse"></div>
//                     <div className="h-4 w-3/4 mx-auto bg-gray-200 rounded animate-pulse mb-2"></div>
//                     <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded animate-pulse"></div>
//                   </div>
//                 ))}
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               <div className="flex items-center gap-4">
//                 <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse"></div>
//               </div>
//               <div className="h-4 w-48 mx-auto bg-gray-200 rounded animate-pulse"></div>
//             </div>
            
//             <div className="rounded-lg bg-gray-200 h-16 animate-pulse"></div>
            
//             <div className="space-y-2">
//               <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
//               <div className="space-y-2">
//                 {[1, 2].map((_, i) => (
//                   <div key={i} className="rounded-lg border h-16 bg-gray-100 animate-pulse"></div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return <ProductSkeleton />;
//   }

//   if (!product) {
//     return (
//       <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
//         <h2 className="text-2xl font-semibold text-gray-700 mb-4">Product not found</h2>
//         <p className="text-gray-500">The product you're looking for doesn't exist or may have been removed.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Breadcrumb */}
//       <div className="mb-6 text-sm text-gray-500">
//         <span>Home</span> / <span>{product.product_name}</span>
//       </div>

//       {/* Product layout */}
//       <div className="grid gap-8 md:grid-cols-2 mt-20">
//         {/* Left: Image gallery */}
//         <div className="space-y-4">
//           <div className="relative aspect-square sm:h-[350px] sm:w-[610px] md:h-[350px] md:w-[350px] lg:h-[400px] lg:w-[480px] xl:h-[470px] xl:w-[620px] 2xl:h-[470px] 2xl:w-[720px] overflow-hidden rounded-xl border">
//             {product.images && product.images.length > 0 ? (
//               <img
//                 src={product.images[selectedImage]}
//                 alt={product.product_name}
//                 className="h-[100%] w-[100%] object-contain"
//               />
//             ) : (
//               <div className="h-full w-full bg-gray-100 flex items-center justify-center">
//                 <span className="text-gray-400">No image available</span>
//               </div>
//             )}
//             {renderProductLabel()}
//           </div>

//           <div className="relative">
//             <div className="flex gap-4 overflow-x-auto pb-2">
//               {product.images && product.images.length > 0 ? (
//                 product.images.map((img, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setSelectedImage(i)}
//                     className={`relative min-w-[80px] overflow-hidden rounded-lg border-2 transition-all
//                       ${selectedImage === i ? "border-[#B4945E]" : "border-transparent opacity-50 hover:opacity-75"}`}
//                   >
//                     <img 
//                       src={img} 
//                       className="h-20 w-20 object-contain" 
//                       alt={`Product view ${i + 1}`}
//                     />
//                   </button>
//                 ))
//               ) : (
//                 <div className="h-20 w-20 bg-gray-100 flex items-center justify-center rounded-lg">
//                   <span className="text-xs text-gray-400">No images</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Right: Product info */}
//         <div className="space-y-3">
//           <div>
//             <div className="mb-2 flex items-center gap-2">
//               {product.average_rating && (
//                 <>
//                   <div className="flex items-center text-yellow-500">
//                     <span>★</span>
//                     <span className="ml-1 text-sm font-medium">{product.average_rating}</span>
//                   </div>
//                   <span className="text-sm text-gray-500">({product.total_reviews || 0} ratings)</span>
//                 </>
//               )}
//             </div>
//             <h1 className="text-2xl font-semibold mb-2">{product.product_name}</h1>
//             <div className="mb-0">
//               {product.availability ? (
//                 <span className="text-green-600 font-medium">In Stock</span>
//               ) : (
//                 <span className="text-red-600 font-medium">Out of Stock</span>
//               )}
//             </div>
//           </div>

//           {/* Price */}
//           <div className="space-y-2">
//             <div className="flex items-baseline gap-2">
//               <span className="text-2xl font-bold">₹{product.product_price?.toLocaleString() || 'N/A'}</span>
//               {product.product_old_price && product.product_old_price > product.product_price && (
//                 <>
//                   <span className="text-gray-500 line-through">₹{product.product_old_price.toLocaleString()}</span>
//                   {product.discount_percentage && (
//                     <span className="text-sm font-medium text-green-600">
//                       {Math.round(((product.product_old_price - product.product_price) / product.product_old_price * 100))}% OFF
//                     </span>
//                   )}
//                 </>
//               )}
//             </div>
//             <p className="text-sm text-gray-500">MRP (Inclusive Of All Taxes)</p>
//           </div>

//           {/* Product Details */}
//           <div className="mt-4">
//             <h3 className="font-medium mb-2">Product Details</h3>
//             <div className="prose max-w-none text-gray-700">
//               {product.product_details ? (
//                 product.product_details.split('\r\n').map((paragraph, i) => (
//                   <p key={i} className="mb-2">{paragraph}</p>
//                 ))
//               ) : (
//                 <p className="text-gray-500">No product details available</p>
//               )}
//             </div>
//           </div>

//           {/* Quantity + Cart button */}
//           <div className="space-y-4 mt-6">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center rounded-md border">
//                 <button
//                   className="h-10 w-10 flex items-center justify-center text-gray-500 hover:bg-gray-100"
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   disabled={quantity <= 1}
//                 >
//                   −
//                 </button>
//                 <input 
//                   type="number" 
//                   value={quantity}
//                   min="1"
//                   onChange={(e) => {
//                     const value = parseInt(e.target.value) || 1;
//                     setQuantity(Math.max(1, value));
//                   }}
//                   className="h-10 w-16 border-x text-center text-sm focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
//                 />
//                 <button 
//                   className="h-10 w-10 flex items-center justify-center text-gray-500 hover:bg-gray-100"
//                   onClick={() => setQuantity(quantity + 1)}
//                 >
//                   +
//                 </button>
//               </div>
//               <button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   if (!isDisabled) {
//                     addToCart();
//                   } else {
//                     if (!isLoggedIn) {
//                       alert("Please login first to add to cart.");
//                     }
//                   }
//                 }}
//                 disabled={isDisabled}
//                 className={`mt-auto w-full ${
//                   isDisabled
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-[#B4945E] hover:bg-[#8B7355]"
//                 } text-white py-2 px-4 rounded-md transition-all duration-500 text-sm flex items-center justify-center overflow-hidden relative`}
//               >
//                 <span className="group-hover:translate-y-0 translate-y-0 transition-transform duration-300 flex items-center">
                  
//                   {!isLoggedIn
//                     ? "Please Login"
//                     : product.availability === false
//                     ? "Out of Stock"
//                     : "Add to Cart"}
//                 </span>
//               </button>
//             </div>
//             <p className="text-center text-sm">✓ Delivery within 4-5 days</p>

//             {/* UPI Discounts */}
//             <div className="rounded-lg bg-[#2D1810] p-4 text-white">
//               <div className="flex items-center justify-between">
//                 <p className="text-sm">Extra Discount on all UPI Payments</p>
//                 <div className="flex gap-2">
//                   {paymentImages.map((payment, index) => (
//                     <img 
//                       key={index} 
//                       src={payment.src} 
//                       alt={payment.name} 
//                       className="h-6 w-6 md:h-6 md:w-6 object-contain rounded-full bg-white p-1" 
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Coupons */}
//             <div className="space-y-2">
//               <h3 className="font-medium">Coupons & Offers</h3>
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between rounded-lg border p-4">
//                   <div className="flex items-center gap-2">
//                     <span className="text-green-600">●</span>
//                     <span>Buy 1 product & get 5% Off</span>
//                   </div>
//                   <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs">SAVED ₹</span>
//                 </div>
//                 <div className="flex items-center justify-between rounded-lg border p-4">
//                   <div className="flex items-center gap-2">
//                     <span className="text-green-600">●</span>
//                     <span>Buy 2 products & get 10% Off</span>
//                   </div>
//                   <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs">SAVED ₹</span>
//                 </div>
//               </div>
//             </div>
//           </div>  
//         </div>
//       </div>

//       {/* Additional sections */}
//       <PerfumeMarketingPage />
//       <FAQ />
//       <Rating id={id} />

//       {/* Cart Panel */}
//       <CartPanel 
//         isOpen={isCartOpen}
//         onClose={() => setIsCartOpen(false)}
//         items={cartItems}
//         onUpdateQuantity={handleUpdateQuantity}
//         onRemoveItem={handleRemoveItem}
//         onCartUpdate={setCartItems}
//       />

//       {/* Out of Stock Popup */}
//       {showOutOfStockPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold text-red-600">Product Out of Stock</h3>
//               <button 
//                 onClick={() => setShowOutOfStockPopup(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <div className="mb-6">
//               <p className="text-gray-700 mb-4">We're sorry, but {product?.product_name} is currently out of stock.</p>
//               <p className="text-gray-600">Please check back later or browse our other products.</p>
//             </div>
//             <div className="flex justify-end">
//               <button
//                 onClick={() => setShowOutOfStockPopup(false)}
//                 className="bg-[#B4945E] text-white px-4 py-2 rounded-md hover:bg-[#8B7355] transition-colors"
//               >
//                 Continue Shopping
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ProductPage;






import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../Axios/axiosInstance";
import { CartContext } from "../Context/CartContext";
import CartPanel from "../Navbar/CartPanel";
// Added missing import

// Payment images
import gpay from "../../assets/image/payment/gpay.png";
import phonepe from "../../assets/image/payment/phonepe.png";
import paypal from "../../assets/image/payment/paypal.png";
import bhim from "../../assets/image/payment/bhim.png";

// Additional components
import FAQ from "./FAQ";
import Rating from "../Rating/ReviewSystem";
import PerfumeMarketingPage from "../PerfumeMarketingPage/PerfumeMarketingPage";
import { toast } from "react-toastify";

function ProductPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  
  const { cartItems, setCartItems } = useContext(CartContext);
  
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("token");
  
  // Button should be disabled if not logged in or product unavailable
  const isDisabled = !isLoggedIn || (product && !product.availability);

  const paymentImages = [
    { name: "Google Pay", src: gpay },
    { name: "Phonepe", src: phonepe },
    { name: "PayPal", src: paypal },
    { name: "Bhim", src: bhim },
  ];

  // Function to render product labels based on API data
  const renderProductLabel = () => {
    if (!product) return null;

    if (product.new_arrival) {
      return (
        <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
          New Arrival
        </span>
      );
    }

    if (product.is_trending) {
      return (
        <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
          Trending
        </span>
      );
    }

    if (product.is_sale) {
      return (
        <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
          Sale
        </span>
      );
    }

    return null;
  };

  // Fetch product by ID
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`get-product-by-id/`, {
          params: { product_id: id }
        });
        if (response.data && response.data.product) {
          setProduct(response.data.product);
          if (response.data.product.availability === false) {
            setShowOutOfStockPopup(true);
          }
        } else {
          console.error("Product data not found in response");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [id]);

  // Add to cart function
  const addToCart = async () => {
    if (!product || !product.availability) {
      setShowOutOfStockPopup(true);
      return;
    }
    
    const price = product.product_price || 0;
    const originalPrice = product.product_old_price || price;
    const image = product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg';
    
    try {
      // First try to add via API if logged in
      if (isLoggedIn) {
        for (let i = 0; i < quantity; i++) {
          await api.post('add-to-cart/' + product.id);
        }
      }
      
      // Update local cart state
      const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += quantity;
        setCartItems(updatedItems);
      } else {
        setCartItems([...cartItems, {
          id: product.id,
          name: product.product_name,
          price: price,
          discountedPrice: price,
          originalPrice: originalPrice,
          image: image,
          variant: 'Default',
          quantity: quantity
        }]);
      }
      
      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      setIsCartOpen(true);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      // Fallback to local storage if API fails
      const updatedItems = existingItemIndex >= 0 
        ? cartItems.map(item => 
            item.id === product.id 
              ? {...item, quantity: item.quantity + quantity} 
              : item
          )
        : [...cartItems, {
            id: product.id,
            name: product.product_name,
            price: price,
            discountedPrice: price,
            originalPrice: originalPrice,
            image: image,
            variant: 'Default',
            quantity: quantity
          }];
      
      setCartItems(updatedItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      setIsCartOpen(true);
    }
  };

  // Handle updating quantity in cart
  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // Also update on server if logged in
    if (isLoggedIn) {
      try {
        await api.put(`update-cart-item/${id}`, { quantity: newQuantity });
      } catch (error) {
        console.error("Error updating cart item quantity:", error);
      }
    }
  };

  // Handle removing item from cart
  const handleRemoveItem = async (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // Also remove from server if logged in
    if (isLoggedIn) {
      try {
        await api.delete(`remove-from-cart/${id}`);
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  };

  // Skeleton loading component
  const ProductSkeleton = () => {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
        
        <div className="grid gap-8 md:grid-cols-2 mt-20">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl border bg-gray-200 animate-pulse"></div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="h-20 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
            
            <div className="flex gap-2">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((_, i) => (
                  <div key={i} className="rounded-lg border p-4 h-40 bg-gray-100">
                    <div className="mx-auto mb-2 h-24 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 mx-auto bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-48 mx-auto bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            <div className="rounded-lg bg-gray-200 h-16 animate-pulse"></div>
            
            <div className="space-y-2">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-2">
                {[1, 2].map((_, i) => (
                  <div key={i} className="rounded-lg border h-16 bg-gray-100 animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Product not found</h2>
        <p className="text-gray-500">The product you're looking for doesn't exist or may have been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500">
        <span>Home</span> / <span>{product.product_name}</span>
      </div>

      {/* Product layout */}
      <div className="grid gap-8 md:grid-cols-2 mt-20">
        {/* Left: Image gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square sm:h-[350px] sm:w-[610px] md:h-[350px] md:w-[350px] lg:h-[400px] lg:w-[480px] xl:h-[470px] xl:w-[620px] 2xl:h-[470px] 2xl:w-[720px] overflow-hidden rounded-xl border">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[selectedImage]}
                alt={product.product_name}
                className="h-[100%] w-[100%] object-contain"
              />
            ) : (
              <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
            {renderProductLabel()}
          </div>

          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images && product.images.length > 0 ? (
                product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative min-w-[80px] overflow-hidden rounded-lg border-2 transition-all
                      ${selectedImage === i ? "border-[#B4945E]" : "border-transparent opacity-50 hover:opacity-75"}`}
                  >
                    <img 
                      src={img} 
                      className="h-20 w-20 object-contain" 
                      alt={`Product view ${i + 1}`}
                    />
                  </button>
                ))
              ) : (
                <div className="h-20 w-20 bg-gray-100 flex items-center justify-center rounded-lg">
                  <span className="text-xs text-gray-400">No images</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Product info */}
        <div className="space-y-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              {product.average_rating && (
                <>
                  <div className="flex items-center text-yellow-500">
                    <span>★</span>
                    <span className="ml-1 text-sm font-medium">{product.average_rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.total_reviews || 0} ratings)</span>
                </>
              )}
            </div>
            <h1 className="text-2xl font-semibold mb-2">{product.product_name}</h1>
            <div className="mb-0">
              {product.availability ? (
                <span className="text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">₹{product.product_price?.toLocaleString() || 'N/A'}</span>
              {product.product_old_price && product.product_old_price > product.product_price && (
                <>
                  <span className="text-gray-500 line-through">₹{product.product_old_price.toLocaleString()}</span>
                  {product.discount_percentage && (
                    <span className="text-sm font-medium text-green-600">
                      {Math.round(((product.product_old_price - product.product_price) / product.product_old_price * 100))}% OFF
                    </span>
                  )}
                </>
              )}
            </div>
            <p className="text-sm text-gray-500">MRP (Inclusive Of All Taxes)</p>
          </div>

          {/* Product Details */}
          <div className="mt-4">
            <h3 className="font-medium mb-2">Product Details</h3>
            <div className="prose max-w-none text-gray-700">
              {product.product_details ? (
                product.product_details.split('\r\n').map((paragraph, i) => (
                  <p key={i} className="mb-2">{paragraph}</p>
                ))
              ) : (
                <p className="text-gray-500">No product details available</p>
              )}
            </div>
          </div>

          {/* Quantity + Cart button */}
          <div className="space-y-4 mt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-md border">
                <button
                  className="h-10 w-10 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  min="1"
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setQuantity(Math.max(1, value));
                  }}
                  className="h-10 w-16 border-x text-center text-sm focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button 
                  className="h-10 w-10 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (!isDisabled) {
                    addToCart();
                  } else {
                    if (!isLoggedIn) {
                      toast.error("Please login first to add to cart.");
                    }
                  }
                }}
                // disabled={isDisabled}
                className={`mt-auto w-full ${
                  isDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#B4945E] hover:bg-[#8B7355]"
                } text-white py-2 px-4 rounded-md transition-all duration-500 text-sm flex items-center justify-center overflow-hidden relative`}
              >
                <span className="group-hover:translate-y-0 translate-y-0 transition-transform duration-300 flex items-center">
                  
                  {!isLoggedIn
                    ? "Please Login"
                    : product.availability === false
                    ? "Out of Stock"
                    : "Add to Cart"}
                </span>
              </button>
            </div>
            <p className="text-center text-sm">✓ Delivery within 4-5 days</p>

            {/* UPI Discounts */}
            <div className="rounded-lg bg-[#2D1810] p-4 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm">Extra Discount on all UPI Payments</p>
                <div className="flex gap-2">
                  {paymentImages.map((payment, index) => (
                    <img 
                      key={index} 
                      src={payment.src} 
                      alt={payment.name} 
                      className="h-6 w-6 md:h-6 md:w-6 object-contain rounded-full bg-white p-1" 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Coupons */}
            <div className="space-y-2">
              <h3 className="font-medium">Coupons & Offers</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">●</span>
                    <span>Buy 1 product & get 5% Off</span>
                  </div>
                  <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs">SAVED ₹</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">●</span>
                    <span>Buy 2 products & get 10% Off</span>
                  </div>
                  <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs">SAVED ₹</span>
                </div>
              </div>
            </div>
          </div>  
        </div>
      </div>

      {/* Additional sections */}
      <PerfumeMarketingPage />
      <FAQ />
      <Rating id={id} />

      {/* Cart Panel */}
      <CartPanel 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCartUpdate={setCartItems}
      />

      {/* Out of Stock Popup */}
      {showOutOfStockPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-red-600">Product Out of Stock</h3>
              <button 
                onClick={() => setShowOutOfStockPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">We're sorry, but {product?.product_name} is currently out of stock.</p>
              <p className="text-gray-600">Please check back later or browse our other products.</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowOutOfStockPopup(false)}
                className="bg-[#B4945E] text-white px-4 py-2 rounded-md hover:bg-[#8B7355] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;