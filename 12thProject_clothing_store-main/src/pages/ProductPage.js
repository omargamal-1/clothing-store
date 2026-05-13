import Reviews from '../components/Reviews';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import products from '../data/products';
import { useCart } from '../context/CartContext';
import './ProductPage.css';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const product = products.find(p => p.id === Number(id));
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="product-page page-container">
        <p>Product not found.</p>
        <button onClick={() => navigate('/shop')}>← Back to Shop</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-page page-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className="product-detail">
        <div className="product-detail-img">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          {product.subtitle && <p className="detail-subtitle">{product.subtitle}</p>}
          <p className="detail-price">LE {product.price.toFixed(2)} EGP</p>

          <div className="size-selector">
            <p className="size-label">Select Size</p>
            <div className="sizes">
              {SIZES.map(s => (
                <button
                  key={s}
                  className={`size-btn ${selectedSize === s ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="detail-actions">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              {added ? '✓ Added!' : 'Add To Cart'}
            </button>
            <button className="buy-now-btn" onClick={() => { handleAddToCart(); navigate('/cart'); }}>
              Buy It Now
            </button>
          </div>

          <p className="detail-tag">Stay Cool. Stay Snow.</p>
        </div>
      </div>
      <Reviews productId={product.id} />
    </div>
  );
}
