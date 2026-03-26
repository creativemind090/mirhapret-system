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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addItem } = useCartContext();
  const { isLoggedIn, user } = useAuth();
  const [selectedSize, setSelectedSize] = useState('');

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewRating, setReviewRating] = useState<any>(null); // { averageRating, totalReviews, distribution }
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
          // Legacy UUID URL — fetch by ID then redirect to slug URL
          const res = await api.get(`/products/${slug}`);
          p = res.data.data ?? res.data;
          if (p?.slug) {
            router.replace(`/products/${p.slug}`);
            return;
          }
        } else {
          const res = await api.get(`/products/slug/${slug}`);
          p = res.data.data ?? res.data;
        }

        setProduct({
          id: p.id,
          slug: p.slug,
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
          api.post(`/products/${p.id}/track`, { event_type: 'view' }).catch(() => {});
          pixelViewContent({ content_name: p.name, content_ids: [p.id], value: Number(p.price) });
        }

        // Fetch reviews
        Promise.allSettled([
          api.get(`/reviews/product/${p.id}`),
          api.get(`/reviews/product/${p.id}/rating`),
        ]).then(([revRes, ratingRes]) => {
          if (revRes.status === 'fulfilled') {
            setReviews(revRes.value.data.data ?? revRes.value.data ?? []);
          }
          if (ratingRes.status === 'fulfilled') {
            setReviewRating(ratingRes.value.data.data ?? ratingRes.value.data ?? null);
          }
        });
      } catch {
        setProduct(null);
      } finally {
        setProductLoading(false);
      }
    };
    fetchProduct();
  }, [slug, router]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes.length > 0 && selectedSize === '') {
      alert('Please select a size');
      return;
    }
    addItem({
      product_id: product.id,
      product_name: product.name,
      sku: product.sku ?? `SKU-${product.id.slice(0, 8).toUpperCase()}`,
      product_size: selectedSize,
      quantity,
      unit_price: product.price,
      main_image: product.main_image,
    });
    pixelAddToCart({ content_name: product.name, content_ids: [product.id], value: product.price * quantity, num_items: quantity });
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

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: 'MirhaPret' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'MirhaPret' },
    },
    ...(product.images?.length ? { image: product.images } : {}),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mirhapret.com' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://mirhapret.com/products' },
      { '@type': 'ListItem', position: 3, name: product.name, item: `https://mirhapret.com/products/${product.slug}` },
    ],
  };

  return (
    <div style={{ background: '#fff', color: '#000' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <SiteHeader />

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <>
          <div onClick={() => setIsSizeGuideOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '36px 40px', zIndex: 301, maxWidth: '680px', width: '92%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Size Guide</h2>
              <button onClick={() => setIsSizeGuideOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}>×</button>
            </div>
            <style>{`
              .sg h4{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#c8a96e;margin:20px 0 8px 0;padding-bottom:4px;border-bottom:1px solid #eae8e3}
              .sg h4:first-child{margin-top:0}
              .sg table{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:8px}
              .sg thead th{background:#111;color:#fff;padding:9px 14px;text-align:left;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;white-space:nowrap}
              .sg thead th:first-child{color:#c8a96e}
              .sg tbody td{padding:9px 14px;border-bottom:1px solid #eae8e3;color:#333;font-size:13px}
              .sg tbody td:first-child{font-weight:600;color:#111;background:#faf9f6;white-space:nowrap}
              .sg tbody tr:last-child td{border-bottom:none}
              .sg tbody tr:hover td{background:#f5f4f0}
              .sg tbody tr:hover td:first-child{background:#f0ede6}
            `}</style>
            {product.size_guide_html ? (
              <div className="sg" dangerouslySetInnerHTML={{ __html: (() => {
                const sanitizeHtml = (html: string) => {
                  return html
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/on\w+="[^"]*"/gi, '')
                    .replace(/on\w+='[^']*'/gi, '')
                    .replace(/javascript:/gi, '');
                };
                return sanitizeHtml(product.size_guide_html || '');
              })() }} />
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
                  <img src={image} alt={`${product.name} - image ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                <Image
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  width={800}
                  height={600}
                  priority={selectedImageIndex === 0}
                  style={{ width: '100%', height: '600px', objectFit: 'cover', display: 'block' }}
                />
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
              { icon: '↩', text: '7-day hassle-free easy exchange' },
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

      {/* ── Reviews Section ─────────────────────────────── */}
      <section style={{ borderTop: '1px solid #e8e8e8', padding: '60px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {/* Header + aggregate rating */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#c8a96e', fontWeight: 600, marginBottom: '8px' }}>Customer Reviews</p>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>
                {reviewRating
                  ? `${Number(reviewRating.averageRating ?? reviewRating.average_rating ?? 4).toFixed(1)} / 5`
                  : '4.0 / 5'}
              </h2>
              <p style={{ fontSize: '13px', color: '#999', margin: '4px 0 0' }}>
                {reviewRating?.totalReviews ?? reviewRating?.total_reviews ?? reviews.length} review{(reviewRating?.totalReviews ?? reviews.length) !== 1 ? 's' : ''}
              </p>
            </div>
            {/* Star display */}
            <div style={{ fontSize: '24px', color: '#c8a96e', letterSpacing: '4px' }}>
              {'★'.repeat(Math.round(Number(reviewRating?.averageRating ?? reviewRating?.average_rating ?? 4)))}
              {'☆'.repeat(5 - Math.round(Number(reviewRating?.averageRating ?? reviewRating?.average_rating ?? 4)))}
            </div>
          </div>

          {/* Existing reviews */}
          {reviews.length > 0 && (
            <div style={{ marginBottom: '48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {reviews.map((review: any) => (
                <div key={review.id} style={{ borderBottom: '1px solid #e8e8e8', paddingBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '16px', color: '#c8a96e', letterSpacing: '2px' }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </span>
                      {review.title && (
                        <p style={{ fontSize: '14px', fontWeight: 700, margin: '6px 0 0' }}>{review.title}</p>
                      )}
                    </div>
                    <p style={{ fontSize: '11px', color: '#bbb', margin: 0 }}>
                      {review.created_at ? new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                    </p>
                  </div>
                  {review.comment && (
                    <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7, margin: '8px 0 0' }}>{review.comment}</p>
                  )}
                  <p style={{ fontSize: '11px', color: '#bbb', margin: '8px 0 0', fontWeight: 600 }}>
                    — {review.user?.first_name ?? 'Customer'} {review.is_verified_purchase ? '· Verified Purchase' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Write a review form */}
          {isLoggedIn ? (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>Write a Review</h3>

              {reviewSuccess && (
                <div style={{ marginBottom: '20px', padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: '13px' }}>{reviewSuccess}</div>
              )}
              {reviewError && (
                <div style={{ marginBottom: '20px', padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '13px' }}>{reviewError}</div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999', marginBottom: '10px' }}>Rating</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                      style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: star <= reviewForm.rating ? '#c8a96e' : '#ddd', padding: 0, lineHeight: 1 }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999', marginBottom: '8px' }}>Title (optional)</label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Summarise your experience"
                  style={{ width: '100%', padding: '12px', border: '1px solid #e8e8e8', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999', marginBottom: '8px' }}>Review</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="Share your thoughts on the fabric, fit, and quality…"
                  rows={4}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e8e8e8', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <button
                disabled={reviewSubmitting}
                onClick={async () => {
                  if (!product) return;
                  setReviewSubmitting(true);
                  setReviewError('');
                  setReviewSuccess('');
                  try {
                    await api.post('/reviews', { product_id: product.id, rating: reviewForm.rating, title: reviewForm.title || undefined, comment: reviewForm.comment || undefined });
                    setReviewSuccess('Thank you! Your review has been submitted and is pending approval.');
                    setReviewForm({ rating: 5, title: '', comment: '' });
                  } catch (err: any) {
                    const msg = err?.response?.data?.message;
                    setReviewError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Could not submit review. Please try again.'));
                  } finally {
                    setReviewSubmitting(false);
                  }
                }}
                style={{ padding: '15px 40px', background: '#000', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: reviewSubmitting ? 'wait' : 'pointer', fontFamily: 'inherit' }}
              >
                {reviewSubmitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </div>
          ) : (
            <div style={{ padding: '28px', background: '#faf9f6', border: '1px solid #e8e8e8', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#666', margin: '0 0 16px' }}>Sign in to leave a review</p>
              <a href="/signin" style={{ display: 'inline-block', padding: '12px 28px', background: '#000', color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
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
