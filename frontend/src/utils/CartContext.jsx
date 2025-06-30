import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children, user }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      if (user?.id) {
        const response = await api.get(`/cart/count/${user.id}`, {
          withCredentials: true,
        });
        setCartCount(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  const incrementCartCount = (amount = 1) => {
    setCartCount(prev => prev + amount);
  };

  const decrementCartCount = (amount = 1) => {
    setCartCount(prev => Math.max(0, prev - amount));
  };

  useEffect(() => {
    fetchCartCount();
  }, [user?.id]);

  return (
    <CartContext.Provider value={{
      cartCount,
      setCartCount,
      updateCartCount,
      incrementCartCount,
      decrementCartCount,
      fetchCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};