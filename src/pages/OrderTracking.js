import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderTracking.css';

const MOCK_ORDERS = {
  'ORD-001': {
    id: 'ORD-001', date: '10 May 2026', status: 'delivered',
    items: [{ name: 'Core White T-shirt', qty: 2, price: 720 }, { name: 'Brown Hoodie', qty: 1, price: 900 }],
    total: 2340, steps: ['Order Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'], currentStep: 4,
  },
  'ORD-002': {
    id: 'ORD-002', date: '12 May 2026', status: 'shipped',
    items: [{ name: 'Pink SpiderMan Hoodie', qty: 1, price: 900 }],
    total: 900, steps: ['Order Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'], currentStep: 2,
  },
  'ORD-003': {
    id: 'ORD-003', date: '13 May 2026', status: 'confirmed',
    items: [{ name: 'Monopoly Pink BBT', qty: 3, price: 400 }],
    total: 1200, steps: ['Order Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'], currentStep: 1,
  },
};

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTrack = () => {
    const found = MOCK_ORDERS[orderId.toUpperCase().trim()];
    if (found) { setOrder(found); setError(''); }
    else { setOrder(null); setError('Order not found. Try ORD-001, ORD-002, or ORD-003'); }
  };

  return (
    <div className="tracking-page">
      <button className="tracking-back" onClick={() => navigate(-1)}>← Back</button>
      <h1 className="tracking-title">Track Your Order</h1>
      <p className="tracking-sub">Enter your order ID to see its status</p>
      <div className="tracking-search">
        <input className="tracking-input" placeholder="e.g. ORD-001" value={orderId}
          onChange={e => setOrderId(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleTrack()} />
        <button className="tracking-btn" onClick={handleTrack}>Track</button>
      </div>
      {error && <p className="tracking-error">{error}</p>}
      {order && (
        <div className="tracking-result">
          <div className="tracking-header">
            <div>
              <p className="tracking-order-id">{order.id}</p>
              <p className="tracking-order-date">Placed on {order.date}</p>
            </div>
            <span className={`tracking-badge tracking-badge--${order.status}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div className="tracking-steps">
            {order.steps.map((step, i) => (
              <div key={i} className={`tracking-step ${i <= order.currentStep ? 'active' : ''}`}>
                <div className="step-circle">{i <= order.currentStep ? '✓' : i + 1}</div>
                <p className="step-label">{step}</p>
                {i < order.steps.length - 1 && (
                  <div className={`step-line ${i < order.currentStep ? 'active' : ''}`} />
                )}
              </div>
            ))}
          </div>
          <div className="tracking-items">
            <h3 className="tracking-items-title">Order Items</h3>
            {order.items.map((item, i) => (
              <div key={i} className="tracking-item">
                <span className="item-name">{item.name}</span>
                <span className="item-qty">x{item.qty}</span>
                <span className="item-price">LE {(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="tracking-total">
              <span>Total</span>
              <span>LE {order.total.toLocaleString()} EGP</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}