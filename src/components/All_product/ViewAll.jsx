// import { useState, useEffect, useContext, useCallback, useRef } from "react";
// import { ChevronRight, Star, ShoppingCart } from "lucide-react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import api from "../../Axios/axiosInstance";
// import URL from "../../Axios/URL";
// import CartPanel from "../Navbar/CartPanel";
// import { CartContext } from "../Context/CartContext";

// const ViewAll = ({product}) => {
//   const [gridView, setGridView] = useState(true);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
//   const [outOfStockProduct, setOutOfStockProduct] = useState(null);
//   const { cartItems, setCartItems } = useContext(CartContext);

//   const setHandleCartAdd = useState(null)[1];
//   const [products, setProducts] = useState([]);
//   const [categoryName, setCategoryName] = useState("Products");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);

//   const observerRef = useRef();
//   const lastProductRef = useRef();

//   const params = useParams();
//   const location = useLocation();
//   const categoryId = params.id || location.state?.categoryId;

//   const [check, setcheck] = useState(false);

//   // ✅ Check if user is logged in
//   const isLoggedIn = !!localStorage.getItem("token");

//   // ✅ Button should be disabled if not logged in or product unavailable
//   const isDisabled = !isLoggedIn

//   // Intersection Observer for infinite scroll
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
//           loadMoreProducts();
//         }
//       },
//       { threshold: 0.1 }
//     );

//     observerRef.current = observer;
//     return () => {
//       if (observerRef.current) {
//         observerRef.current.disconnect();
//       }
//     };
//   }, [hasMore, isLoadingMore]);

//   // Observe the last product element
//   useEffect(() => {
//     if (lastProductRef.current && observerRef.current) {
//       observerRef.current.observe(lastProductRef.current);
//     }
//     return () => {
//       if (lastProductRef.current && observerRef.current) {
//         observerRef.current.unobserve(lastProductRef.current);
//       }
//     };
//   }, [products]);

//   // Function to load more products
//   const loadMoreProducts = async () => {
//     if (isLoadingMore || !hasMore) return;

//     setIsLoadingMore(true);
//     try {
//       const response = await api.get(
//         `get-products/?category_id=${categoryId}&page=${currentPage + 1}`
//       );

//       if (
//         response.data &&
//         response.data.results &&
//         response.data.results.data &&
//         response.data.results.data.length > 0
//       ) {
//         setProducts((prevProducts) => [
//           ...prevProducts,
//           ...response.data.results.data,
//         ]);
//         setCurrentPage(currentPage + 1);

//         // Check if there are more pages
//         if (response.data.next === null) {
//           setHasMore(false);
//         }
//       } else {
//         setHasMore(false);
//       }
//     } catch (err) {
//       console.error("Error loading more products:", err);
//     } finally {
//       setIsLoadingMore(false);
//     }
//   };

//   // Fetch products when component mounts or categoryId changes
//   useEffect(() => {
//     if (!categoryId) {
//       setProducts([]);
//       return;
//     }

//     const fetchProducts = async () => {
//       try {
//         const response = await api.get(
//           `get-products/?category_id=${categoryId}&page=1`
//         );

//         if (
//           response.data &&
//           response.data.results &&
//           response.data.results.data &&
//           response.data.results.data.length > 0
//         ) {
//           setProducts(response.data.results.data);
//           setCategoryName(
//             response.data.results.data[0]?.category_name || "Products"
//           );
//           setCurrentPage(1);

//           // Check if there are more pages
//           if (response.data.next === null) {
//             setHasMore(false);
//           } else {
//             setHasMore(true);
//           }
//         } else {
//           setProducts([]);
//           setHasMore(false);
//         }
//       } catch (err) {
//         console.error("Error fetching products:", err);
//         setProducts([]);
//         setHasMore(false);
//       }
//     };

//     fetchProducts();
//   }, [categoryId]);

//   const formatCurrency = (amount) => {
//     return parseFloat(amount.toFixed(2));
//   };

//   const renderProductLabel = (product) => {
//     if (!product) return null;

//     if (product.new_arrival) {
//       return (
//         <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-0.5 rounded-full font-medium shadow-sm">
//           New Arrival
//         </span>
//       );
//     }

