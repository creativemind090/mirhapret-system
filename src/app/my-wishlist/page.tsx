'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/context/AuthContext';

// Lofi image placeholder component
function LofiImage({ width = 200, height = 250 }: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ background: '#f5f5f5', display: 'block' }}
    >
      <rect width={width} height={height} fill="#f5f5f5" />
      {Array.from({ length: 15 }).map((_, i) => (
        <line
          key={i}
          x1={i * (width / 8) - height}
          y1="0"
          x2={i * (width / 8)}
          y2={height}
          stroke="#e0e0e0"
          strokeWidth="2"
        />
      ))}
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill="#999999"
        fontFamily="system-ui"
      >
        Product
      </text>
    </svg>
  );
}

export default function MyWishlistPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoggedIn) {
        router.push('/signin');
      }
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [isLoggedIn, router]);

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return null;
  }

  // Mock wishlist products
  const allProducts = [
    { id: 'pret-1', name: 'Premium Pret Piece 1', category: 'Premium Pret', price: 2999, discount: 10 },
    { id: 'pret-5', name: 'Premium Pret Piece 5', category: 'Premium Pret', price: 4499, discount: 0 },
    { id: 'octa-3', name: 'Octa West Design 3', category: 'Octa West 2026', price: 7799, discount: 0 },
    { id: 'desire-2', name: 'Desire Couture 2', category: 'Desire Collection', price: 9999, discount: 0 },
  ];

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(wishlistItems.filter((id) => id !== productId));
  };

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
              Your saved items for later
            </p>
          </div>

          {allProducts.length === 0 ? (
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
              {allProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e0e0e0',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#000000',
                        color: '#ffffff',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 700,
                        zIndex: 10,
                      }}
                    >
                      {product.discount}% OFF
                    </div>
                  )}

                  <div style={{ marginBottom: '16px' }}>
                    <LofiImage width={200} height={250} />
                  </div>

                  <div style={{ padding: '0 16px 16px 16px' }}>
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
                      {product.category}
                    </p>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>
                      {product.name}
                    </h4>

                    {/* Price with Discount */}
                    <div style={{ marginBottom: '12px' }}>
                      {product.discount > 0 ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#000000', margin: 0 }}>
                            PKR {Math.round(product.price * (1 - product.discount / 100)).toLocaleString()}
                          </p>
                          <p style={{ fontSize: '0.85rem', color: '#999999', textDecoration: 'line-through', margin: 0 }}>
                            PKR {product.price.toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#000000', margin: 0 }}>
                          PKR {product.price.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
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
            {
              title: 'Shop',
              links: ['All Collections', 'Premium Pret', 'Octa West', 'Desire', 'Sale'],
            },
            {
              title: 'Customer Care',
              links: ['Contact Us', 'Shipping Info', 'Returns & Exchanges', 'Size Guide', 'FAQ'],
            },
            {
              title: 'About',
              links: ['Our Story', 'Craftsmanship', 'Sustainability', 'Press', 'Careers'],
            },
            {
              title: 'Connect',
              links: ['Instagram', 'Facebook', 'TikTok', 'Pinterest', 'WhatsApp'],
            },
          ].map((section, idx) => (
            <div key={idx}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
                {section.title}
              </h4>
              <ul style={{ listStyle: 'none' }}>
                {section.links.map((link, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    <a
                      href="#"
                      style={{
                        fontSize: '0.9rem',
                        color: '#cccccc',
                        cursor: 'pointer',
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: '1px solid #333333',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.9rem',
            color: '#999999',
          }}
        >
          <p>© 2026 MirhaPret. All rights reserved. Celebrating the modern Pakistani woman.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ cursor: 'pointer' }}>
              Privacy Policy
            </a>
            <a href="#" style={{ cursor: 'pointer' }}>
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
