"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import React, { useEffect } from "react";
import { TireData } from "@/lib/data";

interface CartItem extends TireData {
  quantity: number;
  selectedSize: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: { tire: TireData; size: string; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: number; size: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; size: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'REPLACE_CART'; payload: CartState };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'REPLACE_CART':
      return action.payload;
    case 'ADD_ITEM': {
      const { tire, size, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.id === tire.id && item.selectedSize === size
      );

      let newItems: CartItem[];
      
      if (existingItemIndex > -1) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, { ...tire, quantity, selectedSize: size }];
      }

      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total: newTotal,
        itemCount: newItemCount
      };
    }

    case 'REMOVE_ITEM': {
      const { id, size } = action.payload;
      const newItems = state.items.filter(
        item => !(item.id === id && item.selectedSize === size)
      );

      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total: newTotal,
        itemCount: newItemCount
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, size, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id, size } });
      }

      const newItems = state.items.map(item =>
        item.id === id && item.selectedSize === size
          ? { ...item, quantity }
          : item
      );

      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total: newTotal,
        itemCount: newItemCount
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      };

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (tire: TireData, size: string, quantity?: number) => void;
  removeItem: (id: number, size: string) => void;
  updateQuantity: (id: number, size: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: number, size: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Load cart state from localStorage if available

    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Hydrate cart from localStorage on client only
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('cart');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (
              typeof parsed === 'object' &&
              Array.isArray(parsed.items) &&
              typeof parsed.total === 'number' &&
              typeof parsed.itemCount === 'number'
            ) {
              // MIGRATION: Fix images format in cart items
              const migratedItems = parsed.items.map((item: any) => {
                let images = [];
                if (Array.isArray(item.images)) {
                  if (item.images.length > 0 && typeof item.images[0] === 'object' && item.images[0].src) {
                    images = item.images.map((img: any) => ({ src: img.src, alt: img.alt || item.name }));
                  } else {
                    images = item.images.map((img: any) => ({ src: img, alt: item.name }));
                  }
                } else if (typeof item.images === 'string') {
                  images = [{ src: item.images, alt: item.name }];
                } else {
                  images = [{ src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center', alt: item.name }];
                }
                return { ...item, images };
              });
              dispatch({ type: 'REPLACE_CART', payload: { ...parsed, items: migratedItems } });
            }
          } catch {}
        }
      }
    }, []);

  // Persist cart state to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(state));
    }
  }, [state]);

  const addItem = (tire: TireData, size: string, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { tire, size, quantity } });
  };

  const removeItem = (id: number, size: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, size } });
  };

  const updateQuantity = (id: number, size: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isInCart = (id: number, size: string) => {
    return state.items.some(item => item.id === id && item.selectedSize === size);
  };

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
