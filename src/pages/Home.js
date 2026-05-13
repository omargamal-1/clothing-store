import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import products from '../data/products';
import ProductCard from '../components/ProductCard';
import './Home.css';

const HERO_IMAGE = '/images/hero.jpg';

export default function Home() {
  const navigate = useNavigate();

  const tshirts  = products.filter(p => p.category === 'tshirts');
  const babytees = products.filter(p => p.category === 'babytees');
  const boys     = products.filter(p => p.gender === 'men').slice(0, 6);
  const girls    = products.filter(p => p.gender === 'women').slice(0, 6);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-headline">New Season. New Look.</h1>
          <p className="hero-sub">Discover the freshest fits for boys &amp; girls</p>
          <div className="hero-btns">
            <button className="hero-btn" onClick={() => navigate('/shop?gender=men')}>Shop Boys</button>
            <button className="hero-btn hero-btn--outline" onClick={() => navigate('/shop?gender=women')}>Shop Girls</button>
          </div>
        </div>
      </section>

      {/* Gender banners */}
      <div className="gender-banners page-container">
        <div className="gender-banner gender-banner--boys" onClick={() => navigate('/shop?gender=men')}>
          <div className="gender-banner-inner">
            <span className="gender-banner-label">Boys</span>
            <span className="gender-banner-cta">Explore →</span>
          </div>
        </div>
        <div className="gender-banner gender-banner--girls" onClick={() => navigate('/shop?gender=women')}>
          <div className="gender-banner-inner">
            <span className="gender-banner-label">Girls</span>
            <span className="gender-banner-cta">Explore →</span>
          </div>
        </div>
      </div>

      {/* Boys Section */}
      <div className="home-section page-container">
        <div className="section-header">
          <h2 className="section-title">Boys</h2>
          <Link to="/shop?gender=men" className="section-link">View all →</Link>
        </div>
        <div className="products-grid">
          {boys.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* Girls Section */}
      <div className="home-section page-container">
        <div className="section-header">
          <h2 className="section-title girls-title">Girls</h2>
          <Link to="/shop?gender=women" className="section-link">View all →</Link>
        </div>
        <div className="products-grid">
          {girls.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* T-shirts Section */}
      <div className="home-section page-container">
        <div className="section-header">
          <h2 className="section-title">T-shirts</h2>
          <Link to="/shop?cat=tshirts" className="section-link">View all →</Link>
        </div>
        <div className="products-grid">
          {tshirts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* Babytees Section */}
      <div className="home-section page-container">
        <div className="section-header">
          <h2 className="section-title">Babytees</h2>
          <Link to="/shop?cat=babytees" className="section-link">View all →</Link>
        </div>
        <div className="products-grid">
          {babytees.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      <div className="home-shop-all">
        <Link to="/shop" className="shop-all-btn">View All Products</Link>
      </div>
    </div>
  );
}
