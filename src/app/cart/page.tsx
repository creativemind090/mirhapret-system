'use client';

import { useCartContext } from '@/context/CartContext';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const GOLD = '#c8a96e';
const CREAM = '#FAFAF8';

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCartContext();
  const subtotal = total;
  const shipping = 300;
  const finalTotal = subtotal + shipping;

  return (
    <div style={{ background: CREAM, color: '#0a0a0a', minHeight: '100vh' }}>
      <SiteHeader />

      {/* ─── Hero Bar ─── */}
      <section style={{
        background: '#080808', padding: 'clamp(40px, 6vw, 72px) clamp(24px, 6vw, 80px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '16px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(200,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div style={{ zIndex: 1 }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, marginBottom: '10px', fontWeight: 600 }}>Your Selection</p>
          <h1 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 600, fontStyle: 'italic', letterSpacing: '-1px', color: '#fff', lineHeight: 1 }}>
            Shopping Cart
          </h1>
        </div>
        {items.length > 0 && (
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#555', zIndex: 1, letterSpacing: '1px' }}>
            {items.length} item{items.length !== 1 ? 's' : ''}
          </p>
        )}
      </section>

      <section style={{ padding: 'clamp(32px, 5vw, 72px) clamp(20px, 6vw, 80px)', minHeight: '50vh' }}>
        {items.length === 0 ? (

          /* ─── Empty State ─── */
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <div style={{ width: '1px', height: '60px', background: GOLD, margin: '0 auto 32px' }} />
            <p style={{ fontFamily: "'Cormorant', serif", fontSize: '1.4rem', fontStyle: 'italic', color: '#888', marginBottom: '8px' }}>Nothing here yet</p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#bbb', marginBottom: '40px', fontWeight: 300, letterSpacing: '1px' }}>Your cart is empty</p>
            <a href="/products" style={{
              display: 'inline-block', padding: '14px 40px',
              background: '#0a0a0a', color: '#fff', textDecoration: 'none',
              fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 700,
              letterSpacing: '3px', textTransform: 'uppercase',
              cursor: 'pointer',
            }}>
              Explore Collection
            </a>
          </div>

        ) : (
          <div className="cart-layout">

            {/* ─── Cart Items ─── */}
            <div>
              {/* Header row */}
              <div className="cart-item-header" style={{ marginBottom: '8px', paddingBottom: '12px', borderBottom: `1px solid rgba(200,169,110,0.2)` }}>
                {['', 'Product', 'Size', 'Qty', 'Price', ''].map((h, i) => (
                  <p key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#aaa', margin: 0 }}>{h}</p>
                ))}
              </div>

              {items.map(item => (
                <div key={`${item.product_id}-${item.product_size}`} className="cart-item-row" style={{ borderBottom: '1px solid #f0ece8', padding: '20px 0' }}>

                  {/* Image */}
                  <div style={{ width: '80px', height: '100px', background: '#f0ece8', overflow: 'hidden', flexShrink: 0 }}>
                    {item.main_image ? (
                      <img src={item.main_image} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant', serif", fontSize: '18px', fontWeight: 600, color: '#ccc' }}>
                        {item.product_name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div>
                    <p style={{ fontFamily: "'Cormorant', serif", fontSize: '16px', fontWeight: 600, fontStyle: 'italic', margin: '0 0 4px', color: '#0a0a0a' }}>{item.product_name}</p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#bbb', margin: 0, letterSpacing: '1px' }}>SKU: {item.sku}</p>
                  </div>

                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#888', margin: 0, letterSpacing: '1px' }}>{item.product_size}</p>

                  {/* Qty */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0dcd8', width: 'fit-content', background: '#fff' }}>
                    <button onClick={() => updateQuantity(item.product_id, item.product_size, item.quantity - 1)}
                      style={{ width: '32px', height: '32px', background: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer', borderRight: '1px solid #e0dcd8', color: '#555', fontFamily: "'Montserrat', sans-serif" }}>−</button>
                    <span style={{ width: '40px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 600 }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.product_size, item.quantity + 1)}
                      style={{ width: '32px', height: '32px', background: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer', borderLeft: '1px solid #e0dcd8', color: '#555', fontFamily: "'Montserrat', sans-serif" }}>+</button>
                  </div>

                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>
                    PKR {(item.unit_price * item.quantity).toLocaleString()}
                  </p>

                  <button onClick={() => removeItem(item.product_id, item.product_size)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: 0, lineHeight: 1, fontSize: '20px', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#c0392b')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#ccc')}
                    title="Remove">×</button>
                </div>
              ))}

              <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <a href="/products" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 600, color: '#0a0a0a', textDecoration: 'none', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid #0a0a0a', paddingBottom: '2px' }}>
                  ← Continue Shopping
                </a>
                <button onClick={clearCart} style={{ background: 'none', border: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#bbb', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  Clear Cart
                </button>
              </div>
            </div>

            {/* ─── Order Summary ─── */}
            <div style={{ position: 'sticky', top: '110px' }}>
              <div style={{ background: '#fff', border: `1px solid #e8e4e0`, padding: '36px' }}>
                <div style={{ width: '32px', height: '1px', background: GOLD, marginBottom: '24px' }} />
                <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#888', marginBottom: '28px' }}>Order Summary</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#888', fontWeight: 300 }}>Subtotal</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 500 }}>PKR {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid #f0ece8' }}>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#888', fontWeight: 300 }}>Shipping</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 500 }}>PKR {shipping.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: "'Cormorant', serif", fontSize: '1.2rem', fontStyle: 'italic', fontWeight: 600 }}>Total</span>
                  <span style={{ fontFamily: "'Cormorant', serif", fontSize: '1.5rem', fontWeight: 600, fontStyle: 'italic' }}>PKR {Math.round(finalTotal).toLocaleString()}</span>
                </div>

                <button onClick={() => window.location.href = '/checkout'}
                  style={{ width: '100%', padding: '16px', background: '#0a0a0a', color: '#fff', border: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '16px', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = GOLD)}
                  onMouseLeave={e => (e.currentTarget.style.background = '#0a0a0a')}>
                  Proceed to Checkout
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                  {['Free returns', 'Secure checkout', 'COD available'].map((t, i) => (
                    <p key={i} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', color: '#bbb', letterSpacing: '0.5px', textAlign: 'center', fontWeight: 300 }}>{t}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
