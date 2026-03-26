'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#1a7a4a',
  delivered: '#1a7a4a',
  shipped: '#1a56db',
  processing: '#f5a623',
  pending: '#f5a623',
  cancelled: '#c0392b',
};

// Map PostEx status codes to human-readable labels + icons
const POSTEX_STATUS_MAP: Record<string, { label: string; icon: string }> = {
  '0001': { label: 'At Merchant\'s Warehouse', icon: '📦' },
  '0003': { label: 'At PostEx Warehouse', icon: '🏭' },
  '0004': { label: 'Package on Route', icon: '🚚' },
  '0005': { label: 'Delivered', icon: '✅' },
  '0006': { label: 'Returned', icon: '↩️' },
  '0007': { label: 'Returned', icon: '↩️' },
  '0008': { label: 'Delivery Under Review', icon: '🔍' },
  '0013': { label: 'Delivery Attempted', icon: '🔔' },
};

export default function MyOrdersPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Tracking state
  const [trackingData, setTrackingData] = useState<any | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  // Exchange state
  const [showExchange, setShowExchange] = useState(false);
  const [exchangeReasonCategory, setExchangeReasonCategory] = useState('');
  const [exchangeReasonDetail, setExchangeReasonDetail] = useState('');
  const [exchangeItems, setExchangeItems] = useState('');
  const exchangeReason = exchangeReasonCategory === 'Other'
    ? exchangeReasonDetail
    : exchangeReasonCategory
      ? `${exchangeReasonCategory}${exchangeReasonDetail ? `: ${exchangeReasonDetail}` : ''}`
      : '';
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
          id: o.order_number ?? o.id,
          rawId: o.id,
          date: o.created_at ? new Date(o.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—',
          status: o.status ?? 'pending',
          paymentStatus: o.payment_status ?? 'pending',
          total: Number(o.total ?? 0),
          tracking_number: o.tracking_number ?? null,
          items: (o.items ?? []).map((item: any) => ({
            name: item.product_name ?? item.name,
            size: item.product_size ?? item.size,
            quantity: item.quantity,
            price: Number(item.unit_price ?? 0),
          })),
        })));
      } catch {
        setOrders([]);
        setError('Failed to load your orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [isLoggedIn, user, router]);

  const openOrderDetail = (order: any) => {
    setSelectedOrder(order);
    setTrackingData(null);
    setTrackingError('');
    setShowExchange(false);
    setExchangeSuccess('');
    setExchangeError('');
    setExchangeReasonCategory('');
    setExchangeReasonDetail('');
    setExchangeItems('');
  };

  const loadTracking = async () => {
    if (!selectedOrder?.rawId) return;
    setTrackingLoading(true);
    setTrackingError('');
    try {
      const res = await api.get(`/orders/${selectedOrder.rawId}/postex-tracking`);
      setTrackingData(res.data.data ?? null);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setTrackingError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Could not load tracking info'));
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleExchangeSubmit = async () => {
    if (!exchangeReasonCategory) { setExchangeError('Please select a reason for exchange'); return; }
    if (exchangeReasonCategory === 'Other' && !exchangeReasonDetail.trim()) { setExchangeError('Please describe your reason'); return; }
    setExchangeLoading(true);
    setExchangeError('');
    try {
      const res = await api.post(`/orders/${selectedOrder.rawId}/exchange`, {
        reason: exchangeReason,
        items: exchangeItems || undefined,
      });
      const trackingNum = res.data.data?.exchangeTrackingNumber;
      setExchangeSuccess(`Exchange request submitted! PostEx pickup tracking: ${trackingNum}. Our team will contact you within 24 hours.`);
      setShowExchange(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setExchangeError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Exchange request failed. Please contact support.'));
    } finally {
      setExchangeLoading(false);
    }
  };

  if (!isLoggedIn || isLoading) return null;

  const postexHistory: any[] = trackingData?.postex_data?.transactionStatusHistory ?? [];
  const canExchange = selectedOrder && !['cancelled', 'refunded'].includes(selectedOrder.status);

  return (
    <div style={{ background: '#fff', color: '#000' }}>
      <SiteHeader />

      {/* Hero bar */}
      <section style={{ background: '#0e0e0e', padding: '60px 60px 48px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#c8a96e', fontWeight: 600, marginBottom: '12px' }}>Account</p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-1.5px', color: '#fff' }}>My Orders</h1>
        </div>
        <p style={{ fontSize: '13px', color: '#555' }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </section>

      <section style={{ padding: '60px', minHeight: '50vh' }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            {error ? (
              <p style={{ fontSize: '1.1rem', color: '#c0392b', marginBottom: '32px' }}>{error}</p>
            ) : (
              <>
                <p style={{ fontSize: '1.1rem', color: '#999', marginBottom: '32px' }}>You haven't placed any orders yet.</p>
                <a href="/products" style={{ display: 'inline-block', padding: '15px 36px', background: '#000', color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
                  Start Shopping
                </a>
              </>
            )}
          </div>
        ) : (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="orders-table-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e8e8e8' }}>
              <div className="orders-table-header">
                {['Order', 'Date', 'Status', 'Total', ''].map((h, i) => (
                  <p key={i} style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#999', margin: 0 }}>{h}</p>
                ))}
              </div>
              {orders.map(order => (
                <div key={order.id} className="orders-table-row">
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#000', margin: '0 0 2px' }}>{order.id}</p>
                    <p style={{ fontSize: '11px', color: '#bbb', margin: 0 }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    {order.tracking_number && (
                      <p style={{ fontSize: '10px', color: '#c8a96e', margin: '2px 0 0', fontWeight: 600 }}>📦 {order.tracking_number}</p>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>{order.date}</p>
                  <div>
                    <span style={{ display: 'inline-block', padding: '4px 10px', background: `${STATUS_COLORS[order.status] ?? '#999'}15`, color: STATUS_COLORS[order.status] ?? '#999', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'capitalize' }}>
                      {order.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#000', margin: 0 }}>PKR {order.total.toLocaleString()}</p>
                  <button
                    onClick={() => openOrderDetail(order)}
                    style={{ padding: '9px 16px', background: '#fff', color: '#000', border: '1.5px solid #000', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Order detail modal */}
      {selectedOrder && (
        <>
          <div onClick={() => setSelectedOrder(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', zIndex: 301, maxWidth: '580px', width: '92%', maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>

            {/* Header */}
            <div style={{ padding: '28px 32px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '10px', color: '#bbb', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Order</p>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.3px' }}>{selectedOrder.id}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999', padding: 0 }}>×</button>
            </div>

            {/* Meta grid */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #e8e8e8', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {[
                { label: 'Date', value: selectedOrder.date },
                { label: 'Status', value: selectedOrder.status, color: STATUS_COLORS[selectedOrder.status] },
                { label: 'Payment', value: selectedOrder.paymentStatus, color: STATUS_COLORS[selectedOrder.paymentStatus] },
                { label: 'Total', value: `PKR ${selectedOrder.total.toLocaleString()}` },
              ].map((row, i) => (
                <div key={i}>
                  <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', margin: '0 0 4px' }}>{row.label}</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: row.color ?? '#000', textTransform: 'capitalize' }}>{row.value}</p>
                </div>
              ))}
            </div>

            {/* Items */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #e8e8e8' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: '16px' }}>Items</p>
              {selectedOrder.items.map((item: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', marginBottom: '14px', borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid #e8e8e8' : 'none' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>{item.name}</p>
                    <p style={{ fontSize: '11px', color: '#bbb', margin: 0 }}>Size: {item.size} · Qty: {item.quantity}</p>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>PKR {item.price.toLocaleString()}</p>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1.5px solid #000', paddingTop: '14px', marginTop: '8px' }}>
                <p style={{ fontWeight: 700, fontSize: '14px', margin: 0 }}>Total</p>
                <p style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>PKR {selectedOrder.total.toLocaleString()}</p>
              </div>
            </div>

            {/* Exchange success */}
            {exchangeSuccess && (
              <div style={{ margin: '0 32px 16px', padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: '13px' }}>
                {exchangeSuccess}
              </div>
            )}

            {/* Tracking section */}
            {selectedOrder.tracking_number && (
              <div style={{ padding: '20px 32px', borderBottom: '1px solid #e8e8e8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', margin: 0 }}>Shipment Tracking</p>
                  {!trackingData && (
                    <button
                      onClick={loadTracking}
                      disabled={trackingLoading}
                      style={{ fontSize: '11px', fontWeight: 700, background: '#000', color: '#fff', border: 'none', padding: '7px 14px', cursor: trackingLoading ? 'wait' : 'pointer', fontFamily: 'inherit', letterSpacing: '1px' }}
                    >
                      {trackingLoading ? 'Loading…' : 'Track Order'}
                    </button>
                  )}
                </div>

                <p style={{ fontSize: '12px', color: '#666', margin: '0 0 10px' }}>
                  PostEx tracking: <strong style={{ color: '#000' }}>{selectedOrder.tracking_number}</strong>
                </p>

                {trackingError && (
                  <p style={{ fontSize: '13px', color: '#c0392b', margin: 0 }}>{trackingError}</p>
                )}

                {trackingData && postexHistory.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    {postexHistory.map((event: any, idx: number) => {
                      const code = event.transactionStatusMessageCode;
                      const meta = POSTEX_STATUS_MAP[code] ?? { label: event.transactionStatusMessage, icon: '•' };
                      const isLatest = idx === postexHistory.length - 1;
                      return (
                        <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: '12px', marginBottom: '4px', borderLeft: isLatest ? '2px solid #c8a96e' : '2px solid #e8e8e8', paddingLeft: '14px', position: 'relative' }}>
                          <div style={{ position: 'absolute', left: '-7px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', background: isLatest ? '#c8a96e' : '#e8e8e8', border: '2px solid #fff', flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: '13px', fontWeight: isLatest ? 700 : 500, margin: '0 0 2px', color: isLatest ? '#000' : '#555' }}>
                              {meta.icon} {meta.label}
                            </p>
                            {event.transactionStatusMessage && event.transactionStatusMessage !== meta.label && (
                              <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>{event.transactionStatusMessage}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {trackingData && postexHistory.length === 0 && (
                  <p style={{ fontSize: '13px', color: '#999', margin: '8px 0 0' }}>No tracking events yet — your order is being prepared.</p>
                )}
              </div>
            )}

            {/* Exchange section */}
            {canExchange && !exchangeSuccess && (
              <div style={{ padding: '20px 32px' }}>
                {!showExchange ? (
                  <button
                    onClick={() => setShowExchange(true)}
                    style={{ width: '100%', padding: '13px', background: '#fff', color: '#000', border: '1.5px solid #000', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Request Exchange
                  </button>
                ) : (
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: '16px' }}>Exchange Request</p>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
                      Exchange is available within 14 days of delivery. PostEx will pick up your parcel and deliver the replacement.
                    </p>

                    {exchangeError && (
                      <div style={{ marginBottom: '12px', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '13px' }}>
                        {exchangeError}
                      </div>
                    )}

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999', marginBottom: '8px' }}>
                        Reason for Exchange *
                      </label>
                      <select
                        value={exchangeReasonCategory}
                        onChange={(e) => { setExchangeReasonCategory(e.target.value); setExchangeReasonDetail(''); }}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fff', marginBottom: '8px', appearance: 'auto' }}
                      >
                        <option value="">Select a reason…</option>
                        <option value="Wrong size">Wrong size</option>
                        <option value="Wrong colour">Wrong colour</option>
                        <option value="Defective / damaged item">Defective / damaged item</option>
                        <option value="Different from description">Different from description</option>
                        <option value="Wrong item received">Wrong item received</option>
                        <option value="Other">Other (please specify)</option>
                      </select>
                      {exchangeReasonCategory && (
                        <textarea
                          value={exchangeReasonDetail}
                          onChange={(e) => setExchangeReasonDetail(e.target.value)}
                          placeholder={exchangeReasonCategory === 'Other' ? 'Please describe your reason…' : 'Additional details (optional)'}
                          rows={2}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                        />
                      )}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999', marginBottom: '8px' }}>
                        Items to Exchange (optional)
                      </label>
                      <input
                        type="text"
                        value={exchangeItems}
                        onChange={(e) => setExchangeItems(e.target.value)}
                        placeholder="e.g. Blue Lawn Kurta — Size M → Size L"
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => { setShowExchange(false); setExchangeError(''); setExchangeReasonCategory(''); setExchangeReasonDetail(''); }}
                        style={{ flex: 1, padding: '12px', background: '#fff', color: '#666', border: '1px solid #e0e0e0', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleExchangeSubmit}
                        disabled={exchangeLoading}
                        style={{ flex: 2, padding: '12px', background: '#000', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: exchangeLoading ? 'wait' : 'pointer', fontFamily: 'inherit' }}
                      >
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
