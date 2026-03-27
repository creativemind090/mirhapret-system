'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const GOLD = '#c8a96e';
const DARK = '#080808';
const CREAM = '#FAFAF8';

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#1a7a4a', delivered: '#1a7a4a', shipped: '#1a56db',
  processing: '#f5a623', pending: '#f5a623', cancelled: '#c0392b',
};

const POSTEX_STATUS_MAP: Record<string, { label: string }> = {
  '0001': { label: "At Merchant's Warehouse" },
  '0003': { label: 'At PostEx Warehouse' },
  '0004': { label: 'Package on Route' },
  '0005': { label: 'Delivered' },
  '0006': { label: 'Returned' },
  '0007': { label: 'Returned' },
  '0008': { label: 'Delivery Under Review' },
  '0013': { label: 'Delivery Attempted' },
};

const fieldLabel: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700,
  letterSpacing: '2px', textTransform: 'uppercase', color: '#aaa',
  display: 'block', marginBottom: '8px',
};

export default function MyOrdersPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [trackingData, setTrackingData] = useState<any | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');
  const [showExchange, setShowExchange] = useState(false);
  const [exchangeReasonCategory, setExchangeReasonCategory] = useState('');
  const [exchangeReasonDetail, setExchangeReasonDetail] = useState('');
  const [exchangeItems, setExchangeItems] = useState('');
  const exchangeReason = exchangeReasonCategory === 'Other'
    ? exchangeReasonDetail
    : exchangeReasonCategory ? `${exchangeReasonCategory}${exchangeReasonDetail ? `: ${exchangeReasonDetail}` : ''}` : '';
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [exchangeSuccess, setExchangeSuccess] = useState('');
  const [exchangeError, setExchangeError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) { router.push('/signin'); return; }
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const params = user?.id ? `?customer_id=${user.id}&take=50` : '?take=50';
        const res = await api.get(`/orders${params}`);
        setOrders((res.data.data ?? []).map((o: any) => ({
          id: o.order_number ?? o.id, rawId: o.id,
          date: o.created_at ? new Date(o.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—',
          status: o.status ?? 'pending', paymentStatus: o.payment_status ?? 'pending',
          total: Number(o.total ?? 0), tracking_number: o.tracking_number ?? null,
          items: (o.items ?? []).map((item: any) => ({ name: item.product_name ?? item.name, size: item.product_size ?? item.size, quantity: item.quantity, price: Number(item.unit_price ?? 0) })),
        })));
      } catch { setOrders([]); setError('Failed to load orders. Please try again.'); }
      finally { setIsLoading(false); }
    };
    fetchOrders();
  }, [isLoggedIn, user, router]);

  const openOrderDetail = (order: any) => {
    setSelectedOrder(order); setTrackingData(null); setTrackingError('');
    setShowExchange(false); setExchangeSuccess(''); setExchangeError('');
    setExchangeReasonCategory(''); setExchangeReasonDetail(''); setExchangeItems('');
  };

  const loadTracking = async () => {
    if (!selectedOrder?.rawId) return;
    setTrackingLoading(true); setTrackingError('');
    try {
      const res = await api.get(`/orders/${selectedOrder.rawId}/postex-tracking`);
      setTrackingData(res.data.data ?? null);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setTrackingError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Could not load tracking info'));
    } finally { setTrackingLoading(false); }
  };

  const handleExchangeSubmit = async () => {
    if (!exchangeReasonCategory) { setExchangeError('Please select a reason'); return; }
    if (exchangeReasonCategory === 'Other' && !exchangeReasonDetail.trim()) { setExchangeError('Please describe your reason'); return; }
    setExchangeLoading(true); setExchangeError('');
    try {
      const res = await api.post(`/orders/${selectedOrder.rawId}/exchange`, { reason: exchangeReason, items: exchangeItems || undefined });
      const trackingNum = res.data.data?.exchangeTrackingNumber;
      setExchangeSuccess(`Exchange submitted! PostEx pickup tracking: ${trackingNum}. Our team will contact you within 24 hours.`);
      setShowExchange(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setExchangeError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Exchange request failed. Please contact support.'));
    } finally { setExchangeLoading(false); }
  };

  if (!isLoggedIn || isLoading) return null;

  const postexHistory: any[] = trackingData?.postex_data?.transactionStatusHistory ?? [];
  const canExchange = selectedOrder && !['cancelled', 'refunded'].includes(selectedOrder.status);

  return (
    <div style={{ background: CREAM, color: '#0a0a0a', minHeight: '100vh' }}>
      <SiteHeader />

      {/* ─── Hero ─── */}
      <section style={{
        background: DARK, padding: 'clamp(40px,6vw,72px) clamp(24px,6vw,80px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '16px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(rgba(200,169,110,1) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,110,1) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ zIndex: 1 }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, marginBottom: '10px', fontWeight: 600 }}>Account</p>
          <h1 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(2.4rem,5vw,4rem)', fontWeight: 600, fontStyle: 'italic', letterSpacing: '-1px', color: '#fff', lineHeight: 1 }}>My Orders</h1>
        </div>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#555', zIndex: 1, letterSpacing: '1px' }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </section>

      <section style={{ padding: 'clamp(32px,5vw,72px) clamp(20px,6vw,80px)', minHeight: '50vh' }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ width: '1px', height: '56px', background: GOLD, margin: '0 auto 28px' }} />
            {error ? (
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#c0392b', marginBottom: '32px' }}>{error}</p>
            ) : (
              <>
                <p style={{ fontFamily: "'Cormorant', serif", fontSize: '1.3rem', fontStyle: 'italic', color: '#888', marginBottom: '8px' }}>No orders yet</p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#bbb', marginBottom: '36px', fontWeight: 300 }}>Your order history will appear here</p>
                <a href="/products" style={{ display: 'inline-block', padding: '13px 36px', background: DARK, color: '#fff', textDecoration: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>
                  Start Shopping
                </a>
              </>
            )}
          </div>
        ) : (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>

            {/* Table Header */}
            <div className="orders-table-header" style={{ paddingBottom: '12px', borderBottom: `1px solid rgba(200,169,110,0.2)`, marginBottom: '4px' }}>
              {['Order', 'Date', 'Status', 'Total', ''].map((h, i) => (
                <p key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#aaa', margin: 0 }}>{h}</p>
              ))}
            </div>

            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {orders.map(order => (
                <div key={order.id} className="orders-table-row" style={{ borderBottom: '1px solid #f0ece8', padding: '18px 0', background: '#fff', marginBottom: '1px' }}>
                  <div>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', fontWeight: 700, color: '#0a0a0a', margin: '0 0 3px', letterSpacing: '0.5px' }}>{order.id}</p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#bbb', margin: 0, fontWeight: 300 }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    {order.tracking_number && (
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: GOLD, margin: '3px 0 0', fontWeight: 600, letterSpacing: '0.5px' }}>{order.tracking_number}</p>
                    )}
                  </div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#888', margin: 0, fontWeight: 300 }}>{order.date}</p>
                  <div>
                    <span style={{ display: 'inline-block', padding: '3px 10px', background: `${STATUS_COLORS[order.status] ?? '#999'}12`, color: STATUS_COLORS[order.status] ?? '#999', fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'capitalize' }}>
                      {order.status}
                    </span>
                  </div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>PKR {order.total.toLocaleString()}</p>
                  <button onClick={() => openOrderDetail(order)}
                    style={{ padding: '8px 16px', background: 'transparent', color: DARK, border: `1px solid #e0dcd8`, fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ─── Order Detail Modal ─── */}
      {selectedOrder && (
        <>
          <div onClick={() => setSelectedOrder(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', zIndex: 301, maxWidth: '560px', width: '92%', maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}>

            {/* Modal Header */}
            <div style={{ padding: '28px 32px', borderBottom: '1px solid #f0ece8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ width: '24px', height: '1px', background: GOLD, marginBottom: '10px' }} />
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', color: '#bbb', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Order</p>
                <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: '1.3rem', fontWeight: 600, fontStyle: 'italic', margin: 0 }}>{selectedOrder.id}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#bbb', padding: 0, lineHeight: 1 }}>×</button>
            </div>

            {/* Meta grid */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #f0ece8', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {[
                { label: 'Date', value: selectedOrder.date },
                { label: 'Status', value: selectedOrder.status, color: STATUS_COLORS[selectedOrder.status] },
                { label: 'Payment', value: selectedOrder.paymentStatus, color: STATUS_COLORS[selectedOrder.paymentStatus] },
                { label: 'Total', value: `PKR ${selectedOrder.total.toLocaleString()}` },
              ].map((row, i) => (
                <div key={i}>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', margin: '0 0 5px' }}>{row.label}</p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 600, margin: 0, color: row.color ?? '#0a0a0a', textTransform: 'capitalize' }}>{row.value}</p>
                </div>
              ))}
            </div>

            {/* Items */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #f0ece8' }}>
              <p style={fieldLabel}>Items</p>
              {selectedOrder.items.map((item: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', marginBottom: '12px', borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid #f8f5f2' : 'none' }}>
                  <div>
                    <p style={{ fontFamily: "'Cormorant', serif", fontSize: '14px', fontWeight: 600, fontStyle: 'italic', margin: '0 0 2px' }}>{item.name}</p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#bbb', margin: 0, fontWeight: 300 }}>Size: {item.size} · Qty: {item.quantity}</p>
                  </div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 600, margin: 0 }}>PKR {item.price.toLocaleString()}</p>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${DARK}`, paddingTop: '14px', marginTop: '8px', alignItems: 'baseline' }}>
                <span style={{ fontFamily: "'Cormorant', serif", fontSize: '1rem', fontStyle: 'italic', fontWeight: 600 }}>Total</span>
                <span style={{ fontFamily: "'Cormorant', serif", fontSize: '1.2rem', fontWeight: 600, fontStyle: 'italic' }}>PKR {selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Exchange success */}
            {exchangeSuccess && (
              <div style={{ margin: '0 32px 16px', padding: '14px 18px', borderLeft: `3px solid #1a7a4a`, background: '#f0fdf4', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#166534' }}>
                {exchangeSuccess}
              </div>
            )}

            {/* Tracking */}
            {selectedOrder.tracking_number && (
              <div style={{ padding: '20px 32px', borderBottom: '1px solid #f0ece8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <p style={fieldLabel}>Shipment Tracking</p>
                  {!trackingData && (
                    <button onClick={loadTracking} disabled={trackingLoading}
                      style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, background: DARK, color: '#fff', border: 'none', padding: '7px 14px', cursor: trackingLoading ? 'wait' : 'pointer', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                      {trackingLoading ? 'Loading…' : 'Track Order'}
                    </button>
                  )}
                </div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#888', margin: '0 0 12px', fontWeight: 300 }}>
                  PostEx: <strong style={{ color: '#0a0a0a', fontWeight: 600 }}>{selectedOrder.tracking_number}</strong>
                </p>
                {trackingError && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#c0392b', margin: 0 }}>{trackingError}</p>}
                {trackingData && postexHistory.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    {postexHistory.map((event: any, idx: number) => {
                      const code = event.transactionStatusMessageCode;
                      const meta = POSTEX_STATUS_MAP[code] ?? { label: event.transactionStatusMessage };
                      const isLatest = idx === postexHistory.length - 1;
                      return (
                        <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: '12px', paddingLeft: '14px', borderLeft: isLatest ? `2px solid ${GOLD}` : '2px solid #f0ece8', position: 'relative', marginBottom: '4px' }}>
                          <div style={{ position: 'absolute', left: '-7px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: isLatest ? GOLD : '#f0ece8', border: '2px solid #fff', flexShrink: 0 }} />
                          <div>
                            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', fontWeight: isLatest ? 700 : 400, margin: '0 0 2px', color: isLatest ? '#0a0a0a' : '#888' }}>{meta.label}</p>
                            {event.transactionStatusMessage && event.transactionStatusMessage !== meta.label && (
                              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#bbb', margin: 0, fontWeight: 300 }}>{event.transactionStatusMessage}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {trackingData && postexHistory.length === 0 && (
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#bbb', margin: '8px 0 0', fontWeight: 300 }}>No tracking events yet — your order is being prepared.</p>
                )}
              </div>
            )}

            {/* Exchange */}
            {canExchange && !exchangeSuccess && (
              <div style={{ padding: '20px 32px' }}>
                {!showExchange ? (
                  <button onClick={() => setShowExchange(true)}
                    style={{ width: '100%', padding: '13px', background: 'transparent', color: DARK, border: `1px solid ${DARK}`, fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', cursor: 'pointer' }}>
                    Request Exchange
                  </button>
                ) : (
                  <div>
                    <p style={fieldLabel}>Exchange Request</p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#888', marginBottom: '20px', lineHeight: 1.8, fontWeight: 300 }}>
                      Available within 14 days of delivery. PostEx will pick up your parcel and deliver the replacement.
                    </p>
                    {exchangeError && (
                      <div style={{ marginBottom: '12px', padding: '12px 16px', borderLeft: '3px solid #c0392b', background: '#fff5f5', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#c0392b' }}>{exchangeError}</div>
                    )}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={fieldLabel}>Reason *</label>
                      <select value={exchangeReasonCategory} onChange={e => { setExchangeReasonCategory(e.target.value); setExchangeReasonDetail(''); }}
                        style={{ width: '100%', padding: '11px 12px', border: '1px solid #e0dcd8', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', boxSizing: 'border-box', background: '#fff', marginBottom: '8px' }}>
                        <option value="">Select a reason…</option>
                        <option value="Wrong size">Wrong size</option>
                        <option value="Wrong colour">Wrong colour</option>
                        <option value="Defective / damaged item">Defective / damaged item</option>
                        <option value="Different from description">Different from description</option>
                        <option value="Wrong item received">Wrong item received</option>
                        <option value="Other">Other (please specify)</option>
                      </select>
                      {exchangeReasonCategory && (
                        <textarea value={exchangeReasonDetail} onChange={e => setExchangeReasonDetail(e.target.value)}
                          placeholder={exchangeReasonCategory === 'Other' ? 'Please describe your reason…' : 'Additional details (optional)'}
                          rows={2}
                          style={{ width: '100%', padding: '11px 12px', border: '1px solid #e0dcd8', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
                      )}
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={fieldLabel}>Items to Exchange (optional)</label>
                      <input type="text" value={exchangeItems} onChange={e => setExchangeItems(e.target.value)}
                        placeholder="e.g. Blue Lawn Kurta — Size M → Size L"
                        style={{ width: '100%', padding: '11px 12px', border: '1px solid #e0dcd8', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', boxSizing: 'border-box', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => { setShowExchange(false); setExchangeError(''); setExchangeReasonCategory(''); setExchangeReasonDetail(''); }}
                        style={{ flex: 1, padding: '12px', background: '#fff', color: '#888', border: '1px solid #e0dcd8', fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>
                        Cancel
                      </button>
                      <button onClick={handleExchangeSubmit} disabled={exchangeLoading}
                        style={{ flex: 2, padding: '12px', background: DARK, color: '#fff', border: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: exchangeLoading ? 'wait' : 'pointer', opacity: exchangeLoading ? 0.6 : 1 }}>
                        {exchangeLoading ? 'Submitting…' : 'Submit Exchange'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      <SiteFooter />
    </div>
  );
}
