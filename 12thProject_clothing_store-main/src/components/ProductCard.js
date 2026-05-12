import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();

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
