import { useWishlist } from '../context/WishlistContext';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
const { toggleWishlist, isWishlisted } = useWishlist();
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
  };

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="product-card-img-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && (
          <span className={`product-badge product-badge--${product.badge.toLowerCase()}`}>
            {product.badge}
          </span>
        )}
        <button className="product-card-add" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
          <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
        style={{
          position: 'absolute', top: '10px', right: '10px',
          background: 'white', border: 'none', borderRadius: '50%',
          width: '32px', height: '32px', cursor: 'pointer',
          fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 10
        }}
      >
        {isWishlisted(product.id) ? '❤️' : '🤍'}
      </button>
      <div className="product-card-info">
        <p className="product-card-name">{product.name}</p>
        {product.subtitle && (
          <p className="product-card-subtitle">{product.subtitle}</p>
        )}
        <p className="product-card-price">LE {product.price.toFixed(2)} <span className="egp-label">EGP</span></p>
      </div>
    </div>
  );
}
