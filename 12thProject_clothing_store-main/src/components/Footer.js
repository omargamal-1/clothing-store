import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">SNOW</span>
          <p>Stay Cool. Stay Snow.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/cart">Cart</Link>
        </div>
        <p className="footer-copy">© 2025 SNOW Clothing. All rights reserved.</p>
      </div>
    </footer>
  );
}
