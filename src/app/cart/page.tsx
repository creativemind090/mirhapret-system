'use client';

import { useEffect, useState } from 'react';
import { useCartContext } from '@/context/CartContext';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCartContext();
  const subtotal = total;
  const shipping = 300;
  const finalTotal = subtotal + shipping;

  return (
    <div style={{ background: '#fff', color: '#000' }}>
      <SiteHeader />

      {/* Hero bar */}
      <section style={{ background: '#0e0e0e', padding: '48px 60px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-1.5px', color: '#fff' }}>Your Cart</h1>
        {items.length > 0 && (
          <p style={{ fontSize: '13px', color: '#555' }}>{items.length} item{items.length !== 1 ? 's' : ''}</p>
        )}
      </section>

      <section style={{ padding: '60px', minHeight: '50vh' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p style={{ fontSize: '3rem', marginBottom: '20px' }}>—</p>
            <p style={{ fontSize: '1.1rem', color: '#999', marginBottom: '32px' }}>Your cart is empty</p>
            <a href="/products" style={{ display: 'inline-block', padding: '15px 36px', background: '#000', color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="cart-layout">

            {/* Items */}
            <div>
              <div className="cart-items-scroll">
              {/* Header row */}
              <div className="cart-item-header">
                {['', 'Product', 'Size', 'Qty', 'Price', ''].map((h, i) => (
                  <p key={i} style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#999', margin: 0 }}>{h}</p>
                ))}
              </div>

              {items.map(item => (
                <div
                  key={`${item.product_id}-${item.product_size}`}
                  className="cart-item-row"
                >
                  {/* Image */}
                  <div style={{ width: '80px', height: '100px', background: '#f4f4f4', overflow: 'hidden' }}>
                    {item.main_image ? (
                      <img src={item.main_image} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: '#ddd' }}>
                        {item.product_name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px', color: '#000' }}>{item.product_name}</p>
                    <p style={{ fontSize: '11px', color: '#bbb', margin: 0 }}>SKU: {item.sku}</p>
                  </div>

                  <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>{item.product_size}</p>

                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e8e8e8', width: 'fit-content' }}>
                    <button onClick={() => updateQuantity(item.product_id, item.product_size, item.quantity - 1)} style={{ width: '32px', height: '32px', background: '#fff', border: 'none', fontSize: '16px', cursor: 'pointer', borderRight: '1px solid #e8e8e8' }}>−</button>
                    <span style={{ width: '40px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600 }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.product_size, item.quantity + 1)} style={{ width: '32px', height: '32px', background: '#fff', border: 'none', fontSize: '16px', cursor: 'pointer', borderLeft: '1px solid #e8e8e8' }}>+</button>
                  </div>

                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#000', margin: 0 }}>
                    PKR {(item.unit_price * item.quantity).toLocaleString()}
                  </p>

                  <button onClick={() => removeItem(item.product_id, item.product_size)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#ccc', padding: 0, lineHeight: 1 }} title="Remove">×</button>
                </div>
              ))}
              </div>{/* end cart-items-scroll */}

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <a href="/products" style={{ fontSize: '12px', fontWeight: 700, color: '#000', textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1.5px solid #000', paddingBottom: '2px' }}>
                  ← Continue Shopping
                </a>
                <button onClick={clearCart} style={{ background: 'none', border: 'none', fontSize: '12px', color: '#bbb', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order summary */}
            <div style={{ position: 'sticky', top: '110px' }}>
              <div style={{ border: '1.5px solid #000', padding: '32px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '28px' }}>Order Summary</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                  <span style={{ color: '#666' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>PKR {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e8e8e8', fontSize: '14px' }}>
                  <span style={{ color: '#666' }}>Shipping</span>
                  <span style={{ fontWeight: 600 }}>PKR {shipping.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', fontSize: '1.1rem', fontWeight: 800 }}>
                  <span>Total</span>
                  <span>PKR {Math.round(finalTotal).toLocaleString()}</span>
                </div>

                <button onClick={() => window.location.href = '/checkout'} style={{ width: '100%', padding: '16px', background: '#000', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '12px' }}>
                  Proceed to Checkout
                </button>
              </div>

            </div>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
