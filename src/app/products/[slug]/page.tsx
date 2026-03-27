'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartContext } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import api from '@/lib/api';
import { getWishlistIds, toggleWishlist } from '@/app/my-wishlist/page';
import { pixelViewContent, pixelAddToCart, pixelAddToWishlist } from '@/lib/pixel';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const GOLD = '#c8a96e';
const DARK = '#080808';
const CREAM = '#FAFAF8';

const fieldLabel: React.CSSProperties = {
  fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700,
  letterSpacing: '2.5px', textTransform: 'uppercase', color: '#aaa',
  display: 'block', marginBottom: '10px',
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addItem } = useCartContext();
  const { isLoggedIn, user } = useAuth();
  const [selectedSize, setSelectedSize] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewRating, setReviewRating] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');
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
        let p: any;
        if (UUID_RE.test(slug)) {
          const res = await api.get(`/products/${slug}`);
          p = res.data.data ?? res.data;
          if (p?.slug) { router.replace(`/products/${p.slug}`); return; }
        } else {
          const res = await api.get(`/products/slug/${slug}`);
          p = res.data.data ?? res.data;
        }
        setProduct({
          id: p.id, slug: p.slug, name: p.name,
          category: p.category?.name ?? '', price: Number(p.price),
          inStock: p.is_active, description: p.description ?? '',
          sizes: p.available_sizes ?? [],
          images: p.images?.length ? p.images : (p.main_image ? [p.main_image] : []),
          main_image: p.main_image, size_guide_html: p.size_guide_html ?? '', sku: p.sku,
        });
        if (p.available_sizes?.length) setSelectedSize(p.available_sizes[0]);
        setIsInWishlist(getWishlistIds().includes(p.id));
        const sessionKey = `viewed_${p.id}`;
        if (!sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, '1');
          api.post(`/products/${p.id}/track`, { event_type: 'view' }).catch(() => {});
          pixelViewContent({ content_name: p.name, content_ids: [p.id], value: Number(p.price) });
        }
        Promise.allSettled([
          api.get(`/reviews/product/${p.id}`),
          api.get(`/reviews/product/${p.id}/rating`),
        ]).then(([revRes, ratingRes]) => {
          if (revRes.status === 'fulfilled') setReviews(revRes.value.data.data ?? revRes.value.data ?? []);
          if (ratingRes.status === 'fulfilled') setReviewRating(ratingRes.value.data.data ?? ratingRes.value.data ?? null);
        });
      } catch { setProduct(null); }
      finally { setProductLoading(false); }
    };
    fetchProduct();
  }, [slug, router]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes.length > 0 && selectedSize === '') { alert('Please select a size'); return; }
    addItem({
      product_id: product.id, product_name: product.name,
      sku: product.sku ?? `SKU-${product.id.slice(0, 8).toUpperCase()}`,
      product_size: selectedSize, quantity, unit_price: product.price, main_image: product.main_image,
    });
    pixelAddToCart({ content_name: product.name, content_ids: [product.id], value: product.price * quantity, num_items: quantity });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
    setQuantity(1);
  };

  if (productLoading) {
    return (
      <div style={{ background: CREAM, minHeight: '100vh' }}>
        <SiteHeader />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '1px', height: '48px', background: GOLD, margin: '0 auto 20px' }} />
            <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#bbb', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase' }}>Loading…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ background: CREAM, minHeight: '100vh' }}>
        <SiteHeader />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '24px' }}>
          <div style={{ width: '1px', height: '48px', background: GOLD }} />
          <p style={{ fontFamily: "'Cormorant', serif", fontSize: '1.4rem', fontStyle: 'italic', color: '#888' }}>Product not found</p>
          <a href="/products" style={{ padding: '13px 32px', background: DARK, color: '#fff', textDecoration: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
            Back to Products
          </a>
        </div>
      </div>
    );
  }

  const productJsonLd = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: product.name, description: product.description, sku: product.sku,
    brand: { '@type': 'Brand', name: 'MirhaPret' },
    offers: { '@type': 'Offer', priceCurrency: 'PKR', price: product.price, availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', seller: { '@type': 'Organization', name: 'MirhaPret' } },
    ...(product.images?.length ? { image: product.images } : {}),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mirhapret.com' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://mirhapret.com/products' },
      { '@type': 'ListItem', position: 3, name: product.name, item: `https://mirhapret.com/products/${product.slug}` },
    ],
  };

  const avgRating = Number(reviewRating?.averageRating ?? reviewRating?.average_rating ?? 4);
  const totalReviews = reviewRating?.totalReviews ?? reviewRating?.total_reviews ?? reviews.length;

  return (
    <div style={{ background: CREAM, color: '#0a0a0a', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <SiteHeader />

      {/* ─── Size Guide Modal ─── */}
      {isSizeGuideOpen && (
        <>
          <div onClick={() => setIsSizeGuideOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', padding: '40px', zIndex: 301, maxWidth: '680px', width: '92%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <div style={{ width: '28px', height: '1px', background: GOLD, marginBottom: '12px' }} />
                <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: '1.6rem', fontWeight: 600, fontStyle: 'italic' }}>Size Guide</h2>
              </div>
              <button onClick={() => setIsSizeGuideOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#bbb', lineHeight: 1 }}>×</button>
            </div>
            <style>{`
              .sg h4{font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${GOLD};margin:20px 0 8px 0;padding-bottom:4px;border-bottom:1px solid #eae8e3}
              .sg h4:first-child{margin-top:0}
              .sg table{width:100%;border-collapse:collapse;font-family:'Montserrat',sans-serif;font-size:12px;margin-bottom:8px}
              .sg thead th{background:${DARK};color:#fff;padding:9px 14px;text-align:left;font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;white-space:nowrap}
              .sg thead th:first-child{color:${GOLD}}
              .sg tbody td{padding:9px 14px;border-bottom:1px solid #eae8e3;color:#555;font-size:12px}
              .sg tbody td:first-child{font-weight:600;color:#0a0a0a;background:#faf9f6;white-space:nowrap}
              .sg tbody tr:last-child td{border-bottom:none}
              .sg tbody tr:hover td{background:#f5f4f0}
            `}</style>
            {product.size_guide_html ? (
              <div className="sg" dangerouslySetInnerHTML={{ __html: product.size_guide_html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/on\w+="[^"]*"/gi, '').replace(/on\w+='[^']*'/gi, '').replace(/javascript:/gi, '') }} />
            ) : (
              <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#bbb', fontSize: '13px', fontWeight: 300 }}>No size guide available for this product.</p>
            )}
          </div>
        </>
      )}

      {/* ─── Breadcrumb ─── */}
      <div style={{ padding: '18px clamp(20px,5vw,80px)', borderBottom: '1px solid #e8e4e0', background: '#fff' }}>
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#bbb', letterSpacing: '0.5px' }}>
          <a href="/" style={{ color: '#bbb', textDecoration: 'none' }}>Home</a>
          <span style={{ margin: '0 8px' }}>›</span>
          <a href="/products" style={{ color: '#bbb', textDecoration: 'none' }}>Products</a>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: '#555', fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      {/* ─── Main Product Layout ─── */}
      <section className="product-detail-section">

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="product-thumbnails-col">
            {product.images.map((image: string, idx: number) => (
              <button key={idx} onClick={() => setSelectedImageIndex(idx)}
                style={{
                  width: '72px', height: '90px', padding: 0, overflow: 'hidden',
                  border: selectedImageIndex === idx ? `2px solid ${DARK}` : '1px solid #e0dcd8',
                  background: '#ede9e4', cursor: 'pointer', transition: 'border-color 0.2s',
                }}>
                {image ? (
                  <img src={image} alt={`${product.name} ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontFamily: "'Cormorant', serif", fontSize: '11px', fontStyle: 'italic', color: '#bbb' }}>{idx + 1}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Main Image */}
        <div>
          <div
            onMouseEnter={() => setIsImageZoomed(true)}
            onMouseLeave={() => setIsImageZoomed(false)}
            onMouseMove={e => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoomPosition({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            }}
            style={{ position: 'relative', overflow: 'hidden', background: '#ede9e4', cursor: isImageZoomed ? 'zoom-in' : 'default' }}
          >
            <div style={{ transform: isImageZoomed ? 'scale(1.5)' : 'scale(1)', transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`, transition: isImageZoomed ? 'none' : 'transform 0.3s ease' }}>
              {product.images[selectedImageIndex] ? (
                <Image src={product.images[selectedImageIndex]} alt={product.name}
                  width={800} height={600} priority={selectedImageIndex === 0}
                  style={{ width: '100%', height: '600px', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ede9e4' }}>
                  <span style={{ fontFamily: "'Cormorant', serif", fontSize: '5rem', fontWeight: 600, fontStyle: 'italic', color: '#ccc' }}>{product.name.slice(0, 2).toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>
          {product.images.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #e8e4e0' }}>
              <button onClick={() => setSelectedImageIndex((selectedImageIndex - 1 + product.images.length) % product.images.length)}
                style={{ width: '40px', height: '40px', background: '#fff', border: '1px solid #e0dcd8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Montserrat', sans-serif", fontSize: '14px' }}>←</button>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#bbb', letterSpacing: '2px' }}>{selectedImageIndex + 1} / {product.images.length}</span>
              <button onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % product.images.length)}
                style={{ width: '40px', height: '40px', background: '#fff', border: '1px solid #e0dcd8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Montserrat', sans-serif", fontSize: '14px' }}>→</button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ paddingTop: '8px' }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: GOLD, marginBottom: '12px', fontWeight: 600 }}>
            {product.category}
          </p>
          <h1 style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(1.8rem,2.8vw,2.8rem)', fontWeight: 600, fontStyle: 'italic', letterSpacing: '-0.5px', marginBottom: '16px', lineHeight: 1.1 }}>
            {product.name}
          </h1>
          <p style={{ fontFamily: "'Cormorant', serif", fontSize: '2rem', fontWeight: 600, fontStyle: 'italic', marginBottom: '28px', color: DARK }}>
            PKR {product.price.toLocaleString()}
          </p>
          <div style={{ width: '40px', height: '1px', background: GOLD, marginBottom: '24px' }} />

          {product.description && (
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#666', lineHeight: 1.9, marginBottom: '32px', fontWeight: 300 }}>
              {product.description}
            </p>
          )}

          {/* Size selection */}
          {product.sizes.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={fieldLabel}>Select Size</label>
                <button onClick={() => setIsSizeGuideOpen(true)}
                  style={{ background: 'none', border: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: GOLD, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', letterSpacing: '1px' }}>
                  Size Guide
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.sizes.map((size: string) => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '10px 18px',
                      background: selectedSize === size ? DARK : '#fff',
                      color: selectedSize === size ? '#fff' : '#555',
                      border: `1px solid ${selectedSize === size ? DARK : '#e0dcd8'}`,
                      fontFamily: "'Montserrat', sans-serif", fontSize: '11px', fontWeight: 600,
                      letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={{ marginBottom: '28px' }}>
            <label style={fieldLabel}>Quantity</label>
            <div style={{ display: 'flex', alignItems: 'center', width: 'fit-content', border: '1px solid #e0dcd8', background: '#fff' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={!product.inStock}
                style={{ width: '44px', height: '44px', background: 'transparent', border: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: '18px', cursor: product.inStock ? 'pointer' : 'not-allowed', borderRight: '1px solid #e0dcd8', color: '#555' }}>−</button>
              <span style={{ width: '60px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 600 }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} disabled={!product.inStock}
                style={{ width: '44px', height: '44px', background: 'transparent', border: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: '18px', cursor: product.inStock ? 'pointer' : 'not-allowed', borderLeft: '1px solid #e0dcd8', color: '#555' }}>+</button>
            </div>
          </div>

          {!product.inStock && (
            <div style={{ padding: '12px 16px', borderLeft: '3px solid #c0392b', background: '#fff5f5', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#c0392b', marginBottom: '24px' }}>
              This product is currently out of stock
            </div>
          )}

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            {product.inStock ? (
              <>
                <button onClick={handleAddToCart}
                  style={{
                    flex: 1, padding: '16px',
                    background: addedToCart ? '#1a7a4a' : DARK, color: '#fff', border: 'none',
                    fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 700,
                    letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.3s',
                  }}>
                  {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
                <button onClick={() => { if (product) setIsInWishlist(toggleWishlist(product.id)); }}
                  style={{
                    padding: '16px 20px', background: isInWishlist ? DARK : '#fff',
                    color: isInWishlist ? '#fff' : GOLD, border: `1px solid ${isInWishlist ? DARK : '#e0dcd8'}`,
                    fontSize: '18px', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                  {isInWishlist ? '♥' : '♡'}
                </button>
              </>
            ) : (
              <button onClick={() => { if (product) setIsInWishlist(toggleWishlist(product.id)); }}
                style={{ flex: 1, padding: '16px', background: isInWishlist ? DARK : '#fff', color: isInWishlist ? '#fff' : DARK, border: `1px solid ${DARK}`, fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>
                {isInWishlist ? '♥ Wishlisted' : '♡ Add to Wishlist'}
              </button>
            )}
          </div>

          {/* Trust Row */}
          <div style={{ borderTop: '1px solid #e8e4e0', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { text: '7-day hassle-free easy exchange' },
              { text: '100% authentic, quality guaranteed' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '4px', height: '4px', background: GOLD, borderRadius: '50%', flexShrink: 0 }} />
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#888', fontWeight: 300 }}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Reviews Section ─── */}
      <section style={{ borderTop: '1px solid #e8e4e0', padding: 'clamp(40px,6vw,72px) clamp(20px,6vw,80px)', background: '#fff' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '48px' }}>
            <div>
              <div style={{ width: '32px', height: '1px', background: GOLD, marginBottom: '16px' }} />
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: GOLD, fontWeight: 600, marginBottom: '8px' }}>Customer Reviews</p>
              <h2 style={{ fontFamily: "'Cormorant', serif", fontSize: '2rem', fontWeight: 600, fontStyle: 'italic', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
                {avgRating.toFixed(1)} / 5
              </h2>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#bbb', fontWeight: 300 }}>
                {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="20" height="20" viewBox="0 0 24 24" fill={s <= Math.round(avgRating) ? GOLD : 'none'} stroke={GOLD} strokeWidth="1.5">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              ))}
            </div>
          </div>

          {/* Review List */}
          {reviews.length > 0 && (
            <div style={{ marginBottom: '56px', display: 'flex', flexDirection: 'column', gap: '0' }}>
              {reviews.map((review: any) => (
                <div key={review.id} style={{ borderBottom: '1px solid #f0ece8', paddingBottom: '28px', marginBottom: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '3px', marginBottom: '6px' }}>
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= review.rating ? GOLD : 'none'} stroke={GOLD} strokeWidth="1.5">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                          </svg>
                        ))}
                      </div>
                      {review.title && (
                        <p style={{ fontFamily: "'Cormorant', serif", fontSize: '15px', fontWeight: 600, fontStyle: 'italic', margin: '4px 0 0', color: '#0a0a0a' }}>{review.title}</p>
                      )}
                    </div>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#ccc', fontWeight: 300 }}>
                      {review.created_at ? new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                    </p>
                  </div>
                  {review.comment && (
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#666', lineHeight: 1.8, margin: '8px 0', fontWeight: 300 }}>{review.comment}</p>
                  )}
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#bbb', marginTop: '10px', letterSpacing: '0.5px' }}>
                    — {review.user?.first_name ?? 'Customer'}{review.is_verified_purchase ? ' · Verified Purchase' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Write Review Form */}
          {isLoggedIn ? (
            <div>
              <div style={{ width: '28px', height: '1px', background: GOLD, marginBottom: '20px' }} />
              <h3 style={{ fontFamily: "'Cormorant', serif", fontSize: '1.4rem', fontWeight: 600, fontStyle: 'italic', marginBottom: '28px' }}>Write a Review</h3>

              {reviewSuccess && (
                <div style={{ marginBottom: '20px', padding: '14px 18px', borderLeft: `3px solid #1a7a4a`, background: '#f0fdf4', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#166534' }}>{reviewSuccess}</div>
              )}
              {reviewError && (
                <div style={{ marginBottom: '20px', padding: '14px 18px', borderLeft: '3px solid #c0392b', background: '#fff5f5', fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#c0392b' }}>{reviewError}</div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={fieldLabel}>Rating</label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1,2,3,4,5].map(star => (
                    <button key={star} onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill={star <= reviewForm.rating ? GOLD : 'none'} stroke={GOLD} strokeWidth="1.5">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={fieldLabel}>Title (optional)</label>
                <input type="text" value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Summarise your experience"
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #e0dcd8', fontFamily: "'Montserrat', sans-serif", fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: '#fff' }} />
              </div>
              <div style={{ marginBottom: '28px' }}>
                <label style={fieldLabel}>Review</label>
                <textarea value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="Share your thoughts on the fabric, fit, and quality…" rows={4}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #e0dcd8', fontFamily: "'Montserrat', sans-serif", fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', background: '#fff' }} />
              </div>
              <button disabled={reviewSubmitting}
                onClick={async () => {
                  if (!product) return;
                  setReviewSubmitting(true); setReviewError(''); setReviewSuccess('');
                  try {
                    await api.post('/reviews', { product_id: product.id, rating: reviewForm.rating, title: reviewForm.title || undefined, comment: reviewForm.comment || undefined });
                    setReviewSuccess('Thank you! Your review has been submitted and is pending approval.');
                    setReviewForm({ rating: 5, title: '', comment: '' });
                  } catch (err: any) {
                    const msg = err?.response?.data?.message;
                    setReviewError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Could not submit review.'));
                  } finally { setReviewSubmitting(false); }
                }}
                style={{ padding: '14px 40px', background: DARK, color: '#fff', border: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', cursor: reviewSubmitting ? 'wait' : 'pointer', opacity: reviewSubmitting ? 0.6 : 1 }}>
                {reviewSubmitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </div>
          ) : (
            <div style={{ padding: '32px', background: CREAM, border: '1px solid #e8e4e0', textAlign: 'center' }}>
              <div style={{ width: '1px', height: '36px', background: GOLD, margin: '0 auto 20px' }} />
              <p style={{ fontFamily: "'Cormorant', serif", fontSize: '1.2rem', fontStyle: 'italic', color: '#888', margin: '0 0 20px' }}>Sign in to leave a review</p>
              <a href="/signin" style={{ display: 'inline-block', padding: '12px 32px', background: DARK, color: '#fff', textDecoration: 'none', fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                Sign In
              </a>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
