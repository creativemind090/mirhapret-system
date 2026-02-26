'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCartContext } from '@/context/CartContext';
import { PageHeader } from '@/components/PageHeader';

// Lofi image placeholder component
function LofiImage({ width = 500, height = 600, label = 'Product Image' }: { width?: number; height?: number; label?: string }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ background: '#f5f5f5', display: 'block' }}
    >
      <rect width={width} height={height} fill="#f5f5f5" />
      {Array.from({ length: 30 }).map((_, i) => (
        <line
          key={i}
          x1={i * (width / 15) - height}
          y1="0"
          x2={i * (width / 15)}
          y2={height}
          stroke="#e0e0e0"
          strokeWidth="2"
        />
      ))}
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="16"
        fill="#999999"
        fontFamily="system-ui"
      >
        {label}
      </text>
    </svg>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addItem } = useCartContext();
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Mock product data
  const product = {
    id: productId,
    name: 'Premium Fashion Piece',
    category: 'Premium Pret',
    price: 4999,
    discount: productId === 'pret-1' ? 10 : 0,
    inStock: productId !== 'pret-3' && productId !== 'desire-2',
    description:
      'A beautifully crafted piece that combines elegance with comfort. Perfect for any occasion, this garment is made from the finest materials and designed with meticulous attention to detail.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Navy'],
    images: [
      'Main View',
      'Side View',
      'Detail View',
      'Back View',
      'Flat Lay',
    ],
    sizeGuide: {
      S: { chest: '32-34"', length: '26"', waist: '26-28"' },
      M: { chest: '34-36"', length: '27"', waist: '28-30"' },
      L: { chest: '36-38"', length: '28"', waist: '30-32"' },
      XL: { chest: '38-40"', length: '29"', waist: '32-34"' },
    },
    details: [
      'Premium fabric blend',
      'Hand-finished details',
      'Available in multiple sizes',
      'Easy care instructions',
      'Sustainable production',
    ],
  };

  useEffect(() => {
    // Scroll listener removed - not needed for current implementation
  }, []);

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      product_name: product.name,
      sku: `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      product_size: selectedSize,
      quantity,
      unit_price: product.price,
      main_image: 'Main View',
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    setQuantity(1);
  };

  return (
    <div style={{ background: '#ffffff', color: '#000000' }}>
      <PageHeader />

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <>
          <div
            onClick={() => setIsSizeGuideOpen(false)}
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
              borderRadius: '8px',
              zIndex: 301,
              maxWidth: '600px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Size Guide</h2>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
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
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem' }}>Size</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem' }}>Chest</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem' }}>Length</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem' }}>Waist</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(product.sizeGuide).map(([size, measurements]) => (
                  <tr key={size} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{size}</td>
                    <td style={{ padding: '12px', color: '#666666' }}>{measurements.chest}</td>
                    <td style={{ padding: '12px', color: '#666666' }}>{measurements.length}</td>
                    <td style={{ padding: '12px', color: '#666666' }}>{measurements.waist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Product Detail */}
      <section
        style={{
          paddingTop: '100px',
          paddingBottom: '60px',
          paddingLeft: '60px',
          paddingRight: '60px',
          background: '#ffffff',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '40px', alignItems: 'start' }}>
          {/* Image Carousel - Left Side (Sticky) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'sticky', top: '100px', height: 'fit-content' }}>
            {product.images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                style={{
                  width: '80px',
                  height: '100px',
                  border: selectedImageIndex === idx ? '2px solid #000000' : '1px solid #e0e0e0',
                  background: '#f5f5f5',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  color: '#999999',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                }}
              >
                {image}
              </button>
            ))}
          </div>

          {/* Product Image */}
          <div
            onMouseEnter={() => setIsImageZoomed(true)}
            onMouseLeave={() => setIsImageZoomed(false)}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setZoomPosition({ x, y });
            }}
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: '#f5f5f5',
              cursor: isImageZoomed ? 'zoom-in' : 'default',
            }}
          >
            <div
              style={{
                transform: isImageZoomed ? 'scale(1.5)' : 'scale(1)',
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transition: isImageZoomed ? 'none' : 'transform 0.3s ease-out',
              }}
            >
              <LofiImage width={500} height={600} label={product.images[selectedImageIndex]} />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p
              style={{
                fontSize: '0.85rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#999999',
                marginBottom: '12px',
                fontWeight: 600,
              }}
            >
              {product.category}
            </p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '16px', letterSpacing: '-0.5px' }}>
              {product.name}
            </h1>
            <p style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px', color: '#000000' }}>
              PKR {product.price.toLocaleString()}
            </p>

            <p style={{ fontSize: '1rem', color: '#666666', lineHeight: 1.7, marginBottom: '32px' }}>
              {product.description}
            </p>

            {/* Size Selection */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Select Size
                </label>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#000000',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: '0',
                    fontFamily: 'system-ui',
                  }}
                >
                  Size Guide
                </button>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '10px 16px',
                      background: selectedSize === size ? '#000000' : '#ffffff',
                      color: selectedSize === size ? '#ffffff' : '#000000',
                      border: '1px solid #000000',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'system-ui',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Quantity
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: 'fit-content' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!product.inStock}
                  style={{
                    width: '40px',
                    height: '40px',
                    background: '#ffffff',
                    border: '1px solid #e0e0e0',
                    fontSize: '18px',
                    cursor: product.inStock ? 'pointer' : 'not-allowed',
                    fontWeight: 600,
                    opacity: product.inStock ? 1 : 0.5,
                  }}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  disabled={!product.inStock}
                  style={{
                    width: '60px',
                    height: '40px',
                    textAlign: 'center',
                    border: '1px solid #e0e0e0',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'system-ui',
                    opacity: product.inStock ? 1 : 0.5,
                    cursor: product.inStock ? 'text' : 'not-allowed',
                  }}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!product.inStock}
                  style={{
                    width: '40px',
                    height: '40px',
                    background: '#ffffff',
                    border: '1px solid #e0e0e0',
                    fontSize: '18px',
                    cursor: product.inStock ? 'pointer' : 'not-allowed',
                    fontWeight: 600,
                    opacity: product.inStock ? 1 : 0.5,
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Price with Discount */}
            {product.discount > 0 && (
              <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#000000', margin: 0 }}>
                  PKR {Math.round(product.price * (1 - product.discount / 100)).toLocaleString()}
                </p>
                <p style={{ fontSize: '1rem', color: '#999999', textDecoration: 'line-through', margin: 0 }}>
                  PKR {product.price.toLocaleString()}
                </p>
                <div style={{ background: '#000000', color: '#ffffff', padding: '4px 8px', fontSize: '12px', fontWeight: 700 }}>
                  {product.discount}% OFF
                </div>
              </div>
            )}

            {/* Out of Stock Message */}
            {!product.inStock && (
              <div style={{ marginBottom: '24px', padding: '12px', background: '#f5f5f5', border: '1px solid #e0e0e0' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#c0392b', margin: 0 }}>
                  This product is currently out of stock
                </p>
              </div>
            )}

            {/* Add to Cart / Wishlist Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              {product.inStock ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: addedToCart ? '#1a7a4a' : '#000000',
                      color: '#ffffff',
                      border: `1px solid ${addedToCart ? '#1a7a4a' : '#000000'}`,
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'system-ui',
                      transition: 'none',
                    }}
                  >
                    {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => setIsInWishlist(!isInWishlist)}
                    style={{
                      padding: '16px 24px',
                      background: isInWishlist ? '#000000' : '#ffffff',
                      color: isInWishlist ? '#ffffff' : '#000000',
                      border: '1px solid #000000',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'system-ui',
                    }}
                  >
                    {isInWishlist ? '♥ Added to Wishlist' : '♡ Add to Wishlist'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsInWishlist(!isInWishlist)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: isInWishlist ? '#000000' : '#ffffff',
                    color: isInWishlist ? '#ffffff' : '#000000',
                    border: '1px solid #000000',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'system-ui',
                  }}
                >
                  {isInWishlist ? '♥ Added to Wishlist' : '♡ Add to Wishlist'}
                </button>
              )}
            </div>

            {/* Product Details */}
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '32px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Product Details</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {product.details.map((detail, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: '0.95rem',
                      color: '#666666',
                      marginBottom: '12px',
                      paddingLeft: '20px',
                      position: 'relative',
                    }}
                  >
                    <span style={{ position: 'absolute', left: 0 }}>✓</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
