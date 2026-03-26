'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageHeader } from '@/components/PageHeader';
import api from '@/lib/api';
import { blogs } from '@/data/blogs';

gsap.registerPlugin(ScrollTrigger);

function NewsletterSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleSubscribe = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMsg('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    try {
      await api.post('/users/newsletter-subscribe', { email: email.trim(), name: name.trim() || undefined });
      setStatus('success');
      setMsg('You\'re in! Welcome to the MirhaPret family.');
      setName('');
      setEmail('');
    } catch {
      setStatus('error');
      setMsg('Something went wrong. Please try again.');
    }
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '14px 16px',
    border: hasError ? '1.5px solid #c0392b' : '1.5px solid #000',
    background: '#fff',
    color: '#000',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  });

  return (
    <section style={{ borderTop: '1px solid #e8e8e8' }}>
      <div className="newsletter-inner" style={{ padding: '96px 60px' }}>
        <div style={{ flex: '0 0 42%' }}>
          <div style={{ width: '40px', height: '2px', background: '#000', marginBottom: '24px' }} />
          <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 800, letterSpacing: '-1px', color: '#000', marginBottom: '12px', lineHeight: 1.2 }}>
            Get Early Access
          </h2>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7 }}>
            New drops, exclusive offers, and styling inspiration, straight to your inbox.
          </p>
        </div>
        <div style={{ flex: 1, maxWidth: '480px' }}>
          {status === 'success' ? (
            <div style={{ padding: '20px', background: '#f0fdf4', border: '1.5px solid #bbf7d0', color: '#166534', fontSize: '14px', fontWeight: 600 }}>
              {msg}
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setStatus('idle'); setMsg(''); }}
                  placeholder="Your name"
                  style={inputStyle(false)}
                />
                <div style={{ display: 'flex' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus('idle'); setMsg(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                    placeholder="your@email.com"
                    style={{ ...inputStyle(status === 'error'), borderRight: 'none', flex: 1, minWidth: 0 }}
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={status === 'loading'}
                    style={{
                      padding: '14px 24px',
                      background: '#000',
                      color: '#fff',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                      opacity: status === 'loading' ? 0.6 : 1,
                      fontFamily: 'inherit',
                    }}
                  >
                    {status === 'loading' ? '...' : 'Subscribe'}
                  </button>
                </div>
              </div>
              {status === 'error' && msg && (
                <p style={{ fontSize: '12px', color: '#c0392b', marginTop: '6px' }}>{msg}</p>
              )}
              {status !== 'error' && (
                <p style={{ fontSize: '11px', color: '#bbb', marginTop: '10px' }}>No spam, ever. Unsubscribe anytime.</p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [apiCategories, setApiCategories] = useState<any[]>([]);
  const [activePromotions, setActivePromotions] = useState<any[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setProductsLoading(true);
      const [prodsRes, catsRes, promoRes] = await Promise.allSettled([
        api.get('/products?is_active=true&sort_by=view_ratio&take=8')
          .catch(() => api.get('/products?is_active=true&take=8')),
        api.get('/categories'),
        api.get('/promotions/active'),
      ]);
      if (prodsRes.status === 'fulfilled') setFeaturedProducts(prodsRes.value.data.data ?? []);
      if (catsRes.status === 'fulfilled') setApiCategories(catsRes.value.data.data ?? []);
      if (promoRes.status === 'fulfilled') setActivePromotions(promoRes.value.data.data ?? []);
      setProductsLoading(false);
    };
    fetchHomeData();
  }, []);

  const getHomeDiscount = (item: any): number => {
    if (!item) return 0;
    const global = activePromotions.find(p => p.promotion_scope === 'global' && p.discount_type === 'percentage');
    const category = activePromotions.find(p => p.promotion_scope === 'category' && p.category_id === item.category_id && p.discount_type === 'percentage');
    const best = [global, category].filter(Boolean).reduce((max: any, p: any) =>
      !max || Number(p.discount_value) > Number(max.discount_value) ? p : max, null);
    return best ? Number(best.discount_value) : 0;
  };

  const isNewProduct = (item: any): boolean => {
    if (!item?.created_at) return false;
    return Date.now() - new Date(item.created_at).getTime() < 3 * 24 * 60 * 60 * 1000;
  };

  const heroSlides = [
    {
      tag: 'New Season · 2026',
      title: 'Dressed to\nBe Remembered',
      subtitle: 'Premium Pret & Haute Couture for the modern Pakistani woman.',
      cta: 'Shop Collection',
      ctaLink: '/products',
    },
    {
      tag: 'Now Available',
      title: 'Octa West\n2026',
      subtitle: 'Where tradition meets avant-garde, bold, artistic, unapologetically modern.',
      cta: 'Explore Octa West',
      ctaLink: '/products',
    },
    {
      tag: 'Exclusive Collection',
      title: 'The Desire\nEdit',
      subtitle: 'Our most coveted pieces, luxury redefined, one stitch at a time.',
      cta: 'View Desire',
      ctaLink: '/products',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-tag', { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' });
      gsap.from('.hero-title', { opacity: 0, y: 28, duration: 0.7, delay: 0.1, ease: 'power3.out' });
      gsap.from('.hero-sub', { opacity: 0, y: 16, duration: 0.6, delay: 0.25, ease: 'power2.out' });
      gsap.from('.hero-ctas', { opacity: 0, y: 16, duration: 0.5, delay: 0.4, ease: 'power2.out' });
    });
    return () => ctx.revert();
  }, [currentSlide]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.usp-item', {
        opacity: 0, y: 20, stagger: 0.1, duration: 0.6,
        scrollTrigger: { trigger: '.usp-strip', start: 'top 85%' },
      });
      gsap.from('.collection-card', {
        opacity: 0, y: 50, stagger: 0.12, duration: 0.7,
        scrollTrigger: { trigger: '.collections-grid', start: 'top 80%' },
      });
      gsap.from('.product-card', {
        opacity: 0, y: 30, stagger: 0.08, duration: 0.6,
        scrollTrigger: { trigger: '.products-grid', start: 'top 80%' },
      });
      gsap.from('.brand-content', {
        opacity: 0, x: -40, duration: 0.8,
        scrollTrigger: { trigger: '.brand-section', start: 'top 75%' },
      });
      gsap.from('.brand-stats', {
        opacity: 0, x: 40, duration: 0.8,
        scrollTrigger: { trigger: '.brand-section', start: 'top 75%' },
      });
      gsap.from('.testimonial-card', {
        opacity: 0, y: 30, stagger: 0.12, duration: 0.6,
        scrollTrigger: { trigger: '.testimonials-section', start: 'top 80%' },
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const collections = apiCategories.length > 0
    ? apiCategories.slice(0, 3)
    : [
        { id: 'pret', name: 'Premium Pret', description: 'Ready-to-wear elegance', image_url: null },
        { id: 'octa-west', name: 'Octa West 2026', description: 'Contemporary luxury', image_url: null },
        { id: 'desire', name: 'The Desire Edit', description: 'Haute couture pieces', image_url: null },
      ];

  const collectionBgs = ['#1c1c1c', '#2a2018', '#1a1f2e'];

  return (
    <div style={{ background: '#fff', color: '#000', overflowX: 'hidden' }}>

      {/* ─── Announcement Bar ─────────────────────────────── */}
      <div style={{
        background: '#000',
        color: '#fff',
        textAlign: 'center',
        padding: '10px 20px',
        fontSize: '12px',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        fontWeight: 500,
      }}>
        New: Octa West 2026 Now Live
      </div>

      {/* ─── Header ───────────────────────────────────────── */}
      <PageHeader isScrolled={isScrolled} />

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="hero-section">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className="hero-slide"
            style={{
              opacity: currentSlide === idx ? 1 : 0,
              pointerEvents: currentSlide === idx ? 'auto' : 'none',
            }}
          >
            {/* Left — text */}
            <div className="hero-left">
              <p className="hero-tag" style={{
                fontSize: '11px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#999',
                marginBottom: '20px',
                fontWeight: 600,
              }}>
                {slide.tag}
              </p>
              <h1 className="hero-title" style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 5rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-2px',
                marginBottom: '24px',
                whiteSpace: 'pre-line',
                color: '#000',
              }}>
                {slide.title}
              </h1>
              <p className="hero-sub" style={{
                fontSize: '1rem',
                color: '#666',
                lineHeight: 1.8,
                marginBottom: '40px',
                maxWidth: '380px',
              }}>
                {slide.subtitle}
              </p>
              <div className="hero-ctas" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <a href={slide.ctaLink} className="hero-cta-primary" style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  background: '#000',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}>
                  {slide.cta}
                </a>
                <a href="/about" className="hero-cta-secondary" style={{
                  display: 'inline-block',
                  padding: '14px 32px',
                  background: 'transparent',
                  color: '#000',
                  border: '1.5px solid #000',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}>
                  Our Story
                </a>
              </div>

              {/* Slide indicators */}
              <div className="hero-indicators" style={{ display: 'flex', gap: '8px', marginTop: '56px', alignItems: 'center' }}>
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    className={`hero-indicator${currentSlide === i ? ' hero-indicator-active' : ''}`}
                    onClick={() => setCurrentSlide(i)}
                    style={{
                      width: currentSlide === i ? '36px' : '8px',
                      height: '3px',
                      background: currentSlide === i ? '#000' : '#ddd',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: 0,
                    }}
                  />
                ))}
                <span className="hero-counter" style={{ fontSize: '11px', color: '#bbb', marginLeft: '8px', letterSpacing: '1px' }}>
                  {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Right — editorial dark panel (hidden on mobile via CSS) */}
            <div className="hero-right" style={{
              background: '#111',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                fontSize: '22vw',
                fontWeight: 900,
                color: 'rgba(255,255,255,0.03)',
                letterSpacing: '-6px',
                userSelect: 'none',
                lineHeight: 1,
                right: '-2vw',
              }}>
                MP
              </div>
              <div style={{ width: '1px', height: '70px', background: 'linear-gradient(to bottom, transparent, #c8a96e, transparent)', marginBottom: '24px', zIndex: 1 }} />
              <p style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                fontWeight: 500,
                zIndex: 1,
                textAlign: 'center',
                lineHeight: 2,
              }}>
                MirhaPret · 2026<br />
                <span style={{ color: '#c8a96e', letterSpacing: '2px' }}>{slide.tag}</span>
              </p>
              <div style={{ width: '1px', height: '70px', background: 'linear-gradient(to bottom, transparent, #c8a96e, transparent)', marginTop: '24px', zIndex: 1 }} />
            </div>
          </div>
        ))}
      </section>

      {/* ─── USP Strip ────────────────────────────────────── */}
      <section className="usp-strip" style={{ borderTop: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8' }}>
        <div className="usp-grid">
          {[
            { icon: '↩', title: 'Easy Exchange', sub: '7-day hassle-free exchange' },
            { icon: '◈', title: '100% Authentic', sub: 'Genuine quality guaranteed' },
            { icon: '⬡', title: 'Secure Checkout', sub: 'Your data is always protected' },
          ].map((usp, i) => (
            <div
              key={i}
              className={`usp-item${i < 3 ? ' usp-item-border' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '24px 28px' }}
            >
              <span style={{ fontSize: '18px', color: '#c8a96e', flexShrink: 0 }}>{usp.icon}</span>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#000', marginBottom: '2px' }}>{usp.title}</p>
                <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{usp.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Collections ──────────────────────────────────── */}
      <section className="home-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', fontWeight: 600, marginBottom: '10px' }}>
              Shop By Collection
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-1px', color: '#000' }}>
              Our Collections
            </h2>
          </div>
          <a href="/products" style={{ fontSize: '12px', fontWeight: 700, color: '#000', textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1.5px solid #000', paddingBottom: '3px' }}>
            View All →
          </a>
        </div>

        <div className="collections-grid">
          {collections.map((col: any, idx: number) => (
            <div
              key={idx}
              className="collection-card"
              onClick={() => (window.location.href = `/products?category=${col.id}`)}
              style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', background: collectionBgs[idx], minHeight: '320px' }}
            >
              {col.image_url && (
                <img src={col.image_url} alt={col.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
              <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
                <span style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#c8a96e', fontWeight: 700 }}>
                  {`0${idx + 1}`}
                </span>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 24px' }}>
                <h3 style={{ fontSize: idx === 0 ? '1.8rem' : '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                  {col.name}
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '18px' }}>
                  {col.description ?? ''}
                </p>
                <span style={{
                  display: 'inline-block',
                  padding: '8px 20px',
                  border: '1px solid rgba(200,169,110,0.5)',
                  color: '#c8a96e',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                }}>
                  Shop Now
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Products ────────────────────────────── */}
      {(productsLoading || featuredProducts.length > 0) && (
      <section className="home-section-sm">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', fontWeight: 600, marginBottom: '10px' }}>
              Handpicked
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-1px', color: '#000' }}>
              Featured Pieces
            </h2>
          </div>
          <a href="/products" style={{ fontSize: '12px', fontWeight: 700, color: '#000', textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1.5px solid #000', paddingBottom: '3px' }}>
            View All →
          </a>
        </div>

        <div className="products-grid">
          {productsLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="product-card">
                  <div style={{ aspectRatio: '3/4', background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', marginBottom: '14px' }} />
                  <div style={{ height: '10px', width: '60%', background: '#f0f0f0', borderRadius: 2, marginBottom: '8px' }} />
                  <div style={{ height: '14px', width: '80%', background: '#ebebeb', borderRadius: 2, marginBottom: '8px' }} />
                  <div style={{ height: '14px', width: '40%', background: '#f0f0f0', borderRadius: 2 }} />
                </div>
              ))
            : featuredProducts.slice(0, 8).map((item: any, idx) => {
            const pid = item?.id ?? `p${idx}`;
            const isHovered = hoveredProduct === pid;
            return (
              <div
                key={pid}
                className="product-card"
                onMouseEnter={() => setHoveredProduct(pid)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => item && (window.location.href = `/products/${item.slug || item.id}`)}
                style={{ cursor: item ? 'pointer' : 'default' }}
              >
                {/* Image */}
                <div style={{ aspectRatio: '3/4', overflow: 'hidden', marginBottom: '14px', position: 'relative', background: '#f4f4f4' }}>
                  {item?.main_image ? (
                    <Image
                      src={item.main_image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      priority={idx < 4}
                      style={{
                        objectFit: 'cover',
                        transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                        transition: 'transform 0.5s ease',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      background: isHovered ? '#ececec' : '#f4f4f4', transition: 'background 0.3s ease',
                    }}>
                      <span style={{ fontSize: '2rem', color: '#ddd', fontWeight: 800, letterSpacing: '-2px' }}>
                        {item?.name ? item.name.slice(0, 2).toUpperCase() : 'MP'}
                      </span>
                      <span style={{ fontSize: '9px', color: '#ccc', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '6px' }}>
                        MirhaPret
                      </span>
                    </div>
                  )}

                  {/* Quick view overlay */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(0,0,0,0.82)',
                    padding: '13px', textAlign: 'center',
                    color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
                    opacity: isHovered && item ? 1 : 0,
                    transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'all 0.3s ease',
                  }}>
                    Quick View
                  </div>

                  {/* SALE / NEW tags */}
                  <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 2 }}>
                    {getHomeDiscount(item) > 0 && (
                      <span style={{ background: '#c8a96e', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '4px 9px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        SALE
                      </span>
                    )}
                    {isNewProduct(item) && (
                      <span style={{ background: '#111', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '4px 9px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        NEW
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: '4px', fontWeight: 600 }}>
                  {item?.category?.name ?? 'MirhaPret'}
                </p>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#000', marginBottom: '5px', lineHeight: 1.3 }}>
                  {item?.name ?? `Piece ${idx + 1}`}
                </h4>
                {item?.available_sizes?.length > 0 && (
                  <p style={{ fontSize: '11px', color: '#ccc', marginBottom: '7px' }}>
                    {item.available_sizes.slice(0, 4).join(' · ')}{item.available_sizes.length > 4 ? ' +more' : ''}
                  </p>
                )}
                {(() => {
                  if (!item) return <p style={{ fontSize: '14px', fontWeight: 700, color: '#000' }}>—</p>;
                  const disc = getHomeDiscount(item);
                  const salePrice = disc > 0 ? Math.round(Number(item.price) * (1 - disc / 100)) : 0;
                  return disc > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <p style={{ fontSize: '14px', fontWeight: 800, color: '#c8a96e', margin: 0 }}>PKR {salePrice.toLocaleString()}</p>
                      <p style={{ fontSize: '12px', color: '#aaa', textDecoration: 'line-through', margin: 0 }}>PKR {Number(item.price).toLocaleString()}</p>
                      <span style={{ fontSize: '9px', fontWeight: 800, background: '#c8a96e', color: '#fff', padding: '2px 6px', borderRadius: 3 }}>{disc}% OFF</span>
                    </div>
                  ) : (
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#000', margin: 0 }}>PKR {Number(item.price).toLocaleString()}</p>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </section>
      )}

      {/* ─── Brand Story ──────────────────────────────────── */}
      <section className="brand-section" style={{ background: '#0e0e0e', color: '#fff' }}>
        <div className="brand-inner" style={{ padding: '96px 60px' }}>
          <div className="brand-content" style={{ flex: '0 0 50%', maxWidth: '520px' }}>
            <div style={{ width: '40px', height: '2px', background: '#c8a96e', marginBottom: '28px' }} />
            <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#555', fontWeight: 600, marginBottom: '20px' }}>
              Our Philosophy
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 3.2rem)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, marginBottom: '24px', color: '#fff' }}>
              Crafted with Intention.<br />Worn with Pride.
            </h2>
            <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.9, marginBottom: '36px' }}>
              MirhaPret was born from a deep love for Pakistani craftsmanship. Every stitch, every fabric, every silhouette is chosen to celebrate the modern Pakistani woman, bold, elegant, and unapologetically herself.
            </p>
            <a href="/about" style={{
              display: 'inline-block',
              padding: '14px 32px',
              border: '1px solid rgba(200,169,110,0.4)',
              color: '#c8a96e',
              fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', textDecoration: 'none',
            }}>
              Read Our Story →
            </a>
          </div>

          <div className="brand-stats brand-stats-grid" style={{ flex: '0 0 42%', gap: '1px', background: 'rgba(255,255,255,0.05)' }}>
            {[
              { num: '300+', label: 'Products' },
              { num: '10K+', label: 'Happy Customers' },
              { num: '3', label: 'Collections' },
              { num: '2016', label: 'Est.' },
            ].map((stat, i) => (
              <div key={i} style={{
                padding: '40px 32px',
                background: '#0e0e0e',
                borderTop: i < 2 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <p style={{ fontSize: '2.5rem', fontWeight: 800, color: '#c8a96e', letterSpacing: '-1px', marginBottom: '6px' }}>{stat.num}</p>
                <p style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────── */}
      <section className="testimonials-section home-section" style={{ background: '#fafafa' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', fontWeight: 600, marginBottom: '12px' }}>
            Customer Love
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-1px', color: '#000' }}>
            What They're Saying
          </h2>
        </div>

        <div className="testimonials-grid">
          {[
            { name: 'Ayesha K.', city: 'Karachi', text: 'The quality is unmatched. I get compliments every time I wear MirhaPret. My wardrobe is complete.', rating: 5 },
            { name: 'Zainab A.', city: 'Lahore', text: 'Each piece feels intentional. The attention to detail is incredible, worth every rupee spent.', rating: 5 },
            { name: 'Hira M.', city: 'Islamabad', text: 'Finally a brand that understands modern Pakistani fashion. Absolutely obsessed with my purchases!', rating: 5 },
          ].map((t, i) => (
            <div key={i} className="testimonial-card" style={{ background: '#fff', padding: '36px 32px', borderTop: '3px solid #000', boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}>
              <div style={{ marginBottom: '18px' }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} style={{ color: '#c8a96e', fontSize: '14px' }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: '15px', color: '#333', lineHeight: 1.85, marginBottom: '24px', fontStyle: 'italic' }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0,
                }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#000' }}>{t.name}</p>
                  <p style={{ fontSize: '11px', color: '#999', marginTop: '1px' }}>{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Journal / Blog ───────────────────────────────── */}
      <section style={{ borderTop: '1px solid #e8e8e8', padding: 'clamp(56px, 6vw, 96px) clamp(24px, 5vw, 60px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', fontWeight: 600, marginBottom: 10 }}>
              The MirhaPret Journal
            </p>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, letterSpacing: '-1px', color: '#000' }}>
              Style, Craft & Culture
            </h2>
          </div>
          <a href="/blog" style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
            color: '#000', textDecoration: 'none', borderBottom: '1.5px solid #000', paddingBottom: 2, whiteSpace: 'nowrap',
          }}>
            All Articles →
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }} className="home-blog-grid">
          {blogs.slice(0, 3).map(post => (
            <a key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              onMouseEnter={e => { (e.currentTarget.querySelector('.blog-title') as HTMLElement).style.color = '#c8a96e'; }}
              onMouseLeave={e => { (e.currentTarget.querySelector('.blog-title') as HTMLElement).style.color = '#000'; }}
            >
              {/* Cover */}
              <div style={{
                height: 220, background: post.coverGradient,
                marginBottom: 22, overflow: 'hidden', position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', bottom: 12, left: 16,
                  fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
                  color: '#c8a96e', background: 'rgba(0,0,0,0.55)', padding: '4px 10px',
                }}>
                  {post.category}
                </div>
              </div>
              {/* Meta */}
              <p style={{ fontSize: 11, color: '#aaa', marginBottom: 10 }}>
                {post.date} · {post.readTime}
              </p>
              <h3 className="blog-title" style={{
                fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px', lineHeight: 1.4,
                color: '#000', marginBottom: 10, transition: 'color 0.2s',
              }}>
                {post.title}
              </h3>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>
                {post.excerpt.slice(0, 110)}…
              </p>
            </a>
          ))}
        </div>

        <style>{`
          @media (max-width: 768px) {
            .home-blog-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          }
        `}</style>
      </section>

      {/* ─── Newsletter ───────────────────────────────────── */}
      <NewsletterSection />

      {/* ─── Footer ───────────────────────────────────────── */}
      <footer style={{ background: '#0e0e0e', color: '#fff', padding: '64px 60px 40px' }}>
        <div className="footer-grid" style={{ marginBottom: '48px' }}>
          <div>
            <h4 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '1px', color: '#fff', marginBottom: '16px' }}>MirhaPret</h4>
            <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.9, maxWidth: '260px', marginBottom: '24px' }}>
              Premium Pakistani fashion for the modern woman. Celebrating craftsmanship, elegance, and identity.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['IG', 'FB', 'TT'].map(s => (
                <a key={s} href="#" style={{
                  width: '34px', height: '34px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 700, color: '#555', textDecoration: 'none',
                }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Shop', links: [['All Products', '/products'], ['Premium Pret', '/products'], ['Octa West 2026', '/products'], ['The Desire Edit', '/products'], ['Sale', '/products']] },
            { title: 'Help', links: [['Contact Us', '/contact'], ['Shipping Info', '#'], ['Returns', '#'], ['Size Guide', '#'], ['FAQ', '#']] },
            { title: 'Company', links: [['About Us', '/about'], ['Our Story', '/about'], ['Careers', '#'], ['Instagram', '#'], ['WhatsApp', '#']] },
          ].map((section, i) => (
            <div key={i}>
              <h5 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#fff', marginBottom: '20px' }}>
                {section.title}
              </h5>
              <ul style={{ listStyle: 'none' }}>
                {section.links.map(([label, href], j) => (
                  <li key={j} style={{ marginBottom: '10px' }}>
                    <a href={href} style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '28px' }}>
          <p style={{ fontSize: '12px', color: '#333' }}>© 2026 MirhaPret. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ fontSize: '12px', color: '#333', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ fontSize: '12px', color: '#333', textDecoration: 'none' }}>Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
