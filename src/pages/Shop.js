import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import products, { categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Shop.css';

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search');
    const g = params.get('gender');
    const c = params.get('cat');
    if (q) setSearchQuery(q);
    if (g) setActiveGender(g);
    if (c) setActiveCategory(c);
  }, [location.search]);

  const filteredProducts = products.filter(p => {
    const matchCat    = activeCategory === 'all' || p.category === activeCategory;
    const matchGender = activeGender === 'all' || p.gender === activeGender;
    const matchSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchGender && matchSearch;
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

      {searchQuery && (
        <div className="search-indicator">
          Results for "{searchQuery}"
          <button onClick={() => setSearchQuery('')}>✕ Clear</button>
        </div>
      )}

      {isGrouped ? (
        Object.keys(grouped).map(cat => (
          <div key={cat} className="shop-category-section">
            <h2 className="section-title">{categoryLabels[cat] || cat}</h2>
            <div className="products-grid">
              {grouped[cat].map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        ))
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
