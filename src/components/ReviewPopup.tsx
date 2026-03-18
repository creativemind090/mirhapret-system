'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface OrderItem {
  product_id: string;
  product_name: string;
  sku: string;
}

interface PendingReview {
  product_id: string;
  product_name: string;
  main_image: string | null;
}

const DISMISSED_KEY = 'review_popup_dismissed';

function getDismissed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]');
  } catch {
    return [];
  }
}

function addDismissed(productId: string) {
  const list = getDismissed();
  if (!list.includes(productId)) {
    list.push(productId);
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(list));
  }
}

export function ReviewPopup() {
  const { user, isLoggedIn } = useAuth();
  const [pending, setPending] = useState<PendingReview | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn || !user) return;

    let cancelled = false;

    async function checkForPendingReviews() {
      try {
        // Fetch delivered orders for this user
        const ordersRes = await api.get(`/orders?customer_id=${user!.id}&status=delivered&take=10`);
        const orders: { id: string }[] = ordersRes.data?.data || [];
        if (orders.length === 0) return;

        // Fetch already-reviewed product IDs
        const reviewsRes = await api.get('/reviews/user/my-reviews');
        const reviewedProductIds = new Set<string>(
          (reviewsRes.data?.reviews || []).map((r: any) => r.product_id as string)
        );

        const dismissed = getDismissed();

        // Iterate orders to find first unreviewed product
        for (const order of orders) {
          if (cancelled) return;
          const orderRes = await api.get(`/orders/${order.id}`);
          const items: OrderItem[] = orderRes.data?.data?.items || [];

          for (const item of items) {
            if (!item.product_id) continue;
            if (reviewedProductIds.has(item.product_id)) continue;
            if (dismissed.includes(item.product_id)) continue;

            // Fetch product image
            let main_image: string | null = null;
            try {
              const prodRes = await api.get(`/products/${item.product_id}`);
              main_image = prodRes.data?.data?.main_image || null;
            } catch {
              // image not critical
            }

            if (!cancelled) {
              setPending({
                product_id: item.product_id,
                product_name: item.product_name,
                main_image,
              });
            }
            return;
          }
        }
      } catch {
        // silently ignore — review popup is non-critical
      }
    }

    checkForPendingReviews();
    return () => { cancelled = true; };
  }, [isLoggedIn, user]);

  const handleClose = () => {
    if (pending) addDismissed(pending.product_id);
    setPending(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pending || rating === 0) {
      setError('Please select a star rating');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await api.post('/reviews', {
        product_id: pending.product_id,
        rating,
        title: title || `${rating} star review`,
        comment,
      });
      setSubmitted(true);
      setTimeout(() => {
        addDismissed(pending.product_id);
        setPending(null);
        setSubmitted(false);
        setRating(0);
        setTitle('');
        setComment('');
      }, 2000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to submit review';
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!pending) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9998,
        }}
      />

      {/* Popup */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#ffffff',
          width: '100%',
          maxWidth: '480px',
          zIndex: 9999,
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              How was your purchase?
            </p>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Leave a Review</h2>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#888',
              lineHeight: 1,
              padding: '0 0 0 16px',
            }}
          >
            ×
          </button>
        </div>

        {/* Product info */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', padding: '16px', background: '#f9f9f9' }}>
          {pending.main_image ? (
            <img
              src={pending.main_image}
              alt={pending.product_name}
              style={{ width: '72px', height: '72px', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: '72px', height: '72px', background: '#e0e0e0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
              👗
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px 0' }}>{pending.product_name}</p>
            <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Verified Purchase</p>
          </div>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✓</div>
            <p style={{ fontSize: '16px', fontWeight: 600 }}>Thank you for your review!</p>
            <p style={{ fontSize: '13px', color: '#666' }}>Your feedback helps other customers.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Star Rating */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>
                Your Rating *
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '32px',
                      cursor: 'pointer',
                      color: star <= (hoverRating || rating) ? '#f0a500' : '#ddd',
                      padding: '0',
                      lineHeight: 1,
                      transition: 'color 0.1s',
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Review Title */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Title (optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                maxLength={100}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e0e0e0',
                  fontSize: '14px',
                  fontFamily: 'system-ui',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Comment */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Review (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience with this product..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #e0e0e0',
                  fontSize: '14px',
                  fontFamily: 'system-ui',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>

            {error && (
              <div style={{ marginBottom: '16px', padding: '10px 12px', background: '#ffe0e0', border: '1px solid #c0392b', fontSize: '13px', color: '#c0392b' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={submitting || rating === 0}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: submitting || rating === 0 ? '#888' : '#000000',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: submitting || rating === 0 ? 'not-allowed' : 'pointer',
                  fontFamily: 'system-ui',
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: '12px 20px',
                  background: '#ffffff',
                  color: '#000000',
                  border: '1px solid #e0e0e0',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'system-ui',
                }}
              >
                Maybe Later
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
