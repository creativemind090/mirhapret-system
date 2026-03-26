'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { SiteFooter } from '@/components/SiteFooter';
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

  // Sync to backend silently (fire-and-forget)
  if (isIn) {
    api.delete(`/wishlists/${productId}`).catch(() => {});
  } else {
    api.post('/wishlists', { product_id: productId }).catch(() => {});
  }

  return !isIn;
}

export default function MyWishlistPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }

    const loadWishlist = async () => {
      try {
        // Try backend first (source of truth for logged-in users)
        const res = await api.get('/wishlists');
        const backendItems: any[] = res.data.data ?? res.data?.items ?? [];

        if (backendItems.length > 0) {
          // Sync backend IDs into localStorage
          const ids = backendItems.map((w: any) => w.product_id ?? w.product?.id ?? w.id);
          localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
          setProducts(backendItems.map((w: any) => w.product ?? w));
        } else {
          // Fallback: fetch products matching localStorage IDs
          const localIds = getWishlistIds();
          if (localIds.length > 0) {
            const prodRes = await api.get('/products?take=200');
            const all: any[] = prodRes.data.data ?? [];
            const filtered = all.filter((p) => localIds.includes(p.id));
            setProducts(filtered);
            // Sync local IDs up to backend
            for (const id of localIds) {
              api.post('/wishlists', { product_id: id }).catch(() => {});
            }
          }
        }
      } catch {
        // Backend unavailable — fall back to localStorage
        const ids = getWishlistIds();
        if (ids.length > 0) {
          api.get('/products?take=200')
            .then((res) => {
              const all: any[] = res.data.data ?? [];
              setProducts(all.filter((p) => ids.includes(p.id)));
            })
            .catch(() => setError('Could not load wishlist. Please try again.'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [isLoggedIn, router]);

  const removeFromWishlist = (productId: string) => {
    toggleWishlist(productId);
    setProducts((prev) => prev.filter((p) => (p.id ?? p.product_id) !== productId));
  };

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#ffffff' }}>
        <p style={{ fontSize: '14px', color: '#666666' }}>Redirecting to sign in…</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#ffffff' }}>
        <p style={{ fontSize: '14px', color: '#666666' }}>Loading wishlist…</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#ffffff', color: '#000000' }}>
      <PageHeader isScrolled={false} />

      <section style={{ paddingTop: '120px', paddingBottom: '120px', paddingLeft: '60px', paddingRight: '60px', background: '#ffffff', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.5px', margin: '0 0 8px' }}>
              My Wishlist
            </h1>
            <p style={{ fontSize: '14px', color: '#666666', margin: 0 }}>
              {products.length} saved {products.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {error && (
            <div style={{ marginBottom: '24px', padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '14px' }}>
              {error}
            </div>
          )}

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '60px' }}>
              <p style={{ fontSize: '1.1rem', color: '#666666', marginBottom: '24px' }}>Your wishlist is empty</p>
              <a
                href="/products"
                style={{ display: 'inline-block', padding: '12px 32px', background: '#000000', color: '#ffffff', border: '1px solid #000000', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}
              >
                Continue Shopping
              </a>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
              {products.map((product) => {
                const id = product.id ?? product.product_id;
                const img = product.main_image;
                const name = product.name;
                const price = Number(product.price);
                const slug = product.slug ?? id;
                const categoryName = product.category?.name ?? 'Collection';

                return (
                  <div key={id} style={{ background: '#ffffff', border: '1px solid #e0e0e0', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ height: '250px', background: '#f5f5f5', overflow: 'hidden' }}>
                      {img ? (
                        <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '12px', color: '#999999' }}>No image</span>
                        </div>
                      )}
                    </div>

                    <div style={{ padding: '16px' }}>
                      <p style={{ fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#999999', marginBottom: '6px', fontWeight: 600 }}>
                        {categoryName}
                      </p>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>{name}</h4>
                      <p style={{ fontSize: '1rem', fontWeight: 700, color: '#000000', marginBottom: '12px' }}>
                        PKR {price.toLocaleString()}
                      </p>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => window.location.href = `/products/${slug}`}
                          style={{ flex: 1, padding: '8px 12px', background: '#000000', color: '#ffffff', border: '1px solid #000000', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'system-ui' }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => removeFromWishlist(id)}
                          style={{ padding: '8px 12px', background: '#ffffff', color: '#000000', border: '1px solid #e0e0e0', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'system-ui' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