//     if (product.is_trending) {
//       return (
//         <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-3 py-0.5 rounded-full font-medium shadow-sm">
//           Trending
//         </span>
//       );
//     }

//     if (product.is_sale) {
//       return (
//         <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-0.5 rounded-full font-medium shadow-sm">
//           Sale
//         </span>
//       );
//     }

//     return null;
//   };

//   const addToCart = useCallback(
//     (product) => {
//       if (product.availability === false) {
//         setOutOfStockProduct(product);
//         setShowOutOfStockPopup(true);
//         return;
//       }

//       const price = product.product_price || 0;
//       const originalPrice = product.product_old_price || price;
//       const image = product.images ? product.images[0] : "/placeholder.svg";

//       api
//         .post("add-to-cart/" + product.id, {
//           id: product.id,
//           name: product.product_name,
//           price: price,
//           discountedPrice: price,
//           originalPrice: originalPrice,
//           image: image,
//           variant: "Default",
//           quantity: 1,
//         })
//         .then((response) => {
//           if (response.data && Array.isArray(response.data.items)) {
//             setCartItems(response.data.items);
//           } else if (response.data && response.data.cartItems) {
//             setCartItems(response.data.cartItems);
//           } else if (response.data && response.data.cart) {
//             setCartItems(response.data.cart);
//           } else {
//             const existingItemIndex = cartItems.findIndex(
//               (item) => item.id === product.id
//             );
//             if (existingItemIndex >= 0) {
//               const updatedItems = [...cartItems];
//               updatedItems[existingItemIndex].quantity += 1;
//               setCartItems(updatedItems);
//             } else {
//               setCartItems([
//                 ...cartItems,
//                 {
//                   id: product.id,
//                   name: product.product_name,
//                   price: price,
//                   discountedPrice: price,
//                   originalPrice: originalPrice,
//                   image: image,
//                   variant: "Default",
//                   quantity: 1,
//                 },
//               ]);
//             }
//           }
//           setIsCartOpen(true);
//         })
//         .catch((error) => {
//           console.error("Error adding item to cart:", error);
//           alert("Failed to add item to cart. Please try again.");
//         });
//     },
//     [cartItems, setCartItems]
//   );

//   const handleUpdateQuantity = async (id, newQuantity) => {
//     if (newQuantity < 1) return;
//     const updatedItems = cartItems.map((item) =>
//       item.id === id ? { ...item, quantity: newQuantity } : item
//     );
//     setCartItems(updatedItems);
//     setIsCartOpen(true);
//   };

//   const handleRemoveItem = async (id) => {
//     const updatedItems = cartItems.filter((item) => item.id !== id);
//     setCartItems(updatedItems);
//     setIsCartOpen(true);
//   };

//   if (!products || products.length === 0) {
//     return (
//       <div className="flex-1 bg-gray-50 min-h-[50vh] p-8">
//         <div className="container mx-auto px-4 py-6">
//           <div className="bg-white rounded-lg shadow-sm p-6 mb-8"></div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {[...Array(12)].map((_, i) => (
//             <div
//               key={i}
//               className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
//             >
//               <div className="w-full h-64 bg-gray-200 rounded-lg mb-4"></div>
//               <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
//               <div className="h-8 bg-gray-200 rounded w-full"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100">
//       {/* Header */}
//       <div className="bg-white py-4 shadow-lg border-b-4 border-[#B4945E]">
//         <div className="container mx-auto px-4">
//           <h1 className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-r from-slate-500 to-purple-600 bg-clip-text text-transparent">
//             {categoryName} Collection
//           </h1>
//           {/* <p className="text-center mt-4 max-w-3xl mx-auto text-gray-600 text-sm md:text-base italic">
//             Discover our exclusive range of traditional and modern attars,
//             crafted with the finest natural ingredients for a lasting fragrance
//             experience.
//           </p> */}
//         </div>
//       </div>

//       {/* Breadcrumb */}
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex items-center text-sm text-gray-500">
//           <a href="/" className="hover:text-slate-500 transition duration-300">
//             Home
//           </a>
//           <ChevronRight size={14} className="mx-2" />
//           <span className="font-medium text-gray-800">
//             {categoryName} Collection
//           </span>
//         </div>
//       </div>

