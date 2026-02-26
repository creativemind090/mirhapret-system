'use client';

import { useCartContext } from '@/context/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, total, removeItem, updateQuantity } = useCartContext();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 200,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
        }}
      />
      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '420px',
          height: '100vh',
          background: '#ffffff',
          border: '1px solid #e0e0e0',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Your Cart</h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              width: '24px',
              height: '24px',
            }}
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {items.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#666666', textAlign: 'center', marginTop: '40px' }}>
              Your cart is empty
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item) => (
                <div
                  key={`${item.product_id}-${item.product_size}`}
                  style={{
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    gap: '12px',
                  }}
                >
                  {/* Product Image */}
                  <div
                    style={{
                      width: '80px',
                      height: '100px',
                      background: '#f5f5f5',
                      border: '1px solid #e0e0e0',
                      flexShrink: 0,
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

                  {/* Product Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 4px', color: '#000000' }}>
                          {item.product_name}
                        </p>
                        <p style={{ fontSize: '12px', color: '#666666', margin: 0 }}>
                          Size: {item.product_size}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product_id, item.product_size)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          fontSize: '16px',
                          cursor: 'pointer',
                          color: '#999999',
                          padding: '0',
                        }}
                      >
                        ×
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.product_size, item.quantity - 1)}
                          style={{
                            width: '24px',
                            height: '24px',
                            background: '#ffffff',
                            border: '1px solid #e0e0e0',
                            fontSize: '14px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            padding: '0',
                          }}
                        >
                          −
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.product_size, item.quantity + 1)}
                          style={{
                            width: '24px',
                            height: '24px',
                            background: '#ffffff',
                            border: '1px solid #e0e0e0',
                            fontSize: '14px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            padding: '0',
                          }}
                        >
                          +
                        </button>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#000000' }}>
                        PKR {(item.unit_price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: '16px',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700 }}>
              <span>Total:</span>
              <span>PKR {total.toLocaleString()}</span>
            </div>
            <a
              href="/cart"
              onClick={onClose}
              style={{
                padding: '12px',
                background: '#000000',
                color: '#ffffff',
                border: '1px solid #000000',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              View Cart
            </a>
          </div>
        )}
      </div>
    </>
  );
}
