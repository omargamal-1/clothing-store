import React, { useState, useRef, useEffect } from "react";
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import products from '../data/products';
import "./StyleAssistant.css";

export default function StyleAssistant() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const [messages, setMessages] = useState([{
    id: 1, 
    type: 'bot', 
    text: "Hey there! I'm your SNOW Personal Stylist. ✨ Who are we dressing up today?",
    options: ['👗 Girl Style', '👕 Boy Style', '🔥 New Arrivals', '💰 Under 500 EGP']
  }]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping, isLoadingAI]);

  // ==================== CLAUDE AI API CALL ====================
  const callClaudeAI = async (userMessage, context) => {
    try {
      setIsLoadingAI(true);
      
      // بناء الـ context عن المنتجات المتاحة
      const productList = products
        .slice(0, 10) // احدود الـ context size
        .map(p => `${p.name} (${p.category}, Gender: ${p.gender}, Price: LE${p.price})`)
        .join('\n');

      const systemPrompt = `You are SNOW's AI Personal Stylist - a friendly, modern fashion assistant for Egyptian youth.
Your personality: Fun, trendy, uses emojis, speaks to Gen Z, supportive.
Context: You help customers find fashion styles, filter by budget, and recommend outfits.
Available products: ${productList}

When user asks:
- Style recommendations: Suggest 2-3 products that match their vibe, mention prices
- Budget queries: Filter products under their budget and recommend
- Custom requests: Be creative with outfit combinations

Keep responses SHORT (1-2 sentences max) and end with 2-3 quick action options.
Format options like: ['Option 1', 'Option 2', 'Option 3']
Never mention products not in the available list above.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 300,
          system: systemPrompt,
          messages: [
            { role: "user", content: userMessage }
          ],
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.content[0].text;
      
      setIsLoadingAI(false);
      return aiResponse;
    } catch (error) {
      console.error("Claude AI Error:", error);
      setIsLoadingAI(false);
      return "Sorry, I'm having trouble thinking right now. Try asking me something like '👗 Girl Style' or '💰 Under 500 EGP'!";
    }
  };

  // ==================== ACTION HANDLER ====================
  const handleAction = async (text) => {
    if (!text || !text.trim()) return;

    const lowerText = text.toLowerCase();
    
    // Navigation gate for cart
    if (lowerText.includes('cart') || lowerText.includes('🛒')) {
      setIsOpen(false);
      navigate('/cart'); 
      return;
    }

    // User message setup
    const userGender = lowerText.includes('girl') ? 'female' : lowerText.includes('boy') ? 'male' : 'neutral';
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text, gender: userGender }]);
    setInput('');
    setIsTyping(true);

    // Check if this is a simple action that needs local handling (no AI)
    const isSimpleAction = 
      lowerText.includes('start') || 
      lowerText.includes('back') ||
      lowerText.includes('girl style') ||
      lowerText.includes('boy style') ||
      lowerText.includes('new arrivals') ||
      lowerText.includes('under 500') ||
      lowerText.includes('hoodie');

    setTimeout(async () => {
      let botResponse = { id: Date.now(), type: 'bot' };

      if (isSimpleAction) {
        // Use local logic for simple actions
        if (lowerText.includes('girl style')) {
          const pool = products.filter(p => p.gender === 'women');
          let t1 = pool.find(p => p.category?.toLowerCase().includes('tee') || p.category?.toLowerCase().includes('top'));
          let l1 = pool.find(p => p.category?.toLowerCase().includes('hoodie') || p.category?.toLowerCase().includes('polo'));
          if (!t1 && pool.length > 0) t1 = pool[0];
          if (!l1 && pool.length > 1) l1 = pool[1];
          const outfit = [t1, l1].filter(Boolean);
          botResponse.text = `I've put together this Girl style! Ready to add it to your cart? ✨`;
          botResponse.outfit = outfit;
          botResponse.options = ['🛒 View Cart', '🏠 Start Over'];
        } else if (lowerText.includes('boy style')) {
          const pool = products.filter(p => p.gender === 'men');
          let t1 = pool.find(p => p.category?.toLowerCase().includes('tee') || p.category?.toLowerCase().includes('top'));
          let l1 = pool.find(p => p.category?.toLowerCase().includes('hoodie') || p.category?.toLowerCase().includes('polo'));
          if (!t1 && pool.length > 0) t1 = pool[0];
          if (!l1 && pool.length > 1) l1 = pool[1];
          const outfit = [t1, l1].filter(Boolean);
          botResponse.text = `I've put together this Boy style! Ready to add it to your cart? ✨`;
          botResponse.outfit = outfit;
          botResponse.options = ['🛒 View Cart', '🏠 Start Over'];
        } else if (lowerText.includes('under 500')) {
          const budgetItems = products.filter(p => p.price <= 500).slice(0, 4);
          botResponse.text = "Here are some great picks that won't break the bank (Under 500 EGP)! 💰";
          botResponse.products = budgetItems;
          botResponse.options = ['🧥 Hoodies', '🔥 New Arrivals', '🛒 View Cart'];
        } else if (lowerText.includes('hoodie')) {
          const hoodies = products.filter(p => p.category?.toLowerCase().includes('hoodie')).slice(0, 4);
          botResponse.text = "Check out our best-selling hoodies! Warm and stylish. 🧥";
          botResponse.products = hoodies;
          botResponse.options = ['💰 Under 500 EGP', '🛒 View Cart'];
        } else if (lowerText.includes('new arrivals') || lowerText.includes('new')) {
          const newItems = products.filter(p => p.badge === 'New').slice(0, 4);
          botResponse.text = "Straight from the latest drop! 🔥";
          botResponse.products = newItems;
          botResponse.options = ['👗 Girl Style', '👕 Boy Style', '🛒 View Cart'];
        } else if (lowerText.includes('start') || lowerText.includes('back')) {
          botResponse.text = "Welcome back! What are we styling today?";
          botResponse.options = ['👗 Girl Style', '👕 Boy Style', '🔥 New Arrivals'];
        }
        
        setIsTyping(false);
        setMessages(prev => [...prev, botResponse]);
      } else {
        // Use Claude AI for custom requests
        const aiResponse = await callClaudeAI(text, products);
        
        // Parse AI response to extract options
        let optionsMatch = aiResponse.match(/\['(.+?)'\]/);
        let options = [];
        
        if (optionsMatch) {
          options = optionsMatch[1].split("', '").map(opt => opt.replace(/^'|'$/g, ''));
        } else {
          options = ['🛒 View Cart', '🏠 Start Over'];
        }

        // Remove the options array from the text display
        const displayText = aiResponse.replace(/\['.+?'\]/g, '').trim();

        botResponse.text = displayText || "I'm here to help! What would you like?";
        botResponse.options = options.length > 0 ? options : ['👗 Girl Style', '👕 Boy Style', '💰 Under 500 EGP'];

        setIsTyping(false);
        setMessages(prev => [...prev, botResponse]);
      }
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
              <small>• Active & Styling</small>
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
          {(isTyping || isLoadingAI) && <div className="sa-typing"><span></span><span></span><span></span></div>}
        </div>

        <div className="sa-footer">
          <div className="sa-input-bar">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Style me for a party..." 
              onKeyDown={e => e.key === 'Enter' && handleAction(input)}
              disabled={isLoadingAI}
            />
            <button onClick={() => handleAction(input)} disabled={isLoadingAI}>
              {isLoadingAI ? '⏳' : 'Send'}
            </button>
          </div>
        </div>
      </div>
      {isOpen && <div className="sa-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}