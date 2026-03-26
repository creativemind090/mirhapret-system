'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { SiteFooter } from '@/components/SiteFooter';
import api from '@/lib/api';

const STATUS_STEPS = [
  { key: 'pending',    label: 'Order Placed',   icon: '📋' },
  { key: 'confirmed',  label: 'Confirmed',       icon: '✅' },
  { key: 'processing', label: 'Processing',      icon: '⚙️' },
  { key: 'shipped',    label: 'Shipped',         icon: '🚚' },
  { key: 'delivered',  label: 'Delivered',       icon: '🎁' },
];

const STATUS_INDEX: Record<string, number> = {
  pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4,
};

const POSTEX_STATUS: Record<string, string> = {
  '0001': 'Order Booked',
  '0002': 'In Transit',
  '0003': 'Out for Delivery',
  '0004': 'Delivered',
  '0005': 'Failed Delivery Attempt',
  '0006': 'Return Initiated',
  '0007': 'Returned to Sender',
  '0008': 'Picked Up',
  '0009': 'At Hub',
  '0010': 'Dispatched from Hub',
  '0011': 'Arrived at City',
  '0012': 'Attempted',
  '0013': 'Cancelled',
};

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [postex, setPostex] = useState<any>(null);
  const [postexLoading, setPostexLoading] = useState(false);

  // Auto-search if URL params present
  useEffect(() => {
    if (searchParams.get('order') && searchParams.get('email')) {
      handleSearch();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!orderNumber.trim() || !email.trim()) {
      setError('Please enter your order number and email address.');
      return;
    }
    setError('');
    setLoading(true);
    setOrder(null);
    setPostex(null);
    try {
      const res = await api.get(`/orders/track/guest?order_number=${encodeURIComponent(orderNumber.trim())}&email=${encodeURIComponent(email.trim())}`);
      const data = res.data.data ?? res.data;
      setOrder(data);

      // Load PostEx tracking if tracking number exists
      if (data.tracking_number) {
        setPostexLoading(true);
        try {
          const pRes = await api.get(`/orders/${data.id}/postex-tracking`).catch(() => null);
          if (pRes) setPostex(pRes.data?.data ?? null);
        } finally {
          setPostexLoading(false);
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'No order found with those details. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? (STATUS_INDEX[order.status] ?? 0) : -1;
  const isCancelled = order?.status === 'cancelled';

  return (
    <div style={{ background: '#ffffff', color: '#000000', minHeight: '100vh' }}>
      <PageHeader isScrolled={false} />

      <section style={{ paddingTop: '120px', paddingBottom: '80px', paddingLeft: '60px', paddingRight: '60px', background: '#ffffff' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '48px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#c8a96e', marginBottom: '10px' }}>
              Order Tracking
            </p>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', margin: '0 0 8px' }}>Track Your Order</h1>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
              Enter your order number and the email address used at checkout.
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} style={{ marginBottom: '48px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="track-form-grid">
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999', marginBottom: '8px' }}>
                  Order Number
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={e => setOrderNumber(e.target.value)}
                  placeholder="ORD-20260101-XXXXX"
                  style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e0e0e0', fontSize: '14px', fontFamily: 'system-ui', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999', marginBottom: '8px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e0e0e0', fontSize: '14px', fontFamily: 'system-ui', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
            </div>
            {error && (
              <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '13px' }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: '#000', color: '#fff', border: 'none', fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, fontFamily: 'system-ui' }}
            >
              {loading ? 'Searching…' : 'Track Order'}
            </button>
          </form>

          {/* Order result */}
          {order && (
            <div>
              {/* Order summary bar */}
              <div style={{ background: '#f9f9f9', padding: '20px 24px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>Order Number</p>
                  <p style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>{order.order_number}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>Total</p>
                  <p style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>PKR {Number(order.total).toLocaleString()}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>Date</p>
                  <p style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>
                    {new Date(order.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div>
                  <span style={{
                    display: 'inline-block', padding: '5px 14px',
                    background: isCancelled ? '#fef2f2' : order.status === 'delivered' ? '#f0fdf4' : '#fff8e6',
                    color: isCancelled ? '#991b1b' : order.status === 'delivered' ? '#166534' : '#92660a',
                    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Progress tracker */}
              {!isCancelled && (
                <div style={{ marginBottom: '48px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                    {/* Progress line */}
                    <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', height: '2px', background: '#e0e0e0', zIndex: 0 }} />
                    <div style={{ position: 'absolute', top: '20px', left: '20px', height: '2px', background: '#c8a96e', zIndex: 1, width: `${Math.min(100, (currentStep / (STATUS_STEPS.length - 1)) * 100)}%`, transition: 'width 0.5s ease' }} />

                    {STATUS_STEPS.map((step, idx) => {
                      const done = idx <= currentStep;
                      const active = idx === currentStep;
                      return (
                        <div key={step.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: done ? '#c8a96e' : '#f0f0f0',
                            border: active ? '3px solid #c8a96e' : done ? 'none' : '2px solid #e0e0e0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '18px', marginBottom: '10px',
                            boxShadow: active ? '0 0 0 4px rgba(200,169,110,0.2)' : 'none',
                            transition: 'all 0.3s ease',
                          }}>
                            {done ? <span style={{ fontSize: active ? '20px' : '16px' }}>{step.icon}</span> : <span style={{ fontSize: '12px', color: '#ccc' }}>{idx + 1}</span>}
                          </div>
                          <p style={{ fontSize: '10px', fontWeight: done ? 700 : 400, color: done ? '#000' : '#999', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.3px', margin: 0, lineHeight: 1.3 }}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PostEx courier tracking */}
              {order.tracking_number && (
                <div style={{ marginBottom: '40px', borderTop: '1px solid #e0e0e0', paddingTop: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                      Courier Tracking
                    </h2>
                    <span style={{ fontSize: '12px', color: '#999', fontFamily: 'monospace' }}>{order.tracking_number}</span>
                    <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
                  </div>

                  {postexLoading && <p style={{ fontSize: '13px', color: '#999' }}>Loading courier updates…</p>}

                  {postex?.postex_data?.transactionStatusHistory && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                      {[...postex.postex_data.transactionStatusHistory].reverse().map((event: any, idx: number) => {
                        const isLatest = idx === 0;
                        return (
                          <div key={idx} style={{ display: 'flex', gap: '16px', paddingBottom: '20px', position: 'relative' }}>
                            {/* Timeline line */}
                            {idx < postex.postex_data.transactionStatusHistory.length - 1 && (
                              <div style={{ position: 'absolute', left: '10px', top: '24px', bottom: 0, width: '1px', background: '#e0e0e0' }} />
                            )}
                            {/* Dot */}
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: isLatest ? '#c8a96e' : '#e0e0e0', flexShrink: 0, marginTop: '2px', zIndex: 1 }} />
                            <div>
                              <p style={{ fontSize: '13px', fontWeight: isLatest ? 700 : 500, color: isLatest ? '#000' : '#555', margin: '0 0 2px' }}>
                                {POSTEX_STATUS[event.status] || event.status}
                              </p>
                              <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                                {event.dateTime || event.date || ''}
                              </p>
                              {event.remarks && (
                                <p style={{ fontSize: '12px', color: '#666', margin: '2px 0 0', fontStyle: 'italic' }}>{event.remarks}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Items */}
              {order.items?.length > 0 && (
                <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '32px' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '20px' }}>
                    Items Ordered
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>{item.product_name || item.product_id}</p>
                          <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Size: {item.product_size} × {item.quantity}</p>
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>
                          PKR {(Number(item.unit_price) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .track-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <SiteFooter />
    </div>
  );
}
