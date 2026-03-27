import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Returns & Exchanges',
  description: 'Our hassle-free return and exchange policy. Your satisfaction is our commitment.',
};

const GOLD = '#c8a96e';
const DARK = '#080808';
const CREAM = '#FAFAF8';

export default function ReturnsPage() {
  return (
    <div style={{ background: CREAM, color: '#0a0a0a' }}>
      <SiteHeader />

      {/* ─── Hero ─── */}
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
            Your Satisfaction, Guaranteed
          </p>
          <h1 style={{
            fontFamily: "'Cormorant', serif",
            fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
            fontWeight: 600, fontStyle: 'italic',
            letterSpacing: '-1px', lineHeight: 1.05, color: '#fff', margin: 0,
          }}>
            Returns & Exchanges
          </h1>
        </div>
      </section>

      <section style={{ padding: 'clamp(60px,8vw,100px) clamp(24px,6vw,80px)', background: '#fff' }}>

        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#888', lineHeight: 1.9, marginBottom: '64px', fontWeight: 300, maxWidth: '640px' }}>
          We stand behind every piece we make. If something is not right, we will make it right. Our return and exchange process is straightforward, respectful of your time, and designed to be as seamless as possible.
        </p>

        {/* Policy overview */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ width: '28px', height: '1px', background: GOLD }} />
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: GOLD, margin: 0 }}>
              The Policy
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: '#ece8e3' }}>
            {[
              { label: 'Return Window', value: '7 days from delivery date' },
              { label: 'Exchange Window', value: '14 days from delivery date' },
              { label: 'Condition Required', value: 'Unworn, unwashed, tags intact' },
              { label: 'Refund Method', value: 'Store credit or original payment' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: CREAM, padding: '32px 28px' }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: '#bbb', marginBottom: '12px', fontWeight: 600 }}>{label}</p>
                <p style={{ fontFamily: "'Cormorant', serif", fontSize: '1.2rem', fontWeight: 600, fontStyle: 'italic', color: DARK }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
            <div style={{ width: '28px', height: '1px', background: GOLD }} />
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: GOLD, margin: 0 }}>
              How It Works
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
            {[
              { step: '01', title: 'Reach Out', body: 'Email us at returns@mirhapret.com or WhatsApp us with your order number and the reason for return. We respond within 4 hours.' },
              { step: '02', title: 'We Arrange Pickup', body: 'Our logistics partner will collect the item from your address at no charge. You receive a confirmation and tracking link.' },
              { step: '03', title: 'Quality Check', body: 'Once received, our team inspects the item within 48 hours. You are kept informed throughout.' },
              { step: '04', title: 'Resolution', body: 'Your exchange is dispatched or your refund is processed within 3 to 5 business days of approval.' },
            ].map(({ step, title, body }) => (
              <div key={step}>
                <p style={{
                  fontFamily: "'Cormorant', serif",
                  fontSize: '3rem', fontWeight: 600, fontStyle: 'italic',
                  color: '#ece8e3', letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1,
                }}>{step}</p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: DARK, marginBottom: '10px' }}>{title}</p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#777', lineHeight: 1.8, fontWeight: 300 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Non-returnable */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ width: '28px', height: '1px', background: GOLD }} />
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: GOLD, margin: 0 }}>
              Non-Returnable Items
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              'Sale and clearance items',
              'Customised or made to measure pieces',
              'Items with broken seals or removed tags',
              'Items showing signs of wear or alteration',
              'Accessories and jewellery for hygiene reasons',
              'Gift cards and store credit vouchers',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '5px', height: '5px', background: GOLD, transform: 'rotate(45deg)', marginTop: '5px', flexShrink: 0 }} />
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#666', lineHeight: 1.6, fontWeight: 300 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: CREAM, padding: '40px 40px', borderLeft: `3px solid ${GOLD}` }}>
          <p style={{ fontFamily: "'Cormorant', serif", fontSize: '1.2rem', fontWeight: 600, fontStyle: 'italic', marginBottom: '10px', color: DARK }}>
            Have a question about your specific order?
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#777', marginBottom: '24px', lineHeight: 1.7, fontWeight: 300 }}>
            Our customer care team is available to assist you personally. We prefer human conversations over automated responses.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="/contact" style={{
              padding: '13px 28px', background: DARK, color: '#fff',
              textDecoration: 'none', fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', cursor: 'pointer',
            }}>
              Contact Us
            </a>
            <a href="https://wa.me/923244577066" target="_blank" rel="noopener noreferrer" style={{
              padding: '13px 28px', background: 'transparent', color: DARK,
              border: `1px solid ${DARK}`,
              textDecoration: 'none', fontFamily: "'Montserrat', sans-serif",
              fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', cursor: 'pointer',
            }}>
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
