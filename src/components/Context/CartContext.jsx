import { createContext, useState, useEffect } from "react";
// import lazina from "../../assets/image/lazina.jpg";
// import story from "../../assets/image/story.png";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  // Load cart items from localStorage when the app initializes
  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      try {
        const parsedItems = JSON.parse(storedCartItems);
        setCartItems(parsedItems);
        console.log("Cart items loaded from localStorage");
      } catch (error) {
        console.error("Error parsing cart items from localStorage:", error);
        localStorage.removeItem('cartItems'); // Clear invalid data
      }
    }
  }, []);
  
  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
