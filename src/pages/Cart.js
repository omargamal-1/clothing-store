import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { items, removeItem, updateQty, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cart-empty page-container">
        <p>Your cart is empty.</p>
        <Link to="/shop" className="cart-empty-btn">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page page-container">
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="cart-item-details">
              <p className="cart-item-name">{item.name}</p>
              {item.subtitle && <p className="cart-item-sub">{item.subtitle}</p>}
              <p className="cart-item-price">LE {item.price.toFixed(2)} EGP</p>
              <div className="cart-item-qty">
                <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
              </div>
            </div>
            <button className="cart-item-remove" onClick={() => removeItem(item.id)}>✕</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span>Total</span>
          <span>LE {totalPrice.toFixed(2)} EGP</span>
        </div>
        <button className="continue-btn" onClick={() => navigate('/shop')}>
          Continue Shopping
        </button>
        <button className="checkout-btn" onClick={() => navigate('/checkout')}>
          Go To Checkout
        </button>
      </div>
    </div>
  );
}
