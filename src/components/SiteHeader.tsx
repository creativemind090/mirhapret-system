'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from './PageHeader';

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
        background: '#000',
        color: '#fff',
        textAlign: 'center',
        padding: '10px 20px',
        fontSize: '12px',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        fontWeight: 500,
      }}>
        New: Octa West 2026 Now Live
      </div>
      <PageHeader isScrolled={isScrolled} />
      {/* Push content below the fixed nav (60px) + announcement bar already in flow (36px) */}
      <div style={{ height: '60px' }} />
    </>
  );
}
