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

export default function MyOrdersPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

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
          items: (o.items ?? []).map((item: any) => ({
            name: item.product_name ?? item.name,
            size: item.product_size ?? item.size,
            quantity: item.quantity,
            price: Number(item.unit_price ?? 0),
          })),
        })));
      } catch {
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn || isLoading) return null;

  return (
    <div style={{ background: '#fff', color: '#000' }}>
      <SiteHeader />

      {/* Hero bar */}
      <section style={{ background: '#0e0e0e', padding: '60px 60px 48px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#c8a96e', fontWeight: 600, marginBottom: '12px' }}>
            Account
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-1.5px', color: '#fff' }}>My Orders</h1>
        </div>
        <p style={{ fontSize: '13px', color: '#555' }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </section>

      <section style={{ padding: '60px', minHeight: '50vh' }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p style={{ fontSize: '1.1rem', color: '#999', marginBottom: '32px' }}>You haven't placed any orders yet.</p>
            <a href="/products" style={{ display: 'inline-block', padding: '15px 36px', background: '#000', color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Start Shopping
            </a>
          </div>
        ) : (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="orders-table-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e8e8e8' }}>
            {/* Header */}
            <div className="orders-table-header">
              {['Order', 'Date', 'Status', 'Total', ''].map((h, i) => (
                <p key={i} style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#999', margin: 0 }}>{h}</p>
              ))}
            </div>
            {orders.map(order => (
              <div
                key={order.id}
                className="orders-table-row"
              >
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#000', margin: '0 0 2px' }}>{order.id}</p>
                  <p style={{ fontSize: '11px', color: '#bbb', margin: 0 }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                </div>
                <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>{order.date}</p>
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    background: `${STATUS_COLORS[order.status] ?? '#999'}15`,
                    color: STATUS_COLORS[order.status] ?? '#999',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    textTransform: 'capitalize',
                  }}>
                    {order.status}
                  </span>
                </div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#000', margin: 0 }}>
                  PKR {order.total.toLocaleString()}
                </p>
                <button
                  onClick={() => setSelectedOrder(order)}
                  style={{ padding: '9px 16px', background: '#fff', color: '#000', border: '1.5px solid #000', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Details
                </button>
              </div>
            ))}
          </div>{/* end orders-table-scroll */}
          </div>
        )}
      </section>

      {/* Order detail modal */}
      {selectedOrder && (
        <>
          <div onClick={() => setSelectedOrder(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', zIndex: 301, maxWidth: '560px', width: '90%', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '28px 32px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '10px', color: '#bbb', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Order</p>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.3px' }}>{selectedOrder.id}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999', padding: 0 }}>×</button>
            </div>

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

            <div style={{ padding: '24px 32px' }}>
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
            </div>

            <div style={{ padding: '20px 32px', background: '#fafafa', borderTop: '1.5px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontWeight: 700, fontSize: '14px', margin: 0 }}>Total</p>
              <p style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>PKR {selectedOrder.total.toLocaleString()}</p>
            </div>
          </div>
        </>
      )}

      <SiteFooter />
    </div>
  );
}
