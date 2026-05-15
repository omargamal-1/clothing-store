import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { totalItems } = useCart();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>

        {/* Logo center */}
        <Link to="/" className="navbar-logo">
          SNOW
        </Link>

        {/* Right: search + cart */}
<div className="navbar-right">
  <Link to="/order-tracking" className="navbar-link">Track Order</Link>
  <Link to="/wishlist" className="navbar-link">Wishlist ❤️</Link>
          <form onSubmit={handleSearch} className="navbar-search">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <Link to="/cart" className="navbar-cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="navbar-dropdown">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
<<<<<<< HEAD
          <Link to="/order-tracking">Track Order</Link>
=======
>>>>>>> f4bde56a0471a764e82ba26d8c3bccd5b5edc033
          <Link to="/wishlist">Wishlist ❤️</Link>
        </div>
      )}
    </nav>
  );
}
