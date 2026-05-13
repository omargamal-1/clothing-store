import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './OrderTracking.css';

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

const STATUS_INFO = {
  pending:   { label: 'Order Placed', icon: '🛍️', desc: 'We received your order and are reviewing it.' },
  confirmed: { label: 'Confirmed',    icon: '✅', desc: 'Your order has been confirmed and is being prepared.' },
  shipped:   { label: 'Shipped',      icon: '🚚', desc: 'Your order is on its way!' },
  delivered: { label: 'Delivered',    icon: '🎉', desc: 'Your order has been delivered. Enjoy!' },
  cancelled: { label: 'Cancelled',    icon: '❌', desc: 'Your order has been cancelled.' },
};

export default function OrderTracking() {
  const [phone,    setPhone]    = useState('');
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setSearched(false);

    try {
      const q = query(
        collection(db, 'orders'),
        where('customer.phone', '==', phone.trim())
      );
      const snap = await getDocs(q);
      const result = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      result.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
        const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
        return bTime - aTime;
      });
      setOrders(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const getStepIndex = (status) => STATUS_STEPS.indexOf(status);

  return (
    <div className="tracking-page page-container">
      <div className="tracking-hero">
        <div className="tracking-hero-icon">📦</div>
        <h1>Track Your Order</h1>
        <p>Enter your phone number to see your order status</p>
      </div>

      <form className="tracking-form" onSubmit={handleSearch}>
        <div className="tracking-input-wrap">
          <span className="tracking-input-icon">📞</span>
          <input
            type="tel"
            placeholder="e.g. 01001234567"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching…' : 'Track Order'}
        </button>
      </form>

      {searched && orders.length === 0 && (
        <div className="tracking-empty">
          <span>🔍</span>
          <p>No orders found for this number.</p>
          <small>Make sure you entered the same number used at checkout.</small>
        </div>
      )}

      {orders.map(order => {
        const stepIndex   = getStepIndex(order.status);
        const isCancelled = order.status === 'cancelled';
        const statusInfo  = STATUS_INFO[order.status] || STATUS_INFO['pending'];

        return (
          <div key={order.id} className="tracking-card">

            <div className="tracking-card-header">
              <div>
                <span className="tracking-order-id">Order #{order.id.slice(-6).toUpperCase()}</span>
                <span className="tracking-date">
                  {order.createdAt?.toDate?.()?.toLocaleDateString('en-EG', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  }) || '—'}
                </span>
              </div>
              <span className={`tracking-status-badge ${order.status}`}>
                {statusInfo.icon} {statusInfo.label}
              </span>
            </div>

            {!isCancelled && (
              <div className="tracking-progress">
                {STATUS_STEPS.map((step, i) => (
                  <React.Fragment key={step}>
                    <div className={`tracking-step ${i <= stepIndex ? 'done' : ''} ${i === stepIndex ? 'active' : ''}`}>
                      <div className="tracking-step-circle">
                        {i < stepIndex ? '✓' : STATUS_INFO[step].icon}
                      </div>
                      <span className="tracking-step-label">{STATUS_INFO[step].label}</span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`tracking-line ${i < stepIndex ? 'done' : ''}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            <div className="tracking-status-desc">
              <p>{statusInfo.desc}</p>
            </div>

            <div className="tracking-items">
              <h4>Items</h4>
              {order.items?.map((item, i) => (
                <div key={i} className="tracking-item-row">
                  {item.image && <img src={item.image} alt={item.name} />}
                  <span className="tracking-item-name">{item.name}</span>
                  <span className="tracking-item-qty">x{item.qty}</span>
                  <span className="tracking-item-price">LE {(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="tracking-summary">
              <span>🚚 {order.shipping?.method}</span>
              <span className="tracking-total">Total: LE {order.grandTotal?.toFixed(2)} EGP</span>
            </div>

          </div>
        );
      })}
    </div>
  );
}