'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MdSupportAgent } from 'react-icons/md';
import { IoClose, IoSend, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { FaWhatsapp } from 'react-icons/fa';

const CHATBOT_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || 'http://localhost:3004';
const STORAGE_KEY = 'mirhapret_chat_session';
const MAX_STORED_MESSAGES = 40;

interface Product {
  id: string;
  slug?: string;
  name: string;
  price: string | number;
  images?: string[];
  image_url?: string;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  products?: Product[];
  isTyping?: boolean;
}

interface StoredSession {
  messages: Message[];
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}

const WELCOME: Message = {
  role: 'assistant',
  text: "Assalam o Alaikum! I'm Mira, your MirhaPret shopping assistant. How can I help you today?",
};

function loadSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

function saveSession(messages: Message[], history: StoredSession['history']) {
  try {
    const session: StoredSession = {
      messages: messages.filter(m => !m.isTyping).slice(-MAX_STORED_MESSAGES),
      history: history.slice(-MAX_STORED_MESSAGES),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {}
}

// ── Product Carousel ─────────────────────────────────────────────────────────
function ProductCarousel({ products }: { products: Product[] }) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx(i => (i - 1 + products.length) % products.length);
  const next = () => setIdx(i => (i + 1) % products.length);

  const product = products[idx];
  const imgSrc =
    (product.images && product.images.length > 0 ? product.images[0] : null) ||
    product.image_url ||
    null;

  return (
    <div style={{ marginTop: '6px', width: '100%' }}>
      <div
        style={{
          position: 'relative',
          background: '#f9f9f9',
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={() => router.push(`/products/${product.slug || product.id}`)}
        title={`View ${product.name}`}
      >
        {/* Product Image */}
        <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#eee', position: 'relative' }}>
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: '13px' }}>
              No image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ padding: '8px 10px' }}>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.name}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#555' }}>
            PKR {Number(product.price).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Navigation (only if multiple) */}
      {products.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
          <button
            onClick={prev}
            style={{ background: '#000', color: '#fff', border: 'none', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center' }}
          >
            <IoChevronBack size={14} />
          </button>
          <span style={{ fontSize: '11px', color: '#777' }}>
            {idx + 1} / {products.length}
          </span>
          <button
            onClick={next}
            style={{ background: '#000', color: '#fff', border: 'none', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center' }}
          >
            <IoChevronForward size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [history, setHistory] = useState<StoredSession['history']>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionLoaded = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 520);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Load session from localStorage on first open
  useEffect(() => {
    if (isOpen && !sessionLoaded.current) {
      sessionLoaded.current = true;
      const session = loadSession();
      if (session?.messages?.length) {
        setMessages(session.messages);
        setHistory(session.history ?? []);
      }
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const newUserMsg: Message = { role: 'user', text };
    const typingMsg: Message = { role: 'assistant', text: '', isTyping: true };

    setInput('');
    setMessages(prev => [...prev, newUserMsg, typingMsg]);
    setIsLoading(true);

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    try {
      const res = await fetch(`${CHATBOT_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history, token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');

      const reply: string = data.reply;
      const products: Product[] | undefined = data.products;

      const newHistory: StoredSession['history'] = [
        ...history,
        { role: 'user', content: text },
        { role: 'assistant', content: reply },
      ];

      const replyMsg: Message = { role: 'assistant', text: '', products };

      setMessages(prev => {
        const withoutTyping = prev.filter(m => !m.isTyping);
        return [...withoutTyping, replyMsg];
      });

      // Typewriter effect
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === 'assistant' && !last.isTyping) last.text = reply.substring(0, i);
          return updated;
        });
        if (i >= reply.length) {
          clearInterval(interval);
          // Save session after typewriter finishes
          setMessages(prev => {
            saveSession(prev, newHistory);
            return prev;
          });
        }
      }, 16);

      setHistory(newHistory);
    } catch (err: any) {
      const errMsg: Message = {
        role: 'assistant',
        text: err?.message || "Sorry, I'm having trouble connecting. Please try again or reach us on WhatsApp.",
      };
      setMessages(prev => [...prev.filter(m => !m.isTyping), errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, history]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([WELCOME]);
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          position: 'fixed',
          bottom: isMobile ? '16px' : '24px',
          right: isMobile ? '16px' : '24px',
          width: '52px', height: '52px', borderRadius: '50%',
          background: '#000', color: '#fff', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        }}
        title="Chat with Mira"
      >
        {isOpen ? <IoClose size={24} /> : <MdSupportAgent size={24} />}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: isMobile ? '12px' : '88px',
            right: isMobile ? '12px' : '24px',
            left: isMobile ? '12px' : 'auto',
            width: isMobile ? 'auto' : '340px',
            height: isMobile ? '82dvh' : '540px',
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: isMobile ? '12px' : '0',
            boxShadow: '0 8px 40px rgba(0,0,0,0.22)',
            display: 'flex', flexDirection: 'column',
            zIndex: 999, fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Header */}
          <div style={{ background: '#000', color: '#fff', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MdSupportAgent size={20} />
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>Mira — MirhaPret</p>
                <p style={{ margin: 0, fontSize: '10px', color: '#aaa' }}>AI Shopping Assistant</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={clearChat}
                title="Clear chat"
                style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '10px', padding: 0 }}
              >
                Clear
              </button>
              <a
                href="https://wa.me/923244577066?text=Hi%20MirhaPret%2C%20I%20have%20a%20question"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                style={{ color: '#25D366', display: 'flex' }}
              >
                <FaWhatsapp size={18} />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: 0 }}
              >
                <IoClose size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      padding: '8px 12px',
                      background: msg.role === 'user' ? '#000' : '#f2f2f2',
                      color: msg.role === 'user' ? '#fff' : '#111',
                      fontSize: '13px', lineHeight: 1.5,
                      whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    }}
                  >
                    {msg.isTyping ? <TypingDots /> : msg.text}
                  </div>
                  {/* Product Carousel */}
                  {!msg.isTyping && msg.products && msg.products.length > 0 && (
                    <ProductCarousel products={msg.products} />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={isLoading}
              style={{
                flex: 1, padding: '8px 11px',
                border: '1px solid #ddd', fontSize: '13px',
                fontFamily: 'system-ui, sans-serif', outline: 'none',
                background: isLoading ? '#f9f9f9' : '#fff',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              style={{
                padding: '8px 11px',
                background: isLoading || !input.trim() ? '#888' : '#000',
                color: '#fff', border: 'none',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center',
              }}
            >
              <IoSend size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', height: '16px' }}>
      {[0, 0.2, 0.4].map((delay, i) => (
        <span
          key={i}
          style={{
            width: '6px', height: '6px', borderRadius: '50%', background: '#555',
            animation: `chatDot 1.2s ease-in-out ${delay}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes chatDot{0%,80%,100%{transform:scale(.7);opacity:.5}40%{transform:scale(1);opacity:1}}`}</style>
    </span>
  );
}
