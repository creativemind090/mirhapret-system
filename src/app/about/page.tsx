import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about MirhaPret — Pakistan\'s premium pret boutique celebrating the modern Pakistani woman through timeless elegance and authentic craftsmanship since 2016.',
  openGraph: {
    title: 'About MirhaPret',
    description: 'Pakistan\'s premium pret boutique celebrating the modern Pakistani woman through timeless elegance and authentic craftsmanship since 2016.',
    type: 'website',
  },
};

const GOLD = '#c8a96e';
const DARK = '#080808';
const CREAM = '#FAFAF8';

export default function AboutPage() {
  return (
    <div style={{ background: CREAM, color: '#0a0a0a' }}>
      <SiteHeader />

      {/* ─── Page Hero ─────────────────────────────────────── */}
      <section style={{
        background: DARK,
        color: '#fff',
        padding: 'clamp(80px,10vw,120px) clamp(24px,6vw,80px) clamp(60px,8vw,100px)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '380px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '40px',
        flexWrap: 'wrap',
      }}>
        {/* Gold grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(200,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        {/* Watermark */}
        <div style={{
          position: 'absolute', bottom: '-40px', right: '-20px',
          fontFamily: "'Cormorant', serif", fontSize: '20vw', fontWeight: 700,
          color: 'rgba(255,255,255,0.02)', lineHeight: 1, userSelect: 'none', letterSpacing: '-4px',
        }}>MP</div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: '36px', height: '1px', background: GOLD, marginBottom: '24px' }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, fontWeight: 600, marginBottom: '16px' }}>
            Est. 2016
          </p>
          <h1 style={{
            fontFamily: "'Cormorant', serif",
            fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
            fontWeight: 600, fontStyle: 'italic',
            letterSpacing: '-1px', lineHeight: 1.05, color: '#fff', margin: 0,
          }}>
            Our Story
          </h1>
        </div>

        <p style={{
          position: 'relative', zIndex: 1,
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '14px', color: '#666', lineHeight: 1.9,
          maxWidth: '440px', fontWeight: 300,
        }}>
          Celebrating the modern Pakistani woman through timeless elegance, contemporary luxury, and haute couture crafted with meticulous attention to detail.
        </p>
      </section>

      {/* ─── Mission ───────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(60px,8vw,100px) clamp(24px,6vw,80px)',
        borderBottom: '1px solid #ece8e3',
        background: '#fff',
      }}>
        <div className="about-mission-grid">
          <div>
            <div style={{ width: '36px', height: '1px', background: GOLD, marginBottom: '24px' }} />
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, fontWeight: 600, marginBottom: '16px' }}>
              Why We Exist
            </p>
            <h2 style={{
              fontFamily: "'Cormorant', serif",
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              fontWeight: 600, fontStyle: 'italic',
              letterSpacing: '-0.5px', marginBottom: '28px', lineHeight: 1.15,
              color: DARK,
            }}>
              Crafted with Intention.<br />Worn with Pride.
            </h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#666', lineHeight: 1.9, marginBottom: '18px', fontWeight: 300 }}>
              MirhaPret was born from a deep love for Pakistani craftsmanship. We saw a gap — high-quality, contemporary Pakistani fashion that speaks to the modern woman without compromising on cultural identity.
            </p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#666', lineHeight: 1.9, fontWeight: 300 }}>
              Every stitch, every fabric choice, every silhouette is deliberate. We don't follow trends — we set them, rooted in the rich textile traditions of Pakistan.
            </p>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#ece8e3' }}>
            {[
              { num: '500+', label: 'Unique Pieces' },
              { num: '5K+', label: 'Happy Customers' },
              { num: '3', label: 'Collections' },
              { num: '2016', label: 'Est.' },
            ].map((s, i) => (
              <div key={i} style={{ background: CREAM, padding: '40px 32px' }}>
                <p style={{
                  fontFamily: "'Cormorant', serif",
                  fontSize: '2.8rem', fontWeight: 600, fontStyle: 'italic',
                  color: DARK, letterSpacing: '-1px', marginBottom: '8px', lineHeight: 1,
                }}>{s.num}</p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', color: '#aaa', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Values ────────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(60px,8vw,100px) clamp(24px,6vw,80px)',
        background: CREAM,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ width: '36px', height: '1px', background: GOLD, margin: '0 auto 24px' }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, fontWeight: 600, marginBottom: '12px' }}>
            What We Stand For
          </p>
          <h2 style={{
            fontFamily: "'Cormorant', serif",
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            fontWeight: 600, fontStyle: 'italic',
            letterSpacing: '-0.5px', color: DARK, margin: 0,
          }}>
            Our Core Values
          </h2>
        </div>
        <div className="about-values-grid">
          {[
            {
              title: 'Authentic Craftsmanship',
              text: 'We work with skilled artisans across Pakistan, honoring techniques passed down through generations while adapting them for the modern wardrobe.',
            },
            {
              title: 'Intentional Design',
              text: 'Every piece is designed with purpose. No filler, no compromise. Each garment must earn its place in your wardrobe by being genuinely exceptional.',
            },
            {
              title: 'Celebrating Identity',
              text: 'We celebrate what it means to be a modern Pakistani woman — confident, elegant, complex, and unapologetically herself.',
            },
          ].map((v, i) => (
            <div key={i} style={{ background: '#fff', padding: '48px 40px', border: '1px solid #ece8e3' }}>
              <div style={{ width: '28px', height: '1px', background: GOLD, marginBottom: '28px' }} />
              <h3 style={{
                fontFamily: "'Cormorant', serif",
                fontSize: '1.4rem', fontWeight: 600, fontStyle: 'italic',
                letterSpacing: '-0.3px', marginBottom: '18px', color: DARK,
              }}>{v.title}</h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#777', lineHeight: 1.85, fontWeight: 300 }}>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Collections ───────────────────────────────────── */}
      <section style={{
        padding: 'clamp(60px,8vw,100px) clamp(24px,6vw,80px)',
        background: '#fff',
        borderTop: '1px solid #ece8e3',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ width: '36px', height: '1px', background: GOLD, marginBottom: '20px' }} />
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, fontWeight: 600, marginBottom: '10px' }}>Our Lines</p>
            <h2 style={{
              fontFamily: "'Cormorant', serif",
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: 600, fontStyle: 'italic',
              letterSpacing: '-0.5px', color: DARK, margin: 0,
            }}>The Collections</h2>
          </div>
          <a href="/products" style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '10px', fontWeight: 700, color: DARK,
            textDecoration: 'none', letterSpacing: '2px', textTransform: 'uppercase',
            borderBottom: `1px solid ${DARK}`, paddingBottom: '3px',
            cursor: 'pointer',
          }}>
            Shop All →
          </a>
        </div>
        <div className="about-collections-grid">
          {[
            { num: '01', name: 'Premium Pret', desc: 'Ready-to-wear elegance for the everyday woman. Effortless, refined, made to be lived in.', bg: '#141414' },
            { num: '02', name: 'Octa West 2026', desc: 'Where Pakistani craft meets contemporary western silhouettes. Bold, artistic, unapologetic.', bg: '#1e1810' },
            { num: '03', name: 'The Desire Edit', desc: 'Our most exclusive line. Haute couture pieces for those who demand perfection in every detail.', bg: '#101420' },
          ].map((col, i) => (
            <a key={i} href="/products" style={{
              background: col.bg, padding: '48px 36px',
              cursor: 'pointer', position: 'relative', minHeight: '300px',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}>
              {/* Gold grid overlay */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.04,
                backgroundImage: 'linear-gradient(rgba(200,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />
              <span style={{
                position: 'absolute', top: '28px', left: '36px',
                fontFamily: "'Cormorant', serif",
                fontSize: '11px', letterSpacing: '4px', color: GOLD, fontWeight: 600,
              }}>{col.num}</span>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ width: '24px', height: '1px', background: GOLD, marginBottom: '16px' }} />
                <h3 style={{
                  fontFamily: "'Cormorant', serif",
                  fontSize: '1.5rem', fontWeight: 600, fontStyle: 'italic',
                  color: '#fff', marginBottom: '12px', letterSpacing: '-0.3px',
                }}>{col.name}</h3>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '12px', color: 'rgba(255,255,255,0.4)',
                  lineHeight: 1.8, marginBottom: '24px', fontWeight: 300,
                }}>{col.desc}</p>
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '9px', color: GOLD, fontWeight: 700,
                  letterSpacing: '2.5px', textTransform: 'uppercase',
                }}>Shop Now →</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ─── CTA Band ──────────────────────────────────────── */}
      <section style={{
        background: DARK, color: '#fff',
        padding: 'clamp(60px,8vw,96px) clamp(24px,6vw,80px)',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(200,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: '36px', height: '1px', background: GOLD, margin: '0 auto 28px' }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, fontWeight: 600, marginBottom: '16px' }}>
            Join the Family
          </p>
          <h2 style={{
            fontFamily: "'Cormorant', serif",
            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
            fontWeight: 600, fontStyle: 'italic',
            color: '#fff', letterSpacing: '-0.5px', marginBottom: '36px', lineHeight: 1.1,
          }}>
            Discover Your Next<br />Favourite Piece
          </h2>
          <a href="/products" style={{
            display: 'inline-block',
            padding: '14px 44px',
            background: GOLD,
            color: '#fff',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '3px', textTransform: 'uppercase',
            textDecoration: 'none', cursor: 'pointer',
          }}>
            Shop The Collection
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
