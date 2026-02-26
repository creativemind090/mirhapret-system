'use client';

import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { MdSupportAgent } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { IoChatbubbles } from 'react-icons/io5';

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot'; text: string; isTyping?: boolean }>>([
    { type: 'bot', text: 'Hello! How can we help you today?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const typeMessage = (text: string, callback: (fullText: string) => void) => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      callback(text.substring(0, index));
      if (index === text.length) {
        clearInterval(interval);
      }
    }, 30);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isWaitingForResponse) return;

    // Add user message
    setMessages((prev) => [...prev, { type: 'user', text: inputValue }]);
    setInputValue('');
    setIsWaitingForResponse(true);

    // Show typing indicator for at least 2 seconds
    setMessages((prev) => [...prev, { type: 'bot', text: '...', isTyping: true }]);

    setTimeout(() => {
      const responses = [
        'Thanks for your message! Our team will get back to you soon.',
        'We appreciate your inquiry. Feel free to chat with us on WhatsApp for faster response!',
        'Is there anything else I can help you with?',
        'You can also reach us on WhatsApp for immediate assistance.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      // Remove typing indicator and add bot message with typewriter effect
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isTyping);
        return [...filtered, { type: 'bot', text: '', isTyping: false }];
      });

      // Typewriter effect
      typeMessage(randomResponse, (partialText) => {
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.type === 'bot') {
            lastMsg.text = partialText;
          }
          return updated;
        });
      });

      // After typewriter completes, allow new messages
      setTimeout(() => {
        setIsWaitingForResponse(false);
      }, randomResponse.length * 30 + 100);
    }, 2000);
  };

  const whatsappLink = `https://wa.me/923215551851?text=Hi%20MirhaPret%2C%20I%20have%20a%20question`;

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#000000',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '24px',
        }}
        title="Open chat"
      >
        {isOpen ? <IoClose size={24} /> : <MdSupportAgent size={24} />}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            width: '380px',
            height: '500px',
            background: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '0',
            boxShadow: '0 5px 40px rgba(0,0,0,0.16)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 999,
            fontFamily: 'system-ui',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: '#000000',
              color: '#ffffff',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MdSupportAgent size={24} />
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 4px' }}>MirhaPret Support</p>
                <p style={{ fontSize: '12px', color: '#cccccc', margin: 0 }}>We typically reply in minutes</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <a
                href={`https://wa.me/923215551851?text=Hi%20MirhaPret%2C%20I%20have%20a%20question`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#25D366',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}
                title="Chat on WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IoClose size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '10px 14px',
                    borderRadius: '0',
                    background: msg.type === 'user' ? '#000000' : '#f0f0f0',
                    color: msg.type === 'user' ? '#ffffff' : '#000000',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    minHeight: msg.isTyping ? '20px' : 'auto',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {msg.isTyping ? (
                    <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span style={{ animation: 'blink 1.4s infinite' }}>.</span>
                      <span style={{ animation: 'blink 1.4s infinite 0.2s' }}>.</span>
                      <span style={{ animation: 'blink 1.4s infinite 0.4s' }}>.</span>
                      <style>{`
                        @keyframes blink {
                          0%, 20%, 50%, 80%, 100% { opacity: 1; }
                          40% { opacity: 0.3; }
                          60% { opacity: 0.3; }
                        }
                      `}</style>
                    </span>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                fontSize: '13px',
                fontFamily: 'system-ui',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: '10px 16px',
                background: '#000000',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'system-ui',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
