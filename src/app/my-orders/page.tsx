'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/context/AuthContext';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MyOrdersPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Mock orders data
  const orders = [
    {
      id: 'ORD-20260226-ABC1',
      date: '2026-02-26',
      receivedDate: '2026-02-28',
      status: 'Delivered',
      total: 12499,
      items: 3,
      location: { lat: 24.8607, lng: 67.0011 }, // Karachi
      details: [
        { name: 'Premium Pret Piece', size: 'M', quantity: 1, price: 4999 },
        { name: 'Octa West Design', size: 'L', quantity: 1, price: 5999 },
        { name: 'Desire Couture', size: 'S', quantity: 1, price: 1501 },
      ],
    },
    {
      id: 'ORD-20260220-XYZ2',
      date: '2026-02-20',
      receivedDate: null,
      status: 'In Transit',
      total: 8999,
      items: 2,
      location: { lat: 31.5204, lng: 74.3587 }, // Lahore
      details: [
        { name: 'Premium Pret Piece', size: 'S', quantity: 2, price: 4499.5 },
        { name: 'Octa West Design', size: 'M', quantity: 1, price: 4499.5 },
      ],
    },
    {
      id: 'ORD-20260215-DEF3',
      date: '2026-02-15',
      receivedDate: null,
      status: 'Processing',
      total: 5499,
      items: 1,
      location: { lat: 33.6844, lng: 73.0479 }, // Islamabad
      details: [
        { name: 'Premium Pret Piece', size: 'XL', quantity: 1, price: 5499 },
      ],
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoggedIn) {
        router.push('/signin');
      }
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [isLoggedIn, router]);

  // Initialize Mapbox when tracking modal opens
  useEffect(() => {
    if (!trackingOrder || !mapContainer.current) return;

    const order = orders.find((o) => o.id === trackingOrder);
    if (!order) return;

    // Set Mapbox token (using a public token for demo)
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbHZkZXhhbXBsZSJ9.example';

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [order.location.lng, order.location.lat],
        zoom: 12,
      });

      // Add marker for order location
      new mapboxgl.Marker({ color: '#000000' })
        .setLngLat([order.location.lng, order.location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="font-family: system-ui; font-size: 14px; font-weight: 600;">
              ${order.id}
              <br/>
              <span style="font-size: 12px; color: #666;">Status: ${order.status}</span>
            </div>`
          )
        )
        .addTo(map.current);
    } catch (err) {
      console.error('Mapbox initialization error:', err);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [trackingOrder, orders]);

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return null;
  }

  const currentOrder = orders.find((o) => o.id === selectedOrder);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#1a7a4a';
      case 'In Transit':
        return '#0066cc';
      case 'Processing':
        return '#ff9800';
      default:
        return '#666666';
    }
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
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.5px', margin: '0 0 8px' }}>
              My Orders
            </h1>
            <p style={{ fontSize: '14px', color: '#666666', margin: 0 }}>
              View and track your orders
            </p>
          </div>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '60px' }}>
              <p style={{ fontSize: '1.1rem', color: '#666666', marginBottom: '24px' }}>
                You haven't placed any orders yet
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
                Start Shopping
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    border: '1px solid #e0e0e0',
                    padding: '24px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr auto auto',
                    gap: '16px',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666666', margin: '0 0 4px' }}>
                      Order ID
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{order.id}</p>
                  </div>

                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666666', margin: '0 0 4px' }}>
                      Date
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666666', margin: '0 0 4px' }}>
                      Status
                    </p>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        margin: 0,
                        color: getStatusColor(order.status),
                      }}
                    >
                      {order.status}
                    </p>
                  </div>

                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666666', margin: '0 0 4px' }}>
                      Total
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>
                      PKR {order.total.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order.id)}
                    style={{
                      padding: '8px 16px',
                      background: '#000000',
                      color: '#ffffff',
                      border: '1px solid #000000',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'system-ui',
                    }}
                  >
                    View Details
                  </button>
                  {order.status !== 'Delivered' && (
                    <button
                      onClick={() => setTrackingOrder(order.id)}
                      style={{
                        padding: '8px 16px',
                        background: '#ffffff',
                        color: '#000000',
                        border: '1px solid #000000',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'system-ui',
                      }}
                    >
                      Track Order
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Order Details Modal */}
      {selectedOrder && currentOrder && (
        <>
          <div
            onClick={() => setSelectedOrder(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 300,
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#ffffff',
              padding: '40px',
              borderRadius: '0',
              zIndex: 301,
              maxWidth: '600px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>

            {/* Order Info */}
            <div style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #e0e0e0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666666', margin: '0 0 4px' }}>
                    Order ID
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{currentOrder.id}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666666', margin: '0 0 4px' }}>
                    Status
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: getStatusColor(currentOrder.status) }}>
                    {currentOrder.status}
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666666', margin: '0 0 4px' }}>
                    Order Date
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>
                    {new Date(currentOrder.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666666', margin: '0 0 4px' }}>
                    {currentOrder.receivedDate ? 'Received Date' : 'Expected Delivery'}
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>
                    {currentOrder.receivedDate
                      ? new Date(currentOrder.receivedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Pending'}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Items
              </h3>
              {currentOrder.details.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: '12px',
                    marginBottom: '12px',
                    borderBottom: idx < currentOrder.details.length - 1 ? '1px solid #e0e0e0' : 'none',
                  }}
                >
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>{item.name}</p>
                    <p style={{ fontSize: '12px', color: '#666666', margin: 0 }}>
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>PKR {item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ paddingTop: '16px', borderTop: '2px solid #e0e0e0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Total</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>PKR {currentOrder.total.toLocaleString()}</p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                width: '100%',
                padding: '14px',
                background: '#000000',
                color: '#ffffff',
                border: '1px solid #000000',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'system-ui',
                marginTop: '32px',
              }}
            >
              Close
            </button>
          </div>
        </>
      )}

      {/* Order Tracking Modal */}
      {trackingOrder && (
        <>
          <div
            onClick={() => setTrackingOrder(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 400,
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#ffffff',
              padding: '40px',
              borderRadius: '0',
              zIndex: 401,
              maxWidth: '700px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Track Order</h2>
              <button
                onClick={() => setTrackingOrder(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>

            {/* Order Info */}
            {trackingOrder && orders.find((o) => o.id === trackingOrder) && (
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e0e0e0' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666666', margin: '0 0 4px' }}>
                  Order ID
                </p>
                <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{trackingOrder}</p>
              </div>
            )}

            {/* Map Container */}
            <div
              ref={mapContainer}
              style={{
                width: '100%',
                height: '400px',
                marginBottom: '24px',
                border: '1px solid #e0e0e0',
              }}
            />

            {/* Close Button */}
            <button
              onClick={() => setTrackingOrder(null)}
              style={{
                width: '100%',
                padding: '14px',
                background: '#000000',
                color: '#ffffff',
                border: '1px solid #000000',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'system-ui',
              }}
            >
              Close
            </button>
          </div>
        </>
      )}

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
