// import React, { useState, useEffect, useRef, useContext } from "react";
// import api from "../../Axios/axiosInstance";
// import { CartContext } from "../Context/CartContext";
// import CartPanel from "../Navbar/CartPanel";
// import URL from "../../Axios/URL";
// import { ShoppingCart } from "lucide-react";

// const BestSellers = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [visibleItems, setVisibleItems] = useState(1);
//   const [touchStart, setTouchStart] = useState(0);
//   const [touchEnd, setTouchEnd] = useState(0);
//   const carouselRef = useRef(null);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const { cartItems, setCartItems } = useContext(CartContext);
//   const [isAtStart, setIsAtStart] = useState(true);
//   const [isAtEnd, setIsAtEnd] = useState(false);

//   // Check if user is logged in
//   const isLoggedIn = !!localStorage.getItem("token");

//   const handleUpdateQuantity = async (id, quantity_change) => {
//     if (quantity_change <= 0) {
//       handleRemoveItem(id);
//       return;
//     }

//     setCartItems((items) =>
//       items.map((item) =>
//         item.id === id ? { ...item, quantity: quantity_change } : item
//       )
//     );

//     setIsCartOpen(true);
//   };

//   const handleRemoveItem = async (id) => {
//     setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
//     setIsCartOpen(true);
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1280) {
//         setVisibleItems(4);
//       } else if (window.innerWidth >= 1024) {
//         setVisibleItems(3);
//       } else if (window.innerWidth >= 640) {
//         setVisibleItems(2);
//       } else {
//         setVisibleItems(1);
//       }
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (products && products.length > 0) {
//       const maxIndex = Math.max(0, products.length - visibleItems);
//       if (currentIndex > maxIndex) {
//         setCurrentIndex(maxIndex);
//       }

//       setIsAtStart(currentIndex === 0);
//       setIsAtEnd(currentIndex >= maxIndex);
//     }
//   }, [visibleItems, products, currentIndex]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await api.get("top-selling-products/");
//         setProducts(response.data.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error in component:", error);
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleAddToCart = async (product) => {
//     if (!isLoggedIn) {
//       alert("Please login first to add to cart.");
//       return;
//     }

//     const price =
//       product.product_price || product.price || product.discountedPrice || 0;
//     const originalPrice =
//       product.product_old_price || product.originalPrice || price;
//     const image = product.image
//       ? Array.isArray(product.image)
//         ? `${URL.PHOTO_URL}${product.image[0]}`
//         : product.image
//       : "/placeholder.svg";

//     try {
//       const response = await api.post("add-to-cart/" + product.id);

//       const existingItemIndex = cartItems.findIndex(
//         (item) => item.id === product.id
//       );

//       if (existingItemIndex >= 0) {
//         const updatedItems = [...cartItems];
//         updatedItems[existingItemIndex].quantity += 1;
//         setCartItems(updatedItems);
//       } else {
//         setCartItems([
//           ...cartItems,
//           {
//             id: product.id,
//             name: product.product_name || product.name,
//             price: price,
//             discountedPrice: price,
//             originalPrice: originalPrice,
//             image: image,
//             variant: product.variant || "Default",
//             quantity: 1,
//           },
//         ]);
//       }
//     } catch (error) {
//       console.error("Error adding item to cart:", error);

//       const existingItemIndex = cartItems.findIndex(
//         (item) => item.id === product.id
//       );

//       if (existingItemIndex >= 0) {
//         const updatedItems = [...cartItems];
//         updatedItems[existingItemIndex].quantity += 1;
//         setCartItems(updatedItems);
//       } else {
//         setCartItems([
//           ...cartItems,
//           {
//             id: product.id,
//             name: product.product_name || product.name,
//             price: price,
//             discountedPrice: price,
//             originalPrice: originalPrice,
//             image: image,
//             variant: product.variant || "Default",
//             quantity: 1,
//           },
//         ]);
//       }
//     }

//     localStorage.setItem("cartItems", JSON.stringify(cartItems));
//     setIsCartOpen(true);
//   };

//   const next = () => {
//     setCurrentIndex((prevIndex) => {
//       const maxIndex = Math.max(0, products.length - visibleItems);
//       const newIndex = prevIndex >= maxIndex ? maxIndex : prevIndex + 1;

//       setIsAtStart(newIndex === 0);
//       setIsAtEnd(newIndex >= maxIndex);

//       return newIndex;
//     });
//   };

//   const prev = () => {
//     setCurrentIndex((prevIndex) => {
//       const newIndex = prevIndex <= 0 ? 0 : prevIndex - 1;

//       setIsAtStart(newIndex === 0);
//       setIsAtEnd(newIndex >= Math.max(0, products.length - visibleItems));

//       return newIndex;
//     });
//   };

//   const handleTouchStart = (e) => {
//     setTouchStart(e.targetTouches[0].clientX);
//   };

//   const handleTouchMove = (e) => {
//     setTouchEnd(e.targetTouches[0].clientX);
//   };

//   const handleTouchEnd = () => {
//     if (touchStart - touchEnd > 75) {
//       next();
//     } else if (touchEnd - touchStart > 75) {
//       prev();
//     }
//   };

//   const renderProductCard = (product) => {
//     const isDisabled = !isLoggedIn || product.availability === false;

//     return (
//       <div className="rounded-lg border bg-white shadow-sm h-full hover:shadow-md transition-shadow duration-200">
//         <div className="p-3 md:p-4 relative">
//           {product.discount > 0 && (
//             <span className="absolute top-4 right-4 bg-green-600 text-white text-xs px-2 py-1 rounded z-10">
//               {product.discount}% off
//             </span>
//           )}
//           <div className="aspect-square relative mb-4 overflow-hidden rounded-md">
//             <img
//               src={
//                 `${URL.PHOTO_URL}${product.image[0]}` ||
//                 "/placeholder.svg"
//               }
//               alt={product.name}
//               className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
//               onError={(e) => {
//                 if (
//                   typeof product.image === "string" &&
//                   !product.image.startsWith("data:")
//                 ) {
//                   e.target.src = "/placeholder.svg";
//                 }
//               }}
//             />
//           </div>
//           <div className="space-y-2">
//             <p className="text-xs md:text-sm text-gray-500">
//               {product.category_name}
//             </p>
//             <h3 className="font-medium leading-tight truncate text-sm md:text-base">
//               {product.product_name}
//             </h3>
//             <div className="flex items-center gap-1">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400"
//               >
//                 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//               </svg>
//               <span className="text-xs md:text-sm">
//                 {product.average_rating} |{" "}
//                 {product.total_reviews.toLocaleString()}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-base md:text-lg font-bold">
//                 ₹{product.product_price}
//               </span>
//               <span className="text-xs md:text-sm text-gray-500 line-through">
//                 ₹{product.product_old_price}
//               </span>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center p-3 md:p-4 pt-0">
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               if (!isDisabled) {
//                 handleAddToCart(product);
//               } else {
//                 if (!isLoggedIn) {
//                   alert("Please login first to add to cart.");
//                 }
//               }
//             }}
//             disabled={isDisabled}
//             className={`w-full ${
//               isDisabled
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-[#B4945E] hover:bg-[#8B7355]"
//             } text-white py-2 px-4 rounded-md transition-all duration-500 text-sm flex items-center justify-center`}
//           >
//             <ShoppingCart size={14} className="mr-2" />
//             {!isLoggedIn
//               ? "Please Login"
//               : product.availability === false
//               ? "Out of Stock"
//               : "Add to Cart"}
//           </button>
//         </div>
//       </div>
//     );
//   };

//   if (loading && products.length === 0) {
//     return (
//       <section className="py-12 px-4 md:px-6">
//         <div className="max-w-7xl mx-auto text-center">
//           <h2 className="text-3xl md:text-4xl text-black text-center mb-8">
//             Explore Our Best Sellers
//           </h2>
//           <div className="flex items-center justify-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B4945E]"></div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   const productArray = Array.isArray(products) ? products : [];

//   if (!loading && productArray.length === 0) {
//     return (
//       <section className="py-12 px-4 md:px-6">
//         <div className="max-w-7xl mx-auto text-center">
//           <h2 className="text-3xl md:text-4xl text-black text-center mb-8">
//             Our Most Popular Selections
//           </h2>
//           <div className="flex items-center justify-center h-64">
//             <p className="text-lg text-gray-600">
//               No products available at the moment. Please check back later.
//             </p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-12 px-4 md:px-6">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-3xl md:text-4xl text-black text-center mb-8">
//           Our Most Popular Selections
//         </h2>

//         <div className="relative px-6 md:px-8" ref={carouselRef}>
//           <div className="overflow-hidden">
//             <div
//               className="flex transition-transform duration-300 ease-in-out"
//               style={{
//                 transform: `translateX(-${
//                   currentIndex * (100 / visibleItems)
//                 }%)`,
//               }}
//               onTouchStart={handleTouchStart}
//               onTouchMove={handleTouchMove}
//               onTouchEnd={handleTouchEnd}
//             >
//               {productArray.map((product) => (
//                 <div
//                   key={product.id}
//                   className="flex-shrink-0 px-2 md:px-3"
//                   style={{ width: `${100 / visibleItems}%` }}
//                 >
//                   {renderProductCard(product)}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {productArray.length > visibleItems && (
//             <>
//               <button
//                 className={`absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4945E] h-8 w-8 md:h-10 md:w-10 p-0 border border-[#B4945E] ${
//                   isAtStart
//                     ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
//                     : "bg-white text-[#B4945E] hover:bg-[#B4945E] hover:text-white shadow-md"
//                 }`}
//                 onClick={prev}
//                 aria-label="Previous product"
//                 disabled={isAtStart}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="w-4 h-4"
//                 >
//                   <path d="m15 18-6-6 6-6" />
//                 </svg>
//               </button>

//               <button
//                 className={`absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4945E] h-8 w-8 md:h-10 md:w-10 p-0 border border-[#B4945E] ${
//                   isAtEnd
//                     ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
//                     : "bg-white text-[#B4945E] hover:bg-[#B4945E] hover:text-white shadow-md"
//                 }`}
//                 onClick={next}
//                 aria-label="Next product"
//                 disabled={isAtEnd}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="w-4 h-4"
//                 >
//                   <path d="m9 18 6-6-6-6" />
//                 </svg>
//               </button>
//             </>
//           )}

//           <div className="flex justify-center mt-6 md:mt-8 gap-2">
//             {Array.from({
//               length: Math.ceil(productArray.length / visibleItems),
//             }).map((_, index) => (
//               <button
//                 key={index}
//                 className={`w-2 h-2 rounded-full transition-colors ${
//                   Math.floor(currentIndex / visibleItems) === index
//                     ? "bg-[#B4945E]"
//                     : "bg-gray-300"
//                 }`}
//                 onClick={() => {
//                   const newIndex = index * visibleItems;
//                   setCurrentIndex(newIndex);
//                   setIsAtStart(newIndex === 0);
//                   setIsAtEnd(
//                     newIndex >= Math.max(0, productArray.length - visibleItems)
//                   );
//                 }}
//                 aria-label={`Go to slide ${index + 1}`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       <CartPanel
//         isOpen={isCartOpen}
//         onClose={() => setIsCartOpen(false)}
//         items={cartItems}
//         onUpdateQuantity={handleUpdateQuantity}
//         onRemoveItem={handleRemoveItem}
//         onCartUpdate={setCartItems}
//       />
//     </section>
//   );
// };

// export default BestSellers;













import React, { useState, useEffect, useRef, useContext } from "react";
import api from "../../Axios/axiosInstance";
import { CartContext } from "../Context/CartContext";
import CartPanel from "../Navbar/CartPanel";
import URL from "../../Axios/URL";
import { ShoppingCart } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(1);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, setCartItems } = useContext(CartContext);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("token");

  const handleUpdateQuantity = async (id, quantity_change) => {
    if (quantity_change <= 0) {
      handleRemoveItem(id);
      return;
    }

    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: quantity_change } : item
      )
    );

    setIsCartOpen(true);
  };

  const handleRemoveItem = async (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    setIsCartOpen(true);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setVisibleItems(4);
      } else if (window.innerWidth >= 1024) {
        setVisibleItems(3);
      } else if (window.innerWidth >= 640) {
        setVisibleItems(2);
      } else {
        setVisibleItems(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      const maxIndex = Math.max(0, products.length - visibleItems);
      if (currentIndex > maxIndex) {
        setCurrentIndex(maxIndex);
      }

      setIsAtStart(currentIndex === 0);
      setIsAtEnd(currentIndex >= maxIndex);
    }
  }, [visibleItems, products, currentIndex]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("top-selling-products/");
        setProducts(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error in component:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
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

    const price =
      product.product_price || product.price || product.discountedPrice || 0;
    const originalPrice =
      product.product_old_price || product.originalPrice || price;
    const image = product.image
      ? Array.isArray(product.image)
        ? `${URL.PHOTO_URL}${product.image[0]}`
        : product.image
      : "/placeholder.svg";

    try {
      const response = await api.post("add-to-cart/" + product.id);

      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += 1;
        setCartItems(updatedItems);
      } else {
        setCartItems([
          ...cartItems,
          {
            id: product.id,
            name: product.product_name || product.name,
            price: price,
            discountedPrice: price,
            originalPrice: originalPrice,
            image: image,
            variant: product.variant || "Default",
            quantity: 1,
          },
        ]);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);

      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += 1;
        setCartItems(updatedItems);
      } else {
        setCartItems([
          ...cartItems,
          {
            id: product.id,
            name: product.product_name || product.name,
            price: price,
            discountedPrice: price,
            originalPrice: originalPrice,
            image: image,
            variant: product.variant || "Default",
            quantity: 1,
          },
        ]);
      }
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    setIsCartOpen(true);
  };

  const next = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, products.length - visibleItems);
      const newIndex = prevIndex >= maxIndex ? maxIndex : prevIndex + 1;

      setIsAtStart(newIndex === 0);
      setIsAtEnd(newIndex >= maxIndex);

      return newIndex;
    });
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex <= 0 ? 0 : prevIndex - 1;

      setIsAtStart(newIndex === 0);
      setIsAtEnd(newIndex >= Math.max(0, products.length - visibleItems));

      return newIndex;
    });
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      next();
    } else if (touchEnd - touchStart > 75) {
      prev();
    }
  };

  const renderProductCard = (product) => {
    const isDisabled = !isLoggedIn || product.availability === false;

    return (
      <div className="rounded-lg border bg-white shadow-sm h-full hover:shadow-md transition-shadow duration-200">
        <div className="p-3 md:p-4 relative">
          {product.discount > 0 && (
            <span className="absolute top-4 right-4 bg-green-600 text-white text-xs px-2 py-1 rounded z-10">
              {product.discount}% off
            </span>
          )}
          <div className="aspect-square relative mb-4 overflow-hidden rounded-md">
            <img
              src={
                `${URL.PHOTO_URL}${product.image[0]}` ||
                "/placeholder.svg"
              }
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                if (
                  typeof product.image === "string" &&
                  !product.image.startsWith("data:")
                ) {
                  e.target.src = "/placeholder.svg";
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs md:text-sm text-gray-500">
              {product.category_name}
            </p>
            <h3 className="font-medium leading-tight truncate text-sm md:text-base">
              {product.product_name}
            </h3>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-xs md:text-sm">
                {product.average_rating} |{" "}
                {product.total_reviews.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base md:text-lg font-bold">
                ₹{product.product_price}
              </span>
              <span className="text-xs md:text-sm text-gray-500 line-through">
                ₹{product.product_old_price}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center p-3 md:p-4 pt-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!isDisabled) {
                handleAddToCart(product);
              } else {
                if (!isLoggedIn) {
                  toast.error("Please login first to add to cart.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                  });
                }
              }
            }}
            
            className={`w-full ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#B4945E] hover:bg-[#8B7355]"
            } text-white py-2 px-4 rounded-md transition-all duration-500 text-sm flex items-center justify-center`}
          >
            <ShoppingCart size={14} className="mr-2" />
            {!isLoggedIn
              ? "Add to Cart"
              : product.availability === false
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    );
  };

  if (loading && products.length === 0) {
    return (
      <section className="py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-black text-center mb-8">
            Explore Our Best Sellers
          </h2>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B4945E]"></div>
          </div>
        </div>
      </section>
    );
  }

  const productArray = Array.isArray(products) ? products : [];

  if (!loading && productArray.length === 0) {
    return (
      <section className="py-12 px-4 md:px-6">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-black text-center mb-8">
            Our Most Popular Selections
          </h2>
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-600">
              No products available at the moment. Please check back later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 md:px-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl text-black text-center mb-8">
          Our Most Popular Selections
        </h2>

        <div className="relative px-6 md:px-8" ref={carouselRef}>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / visibleItems)
                }%)`,
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {productArray.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 px-2 md:px-3"
                  style={{ width: `${100 / visibleItems}%` }}
                >
                  {renderProductCard(product)}
                </div>
              ))}
            </div>
          </div>

          {productArray.length > visibleItems && (
            <>
              <button
                className={`absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4945E] h-8 w-8 md:h-10 md:w-10 p-0 border border-[#B4945E] ${
                  isAtStart
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                    : "bg-white text-[#B4945E] hover:bg-[#B4945E] hover:text-white shadow-md"
                }`}
                onClick={prev}
                aria-label="Previous product"
                disabled={isAtStart}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <button
                className={`absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B4945E] h-8 w-8 md:h-10 md:w-10 p-0 border border-[#B4945E] ${
                  isAtEnd
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                    : "bg-white text-[#B4945E] hover:bg-[#B4945E] hover:text-white shadow-md"
                }`}
                onClick={next}
                aria-label="Next product"
                disabled={isAtEnd}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          <div className="flex justify-center mt-6 md:mt-8 gap-2">
            {Array.from({
              length: Math.ceil(productArray.length / visibleItems),
            }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / visibleItems) === index
                    ? "bg-[#B4945E]"
                    : "bg-gray-300"
                }`}
                onClick={() => {
                  const newIndex = index * visibleItems;
                  setCurrentIndex(newIndex);
                  setIsAtStart(newIndex === 0);
                  setIsAtEnd(
                    newIndex >= Math.max(0, productArray.length - visibleItems)
                  );
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCartUpdate={setCartItems}
      />
    </section>
  );
};

export default BestSellers;