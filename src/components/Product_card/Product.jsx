import React, { useState, useEffect } from "react";
import frist from "../../assets/image/Product/product1.svg";
import second from "../../assets/image/Product/product2.svg";
import CartPanel from "../Navbar/CartPanel";

const Product = () => {
  const [isCartopen, setIsCartopen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [perfumes, setPerfumes] = useState([
    {
      id: 1,
      name: "AQ 365",
      tagline: "All-year Magic",
      description: "A fragrance that feels right every day occasion or not.",
      image: frist,
      type: "Eau De Parfum",
    },
    {
      id: 2,
      name: "Sulook Royal",
      tagline: "Sulook Royal Attar Perfume",
      description: "A Bold and Majestic Fragrance for the Elite",
      image: second,
      type: "Attar Perfume",
    },
  ]);

  // Simulating API fetch
  useEffect(() => {
    // you can replace this with axios or fetch when your backend is ready
  }, []);

  // 🛠️ Add item to cart
  const handleAddToCart = (item) => {
    const exists = cartItems.find((i) => i.id === item.id);
    if (exists) {
      setCartItems(
        cartItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
    setIsCartopen(true); // Open cart on add
  };

  // 🔁 Update quantity
  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
    setIsCartopen(true); // Open cart to handle API call
  };

  // ❌ Remove from cart
  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
    setIsCartopen(true); // Open cart to handle API call
  };

  return (
    <div className="w-full bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {perfumes.map((perfume) => (
            <div
              key={perfume.id}
              className="relative overflow-hidden rounded-lg"
            >
              <div className="relative h-96 bg-black">
                <img
                  src={perfume.image}
                  alt={perfume.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
                  <h2 className="text-xl font-bold mb-2">{perfume.tagline}</h2>
                  <p className="text-lg mb-4">{perfume.description}</p>
                  <button
                    className="bg-[#b4945e] text-white py-2 px-3 rounded w-36 transition duration-300"
                    onClick={() => handleAddToCart(perfume)} // ✅ Add to cart
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🛒 Cart Panel */}
      <CartPanel
        isOpen={isCartopen}
        onClose={() => setIsCartopen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default Product;
