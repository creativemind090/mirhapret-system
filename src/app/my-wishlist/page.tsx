'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const WISHLIST_KEY = 'wishlist_ids';

export function getWishlistIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function toggleWishlist(productId: string): boolean {
  const ids = getWishlistIds();
  const isIn = ids.includes(productId);
  const next = isIn ? ids.filter((id) => id !== productId) : [...ids, productId];
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
  return !isIn;
}

export default function MyWishlistPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }

    const ids = getWishlistIds();
    if (ids.length === 0) {
      setIsLoading(false);
      return;
    }

    // Fetch all products and filter by wishlist IDs
    api.get('/products?take=200')
      .then((res) => {
        const all: any[] = res.data.data ?? [];
        setProducts(all.filter((p) => ids.includes(p.id)));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isLoggedIn, router]);

  const removeFromWishlist = (productId: string) => {
    toggleWishlist(productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div style={{ background: '#ffffff', color: '#000000' }}>
      <PageHeader isScrolled={false} />

      <section
        style={{
          paddingTop: '120px',
          paddingBottom: '120px',
          paddingLeft: '60px',
          paddingRight: '60px',
          background: '#ffffff',
          minHeight: '100vh',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.5px', margin: '0 0 8px' }}>
              My Wishlist
            </h1>
            <p style={{ fontSize: '14px', color: '#666666', margin: 0 }}>
              {products.length} saved {products.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '60px' }}>
              <p style={{ fontSize: '1.1rem', color: '#666666', marginBottom: '24px' }}>
                Your wishlist is empty
              </p>
              <a
                href="/products"
                style={{
                  display: 'inline-block',
                  padding: '12px 32px',
                  background: '#000000',
                  color: '#ffffff',
                  border: '1px solid #000000',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                Continue Shopping
              </a>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '24px',
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e0e0e0',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div style={{ height: '250px', background: '#f5f5f5', overflow: 'hidden' }}>
                    {product.main_image ? (
                      <img
                        src={product.main_image}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#999999' }}>No image</span>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '16px' }}>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        color: '#999999',
                        marginBottom: '6px',
                        fontWeight: 600,
                      }}
                    >
                      {product.category?.name ?? 'Collection'}
                    </p>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>
                      {product.name}
                    </h4>
                    <p style={{ fontSize: '1rem', fontWeight: 700, color: '#000000', marginBottom: '12px' }}>
                      PKR {Number(product.price).toLocaleString()}
                    </p>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => window.location.href = `/products/${product.id}`}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: '#000000',
                          color: '#ffffff',
                          border: '1px solid #000000',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'system-ui',
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        style={{
                          padding: '8px 12px',
                          background: '#ffffff',
                          color: '#000000',
                          border: '1px solid #e0e0e0',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'system-ui',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '60px',
          background: '#1a1a1a',
          color: '#ffffff',
          borderTop: '1px solid #333333',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {[
            { title: 'Shop', links: ['All Collections', 'Premium Pret', 'Octa West', 'Desire', 'Sale'] },
            { title: 'Customer Care', links: ['Contact Us', 'Shipping Info', 'Returns & Exchanges', 'Size Guide', 'FAQ'] },
            { title: 'About', links: ['Our Story', 'Craftsmanship', 'Sustainability', 'Press', 'Careers'] },
            { title: 'Connect', links: ['Instagram', 'Facebook', 'TikTok', 'Pinterest', 'WhatsApp'] },
          ].map((section, idx) => (
            <div key={idx}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>{section.title}</h4>
              <ul style={{ listStyle: 'none' }}>
                {section.links.map((link, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    <a href="#" style={{ fontSize: '0.9rem', color: '#cccccc', cursor: 'pointer' }}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #333333', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: '#999999' }}>
          <p>© 2026 MirhaPret. All rights reserved. Celebrating the modern Pakistani woman.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ cursor: 'pointer' }}>Privacy Policy</a>
            <a href="#" style={{ cursor: 'pointer' }}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
