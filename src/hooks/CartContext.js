// "use client";
// import { priceCalculation } from "@/actions/priceAction";
// import { createContext, useContext, useState, useEffect } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);

//   useEffect(() => {
//     const savedCart = localStorage.getItem("cart");
//     if (savedCart) setCart(JSON.parse(savedCart));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   // --- কার্ট একদম খালি করার ফাংশন ---
//   const clearCart = () => {
//     setCart([]);
//     localStorage.removeItem("cart");
//   };

//   const addToCart = async (product, mainPrice, quantity, variant) => {
//     const productId = product._id || product.id;
//     const duration = variant?.duration || "N/A";
//     const uniqueId = `${productId}-${duration}`;

//     const totalAmount = await priceCalculation(productId, duration, quantity);

//     setCart((prevCart) => {
//       const existingItem = prevCart.find((item) => item.uniqueId === uniqueId);

//       if (existingItem) {
//         return prevCart.map((item) => {
//           if (item.uniqueId === uniqueId) {
//             const newQty = item.quantity + Number(quantity);
//             return { 
//               ...item, 
//               quantity: newQty,
//               category: product.category || item.category || "service",
//               downloadLink: product.downloadLink || item.downloadLink || null,
//             };
//           }
//           return item;
//         });
//       }

//       return [
//         ...prevCart,
//         {
//           id: productId,
//           uniqueId,
//           title: product.title,
//           image: product.thumbnail,
//           price: mainPrice,
//           totalPrice: totalAmount,
//           duration: duration,
//           quantity: Number(quantity),
//           category: product.category || "service",
//           downloadLink: product.downloadLink || null,
//         },
//       ];
//     });
//   };

//   const updateQuantity = async (uniqueId, amount, productId, duration, currentQty) => {
//     const newQty = Math.max(1, currentQty + amount);
//     const newTotalPrice = await priceCalculation(productId, duration, newQty);

//     setCart((prevCart) =>
//       prevCart.map((item) =>
//         item.uniqueId === uniqueId
//           ? { ...item, quantity: newQty, totalPrice: newTotalPrice }
//           : item
//       )
//     );
//   };

//   const removeFromCart = (uniqueId) => {
//     setCart((prevCart) => prevCart.filter((item) => item.uniqueId !== uniqueId));
//   };

//   return (
 
//     <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);

"use client";
import { priceCalculation } from "@/actions/priceAction";
import { createContext, useContext, useState, useEffect, useCallback } from "react"; 

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // --- useCallback ব্যবহার করে ফাংশনটিকে মেমোরাইজ করা হয়েছে ---
  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem("cart");
  }, []); // খালি অ্যারে মানে এটি একবারই তৈরি হবে

  const addToCart = async (product, mainPrice, quantity, variant) => {
    // ... আপনার আগের কোড ...
    const productId = product._id || product.id;
    const duration = variant?.duration || "N/A";
    const uniqueId = `${productId}-${duration}`;
    const totalAmount = await priceCalculation(productId, duration, quantity);

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.uniqueId === uniqueId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.uniqueId === uniqueId
            ? { ...item, quantity: item.quantity + Number(quantity) }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id: productId,
          uniqueId,
          title: product.title,
          image: product.thumbnail,
          price: mainPrice,
          totalPrice: totalAmount,
          duration: duration,
          quantity: Number(quantity),
          category: product.category || "service",
          downloadLink: product.downloadLink || null,
        },
      ];
    });
  };

  const updateQuantity = async (uniqueId, amount, productId, duration, currentQty) => {
    const newQty = Math.max(1, currentQty + amount);
    const newTotalPrice = await priceCalculation(productId, duration, newQty);
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.uniqueId === uniqueId ? { ...item, quantity: newQty, totalPrice: newTotalPrice } : item
      )
    );
  };

  const removeFromCart = (uniqueId) => {
    setCart((prevCart) => prevCart.filter((item) => item.uniqueId !== uniqueId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);