//       {/* Product Filtering and Listing */}
//       <div className="container mx-auto px-4 py-6 md:py-8">
//         <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
//           <div className="flex-1">
//             {/* Desktop Sorting and View Options */}
//             <div className="hidden md:flex justify-between items-center mb-6 bg-white p-4 border rounded-lg shadow-sm">
//               <div className="flex items-center">
//                 <span className="text-gray-700 mr-3">View:</span>
//                 <div className="flex border rounded-md overflow-hidden">
//                   <button
//                     className={`p-2 ${
//                       gridView
//                         ? "bg-slate-100 text-slate-500"
//                         : "bg-white text-gray-500"
//                     } transition duration-300`}
//                     onClick={() => setGridView(true)}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M4 6h16M4 12h16M4 18h16"
//                       />
//                     </svg>
//                   </button>
//                   <button
//                     className={`p-2 ${
//                       !gridView
//                         ? "bg-slate-100 text-slate-500"
//                         : "bg-white text-gray-500"
//                     } transition duration-300`}
//                     onClick={() => setGridView(false)}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M4 6h16M4 10h16M4 14h16M4 18h16"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Products Grid/List */}
//             <div
//               className={`grid ${
//                 gridView
//                   ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
//                   : "grid-cols-1"
//               } gap-10`}
//             >
//               {products.map((product, index) => (
//                 <Link
//                   key={`${product.id}-${index}`}
//                   to={`/product/${product.id}`}
//                   className={`group bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 ${
//                     !gridView && "flex flex-col md:flex-row"
//                   } transform hover:-translate-y-1`}
//                   style={{
//                     animationDelay: `${(index + 1) * 100}ms`,
//                     animation: "fade-in 0.6s ease-out forwards",
//                   }}
//                   ref={index === products.length - 1 ? lastProductRef : null}
//                 >
//                   {/* Product Image with Overlay */}
//                   <div className={`relative ${!gridView && "md:w-1/6"}`}>
//                     <div className="aspect-square overflow-hidden bg-gray-100">
//                       <img
//                         src={product.images[0]}
//                         alt={product.product_name}
//                         className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
//                       />
//                     </div>

//                     {/* Badges */}
//                     <div className="absolute top-2 left-2 flex flex-col space-y-1">
//                       {renderProductLabel(product)}
//                     </div>
//                   </div>

//                   {/* Product Info */}
//                   <div
//                     className={`p-4 flex flex-col ${!gridView && "md:w-2/3"}`}
//                   >
//                     <h3 className="font-medium text-gray-800 mb-1 text-sm md:text-base transition-colors duration-300 group-hover:text-slate-600">
//                       {product.product_name}
//                     </h3>

//                     {/* Product Details */}
//                     <p className="text-gray-600 text-sm mt-2 line-clamp-2">
//                       {product.product_details}
//                     </p>

//                     {/* Rating */}
//                     <div className="flex items-center mb-2 mt-2">
//                       <div className="flex items-center text-amber-400">
//                         <Star size={12} fill="currentColor" />
//                         <span className="ml-1 text-xs font-medium">
//                           {product.average_rating}/5
//                         </span>
//                       </div>
//                       <span className="mx-1 text-gray-300">|</span>
//                       <span className="text-xs text-gray-500">
//                         {product.total_reviews} reviews
//                       </span>
//                     </div>

//                     {/* Price */}
//                     <div className="flex items-center mb-3">
//                       <span className="font-semibold text-gray-800">
//                         ₹{formatCurrency(product.product_price || 0)}
//                       </span>
//                       {product.product_old_price > product.product_price && (
//                         <>
//                           <span className="ml-2 text-xs text-gray-500 line-through">
//                             ₹{formatCurrency(product.product_old_price)}
//                           </span>
//                           <span className="ml-2 text-xs font-medium px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-sm">
//                             {product.discount_percentage}% off
//                           </span>
//                         </>
//                       )}
//                     </div>

