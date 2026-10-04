import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToCart = (foodItem) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.foodItem._id === foodItem._id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.foodItem._id === foodItem._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          foodItem,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (foodId) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.foodItem._id !== foodId
      )
    );
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity < 1) return;

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.foodItem._id === foodId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};