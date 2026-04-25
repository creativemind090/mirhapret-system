'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CartSidebar } from './CartSidebar';
import { MirhaPretLogo } from './MirhaPretLogo';

const GOLD = '#c8a96e';
const DARK = '#080808';

interface PageHeaderProps {
  isScrolled?: boolean;
}

export function PageHeader({ isScrolled: _isScrolled = true }: PageHeaderProps) {
  const router = useRouter();
  const { itemCount } = useCartContext();
  const { user, isLoggedIn, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkStyle: React.CSSProperties = {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
    transition: 'color 0.2s',
  };

  return (
    <>
      <nav
        className="site-nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: '#ffffff',
          borderBottom: '1px solid #ece8e3',
          boxShadow: _isScrolled ? '0 1px 0 rgba(236,232,227,0.45)' : '0 1px 0 rgba(236,232,227,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '40px',
          paddingRight: '40px',
          zIndex: 100,
          transition: 'background 0.3s, border-color 0.3s',
        }}
      >
        {/* Logo - Left */}
        <Link href="/" style={{ cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <MirhaPretLogo height={46} color="black" />
        </Link>

        {/* Hamburger - show on mobile */}
        <button className="nav-hamburger" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>

        {/* Nav Links - Center desktop only */}
        <div className="nav-links" style={{ gap: '36px' }}>
          <Link href="/" style={navLinkStyle}>Home</Link>
          <Link href="/products" style={navLinkStyle}>Shop</Link>
          <Link href="/blog" style={navLinkStyle}>Journal</Link>
          <Link href="/about" style={navLinkStyle}>About</Link>
          <Link href="/contact" style={navLinkStyle}>Contact</Link>
        </div>

        {/* Cart & Profile - Right */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
            }}
            aria-label="Open cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {itemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: GOLD,
                  color: '#fff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 700,
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: '0',
                }}
              >
                {itemCount}
              </span>
            )}
          </button>

          {/* Profile Icon */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
              }}
              aria-label="Profile menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: 0,
                  background: '#ffffff',
                  border: '1px solid #ece8e3',
                  minWidth: '180px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  zIndex: 1000,
                }}
              >
                {isLoggedIn && user && (
                  <div style={{
                    padding: '14px 18px 12px',
                    borderBottom: '1px solid #f0ece8',
                  }}>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', margin: '0 0 2px' }}>Signed in as</p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', fontWeight: 500, color: DARK, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>{user.first_name || user.email}</p>
                  </div>
                )}
                {isLoggedIn ? (
                  <>
                    {[
                      { href: '/my-profile', label: 'My Profile' },
                      { href: '/my-orders', label: 'My Orders' },
                      { href: '/my-wishlist', label: 'Wishlist' },
                    ].map(({ href, label }) => (
                      <a
                        key={href}
                        href={href}
                        onClick={() => setIsProfileOpen(false)}
                        style={{
                          display: 'block',
                          padding: '11px 18px',
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: '11px',
                          fontWeight: 500,
                          letterSpacing: '0.5px',
                          color: DARK,
                          textDecoration: 'none',
                          borderBottom: '1px solid #f0ece8',
                          cursor: 'pointer',
                          transition: 'color 0.15s',
                        }}
                      >
                        {label}
                      </a>
                    ))}
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                        router.push('/');
                      }}
                      style={{
                        width: '100%',
                        padding: '11px 18px',
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        color: '#b03020',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <a
                    href="/signin"
                    onClick={() => setIsProfileOpen(false)}
                    style={{
                      display: 'block',
                      padding: '14px 18px',
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: DARK,
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Sign In →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile nav overlay */}
      <div className={`mobile-nav-overlay${isMobileMenuOpen ? ' open' : ''}`}>
        <button className="mobile-nav-close" onClick={() => setIsMobileMenuOpen(false)}>×</button>
        <Link href="/" style={{ textDecoration: 'none', marginBottom: '32px', display: 'block' }}>
          <MirhaPretLogo height={80} color="black" />
        </Link>
        {['/', '/products', '/blog', '/about', '/contact'].map((href, i) => (
          <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)}
            style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
            {['Home', 'Shop', 'Journal', 'About', 'Contact'][i]}
          </Link>
        ))}
        <div style={{ marginTop: '32px', borderTop: '1px solid #f0ece8', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '0' }}>
          {isLoggedIn ? (
            <>
              <Link href="/my-profile" onClick={() => setIsMobileMenuOpen(false)}
                style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '1px' }}>My Profile</Link>
              <Link href="/my-orders" onClick={() => setIsMobileMenuOpen(false)}
                style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '1px' }}>My Orders</Link>
              <Link href="/my-wishlist" onClick={() => setIsMobileMenuOpen(false)}
                style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '1px' }}>Wishlist</Link>
              <button className="nav-link-btn" onClick={() => { logout(); setIsMobileMenuOpen(false); router.push('/'); }}
                style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '1px', color: '#b03020' }}>Logout</button>
            </>
          ) : (
            <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>Sign In →</Link>
          )}
        </div>
      </div>
    </>
  );
}
