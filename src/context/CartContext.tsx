'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  product_id: string;
  product_name: string;
  sku: string;
  product_size: string;
  quantity: number;
  unit_price: number;
  main_image?: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string, size: string) => void;
  updateQuantity: (product_id: string, size: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (err) {
        console.error('Failed to load cart:', err);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.product_id === item.product_id && i.product_size === item.product_size
      );

      if (existingItem) {
        return prevItems.map((i) =>
          i.product_id === item.product_id && i.product_size === item.product_size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [...prevItems, item];
    });
  };

  const removeItem = (product_id: string, size: string) => {
    setItems((prevItems) =>
      prevItems.filter((i) => !(i.product_id === product_id && i.product_size === size))
    );
  };

  const updateQuantity = (product_id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(product_id, size);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((i) =>
        i.product_id === product_id && i.product_size === size
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
