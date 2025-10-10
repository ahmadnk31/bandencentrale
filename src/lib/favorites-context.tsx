"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface FavoritesContextType {
  favorites: number[];
  addToFavorites: (id: number) => void;
  removeFromFavorites: (id: number) => void;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('bandencentrale-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bandencentrale-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const removeFromFavorites = (id: number) => {
    setFavorites(prev => prev.filter(favId => favId !== id));
  };

  const isFavorite = (id: number) => {
    return favorites.includes(id);
  };

  const toggleFavorite = (id: number) => {
    if (isFavorite(id)) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      toggleFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
