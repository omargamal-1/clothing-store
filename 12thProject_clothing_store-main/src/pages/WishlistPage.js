import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <button
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#888', marginBottom: '24px' }}
      >← Back</button>
      <h1 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '32px' }}>
        My Wishlist ❤️ ({wishlist.length})
      </h1>
      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#aaa' }}>
          <p style={{ fontSize: '40px' }}>🤍</p>
          <p style={{ fontSize: '16px' }}>Your wishlist is empty</p>
          <button
            onClick={() => navigate('/shop')}
            style={{ marginTop: '16px', background: '#111', color: '#fff', border: 'none', padding: '12px 28px', cursor: 'pointer', borderRadius: '2px', fontSize: '13px', letterSpacing: '1px' }}
          >Shop Now</button>
        </div>
      ) : (
        <div className="products-grid">
          {wishlist.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}