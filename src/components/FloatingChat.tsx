'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { IoClose, IoSend, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { FaWhatsapp } from 'react-icons/fa';
import { MdSupportAgent } from 'react-icons/md';

const CHATBOT_URL = process.env.NEXT_PUBLIC_CHATBOT_URL || '';
const STORAGE_KEY = 'mirhapret_chat_session';
const MAX_STORED_MESSAGES = 40;
const GOLD = '#c8a96e';
const DARK = '#080808';

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

// ── Product Carousel ──────────────────────────────────────────────────────────
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
    <div style={{ marginTop: '8px', width: '100%' }}>
      <div
        style={{
          position: 'relative',
          background: '#f9f7f4',
          border: '1px solid rgba(200,169,110,0.2)',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={() => router.push(`/products/${product.slug || product.id}`)}
        title={`View ${product.name}`}
      >
        <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#ece8e3', position: 'relative' }}>
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontFamily: "'Montserrat', sans-serif", fontSize: '11px' }}>
              No image
            </div>
          )}
        </div>
        <div style={{ padding: '10px 12px' }}>
          <p style={{ margin: 0, fontFamily: "'Montserrat', sans-serif", fontSize: '11px', fontWeight: 600, color: DARK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.name}
          </p>
          <p style={{ margin: '4px 0 0', fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: GOLD, fontWeight: 600 }}>
            PKR {Number(product.price).toLocaleString()}
          </p>
        </div>
      </div>

      {products.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
          <button onClick={prev} style={{ background: DARK, color: '#fff', border: 'none', cursor: 'pointer', padding: '4px 10px', display: 'flex', alignItems: 'center' }}>
            <IoChevronBack size={12} />
          </button>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#999', letterSpacing: '1px' }}>
            {idx + 1} / {products.length}
          </span>
          <button onClick={next} style={{ background: DARK, color: '#fff', border: 'none', cursor: 'pointer', padding: '4px 10px', display: 'flex', alignItems: 'center' }}>
            <IoChevronForward size={12} />
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

  useEffect(() => {
    if (isOpen && !sessionLoaded.current) {
      sessionLoaded.current = true;
      const session = loadSession();
      if (session?.messages?.length) {
        setMessages(session.messages);
        setHistory(session.history ?? []);
      }
    }
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

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
      if (!CHATBOT_URL) {
        throw new Error('CHATBOT_UNAVAILABLE');
      }

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
          setMessages(prev => {
            saveSession(prev, newHistory);
            return prev;
          });
        }
      }, 16);

      setHistory(newHistory);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      const fallbackText = message === 'CHATBOT_UNAVAILABLE' || message === 'Failed to fetch'
        ? "Mira is temporarily unavailable. Please message us on WhatsApp at +92 324 457 7066 and we'll help you right away."
        : message || "Sorry, I'm having trouble connecting. Please try again or reach us on WhatsApp.";
      const errMsg: Message = {
        role: 'assistant',
        text: fallbackText,
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
        aria-label="Chat with Mira"
        style={{
          position: 'fixed',
          bottom: isMobile ? '16px' : '24px',
          right: isMobile ? '16px' : '24px',
          width: '52px', height: '52px',
          background: isOpen ? DARK : GOLD,
          color: '#fff', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          transition: 'background 0.2s',
        }}
      >
        {isOpen ? <IoClose size={22} /> : <MdSupportAgent size={26} />}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: isMobile ? '12px' : '88px',
          right: isMobile ? '12px' : '24px',
          left: isMobile ? '12px' : 'auto',
          width: isMobile ? 'auto' : '340px',
          height: isMobile ? '82dvh' : '540px',
          background: '#fff',
          border: '1px solid #ece8e3',
          boxShadow: '0 12px 48px rgba(0,0,0,0.14)',
          display: 'flex', flexDirection: 'column',
          zIndex: 999,
        }}>
          {/* Header */}
          <div style={{
            background: DARK, color: '#fff',
            padding: '14px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.04,
              backgroundImage: 'linear-gradient(rgba(200,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,1) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '32px', height: '32px', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: "'Cormorant', serif", fontSize: '18px', fontWeight: 600, fontStyle: 'italic', color: '#fff', lineHeight: 1 }}>M</span>
              </div>
              <div>
                <p style={{ margin: 0, fontFamily: "'Cormorant', serif", fontSize: '15px', fontWeight: 600, fontStyle: 'italic', letterSpacing: '0.3px' }}>Mira</p>
                <p style={{ margin: 0, fontFamily: "'Montserrat', sans-serif", fontSize: '9px', color: '#555', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600 }}>MirhaPret Assistant</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
              <button
                onClick={clearChat}
                title="Clear chat"
                style={{
                  background: 'transparent', border: 'none', color: '#444',
                  cursor: 'pointer', fontFamily: "'Montserrat', sans-serif",
                  fontSize: '9px', fontWeight: 600, letterSpacing: '1.5px',
                  textTransform: 'uppercase', padding: 0,
                }}
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
                <FaWhatsapp size={16} />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#777', cursor: 'pointer', display: 'flex', padding: 0 }}
              >
                <IoClose size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '14px 12px',
            display: 'flex', flexDirection: 'column', gap: '10px',
            background: '#FAFAF8',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    padding: '9px 13px',
                    background: msg.role === 'user' ? DARK : '#fff',
                    color: msg.role === 'user' ? '#fff' : '#333',
                    border: msg.role === 'user' ? 'none' : '1px solid #ece8e3',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '12px', lineHeight: 1.6, fontWeight: 300,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  }}>
                    {msg.isTyping ? <TypingDots /> : msg.text}
                  </div>
                  {!msg.isTyping && msg.products && msg.products.length > 0 && (
                    <ProductCarousel products={msg.products} />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 12px',
            borderTop: '1px solid #ece8e3',
            display: 'flex', gap: '8px', alignItems: 'center',
            background: '#fff',
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything…"
              disabled={isLoading}
              style={{
                flex: 1, padding: '9px 12px',
                border: '1px solid #ece8e3',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '12px', outline: 'none',
                background: isLoading ? '#fafaf8' : '#fff',
                color: DARK, fontWeight: 300,
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              style={{
                padding: '9px 12px',
                background: isLoading || !input.trim() ? '#d0ccc8' : GOLD,
                color: '#fff', border: 'none',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center',
                transition: 'background 0.2s',
              }}
            >
              <IoSend size={14} />
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
            width: '5px', height: '5px', background: GOLD,
            animation: `chatDot 1.2s ease-in-out ${delay}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes chatDot{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}`}</style>
    </span>
  );
}
