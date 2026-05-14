import React, { useState, useRef, useEffect } from 'react';
import './StyleAssistant.css';

const SYSTEM_PROMPT = `You are a friendly AI style assistant for SNOW Clothing Store. 
You help customers find the perfect outfits from our collection.
Our products include: hoodies, t-shirts, and streetwear items in various colors.
Keep responses short, friendly, and always suggest 2-3 specific outfit combinations.
Use emojis to make responses fun. Always end with a question to keep the conversation going.`;

export default function StyleAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! 👋 I'm your personal style assistant at SNOW. Tell me about your style, occasion, or mood and I'll help you find the perfect outfit! 🔥" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Please try again! 😊'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button className="style-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '✨ Style AI'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="style-chat">
          <div className="style-chat-header">
            <span>✨ SNOW Style Assistant</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="style-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`style-msg style-msg--${msg.role}`}>
                {msg.role === 'assistant' && <span className="style-avatar">✨</span>}
                <p>{msg.content}</p>
              </div>
            ))}
            {loading && (
              <div className="style-msg style-msg--assistant">
                <span className="style-avatar">✨</span>
                <p className="style-typing">Styling your look...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="style-chat-input">
            <input
              type="text"
              placeholder="Ask for outfit ideas..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} disabled={loading}>
              {loading ? '...' : '→'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}