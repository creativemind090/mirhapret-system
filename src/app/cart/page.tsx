'use client';

import { useState, useEffect } from 'react';
import { useCartContext } from '@/context/CartContext';
import { PageHeader } from '@/components/PageHeader';

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCartContext();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const subtotal = total;
  const tax = subtotal * 0.17;
  const shipping = subtotal > 5000 ? 0 : 300;
  const finalTotal = subtotal + tax + shipping;

  return (
    <div style={{ background: '#ffffff', color: '#000000' }}>
      <PageHeader isScrolled={isScrolled} />

      {/* Cart Section */}
      <section
        style={{
          paddingTop: '100px',
          paddingBottom: '60px',
          paddingLeft: '60px',
          paddingRight: '60px',
          background: '#ffffff',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '32px', letterSpacing: '-0.5px' }}>
            Shopping Cart
          </h1>

          {items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '60px' }}>
              <p style={{ fontSize: '1.1rem', color: '#666666', marginBottom: '24px' }}>
                Your cart is empty
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
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px' }}>
              {/* Cart Items */}
              <div>
                <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 1fr 0.5fr', gap: '16px', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666666' }}>
                    <div>Image</div>
                    <div>Product</div>
                    <div>Size</div>
                    <div>Quantity</div>
                    <div>Price</div>
                    <div></div>
                  </div>
                </div>

                {items.map((item) => (
                  <div
                    key={`${item.product_id}-${item.product_size}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr 1fr 1fr 1fr 0.5fr',
                      gap: '16px',
                      alignItems: 'center',
                      paddingBottom: '24px',
                      borderBottom: '1px solid #e0e0e0',
                      marginBottom: '24px',
                    }}
                  >
                    {/* Product Image */}
                    <div
                      style={{
                        width: '80px',
                        height: '100px',
                        background: '#f5f5f5',
                        border: '1px solid #e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        color: '#999999',
                        fontWeight: 500,
                      }}
                    >
                      {item.main_image || 'Image'}
                    </div>

                    <div>
                      <p style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 4px', color: '#000000' }}>
                        {item.product_name}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: '#666666', margin: 0 }}>
                        SKU: {item.sku}
                      </p>
                    </div>

                    <div style={{ fontSize: '0.95rem', color: '#333333' }}>
                      {item.product_size}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.product_size, item.quantity - 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          background: '#ffffff',
                          border: '1px solid #e0e0e0',
                          fontSize: '16px',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product_id, item.product_size, Math.max(1, parseInt(e.target.value) || 1))}
                        style={{
                          width: '48px',
                          height: '32px',
                          textAlign: 'center',
                          border: '1px solid #e0e0e0',
                          fontSize: '14px',
                          fontWeight: 600,
                          fontFamily: 'system-ui',
                        }}
                      />
                      <button
                        onClick={() => updateQuantity(item.product_id, item.product_size, item.quantity + 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          background: '#ffffff',
                          border: '1px solid #e0e0e0',
                          fontSize: '16px',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#000000' }}>
                      PKR {(item.unit_price * item.quantity).toLocaleString()}
                    </div>

                    <button
                      onClick={() => removeItem(item.product_id, item.product_size)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                        color: '#999999',
                        padding: '0',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Remove item"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <button
                  onClick={clearCart}
                  style={{
                    marginTop: '24px',
                    padding: '10px 20px',
                    background: '#ffffff',
                    color: '#000000',
                    border: '1px solid #e0e0e0',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'system-ui',
                  }}
                >
                  Clear Cart
                </button>
              </div>

              {/* Order Summary */}
              <div style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
                <div style={{ border: '1px solid #e0e0e0', padding: '24px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Order Summary
                  </h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
                    <span style={{ color: '#666666' }}>Subtotal</span>
                    <span style={{ fontWeight: 600 }}>PKR {subtotal.toLocaleString()}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
                    <span style={{ color: '#666666' }}>Tax (17%)</span>
                    <span style={{ fontWeight: 600 }}>PKR {Math.round(tax).toLocaleString()}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '0.95rem', paddingBottom: '24px', borderBottom: '1px solid #e0e0e0' }}>
                    <span style={{ color: '#666666' }}>
                      Shipping {shipping === 0 ? '(Free)' : ''}
                    </span>
                    <span style={{ fontWeight: 600 }}>PKR {shipping.toLocaleString()}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.1rem', fontWeight: 700 }}>
                    <span>Total</span>
                    <span>PKR {Math.round(finalTotal).toLocaleString()}</span>
                  </div>

                  <button
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
                      marginBottom: '12px',
                    }}
                    onClick={() => window.location.href = '/checkout'}
                  >
                    Proceed to Checkout
                  </button>

                  <a
                    href="/products"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '12px',
                      background: '#ffffff',
                      color: '#000000',
                      border: '1px solid #e0e0e0',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'none',
                    }}
                  >
                    Continue Shopping
                  </a>
                </div>

                <div style={{ marginTop: '24px', padding: '16px', background: '#f5f5f5', border: '1px solid #e0e0e0' }}>
                  <p style={{ fontSize: '0.85rem', color: '#666666', margin: 0, lineHeight: 1.6 }}>
                    Free shipping on orders over PKR 5,000. Taxes calculated at checkout.
                  </p>
                </div>
              </div>
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