//                     {/* Add to cart button */}
//                     {/* <button
//                       onClick={(e) => {
//                         e.preventDefault();
//                         addToCart(product);
//                       }}
//                       className={`mt-auto w-full ${
//                         product.availability === false
//                           ? "bg-gray-400 cursor-not-allowed"
//                           : "bg-[#B4945E] hover:bg-[#8B7355]"
//                       } text-white py-2 px-4 rounded-md transition-all duration-500 text-sm flex items-center justify-center overflow-hidden relative`}
//                     >
//                       <span className="group-hover:translate-y-0 translate-y-0 transition-transform duration-300 flex items-center">
//                         <ShoppingCart size={14} className="mr-2" />
//                         {product.availability === false
//                           ? "Out of Stock"
//                           : "Add to Cart"}
//                       </span>
//                     </button> */}
//                      <button
//       onClick={(e) => {
//         e.preventDefault();
//         if (!isDisabled) {
//           addToCart(product);
//         } else {
//           if (!isLoggedIn) {
//             alert("Please login first to add to cart.");
//           }
//         }
//       }}
//       disabled={isDisabled}
//       className={`mt-auto w-full ${
//         isDisabled
//           ? "bg-gray-400 cursor-not-allowed"
//           : "bg-[#B4945E] hover:bg-[#8B7355]"
//       } text-white py-2 px-4 rounded-md transition-all duration-500 text-sm flex items-center justify-center overflow-hidden relative`}
//     >
//       <span className="group-hover:translate-y-0 translate-y-0 transition-transform duration-300 flex items-center">
//         <ShoppingCart size={14} className="mr-2" />
//         {!isLoggedIn
//           ? "Please Login"
//           : product.availability === false
//           ? "Out of Stock"
//           : "Add to Cart"}
//       </span>
//     </button>
//                   </div>
//                 </Link>
//               ))}
//             </div>

//             {/* Loading more indicator */}
//             {isLoadingMore && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
//                 {[...Array(4)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
//                   >
//                     <div className="w-full h-64 bg-gray-200 rounded-lg mb-4"></div>
//                     <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
//                     <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
//                     <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
//                     <div className="h-8 bg-gray-200 rounded w-full"></div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* CartPanel Component */}
//       <CartPanel
//         isOpen={isCartOpen}
//         onClose={() => setIsCartOpen(false)}
//         items={cartItems}
//         onUpdateQuantity={handleUpdateQuantity}
//         onRemoveItem={handleRemoveItem}
//         onCartUpdate={setCartItems}
//         onAddToCart={setHandleCartAdd}
//       />

//       {/* Out of Stock Popup */}
//       {showOutOfStockPopup && outOfStockProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold text-red-600">
//                 Product Out of Stock
//               </h3>
//               <button
//                 onClick={() => setShowOutOfStockPopup(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <div className="mb-6">
//               <p className="text-gray-700 mb-4">
//                 We&apos;re sorry, but {outOfStockProduct.product_name} is
//                 currently out of stock.
//               </p>
//               <p className="text-gray-600">
//                 Please check back later or browse our other products.
//               </p>
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

//       {/* Custom CSS for animations */}
//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//                 @keyframes fade-in {
//                     0% {
//                         opacity: 0;
//                     }
//                     100% {
//                         opacity: 1;
//                     }
//                 }
//                 `,
//         }}
//       />
//     </div>
//   );
// };

// export default ViewAll;












