import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Shipping Information',
  description: 'Delivery timelines, shipping rates, and everything you need to know about receiving your MirhaPret order.',
};

const GOLD = '#c8a96e';
const DARK = '#080808';
const CREAM = '#FAFAF8';

export default function ShippingPage() {
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
            Delivery Excellence
          </p>
          <h1 style={{
            fontFamily: "'Cormorant', serif",
            fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
            fontWeight: 600, fontStyle: 'italic',
            letterSpacing: '-1px', lineHeight: 1.05, color: '#fff', margin: 0,
          }}>
            Shipping Information
          </h1>
        </div>
      </section>

      <section style={{ padding: 'clamp(60px,8vw,100px) clamp(24px,6vw,80px)', background: '#fff' }}>

        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#888', lineHeight: 1.9, marginBottom: '64px', fontWeight: 300, maxWidth: '640px' }}>
          Every MirhaPret piece is carefully packed and dispatched with the same attention to detail that goes into making it. We partner with Pakistan&apos;s most reliable couriers to ensure your order arrives beautifully and on time.
        </p>

        {/* Domestic */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ width: '28px', height: '1px', background: GOLD }} />
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: GOLD, margin: 0 }}>
              Within Pakistan
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: '#ece8e3' }}>
            {[
              { city: 'Lahore', time: '1 to 2 business days', rate: 'PKR 300 flat rate' },
              { city: 'Karachi', time: '2 to 3 business days', rate: 'PKR 300 flat rate' },
              { city: 'Islamabad', time: '2 to 3 business days', rate: 'PKR 300 flat rate' },
              { city: 'All Other Cities', time: '3 to 5 business days', rate: 'PKR 300 flat rate' },
            ].map(({ city, time, rate }) => (
              <div key={city} style={{ background: CREAM, padding: '28px 24px' }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '10px', color: DARK }}>{city}</p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: 300 }}>{time}</p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: GOLD, fontWeight: 600 }}>{rate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Good to Know */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
            <div style={{ width: '28px', height: '1px', background: GOLD }} />
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: GOLD, margin: 0 }}>
              Good to Know
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px' }}>
            {[
              {
                title: 'Order Processing',
                body: 'Orders are confirmed and dispatched within 24 hours on business days. Orders placed on weekends or public holidays are processed the next working morning.',
              },
              {
                title: 'Tracking Your Order',
                body: 'A tracking number is sent to your email and WhatsApp as soon as your order is collected by the courier. You can track in real time through the courier website.',
              },
              {
                title: 'Packaging',
                body: 'Each piece is carefully folded, protected, and packed in MirhaPret packaging before dispatch.',
              },
            ].map(({ title, body }) => (
              <div key={title}>
                <div style={{ width: '24px', height: '1px', background: GOLD, marginBottom: '16px' }} />
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: DARK, marginBottom: '10px' }}>{title}</p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#777', lineHeight: 1.8, fontWeight: 300 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: DARK, padding: '48px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '24px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: 'linear-gradient(rgba(200,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: "'Cormorant', serif", fontSize: '1.3rem', fontWeight: 600, fontStyle: 'italic', color: '#fff', marginBottom: '6px' }}>Need help with your delivery?</p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#555', fontWeight: 300 }}>Our team is available Monday through Saturday, 10am to 7pm PKT.</p>
          </div>
          <a href="/contact" style={{
            position: 'relative', zIndex: 1,
            padding: '14px 32px', background: GOLD, color: '#fff',
            textDecoration: 'none', fontFamily: "'Montserrat', sans-serif",
            fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase',
            whiteSpace: 'nowrap', cursor: 'pointer',
          }}>
            Contact Support
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
