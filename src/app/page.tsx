'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PageHeader } from '@/components/PageHeader';
import { SiteFooter } from '@/components/SiteFooter';
import api from '@/lib/api';
import { blogs } from '@/data/blogs';

gsap.registerPlugin(ScrollTrigger);

const GOLD = '#c8a96e';
const DARK = '#080808';

// ─── SVG Icons (no emojis) ───────────────────────────────
const IconExchange = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);
const IconShield = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);
const IconLock = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// ─── Shared style helpers ────────────────────────────────
const label = (color = '#999'): React.CSSProperties => ({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase',
  color, fontWeight: 600, marginBottom: '16px',
});
const heading = (color = '#0a0a0a'): React.CSSProperties => ({
  fontFamily: "'Cormorant', serif",
  fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 600,
  fontStyle: 'italic', letterSpacing: '-0.5px', color, lineHeight: 1.1,
});

// ─── Newsletter ──────────────────────────────────────────
function NewsletterSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleSubscribe = async () => {
    const nameEmpty = !name.trim();
    const emailInvalid = !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setNameError(nameEmpty);
    setEmailError(emailInvalid);
    if (nameEmpty || emailInvalid) {
      setStatus('error');
      setMsg(nameEmpty && emailInvalid ? 'Please fill in your name and email.' : nameEmpty ? 'Please enter your name.' : 'Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    try {
      await api.post('/users/newsletter-subscribe', { email: email.trim(), name: name.trim() || undefined });
      setStatus('success');
      setMsg("You're in! Welcome to the MirhaPret family.");
      setName(''); setEmail('');
    } catch {
      setStatus('error');
      setMsg('Something went wrong. Please try again.');
    }
  };

  const darkInput = (hasError: boolean): React.CSSProperties => ({
    width: '100%', padding: '14px 18px',
    background: 'rgba(255,255,255,0.04)',
    border: hasError ? '1px solid #c0392b' : '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: '14px',
    fontFamily: "'Montserrat', sans-serif",
    outline: 'none', boxSizing: 'border-box',
  });

  return (
    <section style={{ background: DARK }}>
      <div className="newsletter-inner" style={{ padding: '96px 60px' }}>
        <div style={{ flex: '0 0 44%' }}>
          <div style={{ width: '48px', height: '1px', background: GOLD, marginBottom: '32px' }} />
          <p style={label(GOLD)}>Members First</p>
          <h2 style={{ ...heading('#fff'), marginBottom: '16px' }}>
            Get Early Access
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#666', lineHeight: 1.85, maxWidth: '320px', fontWeight: 300 }}>
            New drops, exclusive offers, and styling inspiration — straight to your inbox.
          </p>
        </div>
        <div style={{ flex: 1, maxWidth: '480px' }}>
          {status === 'success' ? (
            <div style={{ padding: '24px', border: `1px solid rgba(200,169,110,0.3)`, color: GOLD, fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}>
              {msg}
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" value={name}
                  onChange={e => { setName(e.target.value); setNameError(false); setStatus('idle'); setMsg(''); }}
                  placeholder="Your name *"
                  style={darkInput(nameError)}
                />
                <div style={{ display: 'flex' }}>
                  <input type="email" value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError(false); setStatus('idle'); setMsg(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                    placeholder="your@email.com *"
                    style={{ ...darkInput(emailError), flex: 1, minWidth: 0, borderRight: 'none' }}
                  />
                  <button onClick={handleSubscribe} disabled={status === 'loading'}
                    style={{ padding: '14px 28px', background: GOLD, color: '#000', border: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', cursor: status === 'loading' ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', opacity: status === 'loading' ? 0.6 : 1, fontFamily: "'Montserrat', sans-serif" }}>
                    {status === 'loading' ? '...' : 'Subscribe'}
                  </button>
                </div>
              </div>
              {status === 'error' && msg && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#c0392b', marginTop: '8px' }}>{msg}</p>}
              {status !== 'error' && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#444', marginTop: '12px', fontWeight: 300 }}>No spam, ever. Unsubscribe anytime.</p>}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ───────────────────────────────────────────
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
        api.get('/products?is_active=true&sort_by=view_ratio&take=8').catch(() => api.get('/products?is_active=true&take=8')),
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
    { tag: 'New Season · 2026', title: 'Dressed to\nBe Remembered', subtitle: 'Premium Pret & Haute Couture for the modern Pakistani woman.', cta: 'Shop Collection', ctaLink: '/products' },
    { tag: 'Now Available', title: 'Octa West\n2026', subtitle: 'Where tradition meets avant-garde. Bold, artistic, unapologetically modern.', cta: 'Explore Octa West', ctaLink: '/products' },
    { tag: 'Exclusive Collection', title: 'The Desire\nEdit', subtitle: 'Our most coveted pieces. Luxury redefined, one stitch at a time.', cta: 'View Desire Edit', ctaLink: '/products' },
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % heroSlides.length), 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('.hero-tag', { opacity: 0, y: 12, duration: 0.5, ease: 'power2.out' });
      gsap.from('.hero-title', { opacity: 0, y: 28, duration: 0.7, delay: 0.1, ease: 'power3.out' });
      gsap.from('.hero-sub', { opacity: 0, y: 16, duration: 0.6, delay: 0.25, ease: 'power2.out' });
      gsap.from('.hero-ctas', { opacity: 0, y: 16, duration: 0.5, delay: 0.4, ease: 'power2.out' });
    });
    return () => ctx.revert();
  }, [currentSlide]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('.usp-item', { opacity: 0, y: 20, stagger: 0.1, duration: 0.6, scrollTrigger: { trigger: '.usp-strip', start: 'top 85%' } });
      gsap.from('.collection-card', { opacity: 0, y: 50, stagger: 0.12, duration: 0.7, scrollTrigger: { trigger: '.collections-grid', start: 'top 80%' } });
      gsap.from('.product-card', { opacity: 0, y: 30, stagger: 0.08, duration: 0.6, scrollTrigger: { trigger: '.products-grid', start: 'top 80%' } });
      gsap.from('.brand-content', { opacity: 0, x: -40, duration: 0.8, scrollTrigger: { trigger: '.brand-section', start: 'top 75%' } });
      gsap.from('.brand-stats', { opacity: 0, x: 40, duration: 0.8, scrollTrigger: { trigger: '.brand-section', start: 'top 75%' } });
      gsap.from('.testimonial-card', { opacity: 0, y: 30, stagger: 0.12, duration: 0.6, scrollTrigger: { trigger: '.testimonials-section', start: 'top 80%' } });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const collections = apiCategories.length > 0 ? apiCategories.slice(0, 3) : [
    { id: 'pret', name: 'Premium Pret', description: 'Ready-to-wear elegance', image_url: null },
    { id: 'octa-west', name: 'Octa West 2026', description: 'Contemporary luxury', image_url: null },
    { id: 'desire', name: 'The Desire Edit', description: 'Haute couture pieces', image_url: null },
  ];
  const collectionBgs = ['#141414', '#16120c', '#0f1116'];

  const marqueeItems = ['Premium Pret', 'Octa West 2026', 'The Desire Edit', 'New Season 2026', 'Pakistani Luxury Fashion', 'Crafted with Intention'];

  return (
    <div style={{ background: '#fff', color: '#0a0a0a', overflowX: 'hidden', fontFamily: "'Montserrat', sans-serif" }}>

      {/* ─── Announcement Bar ─────────────────────────────── */}
      <div style={{ background: DARK, color: '#fff', textAlign: 'center', padding: '11px 20px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 500, fontFamily: "'Montserrat', sans-serif" }}>
        Free Shipping above PKR 5,000
        <span style={{ color: GOLD, margin: '0 16px', fontSize: '8px', verticalAlign: 'middle' }}>◆</span>
        New: Octa West 2026 Now Live
        <span style={{ color: GOLD, margin: '0 16px', fontSize: '8px', verticalAlign: 'middle' }}>◆</span>
        7-Day Easy Exchange
      </div>

      {/* ─── Header ───────────────────────────────────────── */}
      <PageHeader isScrolled={isScrolled} />

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="hero-section">
        {heroSlides.map((slide, idx) => (
          <div key={idx} className="hero-slide"
            style={{ opacity: currentSlide === idx ? 1 : 0, pointerEvents: currentSlide === idx ? 'auto' : 'none' }}>

            {/* Left — editorial text panel */}
            <div className="hero-left" style={{ borderLeft: `3px solid ${GOLD}` }}>
              <p className="hero-tag" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, marginBottom: '24px', fontWeight: 600 }}>
                {slide.tag}
              </p>
              <h1 className="hero-title" style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(3rem, 6vw, 7rem)', fontWeight: 600, fontStyle: 'italic', lineHeight: 1.0, letterSpacing: '-3px', marginBottom: '28px', whiteSpace: 'pre-line', color: '#0a0a0a' }}>
                {slide.title}
              </h1>
              <p className="hero-sub" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#888', lineHeight: 1.9, marginBottom: '48px', maxWidth: '360px', fontWeight: 300 }}>
                {slide.subtitle}
              </p>
              <div className="hero-ctas" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <a href={slide.ctaLink} className="hero-cta-primary" style={{ display: 'inline-block', padding: '15px 40px', background: '#0a0a0a', color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none', fontFamily: "'Montserrat', sans-serif" }}>
                  {slide.cta}
                </a>
                <a href="/about" className="hero-cta-secondary" style={{ display: 'inline-block', padding: '15px 0', color: '#0a0a0a', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none', fontFamily: "'Montserrat', sans-serif", borderBottom: '1px solid #0a0a0a' }}>
                  Our Story →
                </a>
              </div>
              {/* Slide indicators */}
              <div className="hero-indicators" style={{ display: 'flex', gap: '10px', marginTop: '64px', alignItems: 'center' }}>
                {heroSlides.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)} aria-label={`Go to slide ${i + 1}`}
                    className={`hero-indicator${currentSlide === i ? ' hero-indicator-active' : ''}`}
                    style={{ width: currentSlide === i ? '40px' : '8px', height: '2px', background: currentSlide === i ? GOLD : '#ddd', border: 'none', cursor: 'pointer', transition: 'all 0.4s ease', padding: 0 }}
                  />
                ))}
                <span className="hero-counter" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#ccc', marginLeft: '8px', letterSpacing: '2px', fontWeight: 300 }}>
                  {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Right — dark editorial panel */}
            <div className="hero-right" style={{ background: '#080808', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              {/* Subtle gold grid */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(200,169,110,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,0.04) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
              {/* MP watermark */}
              <div style={{ position: 'absolute', fontFamily: "'Cormorant', serif", fontSize: '30vw', fontWeight: 700, fontStyle: 'italic', color: 'rgba(255,255,255,0.025)', letterSpacing: '-8px', userSelect: 'none', lineHeight: 1 }}>
                MP
              </div>
              {/* Editorial content */}
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 40px' }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase', color: 'rgba(200,169,110,0.5)', marginBottom: '20px', fontWeight: 500 }}>
                  MirhaPret · 2026
                </p>
                <div style={{ width: '1px', height: '70px', background: `linear-gradient(to bottom, transparent, ${GOLD})`, margin: '0 auto 24px' }} />
                <p style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(1.2rem, 1.8vw, 2rem)', fontWeight: 500, fontStyle: 'italic', color: GOLD, letterSpacing: '2px', lineHeight: 1.4 }}>
                  {slide.tag}
                </p>
                <div style={{ width: '1px', height: '70px', background: `linear-gradient(to bottom, ${GOLD}, transparent)`, margin: '24px auto 0' }} />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ─── USP Strip ────────────────────────────────────── */}
      <section className="usp-strip" style={{ borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', background: '#FAFAF8' }}>
        <div className="usp-grid">
          {[
            { icon: <IconExchange />, title: 'Easy Exchange', sub: '7-day hassle-free exchange' },
            { icon: <IconShield />, title: '100% Authentic', sub: 'Genuine quality guaranteed' },
            { icon: <IconLock />, title: 'Secure Checkout', sub: 'Your data is always protected' },
          ].map((usp, i) => (
            <div key={i} className={`usp-item${i < 2 ? ' usp-item-border' : ''}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', padding: '28px 32px' }}>
              <div style={{ flexShrink: 0 }}>{usp.icon}</div>
              <div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 700, color: '#0a0a0a', marginBottom: '4px', letterSpacing: '0.2px' }}>{usp.title}</p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#aaa', margin: 0, fontWeight: 300 }}>{usp.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Marquee Strip ────────────────────────────────── */}
      <div style={{ background: DARK, overflow: 'hidden', padding: '16px 0', borderBottom: `1px solid rgba(200,169,110,0.12)` }}>
        <div className="marquee-track" style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marquee 24s linear infinite' }}>
          {[...Array(2)].map((_, r) => (
            <div key={r} style={{ display: 'flex', flexShrink: 0 }}>
              {marqueeItems.map((text, i) => (
                <span key={i} style={{ fontFamily: "'Cormorant', serif", fontSize: '1.05rem', fontStyle: 'italic', color: i % 2 === 0 ? 'rgba(255,255,255,0.45)' : GOLD, padding: '0 28px', letterSpacing: '1px', fontWeight: 400 }}>
                  {text}
                  <span style={{ color: GOLD, fontSize: '7px', verticalAlign: 'middle', margin: '0 6px' }}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Collections ──────────────────────────────────── */}
      <section className="home-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={label()}>Shop By Collection</p>
            <h2 style={heading()}>Our Collections</h2>
          </div>
          <a href="/products" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 700, color: '#0a0a0a', textDecoration: 'none', letterSpacing: '3px', textTransform: 'uppercase', borderBottom: `1px solid ${GOLD}`, paddingBottom: '3px' }}>
            View All →
          </a>
        </div>

        <div className="collections-grid">
          {collections.map((col: any, idx: number) => (
            <div key={idx} className="collection-card"
              onClick={() => window.location.href = `/products?category=${col.id}`}
              style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', background: collectionBgs[idx], minHeight: '380px' }}>
              {col.image_url && (
                <img src={col.image_url} alt={col.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }} />
              )}
              {/* Subtle grid overlay */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(200,169,110,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,0.03) 1px, transparent 1px)`, backgroundSize: '36px 36px' }} />
              {/* Gradient */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)' }} />
              {/* Top accent line */}
              <div style={{ position: 'absolute', top: 0, left: '24px', right: '24px', height: '1px', background: `linear-gradient(to right, ${GOLD}, transparent)`, opacity: 0.35 }} />
              {/* Number */}
              <div style={{ position: 'absolute', top: '24px', left: '28px', zIndex: 2 }}>
                <span style={{ fontFamily: "'Cormorant', serif", fontSize: '2.8rem', fontWeight: 400, fontStyle: 'italic', color: GOLD, opacity: 0.6, lineHeight: 1 }}>0{idx + 1}</span>
              </div>
              {/* Content */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 28px', zIndex: 2 }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, marginBottom: '10px', fontWeight: 600 }}>
                  Collection
                </p>
                <h3 style={{ fontFamily: "'Cormorant', serif", fontSize: idx === 0 ? '2.4rem' : '1.9rem', fontWeight: 600, fontStyle: 'italic', color: '#fff', marginBottom: '10px', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
                  {col.name}
                </h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '22px', fontWeight: 300 }}>
                  {col.description ?? ''}
                </p>
                <span style={{ fontFamily: "'Montserrat', sans-serif", display: 'inline-block', padding: '9px 22px', border: `1px solid rgba(200,169,110,0.35)`, color: GOLD, fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Products ────────────────────────────── */}
      {(productsLoading || featuredProducts.length > 0) && (
        <section className="home-section" style={{ background: '#FAFAF8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={label()}>Handpicked for You</p>
              <h2 style={heading()}>Featured Pieces</h2>
            </div>
            <a href="/products" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 700, color: '#0a0a0a', textDecoration: 'none', letterSpacing: '3px', textTransform: 'uppercase', borderBottom: `1px solid ${GOLD}`, paddingBottom: '3px' }}>
              View All →
            </a>
          </div>

          <div className="products-grid">
            {productsLoading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="product-card">
                    <div style={{ aspectRatio: '3/4', background: 'linear-gradient(90deg, #efefef 25%, #e8e8e8 50%, #efefef 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', marginBottom: '16px' }} />
                    <div style={{ height: '8px', width: '40%', background: '#ebebeb', marginBottom: '10px' }} />
                    <div style={{ height: '18px', width: '75%', background: '#e8e8e8', marginBottom: '8px' }} />
                    <div style={{ height: '14px', width: '35%', background: '#efefef' }} />
                  </div>
                ))
              : featuredProducts.slice(0, 8).map((item: any, idx) => {
                  const pid = item?.id ?? `p${idx}`;
                  const isHovered = hoveredProduct === pid;
                  return (
                    <div key={pid} className="product-card"
                      onMouseEnter={() => setHoveredProduct(pid)}
                      onMouseLeave={() => setHoveredProduct(null)}
                      onClick={() => item && (window.location.href = `/products/${item.slug || item.id}`)}
                      style={{ cursor: item ? 'pointer' : 'default' }}>
                      {/* Image */}
                      <div style={{ aspectRatio: '3/4', overflow: 'hidden', marginBottom: '16px', position: 'relative', background: '#f2f2ee' }}>
                        {item?.main_image ? (
                          <Image src={item.main_image} alt={item.name} fill sizes="(max-width: 768px) 50vw, 25vw" priority={idx < 4}
                            style={{ objectFit: 'cover', transform: isHovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.6s ease' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: isHovered ? '#eaeae4' : '#f2f2ee', transition: 'background 0.3s' }}>
                            <span style={{ fontFamily: "'Cormorant', serif", fontSize: '3.5rem', fontStyle: 'italic', color: '#ddd', fontWeight: 400, lineHeight: 1 }}>
                              {item?.name ? item.name.slice(0, 2).toUpperCase() : 'MP'}
                            </span>
                            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '8px', color: '#ccc', letterSpacing: '3px', textTransform: 'uppercase', marginTop: '10px', fontWeight: 300 }}>
                              MirhaPret
                            </span>
                          </div>
                        )}
                        {/* Quick view */}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(8,8,8,0.88)', padding: '13px', textAlign: 'center', color: '#fff', fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', opacity: isHovered && item ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(6px)', transition: 'all 0.3s ease' }}>
                          Quick View
                        </div>
                        {/* Badges */}
                        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 2 }}>
                          {getHomeDiscount(item) > 0 && <span style={{ background: GOLD, color: '#fff', fontFamily: "'Montserrat', sans-serif", fontSize: '8px', fontWeight: 800, padding: '4px 8px', letterSpacing: '2px', textTransform: 'uppercase' }}>SALE</span>}
                          {isNewProduct(item) && <span style={{ background: '#0a0a0a', color: '#fff', fontFamily: "'Montserrat', sans-serif", fontSize: '8px', fontWeight: 800, padding: '4px 8px', letterSpacing: '2px', textTransform: 'uppercase' }}>NEW</span>}
                        </div>
                      </div>
                      {/* Info */}
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#bbb', marginBottom: '6px', fontWeight: 500 }}>
                        {item?.category?.name ?? 'MirhaPret'}
                      </p>
                      <h4 style={{ fontFamily: "'Cormorant', serif", fontSize: '1.15rem', fontWeight: 500, fontStyle: 'italic', color: '#0a0a0a', marginBottom: '6px', lineHeight: 1.3 }}>
                        {item?.name ?? `Piece ${idx + 1}`}
                      </h4>
                      {item?.available_sizes?.length > 0 && (
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#ccc', marginBottom: '8px', fontWeight: 300 }}>
                          {item.available_sizes.slice(0, 4).join(' · ')}{item.available_sizes.length > 4 ? ' +more' : ''}
                        </p>
                      )}
                      {(() => {
                        if (!item) return <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 600, color: '#0a0a0a' }}>—</p>;
                        const disc = getHomeDiscount(item);
                        const salePrice = disc > 0 ? Math.round(Number(item.price) * (1 - disc / 100)) : 0;
                        return disc > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 700, color: GOLD, margin: 0 }}>PKR {salePrice.toLocaleString()}</p>
                            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#bbb', textDecoration: 'line-through', margin: 0 }}>PKR {Number(item.price).toLocaleString()}</p>
                            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '8px', fontWeight: 800, background: GOLD, color: '#fff', padding: '2px 6px' }}>{disc}% OFF</span>
                          </div>
                        ) : (
                          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>PKR {Number(item.price).toLocaleString()}</p>
                        );
                      })()}
                    </div>
                  );
                })}
          </div>
        </section>
      )}

      {/* ─── Brand Story ──────────────────────────────────── */}
      <section className="brand-section" style={{ background: DARK, color: '#fff' }}>
        {/* Full-width editorial quote */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '72px 60px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Cormorant', serif", fontSize: 'clamp(1.6rem, 3vw, 3rem)', fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.8)', maxWidth: '860px', margin: '0 auto', lineHeight: 1.5, letterSpacing: '-0.3px' }}>
            "Every stitch is a conversation between craft and culture — we dress the women who write Pakistan's future."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '36px' }}>
            <div style={{ width: '48px', height: '1px', background: GOLD }} />
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, fontWeight: 500 }}>MirhaPret Philosophy</span>
            <div style={{ width: '48px', height: '1px', background: GOLD }} />
          </div>
        </div>

        <div className="brand-inner" style={{ padding: '96px 60px' }}>
          <div className="brand-content" style={{ flex: '0 0 48%', maxWidth: '520px' }}>
            <div style={{ width: '48px', height: '1px', background: GOLD, marginBottom: '32px' }} />
            <p style={label('#555')}>Our Philosophy</p>
            <h2 style={{ ...heading('#fff'), fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', marginBottom: '28px' }}>
              Crafted with Intention.<br />Worn with Pride.
            </h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#777', lineHeight: 2, marginBottom: '40px', fontWeight: 300 }}>
              MirhaPret was born from a deep love for Pakistani craftsmanship. Every stitch, every fabric, every silhouette is chosen to celebrate the modern Pakistani woman — bold, elegant, and unapologetically herself.
            </p>
            <a href="/about" style={{ fontFamily: "'Montserrat', sans-serif", display: 'inline-block', padding: '13px 32px', border: `1px solid rgba(200,169,110,0.3)`, color: GOLD, fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none' }}>
              Read Our Story →
            </a>
          </div>

          <div className="brand-stats brand-stats-grid" style={{ flex: '0 0 44%', gap: '1px', background: 'rgba(200,169,110,0.08)' }}>
            {[
              { num: '300+', label: 'Products' },
              { num: '5K+', label: 'Happy Customers' },
              { num: '3', label: 'Collections' },
              { num: '2016', label: 'Established' },
            ].map((stat, i) => (
              <div key={i} style={{ padding: '44px 36px', background: DARK, borderTop: i < 2 ? 'none' : '1px solid rgba(255,255,255,0.04)', borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <p style={{ fontFamily: "'Cormorant', serif", fontSize: '3.2rem', fontWeight: 600, fontStyle: 'italic', color: GOLD, letterSpacing: '-1px', marginBottom: '8px', lineHeight: 1 }}>{stat.num}</p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 500 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────── */}
      <section className="testimonials-section home-section" style={{ background: '#FAFAF8' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={label()}>Customer Love</p>
          <h2 style={heading()}>What They're Saying</h2>
        </div>

        <div className="testimonials-grid">
          {[
            { name: 'Ayesha K.', city: 'Karachi', text: 'The quality is unmatched. I get compliments every time I wear MirhaPret. My wardrobe is complete.', rating: 5 },
            { name: 'Zainab A.', city: 'Lahore', text: 'Each piece feels intentional. The attention to detail is incredible, worth every rupee spent.', rating: 5 },
            { name: 'Hira M.', city: 'Islamabad', text: 'Finally a brand that understands modern Pakistani fashion. Absolutely obsessed with my purchases!', rating: 5 },
          ].map((t, i) => (
            <div key={i} className="testimonial-card" style={{ background: '#fff', padding: '40px 36px', borderLeft: `2px solid ${GOLD}`, boxShadow: '0 2px 40px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
              {/* Large opening quote */}
              <p style={{ fontFamily: "'Cormorant', serif", fontSize: '5rem', fontWeight: 400, fontStyle: 'italic', color: GOLD, lineHeight: 0.8, marginBottom: '16px', opacity: 0.55 }}>"</p>
              {/* Stars */}
              <div style={{ display: 'flex', gap: '3px', marginBottom: '20px' }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg key={j} width="12" height="12" viewBox="0 0 24 24" fill={GOLD} aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p style={{ fontFamily: "'Cormorant', serif", fontSize: '1.2rem', fontStyle: 'italic', color: '#2a2a2a', lineHeight: 1.8, marginBottom: '28px', flex: 1, fontWeight: 400 }}>
                {t.text}
              </p>
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '14px', marginTop: 'auto' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Montserrat', sans-serif", fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', fontWeight: 700, color: '#0a0a0a', marginBottom: '2px' }}>{t.name}</p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#bbb', fontWeight: 300, letterSpacing: '1px' }}>{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Journal ──────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid #f0f0f0', padding: 'clamp(56px, 6vw, 96px) clamp(24px, 5vw, 60px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={label()}>The MirhaPret Journal</p>
            <h2 style={heading()}>Style, Craft & Culture</h2>
          </div>
          <a href="/blog" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#0a0a0a', textDecoration: 'none', borderBottom: `1px solid ${GOLD}`, paddingBottom: 2, whiteSpace: 'nowrap' }}>
            All Articles →
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }} className="home-blog-grid">
          {blogs.slice(0, 3).map(post => (
            <a key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}
              onMouseEnter={e => { const el = e.currentTarget.querySelector('.blog-title') as HTMLElement; if (el) el.style.color = GOLD; }}
              onMouseLeave={e => { const el = e.currentTarget.querySelector('.blog-title') as HTMLElement; if (el) el.style.color = '#0a0a0a'; }}>
              <div style={{ height: 240, background: post.coverGradient, marginBottom: 24, overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)' }} />
                <div style={{ position: 'absolute', bottom: 14, left: 16, fontFamily: "'Montserrat', sans-serif", fontSize: '8px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: GOLD, background: 'rgba(0,0,0,0.5)', padding: '5px 10px' }}>
                  {post.category}
                </div>
              </div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#bbb', marginBottom: 12, fontWeight: 300, letterSpacing: '0.3px' }}>
                {post.date} · {post.readTime}
              </p>
              <h3 className="blog-title" style={{ fontFamily: "'Cormorant', serif", fontSize: '1.4rem', fontWeight: 600, fontStyle: 'italic', letterSpacing: '-0.2px', lineHeight: 1.3, color: '#0a0a0a', marginBottom: 10, transition: 'color 0.2s' }}>
                {post.title}
              </h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#999', lineHeight: 1.75, fontWeight: 300 }}>
                {post.excerpt.slice(0, 110)}…
              </p>
            </a>
          ))}
        </div>
        <style>{`@media (max-width: 768px) { .home-blog-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
      </section>

      {/* ─── Newsletter ───────────────────────────────────── */}
      <NewsletterSection />

      {/* ─── Footer ───────────────────────────────────────── */}
      <SiteFooter />

    </div>
  );
}
