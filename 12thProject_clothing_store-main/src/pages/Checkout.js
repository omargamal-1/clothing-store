import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Checkout.css';

const OWNER_WHATSAPP   = '201227933409';
const CALLMEBOT_APIKEY = '8080033';

// ── كوبونات الخصم ─────────────────────────────────────────────
const COUPONS = {
  'SNOW10':  { type: 'percent', value: 10,  label: '10% OFF' },
  'SNOW20':  { type: 'percent', value: 20,  label: '20% OFF' },
  'SNOW50':  { type: 'fixed',   value: 50,  label: 'LE 50 OFF' },
  'WELCOME': { type: 'percent', value: 15,  label: '15% OFF' },
  'FREESHIP':{ type: 'ship',    value: 0,   label: 'Free Shipping' },
};

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', desc: '3–5 business days',         price: 45,  icon: '📦', color: '#3b6ea5' },
  { id: 'express',  label: 'Express Delivery',  desc: '1–2 business days',         price: 80,  icon: '⚡', color: '#e8445a' },
  { id: 'sameday',  label: 'Same-Day',          desc: 'Cairo only · before 12 PM', price: 120, icon: '🚀', color: '#2e7d32' },
  { id: 'pickup',   label: 'Store Pickup',      desc: 'Ready in 2 hrs · Free',     price: 0,   icon: '🏪', color: '#7b5ea7' },
];
const PAYMENT_OPTIONS = [
  { id: 'cod',      label: 'Cash on Delivery',    icon: '💵' },
  { id: 'card',     label: 'Credit / Debit Card', icon: '💳' },
  { id: 'instapay', label: 'InstaPay',            icon: '📲' },
];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [shipping,  setShipping]  = useState('standard');
  const [payment,   setPayment]   = useState('cod');
  const [form, setForm] = useState({
    firstName:'', lastName:'', email:'', phone:'',
    address:'', city:'', postalCode:'',
  });

  // ── Coupon state ───────────────────────────────────────────
  const [couponInput,   setCouponInput]   = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError,   setCouponError]   = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const selectedShipping = SHIPPING_OPTIONS.find(o => o.id === shipping);
  const shippingCost     = selectedShipping?.price ?? 0;

  // ── حساب الخصم ────────────────────────────────────────────
  const calcDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') return (totalPrice * appliedCoupon.value) / 100;
    if (appliedCoupon.type === 'fixed')   return appliedCoupon.value;
    if (appliedCoupon.type === 'ship')    return shippingCost;
    return 0;
  };

  const discount      = calcDiscount();
  const finalShipping = appliedCoupon?.type === 'ship' ? 0 : shippingCost;
  const grandTotal    = Math.max(0, totalPrice - (appliedCoupon?.type === 'ship' ? 0 : discount) + finalShipping);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── Apply Coupon ───────────────────────────────────────────
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    setCouponError('');
    setCouponSuccess('');

    if (!code) { setCouponError('Please enter a coupon code.'); return; }

    // ── تحقق إن الكوبون اتكسب من العجلة ──
    const wonCoupon = localStorage.getItem('sw_won_coupon');
    if (!wonCoupon || wonCoupon.toUpperCase() !== code) {
      setCouponError('🎡 This coupon is only for Spin & Win winners!');
      setAppliedCoupon(null);
      return;
    }

    const found = COUPONS[code];
    if (!found) { setCouponError('Invalid coupon code.'); setAppliedCoupon(null); return; }

    setAppliedCoupon({ ...found, code });
    setCouponSuccess(`🎉 Coupon applied! You got ${found.label}`);

    // ── امسح الكوبون بعد الاستخدام ──
    localStorage.removeItem('sw_won_coupon');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    setCouponSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      customer:  { ...form },
      items:     items.map(i => ({ id:i.id, name:i.name, price:i.price, qty:i.qty, image:i.image||'' })),
      shipping:  { method: selectedShipping?.label, cost: finalShipping },
      payment,
      coupon:    appliedCoupon ? { code: appliedCoupon.code, discount } : null,
      totalPrice,
      grandTotal,
      status:    'pending',
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);

      const itemsList = items
        .map(i => `* ${i.name} x${i.qty} - LE ${(i.price * i.qty).toFixed(2)}`)
        .join(' | ');

      const msgText = [
        '🛍️ طلب جديد!',
        `👤 ${form.firstName} ${form.lastName}`,
        `📞 ${form.phone}`,
        `📍 ${form.address}، ${form.city}`,
        `🧾 ${itemsList}`,
        appliedCoupon ? `🎟️ كوبون: ${appliedCoupon.code} (-LE ${discount.toFixed(2)})` : '',
        `🚚 ${selectedShipping?.label} - LE ${finalShipping}`,
        `💳 ${PAYMENT_OPTIONS.find(p=>p.id===payment)?.label}`,
        `💰 الاجمالي: LE ${grandTotal.toFixed(2)} EGP`,
      ].filter(Boolean).join(' | ');

      const encodedMsg = encodeURIComponent(msgText);

      await new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = `https://api.callmebot.com/whatsapp.php?phone=${OWNER_WHATSAPP}&text=${encodedMsg}&apikey=${CALLMEBOT_APIKEY}`;
        setTimeout(resolve, 3000);
      });

      clearCart();
      setSubmitted(true);
    } catch (err) {
      console.error('Order error:', err);
      alert('حصل خطأ في حفظ الأوردر، حاول تاني.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="checkout-success page-container">
        <div className="success-box">
          <div className="success-icon">✓</div>
          <h2>Order Confirmed!</h2>
          <p>Thank you, {form.firstName}! We'll contact you on <strong>{form.phone}</strong>.</p>
          <div className="success-summary">
            <span>{selectedShipping?.icon} {selectedShipping?.label}</span>
            <span>LE {grandTotal.toFixed(2)} EGP</span>
          </div>
          <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page page-container">
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>

          {/* 1. Shipping Info */}
          <section className="checkout-section">
            <h3 className="checkout-section-title"><span className="step-num">1</span> Shipping Information</h3>
            <div className="form-row">
              <div className="form-group"><label>First Name</label><input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="Ahmed" /></div>
              <div className="form-group"><label>Last Name</label><input name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Mohamed" /></div>
            </div>
            <div className="form-group"><label>Email</label><input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="ahmed@email.com" /></div>
            <div className="form-group"><label>Phone</label><input name="phone" value={form.phone} onChange={handleChange} required placeholder="+20 1XX XXX XXXX" /></div>
            <div className="form-group"><label>Address</label><input name="address" value={form.address} onChange={handleChange} required placeholder="123 Street Name" /></div>
            <div className="form-row">
              <div className="form-group"><label>City</label><input name="city" value={form.city} onChange={handleChange} required placeholder="Cairo" /></div>
              <div className="form-group"><label>Postal Code</label><input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="11511" /></div>
            </div>
          </section>

          {/* 2. Delivery */}
          <section className="checkout-section">
            <h3 className="checkout-section-title"><span className="step-num">2</span> Delivery Method</h3>
            <div className="shipping-options">
              {SHIPPING_OPTIONS.map(opt => (
                <label key={opt.id} className={`shipping-card ${shipping===opt.id?'selected':''}`}
                  style={shipping===opt.id?{borderColor:opt.color,background:`${opt.color}0d`}:{}}>
                  <input type="radio" name="shipping" value={opt.id} checked={shipping===opt.id} onChange={()=>setShipping(opt.id)} />
                  <span className="shipping-icon">{opt.icon}</span>
                  <div className="shipping-text"><span className="shipping-label">{opt.label}</span><span className="shipping-desc">{opt.desc}</span></div>
                  <span className="shipping-price" style={shipping===opt.id?{color:opt.color}:{}}>{opt.price===0?'Free':`LE ${opt.price}`}</span>
                </label>
              ))}
            </div>
          </section>

          {/* 3. Payment */}
          <section className="checkout-section">
            <h3 className="checkout-section-title"><span className="step-num">3</span> Payment Method</h3>
            <div className="payment-options">
              {PAYMENT_OPTIONS.map(opt => (
                <label key={opt.id} className={`payment-card ${payment===opt.id?'selected':''}`}>
                  <input type="radio" name="payment" value={opt.id} checked={payment===opt.id} onChange={()=>setPayment(opt.id)} />
                  <span className="payment-icon">{opt.icon}</span>
                  <span className="payment-label">{opt.label}</span>
                  {payment===opt.id && <span className="payment-check">✓</span>}
                </label>
              ))}
            </div>
            {payment==='instapay' && <div className="instapay-note">📲 You'll receive an InstaPay request after placing the order.</div>}
          </section>

          {/* 4. Coupon */}
          <section className="checkout-section">
            <h3 className="checkout-section-title"><span className="step-num">4</span> Coupon Code</h3>
            {!appliedCoupon ? (
              <div className="coupon-row">
                <input
                  className="coupon-input"
                  type="text"
                  placeholder="Enter coupon code e.g. SNOW10"
                  value={couponInput}
                  onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                />
                <button type="button" className="coupon-btn" onClick={applyCoupon}>Apply</button>
              </div>
            ) : (
              <div className="coupon-applied">
                <span>🎟️ <strong>{appliedCoupon.code}</strong> — {appliedCoupon.label}</span>
                <button type="button" className="coupon-remove" onClick={removeCoupon}>✕ Remove</button>
              </div>
            )}
            {couponError   && <p className="coupon-error">❌ {couponError}</p>}
            {couponSuccess && <p className="coupon-success">{couponSuccess}</p>}
          </section>

          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? 'Placing Order…' : `Place Order · LE ${grandTotal.toFixed(2)} EGP`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {items.map(item => (
              <div key={item.id} className="summary-item">
                <img src={item.image} alt={item.name} />
                <div className="summary-item-info"><p className="summary-item-name">{item.name}</p><p className="summary-qty">Qty: {item.qty}</p></div>
                <p className="summary-item-price">LE {(item.price*item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="summary-breakdown">
            <div className="summary-row"><span>Subtotal</span><span>LE {totalPrice.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{finalShipping===0?'Free':`LE ${finalShipping}`}</span></div>
            {appliedCoupon && appliedCoupon.type !== 'ship' && (
              <div className="summary-row coupon-discount-row">
                <span>🎟️ Discount ({appliedCoupon.code})</span>
                <span>- LE {discount.toFixed(2)}</span>
              </div>
            )}
            {appliedCoupon && appliedCoupon.type === 'ship' && (
              <div className="summary-row coupon-discount-row">
                <span>🎟️ Free Shipping ({appliedCoupon.code})</span>
                <span>- LE {shippingCost.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-total summary-row"><span>Total</span><span>LE {grandTotal.toFixed(2)} EGP</span></div>
          </div>
          <div className="trust-badges">
            <div className="trust-badge"><span>🔒</span> Secure Checkout</div>
            <div className="trust-badge"><span>↩️</span> 14-Day Returns</div>
            <div className="trust-badge"><span>📞</span> 24/7 Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}