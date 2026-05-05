import React, { createContext, useState, useCallback } from 'react';

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  bio: string;
  categoryId: number;
  categoryName: string;
  availabilityStatus: string;
  photoUrls: string[];
  healthStatus?: string;
  healthStatusNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CartContextType {
  cartItems: Pet[];
  addPet: (pet: Pet) => void;
  removePet: (petId: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Pet[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const addPet = useCallback((pet: Pet) => {
    setCartItems((prev) => {
      const exists = prev.find((p) => p.id === pet.id);
      if (exists) {
        console.warn('Pet already in cart');
        return prev;
      }
      const updated = [...prev, pet];
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removePet = useCallback((petId: number) => {
    setCartItems((prev) => {
      const updated = prev.filter((p) => p.id !== petId);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cart');
  }, []);

  const getCartCount = useCallback(() => cartItems.length, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addPet, removePet, clearCart, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