import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { ChevronRight, Star, ShoppingCart } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import api from "../../Axios/axiosInstance";
import URL from "../../Axios/URL";
import CartPanel from "../Navbar/CartPanel";
import { CartContext } from "../Context/CartContext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ViewAll = ({ product }) => {
  // State management
  const [gridView, setGridView] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  const [outOfStockProduct, setOutOfStockProduct] = useState(null);
  const { cartItems, setCartItems } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("Products");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Refs
  const observerRef = useRef();
  const lastProductRef = useRef();

  // Router hooks
  const params = useParams();
  const location = useLocation();
  const categoryId = params.id || location.state?.categoryId;

  // Auth check
  const isLoggedIn = !!localStorage.getItem("token");

  // Infinite scroll setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore]);

  useEffect(() => {
    if (lastProductRef.current && observerRef.current) {
      observerRef.current.observe(lastProductRef.current);
    }
    return () => {
      if (lastProductRef.current && observerRef.current) {
        observerRef.current.unobserve(lastProductRef.current);
      }
    };
  }, [products]);

  // Fetch products
  useEffect(() => {
    if (!categoryId) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await api.get(
          `get-products/?category_id=${categoryId}&page=1`
        );

        if (response.data?.results?.data?.length > 0) {
          setProducts(response.data.results.data);
          setCategoryName(response.data.results.data[0]?.category_name || "Products");
          setCurrentPage(1);
          setHasMore(response.data.next !== null);
        } else {
          setProducts([]);
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
        setHasMore(false);
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, [categoryId]);

  // Helper functions
  const formatCurrency = (amount) => {
    return parseFloat(amount?.toFixed(2)) || 0;
  };

  const loadMoreProducts = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const response = await api.get(
        `get-products/?category_id=${categoryId}&page=${currentPage + 1}`
      );

      if (response.data?.results?.data?.length > 0) {
        setProducts((prev) => [...prev, ...response.data.results.data]);
        setCurrentPage((prev) => prev + 1);
        setHasMore(response.data.next !== null);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more products:", err);
      toast.error("Failed to load more products");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Product label renderer
  const renderProductLabel = (product) => {
    if (!product) return null;

    if (product.new_arrival) {
      return (
        <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-0.5 rounded-full font-medium shadow-sm">
          New Arrival
        </span>
      );
    }

    if (product.is_trending) {
      return (
        <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-3 py-0.5 rounded-full font-medium shadow-sm">
          Trending
        </span>
      );
    }

    if (product.is_sale) {
      return (
        <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-0.5 rounded-full font-medium shadow-sm">
          Sale
        </span>
      );
    }

    return null;
  };

  // Cart functions
  const addToCart = useCallback(
    async (product) => {
      if (!isLoggedIn) {
        toast.error("Please login to add items to your cart", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      if (product.availability === false) {
        setOutOfStockProduct(product);
        setShowOutOfStockPopup(true);
        return;
      }

      setIsAddingToCart(true);
      try {
        const price = product.product_price || 0;
        const originalPrice = product.product_old_price || price;
        const image = product.images?.[0] || "/placeholder.svg";

        const response = await api.post("add-to-cart/" + product.id, {
          id: product.id,
          name: product.product_name,
          price: price,
          discountedPrice: price,
          originalPrice: originalPrice,
          image: image,
          variant: "Default",
          quantity: 1,
        });

        setCartItems((prevItems) => {
          // Handle all possible API response formats
          const newItems =
            response.data?.items ||
            response.data?.cartItems ||
            response.data?.cart ||
            (() => {
              const existingItem = prevItems.find((item) => item.id === product.id);
              return existingItem
                ? prevItems.map((item) =>
                    item.id === product.id
                      ? { ...item, quantity: item.quantity + 1 }
                      : item
                  )
                : [
                    ...prevItems,
                    {
                      id: product.id,
                      name: product.product_name,
                      price: price,
                      discountedPrice: price,
                      originalPrice: originalPrice,
                      image: image,
                      variant: "Default",
                      quantity: 1,
                    },
                  ];
            })();

          localStorage.setItem("cartItems", JSON.stringify(newItems));
          return newItems;
        });

        toast.success("Item added to cart!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setIsCartOpen(true);
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add item to cart", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setIsAddingToCart(false);
      }
    },
    [isLoggedIn, setCartItems]
  );

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
        return updatedItems;
      });
      setIsCartOpen(true);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.id !== id);
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
        return updatedItems;
      });
      setIsCartOpen(true);
      toast.success("Item removed from cart", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Loading state
  if (!products || products.length === 0) {
    return (
      <div className="flex-1 bg-gray-50 min-h-[50vh] p-8">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
            >
              <div className="w-full h-64 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Add ToastContainer at the top of your component */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Header */}
      <div className="bg-white py-4 shadow-lg border-b-4 border-[#B4945E]">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-r from-slate-500 to-purple-600 bg-clip-text text-transparent">
            {categoryName} Collection
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-gray-500">
          <a href="/" className="hover:text-slate-500 transition duration-300">
            Home
          </a>
          <ChevronRight size={14} className="mx-2" />
          <span className="font-medium text-gray-800">
            {categoryName} Collection
          </span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          <div className="flex-1">
            {/* View Toggle */}
            <div className="hidden md:flex justify-between items-center mb-6 bg-white p-4 border rounded-lg shadow-sm">
              <div className="flex items-center">
                <span className="text-gray-700 mr-3">View:</span>
                <div className="flex border rounded-md overflow-hidden">
                  <button
                    className={`p-2 ${
                      gridView ? "bg-slate-100 text-slate-500" : "bg-white text-gray-500"
                    } transition duration-300`}
                    onClick={() => setGridView(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <button
                    className={`p-2 ${
                      !gridView ? "bg-slate-100 text-slate-500" : "bg-white text-gray-500"
                    } transition duration-300`}
                    onClick={() => setGridView(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            <div
              className={`grid ${
                gridView
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                  : "grid-cols-1"
              } gap-10`}
            >
              {products.map((product, index) => (
                <Link
                  key={`${product.id}-${index}`}
                  to={`/product/${product.id}`}
                  className={`group bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 ${
                    !gridView && "flex flex-col md:flex-row"
                  } transform hover:-translate-y-1`}
                  style={{
                    animationDelay: `${(index + 1) * 100}ms`,
                    animation: "fade-in 0.6s ease-out forwards",
                  }}
                  ref={index === products.length - 1 ? lastProductRef : null}
                >
                  <div className={`relative ${!gridView && "md:w-1/6"}`}>
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.images[0]}
                        alt={product.product_name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                      />
                    </div>
                    <div className="absolute top-2 left-2 flex flex-col space-y-1">
                      {renderProductLabel(product)}
                    </div>
                  </div>

                  <div className={`p-4 flex flex-col ${!gridView && "md:w-2/3"}`}>
                    <h3 className="font-medium text-gray-800 mb-1 text-sm md:text-base transition-colors duration-300 group-hover:text-slate-600">
                      {product.product_name}
                    </h3>

                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {product.product_details}
                    </p>

                    <div className="flex items-center mb-2 mt-2">
                      <div className="flex items-center text-amber-400">
                        <Star size={12} fill="currentColor" />
                        <span className="ml-1 text-xs font-medium">
                          {product.average_rating}/5
                        </span>
                      </div>
                      <span className="mx-1 text-gray-300">|</span>
                      <span className="text-xs text-gray-500">
                        {product.total_reviews} reviews
                      </span>
                    </div>

                    <div className="flex items-center mb-3">
                      <span className="font-semibold text-gray-800">
                        ₹{formatCurrency(product.product_price || 0)}
                      </span>
                      {product.product_old_price > product.product_price && (
                        <>
                          <span className="ml-2 text-xs text-gray-500 line-through">
                            ₹{formatCurrency(product.product_old_price)}
                          </span>
                          <span className="ml-2 text-xs font-medium px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-sm">
                            {product.discount_percentage}% off
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isLoggedIn) {
                          toast.error("Please login first to add to cart.", {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                          });
                          return;
                        }
                        addToCart(product);
                      }}
                     
                      className={`mt-auto w-full ${
                        !isLoggedIn || product.availability === false
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#B4945E] hover:bg-[#8B7355]"
                      } text-white py-2 px-4 rounded-md transition-all duration-500 text-sm flex items-center justify-center overflow-hidden relative`}
                    >
                      {isAddingToCart ? (
                        "Adding..."
                      ) : (
                        <>
                          <ShoppingCart size={15} className="mr-2" />
                          {!isLoggedIn
                            ? "Add to Cart"
                            : product.availability === false
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </>
                      )}
                    </button>
                  </div>
                </Link>
              ))}
            </div>

            {isLoadingMore && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
                  >
                    <div className="w-full h-64 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
      {showOutOfStockPopup && outOfStockProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-red-600">
                Product Out of Stock
              </h3>
              <button
                onClick={() => setShowOutOfStockPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                We're sorry, but {outOfStockProduct.product_name} is currently out of stock.
              </p>
              <p className="text-gray-600">
                Please check back later or browse our other products.
              </p>
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

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fade-in {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
          `,
        }}
      />
    </div>
  );
};

export default ViewAll;