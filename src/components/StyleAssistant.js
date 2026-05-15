import React, { useState, useRef, useEffect } from "react";
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom'; // Ensure this is imported
import products from '../data/products';
import "./StyleAssistant.css";

export default function StyleAssistant() {
  const { addToCart } = useCart();
  const navigate = useNavigate(); // Hook for smooth navigation
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  const [messages, setMessages] = useState([{
    id: 1, 
    type: 'bot', 
    text: "Hey there! I'm your SNOW Personal Stylist. ✨ Who are we dressing up today?",
    options: ['👗 Girl Style', '👕 Boy Style', '🔥 New Arrivals', '💰 Under 500 EGP']
  }]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleAction = (text) => {
    if (!text || !text.trim()) return;

    // --- NAVIGATION GATE (FIX FOR VIEW CART) ---
    const lowerText = text.toLowerCase();
    if (lowerText.includes('cart') || lowerText.includes('🛒')) {
        setIsOpen(false);
        navigate('/cart'); 
        return; // Stop execution here
    }
    
    // User message setup
    const userGender = lowerText.includes('girl') ? 'female' : lowerText.includes('boy') ? 'male' : 'neutral';
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text, gender: userGender }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let botResponse = { id: Date.now(), type: 'bot' };
      const query = lowerText;

      // 1. OUTFIT GENERATOR (Girl/Boy Style)
      if (query.includes('style')) {
        const isGirl = query.includes('girl');
        const pool = products.filter(p => isGirl ? p.gender === 'women' : p.gender === 'men');
        
        // Safety Fallbacks: ensure we find at least something
        let t1 = pool.find(p => p.category?.toLowerCase().includes('tee') || p.category?.toLowerCase().includes('top'));
        let l1 = pool.find(p => p.category?.toLowerCase().includes('hoodie') || p.category?.toLowerCase().includes('polo'));

        if (!t1 && pool.length > 0) t1 = pool[0];
        if (!l1 && pool.length > 1) l1 = pool[1];

        const outfit = [t1, l1].filter(Boolean);

        botResponse.text = `I've put together this ${isGirl ? 'Girl' : 'Boy'} style! Ready to add it to your cart? ✨`;
        botResponse.outfit = outfit;
        botResponse.options = ['🛒 View Cart', '🏠 Start Over'];
      } 

      // 2. BUDGET FILTER (Under 500)
      else if (query.includes('under') || query.includes('500') || query.includes('budget')) {
        const budgetItems = products.filter(p => p.price <= 500).slice(0, 4);
        botResponse.text = "Here are some great picks that won't break the bank (Under 500 EGP)! 💰";
        botResponse.products = budgetItems;
        botResponse.options = ['🧥 Hoodies', '🔥 New Arrivals', '🛒 View Cart'];
      }

      // 3. HOODIES (Specific category logic)
      else if (query.includes('hoodie')) {
        const hoodies = products.filter(p => p.category?.toLowerCase().includes('hoodie')).slice(0, 4);
        botResponse.text = "Check out our best-selling hoodies! Warm and stylish. 🧥";
        botResponse.products = hoodies;
        botResponse.options = ['💰 Under 500 EGP', '🛒 View Cart'];
      }

      // 4. NEW ARRIVALS
      else if (query.includes('new')) {
        const newItems = products.filter(p => p.badge === 'New').slice(0, 4);
        botResponse.text = "Straight from the latest drop! 🔥";
        botResponse.products = newItems;
        botResponse.options = ['👗 Girl Style', '👕 Boy Style', '🛒 View Cart'];
      }

      // 5. START OVER / BACK
      else if (query.includes('start') || query.includes('back')) {
        botResponse.text = "Welcome back! What are we styling today?";
        botResponse.options = ['👗 Girl Style', '👕 Boy Style', '🔥 New Arrivals'];
      }

      // 6. DEFAULT FALLBACK
      else {
        botResponse.text = "I'm on it! Would you like to see a custom style or filter by category?";
        botResponse.options = ['👗 Girl Style', '👕 Boy Style', '🧥 Hoodies', '💰 Under 500 EGP'];
      }

      setMessages(prev => [...prev, botResponse]);
    }, 800);
  };

  const handleAddOutfit = (outfit) => {
    if (addToCart) {
      outfit.forEach(p => addToCart(p, 'M'));
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        type: 'bot', 
        text: "✅ Full style added to your cart! You're going to look great. 🛍️",
        options: ['🛒 View Cart', '🏠 Continue Shopping']
      }]);
    }
  };

  return (
    <>
      <button className="sa-fab-main" onClick={() => setIsOpen(true)}>
        <span className="sa-icon">✨</span> Stylist
      </button>

      <div className={`sa-drawer ${isOpen ? 'open' : ''}`}>
        <div className="sa-head">
          <div className="sa-head-info">
            <div className="sa-pfp">✨</div>
            <div>
              <h4>SNOW AI</h4>
              <p className="sa-online-status">Active & Styling</p>
            </div>
          </div>
          <button className="sa-close" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className="sa-chat-body" ref={scrollRef}>
          {messages.map(m => (
            <div key={m.id} className={`sa-row ${m.type} ${m.gender || ''}`}>
              <div className="sa-bubble">
                {m.text}
                
                {m.options && (
                  <div className="sa-chips">
                    {m.options.map(opt => (
                      <button key={opt} onClick={() => handleAction(opt)}>{opt}</button>
                    ))}
                  </div>
                )}

                {m.products && (
                  <div className="sa-mini-results">
                    {m.products.map(p => (
                      <div key={p.id} className="sa-mini-item">
                        <img src={p.image} alt={p.name} />
                        <div className="sa-mini-info">
                          <span>{p.name.substring(0, 15)}...</span>
                          <button onClick={() => {
                            addToCart(p, 'M');
                            setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: `Added ${p.name} to cart! ✅` }]);
                          }}>
                            + LE {p.price}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {m.outfit && (
                  <div className="sa-outfit-card">
                    <div className="sa-grid">
                      {m.outfit.map(p => <img key={p.id} src={p.image} alt="" />)}
                    </div>
                    <button className="sa-confirm" onClick={() => handleAddOutfit(m.outfit)}>
                      Confirm & Add Full Style — LE {m.outfit.reduce((s, p) => s + p.price, 0)}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && <div className="sa-typing"><span></span><span></span><span></span></div>}
        </div>

        <div className="sa-footer">
          <div className="sa-input-bar">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Style me for a party..." 
              onKeyDown={e => e.key === 'Enter' && handleAction(input)}
            />
            <button onClick={() => handleAction(input)}>Send</button>
          </div>
        </div>
      </div>
      {isOpen && <div className="sa-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}