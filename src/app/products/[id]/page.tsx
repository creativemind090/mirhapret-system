'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCartContext } from '@/context/CartContext';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import api from '@/lib/api';
import { getWishlistIds, toggleWishlist } from '@/app/my-wishlist/page';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addItem } = useCartContext();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [product, setProduct] = useState<any>(null);
  const [productLoading, setProductLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setProductLoading(true);
      try {
        const res = await api.get(`/products/${productId}`);
        const p = res.data.data ?? res.data;
        setProduct({
          id: p.id,
          name: p.name,
          category: p.category?.name ?? '',
          price: Number(p.price),
          inStock: p.is_active,
          description: p.description ?? '',
          sizes: p.available_sizes ?? [],
          images: p.images?.length ? p.images : (p.main_image ? [p.main_image] : []),
          main_image: p.main_image,
          size_guide_html: p.size_guide_html ?? '',
          sku: p.sku,
        });
        if (p.available_sizes?.length) setSelectedSize(p.available_sizes[0]);
        setIsInWishlist(getWishlistIds().includes(p.id));

        const sessionKey = `viewed_${p.id}`;
        if (!sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, '1');
          api.post(`/products/analytics/${p.id}/track`, { event_type: 'view' }).catch(() => {});
        }
      } catch {
        setProduct(null);
      } finally {
        setProductLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      product_id: product.id,
      product_name: product.name,
      sku: product.sku ?? `SKU-${product.id.slice(0, 8).toUpperCase()}`,
      product_size: selectedSize,
      quantity,
      unit_price: product.price,
      main_image: product.main_image,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
    setQuantity(1);
  };

  if (productLoading) {
    return (
      <div style={{ background: '#fff', minHeight: '100vh' }}>
        <SiteHeader />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <p style={{ color: '#bbb', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ background: '#fff', minHeight: '100vh' }}>
        <SiteHeader />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '20px' }}>
          <p style={{ color: '#999', fontSize: '14px' }}>Product not found.</p>
          <a href="/products" style={{ padding: '13px 28px', background: '#000', color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Back to Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', color: '#000' }}>
      <SiteHeader />

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <>
          <div onClick={() => setIsSizeGuideOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '40px', zIndex: 301, maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Size Guide</h2>
              <button onClick={() => setIsSizeGuideOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}>×</button>
            </div>
            <style>{`.sg table{width:100%;border-collapse:collapse;font-size:14px}.sg th{background:#000;color:#fff;padding:10px 16px;text-align:left;font-size:11px;letter-spacing:1px;text-transform:uppercase}.sg td{padding:10px 16px;border-bottom:1px solid #e8e8e8;color:#333}.sg tr:last-child td{border-bottom:none}.sg tr:nth-child(even) td{background:#fafafa}`}</style>
            {product.size_guide_html ? (
              <div className="sg" dangerouslySetInnerHTML={{ __html: product.size_guide_html }} />
            ) : (
              <p style={{ color: '#999', fontSize: '14px' }}>No size guide available for this product.</p>
            )}
          </div>
        </>
      )}

      {/* Breadcrumb */}
      <div style={{ padding: '20px 60px', borderBottom: '1px solid #e8e8e8', fontSize: '12px', color: '#999' }}>
        <a href="/" style={{ color: '#999', textDecoration: 'none' }}>Home</a>
        <span style={{ margin: '0 8px' }}>›</span>
        <a href="/products" style={{ color: '#999', textDecoration: 'none' }}>Products</a>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: '#000', fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Main content */}
      <section className="product-detail-section">

        {/* Thumbnails */}
        {product.images.length > 0 && (
          <div className="product-thumbnails-col">
            {product.images.map((image: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                style={{
                  width: '72px', height: '90px',
                  border: selectedImageIndex === idx ? '2px solid #000' : '1.5px solid #e8e8e8',
                  background: '#f4f4f4',
                  cursor: 'pointer', padding: 0, overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                {image ? (
                  <img src={image} alt={`View ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '11px', color: '#bbb' }}>{idx + 1}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div>
          <div
            onMouseEnter={() => setIsImageZoomed(true)}
            onMouseLeave={() => setIsImageZoomed(false)}
            onMouseMove={e => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoomPosition({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            }}
            style={{ position: 'relative', overflow: 'hidden', background: '#f4f4f4', cursor: isImageZoomed ? 'zoom-in' : 'default' }}
          >
            <div style={{ transform: isImageZoomed ? 'scale(1.5)' : 'scale(1)', transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`, transition: isImageZoomed ? 'none' : 'transform 0.3s ease' }}>
              {product.images[selectedImageIndex] ? (
                <img src={product.images[selectedImageIndex]} alt={product.name} style={{ width: '100%', height: '600px', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0' }}>
                  <span style={{ fontSize: '4rem', fontWeight: 800, color: '#ddd', letterSpacing: '-2px' }}>
                    {product.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {product.images.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #e8e8e8' }}>
              <button onClick={() => setSelectedImageIndex((selectedImageIndex - 1 + product.images.length) % product.images.length)} style={{ width: '40px', height: '40px', background: '#fff', border: '1.5px solid #e8e8e8', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 300 }}>←</button>
              <span style={{ fontSize: '11px', color: '#bbb', letterSpacing: '1px' }}>{selectedImageIndex + 1} / {product.images.length}</span>
              <button onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % product.images.length)} style={{ width: '40px', height: '40px', background: '#fff', border: '1.5px solid #e8e8e8', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 300 }}>→</button>
            </div>
          )}
        </div>

        {/* Product info */}
        <div style={{ paddingTop: '8px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: '12px', fontWeight: 600 }}>
            {product.category}
          </p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 2.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1.15 }}>
            {product.name}
          </h1>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '28px', color: '#000' }}>
            PKR {product.price.toLocaleString()}
          </p>

          {product.description && (
            <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.85, marginBottom: '32px' }}>
              {product.description}
            </p>
          )}

          {/* Size selection */}
          {product.sizes.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Select Size</p>
                <button onClick={() => setIsSizeGuideOpen(true)} style={{ background: 'none', border: 'none', fontSize: '12px', color: '#000', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>
                  Size Guide
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '10px 18px',
                      background: selectedSize === size ? '#000' : '#fff',
                      color: selectedSize === size ? '#fff' : '#000',
                      border: `1.5px solid ${selectedSize === size ? '#000' : '#e8e8e8'}`,
                      fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.2s',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={{ marginBottom: '28px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>Quantity</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', width: 'fit-content', border: '1.5px solid #e8e8e8' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={!product.inStock} style={{ width: '44px', height: '44px', background: '#fff', border: 'none', fontSize: '18px', cursor: product.inStock ? 'pointer' : 'not-allowed', fontWeight: 400, borderRight: '1px solid #e8e8e8' }}>−</button>
              <span style={{ width: '60px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600 }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} disabled={!product.inStock} style={{ width: '44px', height: '44px', background: '#fff', border: 'none', fontSize: '18px', cursor: product.inStock ? 'pointer' : 'not-allowed', fontWeight: 400, borderLeft: '1px solid #e8e8e8' }}>+</button>
            </div>
          </div>

          {/* Out of stock notice */}
          {!product.inStock && (
            <div style={{ padding: '12px 16px', background: '#fff0f0', borderLeft: '3px solid #c0392b', fontSize: '13px', color: '#c0392b', marginBottom: '24px' }}>
              This product is currently out of stock
            </div>
          )}

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            {product.inStock ? (
              <>
                <button
                  onClick={handleAddToCart}
                  style={{
                    flex: 1, padding: '16px',
                    background: addedToCart ? '#1a7a4a' : '#000',
                    color: '#fff', border: 'none',
                    fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'background 0.3s',
                  }}
                >
                  {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => { if (product) setIsInWishlist(toggleWishlist(product.id)); }}
                  style={{
                    padding: '16px 20px',
                    background: isInWishlist ? '#000' : '#fff',
                    color: isInWishlist ? '#fff' : '#000',
                    border: '1.5px solid #000',
                    fontSize: '18px', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                  title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  {isInWishlist ? '♥' : '♡'}
                </button>
              </>
            ) : (
              <button
                onClick={() => { if (product) setIsInWishlist(toggleWishlist(product.id)); }}
                style={{ flex: 1, padding: '16px', background: isInWishlist ? '#000' : '#fff', color: isInWishlist ? '#fff' : '#000', border: '1.5px solid #000', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {isInWishlist ? '♥ Wishlisted' : '♡ Add to Wishlist'}
              </button>
            )}
          </div>

          {/* Trust row */}
          <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: '✦', text: 'Free shipping on orders above PKR 5,000' },
              { icon: '↩', text: '7-day hassle-free returns' },
              { icon: '◈', text: '100% authentic, quality guaranteed' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#c8a96e', fontSize: '14px' }}>{t.icon}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
