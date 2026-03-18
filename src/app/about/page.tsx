'use client';

import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export default function AboutPage() {
  return (
    <div style={{ background: '#fff', color: '#000' }}>
      <SiteHeader />

      {/* ─── Page Hero ─────────────────────────────────────── */}
      <section style={{
        background: '#0e0e0e',
        color: '#fff',
        padding: '80px 60px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '40px',
        flexWrap: 'wrap',
        minHeight: '340px',
      }}>
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#c8a96e', fontWeight: 600, marginBottom: '20px' }}>
            Est. 2016
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.05, color: '#fff', marginBottom: '0' }}>
            Our Story
          </h1>
        </div>
        <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: 1.8, maxWidth: '480px' }}>
          Celebrating the modern Pakistani woman through timeless elegance, contemporary luxury, and haute couture crafted with meticulous attention to detail.
        </p>
      </section>

      {/* ─── Mission ───────────────────────────────────────── */}
      <section className="home-section" style={{ borderBottom: '1px solid #e8e8e8' }}>
        <div className="about-mission-grid">
          <div>
            <div style={{ width: '40px', height: '2px', background: '#c8a96e', marginBottom: '24px' }} />
            <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', fontWeight: 600, marginBottom: '16px' }}>
              Why We Exist
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '24px', lineHeight: 1.15 }}>
              Crafted with Intention.<br />Worn with Pride.
            </h2>
            <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.9, marginBottom: '20px' }}>
              MirhaPret was born from a deep love for Pakistani craftsmanship. We saw a gap — high-quality, contemporary Pakistani fashion that speaks to the modern woman without compromising on cultural identity.
            </p>
            <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.9 }}>
              Every stitch, every fabric choice, every silhouette is deliberate. We don't follow trends — we set them, rooted in the rich textile traditions of Pakistan.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#e8e8e8' }}>
            {[
              { num: '500+', label: 'Unique Pieces' },
              { num: '10K+', label: 'Happy Customers' },
              { num: '3', label: 'Collections' },
              { num: '2016', label: 'Est.' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', padding: '40px 32px' }}>
                <p style={{ fontSize: '2.5rem', fontWeight: 800, color: '#000', letterSpacing: '-1px', marginBottom: '6px' }}>{s.num}</p>
                <p style={{ fontSize: '11px', color: '#999', letterSpacing: '2px', textTransform: 'uppercase' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Values ────────────────────────────────────────── */}
      <section className="home-section" style={{ background: '#fafafa' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', fontWeight: 600, marginBottom: '12px' }}>
            What We Stand For
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-1px' }}>
            Our Core Values
          </h2>
        </div>
        <div className="about-values-grid">
          {[
            { icon: '◈', title: 'Authentic Craftsmanship', text: 'We work with skilled artisans across Pakistan, honoring techniques passed down through generations while adapting them for the modern wardrobe.' },
            { icon: '✦', title: 'Intentional Design', text: 'Every piece is designed with purpose. No filler, no compromise. Each garment must earn its place in your wardrobe by being genuinely exceptional.' },
            { icon: '⬡', title: 'Celebrating Identity', text: 'We celebrate what it means to be a modern Pakistani woman — confident, elegant, complex, and unapologetically herself.' },
          ].map((v, i) => (
            <div key={i} style={{ background: '#fff', padding: '48px 40px' }}>
              <span style={{ fontSize: '24px', color: '#c8a96e', display: 'block', marginBottom: '24px' }}>{v.icon}</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', letterSpacing: '-0.3px' }}>{v.title}</h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.85 }}>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Collections ───────────────────────────────────── */}
      <section className="home-section" style={{ borderTop: '1px solid #e8e8e8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#999', fontWeight: 600, marginBottom: '10px' }}>Our Lines</p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-1px' }}>The Collections</h2>
          </div>
          <a href="/products" style={{ fontSize: '12px', fontWeight: 700, color: '#000', textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1.5px solid #000', paddingBottom: '3px' }}>
            Shop All →
          </a>
        </div>
        <div className="about-collections-grid">
          {[
            { num: '01', name: 'Premium Pret', desc: 'Ready-to-wear elegance for the everyday woman. Effortless, refined, made to be lived in.', bg: '#1c1c1c' },
            { num: '02', name: 'Octa West 2026', desc: 'Where Pakistani craft meets contemporary western silhouettes. Bold, artistic, unapologetic.', bg: '#2a2018' },
            { num: '03', name: 'The Desire Edit', desc: 'Our most exclusive line. Haute couture pieces for those who demand perfection in every detail.', bg: '#1a1f2e' },
          ].map((col, i) => (
            <div key={i} onClick={() => window.location.href = '/products'} style={{ background: col.bg, padding: '48px 36px', cursor: 'pointer', position: 'relative', minHeight: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <span style={{ position: 'absolute', top: '28px', left: '36px', fontSize: '10px', letterSpacing: '3px', color: '#c8a96e', fontWeight: 700 }}>{col.num}</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>{col.name}</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: '24px' }}>{col.desc}</p>
              <span style={{ fontSize: '11px', color: '#c8a96e', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Shop Now →</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Band ──────────────────────────────────────── */}
      <section style={{ background: '#000', color: '#fff', padding: '80px 60px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#c8a96e', fontWeight: 600, marginBottom: '16px' }}>
          Join the Family
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: '24px' }}>
          Discover Your Next Favourite Piece
        </h2>
        <a href="/products" style={{
          display: 'inline-block',
          padding: '15px 40px',
          background: '#fff',
          color: '#000',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          Shop The Collection
        </a>
      </section>

      <SiteFooter />
    </div>
  );
}
