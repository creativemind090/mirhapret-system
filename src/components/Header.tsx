'use client';

import { useState, useEffect } from 'react';

interface HeaderProps {
  isScrolled?: boolean;
}

export default function Header({ isScrolled = false }: HeaderProps) {
  const [cartCount, setCartCount] = useState(0);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: isScrolled ? '#ffffff' : 'transparent',
        borderBottom: isScrolled ? '1px solid #e0e0e0' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '40px',
        paddingRight: '40px',
        zIndex: 100,
        transition: 'none',
      }}
    >
      <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '2px' }}>NEXUS</div>
      <nav style={{ display: 'flex', gap: '40px', fontSize: '14px', fontWeight: 500 }}>
        <a href="#collections" style={{ cursor: 'pointer' }}>
          Collections
        </a>
        <a href="#featured" style={{ cursor: 'pointer' }}>
          Featured
        </a>
        <a href="#about" style={{ cursor: 'pointer' }}>
          About
        </a>
        <a href="#contact" style={{ cursor: 'pointer' }}>
          Contact
        </a>
      </nav>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <span style={{ fontSize: '18px' }}>🛍</span>
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#c0392b',
                color: '#ffffff',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              {cartCount}
            </span>
          )}
        </div>
        <button
          style={{
            padding: '10px 24px',
            background: '#000000',
            color: '#ffffff',
            border: '1px solid #000000',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Shop Now
        </button>
      </div>
    </header>
  );
}
