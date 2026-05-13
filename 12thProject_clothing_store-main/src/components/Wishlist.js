import React, { useState } from 'react';

export function useWishlist() {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist')) || []; }
    catch { return []; }
  });

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      const updated = exists
        ? prev.filter(p => p.id !== product.id)
        : [product, ...prev];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isWishlisted = (id) => wishlist.some(p => p.id === id);

  return { wishlist, toggleWishlist, isWishlisted };
}