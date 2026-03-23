import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Returns & Exchanges',
  description: 'Our hassle-free return and exchange policy. Your satisfaction is our commitment.',
};

const gold = '#c8a96e';

export default function ReturnsPage() {
  return (
    <div style={{ background: '#fff', color: '#000' }}>
      <SiteHeader />

      {/* Hero */}
      <section style={{ background: '#0e0e0e', color: '#fff', padding: '80px 60px', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: gold, fontWeight: 600, marginBottom: '16px' }}>
          Your Satisfaction, Guaranteed
        </p>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 4rem)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.05 }}>
          Returns & Exchanges
        </h1>
      </section>

      <section style={{ padding: '80px 60px' }}>

        <p style={{ fontSize: '17px', color: '#444', lineHeight: 1.9, marginBottom: '64px', fontWeight: 300, maxWidth: '680px' }}>
          We stand behind every piece we make. If something is not right, we will make it right. Our return and exchange process is straightforward, respectful of your time, and designed to be as seamless as possible.
        </p>

        {/* Policy overview */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            <div style={{ width: '40px', height: '1px', background: gold }} />
            <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: gold }}>
              The Policy
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1px', background: '#e8e8e8' }}>
            {[
              { label: 'Return Window', value: '7 days from delivery date' },
              { label: 'Exchange Window', value: '14 days from delivery date' },
              { label: 'Condition Required', value: 'Unworn, unwashed, tags intact' },
              { label: 'Refund Method', value: 'Store credit or original payment' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: '#fff', padding: '28px 24px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#bbb', marginBottom: '10px' }}>{label}</p>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#000' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
            <div style={{ width: '40px', height: '1px', background: gold }} />
            <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: gold }}>
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
                <p style={{ fontSize: '32px', fontWeight: 800, color: '#f0ede6', letterSpacing: '-1px', marginBottom: '16px', lineHeight: 1 }}>{step}</p>
                <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>{title}</p>
                <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.8 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What cannot be returned */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            <div style={{ width: '40px', height: '1px', background: gold }} />
            <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: gold }}>
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
              <div key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: gold, fontWeight: 700, marginTop: '1px', flexShrink: 0 }}>✦</span>
                <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: '#faf9f6', padding: '48px 40px', borderLeft: '3px solid ' + gold }}>
          <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Have a question about your specific order?</p>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '24px', lineHeight: 1.7 }}>
            Our customer care team is available to assist you personally. We prefer human conversations over automated responses.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="/contact" style={{ padding: '13px 28px', background: '#000', color: '#fff', textDecoration: 'none', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Contact Us
            </a>
            <a href="https://wa.me/923244577066" target="_blank" rel="noopener noreferrer" style={{ padding: '13px 28px', background: 'transparent', color: '#000', border: '1.5px solid #000', textDecoration: 'none', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
