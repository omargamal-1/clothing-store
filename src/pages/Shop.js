import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import products, { categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const MIN_PRICE = 300;
const MAX_PRICE = 1000;

const genderFilters = [
  { id: 'all', label: 'All' },
  { id: 'men', label: 'Boys' },
  { id: 'women', label: 'Girls' },
];

export default function Shop() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeGender, setActiveGender] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search');
    const g = params.get('gender');
    const c = params.get('cat');
    if (q) setSearchQuery(q);
    if (g) setActiveGender(g);
    if (c) setActiveCategory(c);
  }, [location.search]);

  const pct = (val) => ((val - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  const clampMin = useCallback((raw) => {
    const snapped = Math.round(raw / 50) * 50;
    return Math.max(MIN_PRICE, Math.min(snapped, priceRange[1] - 50));
  }, [priceRange]);

  const clampMax = useCallback((raw) => {
    const snapped = Math.round(raw / 50) * 50;
    return Math.min(MAX_PRICE, Math.max(snapped, priceRange[0] + 50));
  }, [priceRange]);

  const handleTrackClick = (e) => {
    if (e.target.classList.contains('price-thumb')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const val = Math.round((MIN_PRICE + ratio * (MAX_PRICE - MIN_PRICE)) / 50) * 50;
    const distMin = Math.abs(val - priceRange[0]);
    const distMax = Math.abs(val - priceRange[1]);
    if (distMin <= distMax) {
      setPriceRange(prev => [clampMin(val), prev[1]]);
    } else {
      setPriceRange(prev => [prev[0], clampMax(val)]);
    }
  };

  const handleThumbMouseDown = (thumb) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(thumb);
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const track = document.querySelector('.price-track');
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const val = MIN_PRICE + ratio * (MAX_PRICE - MIN_PRICE);
      if (dragging === 'min') setPriceRange(prev => [clampMin(val), prev[1]]);
      else setPriceRange(prev => [prev[0], clampMax(val)]);
    };
    const onUp = () => setDragging(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging, clampMin, clampMax]);

  const resetPrice = () => setPriceRange([MIN_PRICE, MAX_PRICE]);
  const isPriceFiltered = priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE;

  const filteredProducts = products.filter(p => {
    const matchCat    = activeCategory === 'all' || p.category === activeCategory;
    const matchGender = activeGender === 'all' || p.gender === activeGender;
    const matchSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPrice  = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchCat && matchGender && matchSearch && matchPrice;
  });

  const isGrouped = activeCategory === 'all' && !searchQuery;
  const grouped = {};
  if (isGrouped) {
    filteredProducts.forEach(p => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });
  }

  const categoryLabels = { tshirts: 'T-shirts', babytees: 'Babytees', tops: 'Tops', polos: 'Polos', hoodies: 'Hoodies' };

  return (
    <div className="shop-page page-container">
      {/* Gender toggle */}
      <div className="shop-gender-toggle">
        {genderFilters.map(g => (
          <button
            key={g.id}
            className={`gender-toggle-btn ${activeGender === g.id ? 'active' : ''}`}
            onClick={() => setActiveGender(g.id)}
          >
            {g.label}
          </button>
        ))}
      </div>
{/* Search Input */}
<div className="shop-search">
  <input
    type="text"
    placeholder="Search products..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="shop-search-input"
  />
</div>
      {/* Category filter */}
      <div className="shop-filters">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Price Range Slider */}
      <div className="price-filter">
        <div className="price-filter-header">
          <span className="price-filter-label">Price Range</span>
          <span className="price-filter-values">
            <span className="price-val">{priceRange[0]} EGP</span>
            <span className="price-dash"> – </span>
            <span className="price-val">{priceRange[1]} EGP</span>
          </span>
          {isPriceFiltered && (
            <button className="price-reset" onClick={resetPrice}>✕ Reset</button>
          )}
        </div>

        <div className="price-track-wrap" onClick={handleTrackClick}>
          <div className="price-track">
            <div
              className="price-range-fill"
              style={{ left: `${pct(priceRange[0])}%`, width: `${pct(priceRange[1]) - pct(priceRange[0])}%` }}
            />
            <div
              className={`price-thumb price-thumb--min${dragging === 'min' ? ' dragging' : ''}`}
              style={{ left: `${pct(priceRange[0])}%` }}
              onMouseDown={handleThumbMouseDown('min')}
              onTouchStart={handleThumbMouseDown('min')}
            />
            <div
              className={`price-thumb price-thumb--max${dragging === 'max' ? ' dragging' : ''}`}
              style={{ left: `${pct(priceRange[1])}%` }}
              onMouseDown={handleThumbMouseDown('max')}
              onTouchStart={handleThumbMouseDown('max')}
            />
          </div>
        </div>

        <div className="price-track-labels">
          <span>{MIN_PRICE} EGP</span>
          <span>{MAX_PRICE} EGP</span>
        </div>
      </div>

      {searchQuery && (
        <div className="search-indicator">
          Results for "{searchQuery}"
          <button onClick={() => setSearchQuery('')}>✕ Clear</button>
        </div>
      )}

      {isGrouped ? (
        Object.keys(grouped).length === 0 ? (
          <p className="no-results">No products found in this price range.</p>
        ) : (
          Object.keys(grouped).map(cat => (
            <div key={cat} className="shop-category-section">
              <h2 className="section-title">{categoryLabels[cat] || cat}</h2>
              <div className="products-grid">
                {grouped[cat].map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          ))
        )
      ) : (
        <div>
          {filteredProducts.length === 0 ? (
            <p className="no-results">No products found.</p>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}