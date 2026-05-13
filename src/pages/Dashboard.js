import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, orderBy, query, doc, updateDoc } from 'firebase/firestore';
import './Dashboard.css';

// ← غيّر الباسورد ده
const DASHBOARD_PASSWORD = 'snow2024';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS   = {
  pending:   '#f59e0b',
  confirmed: '#3b82f6',
  shipped:   '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444',
};

export default function Dashboard() {
  const [authed,   setAuthed]   = useState(false);
  const [pwInput,  setPwInput]  = useState('');
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter,   setFilter]   = useState('all');

  // ── Auth ─────────────────────────────────────────────────────
  const handleLogin = (e) => {
    e.preventDefault();
    if (pwInput === DASHBOARD_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem('dash_auth', '1');
    } else {
      alert('كلمة المرور غلط!');
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('dash_auth') === '1') setAuthed(true);
  }, []);

  // ── Fetch orders (realtime) ───────────────────────────────────
  useEffect(() => {
    if (!authed) return;
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [authed]);

  const updateStatus = async (orderId, newStatus) => {
    await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
  };

  // ── Stats ─────────────────────────────────────────────────────
  const total    = orders.length;
  const revenue  = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.grandTotal || 0), 0);
  const pending  = orders.filter(o => o.status === 'pending').length;
  const delivered= orders.filter(o => o.status === 'delivered').length;

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  // ── Login screen ──────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="dash-login">
        <div className="dash-login-box">
          <div className="dash-login-icon">🔐</div>
          <h2>Dashboard</h2>
          <p>أدخل كلمة المرور للدخول</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={pwInput}
              onChange={e => setPwInput(e.target.value)}
              autoFocus
            />
            <button type="submit">دخول</button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────
  return (
    <div className="dash-page">
      <div className="dash-header">
        <h1>📊 Orders Dashboard</h1>
        <button className="dash-logout" onClick={() => { sessionStorage.removeItem('dash_auth'); setAuthed(false); }}>
          خروج
        </button>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <div className="stat-card"><span className="stat-num">{total}</span><span className="stat-label">إجمالي الطلبات</span></div>
        <div className="stat-card pending"><span className="stat-num">{pending}</span><span className="stat-label">في الانتظار</span></div>
        <div className="stat-card delivered"><span className="stat-num">{delivered}</span><span className="stat-label">تم التوصيل</span></div>
        <div className="stat-card revenue"><span className="stat-num">LE {revenue.toFixed(0)}</span><span className="stat-label">إجمالي الإيراد</span></div>
      </div>

      {/* Filter tabs */}
      <div className="dash-filters">
        {['all', ...STATUS_OPTIONS].map(s => (
          <button
            key={s}
            className={`dash-filter-btn ${filter === s ? 'active' : ''}`}
            style={filter === s && s !== 'all' ? { borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s] } : {}}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? 'الكل' : s}
            <span className="filter-count">
              {s === 'all' ? orders.length : orders.filter(o => o.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="dash-loading">جاري التحميل…</div>
      ) : filtered.length === 0 ? (
        <div className="dash-empty">لا يوجد طلبات</div>
      ) : (
        <div className="dash-orders">
          {filtered.map(order => (
            <div key={order.id} className={`order-card ${expanded === order.id ? 'expanded' : ''}`}>

              {/* Order header */}
              <div className="order-header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className="order-id">#{order.id.slice(-6).toUpperCase()}</div>
                <div className="order-customer">
                  <strong>{order.customer?.firstName} {order.customer?.lastName}</strong>
                  <span>{order.customer?.phone}</span>
                </div>
                <div className="order-meta">
                  <span className="order-total">LE {order.grandTotal?.toFixed(2)}</span>
                  <span className="order-date">
                    {order.createdAt?.toDate?.()?.toLocaleDateString('ar-EG') || '—'}
                  </span>
                </div>
                <span
                  className="order-status-badge"
                  style={{ background: STATUS_COLORS[order.status] || '#999' }}
                >
                  {order.status}
                </span>
                <span className="order-chevron">{expanded === order.id ? '▲' : '▼'}</span>
              </div>

              {/* Order details */}
              {expanded === order.id && (
                <div className="order-details">
                  <div className="order-details-grid">
                    <div>
                      <h4>بيانات العميل</h4>
                      <p>📧 {order.customer?.email}</p>
                      <p>📍 {order.customer?.address}، {order.customer?.city}</p>
                      <p>🚚 {order.shipping?.method} — LE {order.shipping?.cost}</p>
                      <p>💳 {order.payment}</p>
                    </div>
                    <div>
                      <h4>المنتجات</h4>
                      {order.items?.map((item, i) => (
                        <div key={i} className="order-item-row">
                          {item.image && <img src={item.image} alt={item.name} />}
                          <span>{item.name} × {item.qty}</span>
                          <span>LE {(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status changer */}
                  <div className="order-status-row">
                    <label>تغيير الحالة:</label>
                    <div className="status-btns">
                      {STATUS_OPTIONS.map(s => (
                        <button
                          key={s}
                          className={`status-btn ${order.status === s ? 'active' : ''}`}
                          style={order.status === s ? { background: STATUS_COLORS[s], color: '#fff' } : { borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s] }}
                          onClick={() => updateStatus(order.id, s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp quick reply */}
                  <a
                    className="dash-wa-btn"
                    href={`https://wa.me/${order.customer?.phone?.replace(/\D/g,'')}?text=أهلاً ${order.customer?.firstName}، طلبك رقم %23${order.id.slice(-6).toUpperCase()} حالته: ${order.status} 🛍️`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    💬 رد على العميل واتساب
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
