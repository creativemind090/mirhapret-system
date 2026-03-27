'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from './PageHeader';

const GOLD = '#c8a96e';

/** Drop-in header for all pages except home.
 *  Manages its own scroll state — pages don't need to. */
export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Announcement bar */}
      <div className="site-announcement" style={{
        background: '#080808',
        color: GOLD,
        textAlign: 'center',
        padding: '9px 20px',
        fontSize: '10px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        fontWeight: 600,
        fontFamily: "'Montserrat', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}>
        <span style={{ width: '4px', height: '4px', background: GOLD, transform: 'rotate(45deg)', display: 'inline-block', flexShrink: 0 }} />
        New: Octa West 2026 Now Live
        <span style={{ width: '4px', height: '4px', background: GOLD, transform: 'rotate(45deg)', display: 'inline-block', flexShrink: 0 }} />
      </div>
      <PageHeader isScrolled={isScrolled} />
      {/* Push content below the fixed nav (60px) + announcement bar already in flow (36px) */}
      <div style={{ height: '60px' }} />
    </>
  );
}
