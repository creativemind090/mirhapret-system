'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { CartSidebar } from './CartSidebar';

interface PageHeaderProps {
  isScrolled?: boolean;
}

export function PageHeader({ isScrolled = false }: PageHeaderProps) {
  const router = useRouter();
  const { itemCount } = useCartContext();
  const { user, isLoggedIn, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <nav
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
        }}
      >
        {/* Logo - Left */}
        <a href="/" style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '2px', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
          MirhaPret
        </a>

        {/* Nav Links - Center */}
        <div style={{ display: 'flex', gap: '40px', fontSize: '14px', fontWeight: 500 }}>
          <a href="/" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
            Home
          </a>
          <a href="/products" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
            Shop
          </a>
          <a href="/about" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
            About
          </a>
          <a href="/contact" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
            Contact
          </a>
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
            title="Open cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                  background: '#000000',
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
              title="Profile"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: '#ffffff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  minWidth: '160px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                }}
              >
                {isLoggedIn ? (
                  <>
                    <a
                      href="/my-profile"
                      onClick={() => setIsProfileOpen(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: '#000000',
                        textDecoration: 'none',
                        borderBottom: '1px solid #e0e0e0',
                        cursor: 'pointer',
                      }}
                    >
                      My Profile
                    </a>
                    <a
                      href="/my-orders"
                      onClick={() => setIsProfileOpen(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: '#000000',
                        textDecoration: 'none',
                        borderBottom: '1px solid #e0e0e0',
                        cursor: 'pointer',
                      }}
                    >
                      My Orders
                    </a>
                    <a
                      href="/my-wishlist"
                      onClick={() => setIsProfileOpen(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: '#000000',
                        textDecoration: 'none',
                        borderBottom: '1px solid #e0e0e0',
                        cursor: 'pointer',
                      }}
                    >
                      My Wishlist
                    </a>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                        router.push('/');
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: '#c0392b',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontWeight: 600,
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
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#000000',
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Sign In
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
