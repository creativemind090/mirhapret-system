import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Careers at MirhaPret',
  description: 'Learn about working at MirhaPret and stay informed about future opportunities.',
  robots: { index: false, follow: false },
};

const GOLD = '#c8a96e';
const DARK = '#080808';
const CREAM = '#FAFAF8';

export default function CareersPage() {
  return (
    <div style={{ background: CREAM, color: '#0a0a0a' }}>
      <SiteHeader />

      {/* Hero */}
      <section style={{
        background: DARK, color: '#fff',
        padding: 'clamp(80px,10vw,120px) clamp(24px,6vw,80px) clamp(60px,8vw,96px)',
        minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(200,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: '36px', height: '1px', background: GOLD, marginBottom: '24px' }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, fontWeight: 600, marginBottom: '16px' }}>
            Join Our Team
          </p>
          <h1 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
            fontWeight: 600,
            letterSpacing: '-1px', lineHeight: 1.05, color: '#fff', margin: 0,
          }}>
            Careers at<br />MirhaPret
          </h1>
        </div>
      </section>

      <section style={{ padding: 'clamp(60px,8vw,100px) clamp(24px,6vw,80px)', background: '#fff' }}>

        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#888', lineHeight: 1.9, marginBottom: '64px', fontWeight: 300, maxWidth: '600px' }}>
          We are a small team doing ambitious work. Every person at MirhaPret has a meaningful impact on what the brand becomes. We are always looking for people who care deeply about craft, quality, and the women we serve.
        </p>

        {/* No positions banner */}
        <div style={{
          background: DARK, padding: '56px 48px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: 'linear-gradient(rgba(200,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: '28px', height: '1px', background: GOLD, margin: '0 auto 24px' }} />
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: GOLD, fontWeight: 600, marginBottom: '16px' }}>
              Current Openings
            </p>
            <h3 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '1.8rem', fontWeight: 600,
              color: '#fff', marginBottom: '16px',
            }}>No Open Positions Right Now</h3>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#888', lineHeight: 1.9, maxWidth: '480px', margin: '0 auto 32px', fontWeight: 300 }}>
              We are not accepting applications at this time. Follow us on Instagram to be the first to know when new roles open up.
            </p>
            <a
              href="https://www.instagram.com/mirhapret_official"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '13px 32px', background: GOLD, color: '#fff',
                textDecoration: 'none', fontFamily: "'Montserrat', sans-serif",
                fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase',
              }}
            >
              Follow Us on Instagram
            </a>
          </div>
        </div>

      </section>

      <SiteFooter />
    </div>
  );
}
