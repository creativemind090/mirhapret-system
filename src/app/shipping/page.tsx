import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Shipping Information',
  description: 'Delivery timelines, shipping rates, and everything you need to know about receiving your MirhaPret order.',
};

const gold = '#c8a96e';

export default function ShippingPage() {
  return (
    <div style={{ background: '#fff', color: '#000' }}>
      <SiteHeader />

      {/* Hero */}
      <section style={{ background: '#0e0e0e', color: '#fff', padding: '80px 60px', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: gold, fontWeight: 600, marginBottom: '16px' }}>
          Delivery Excellence
        </p>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 4rem)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.05 }}>
          Shipping Information
        </h1>
      </section>

      {/* Content */}
      <section style={{ padding: '80px 60px' }}>

        {/* Intro */}
        <p style={{ fontSize: '17px', color: '#444', lineHeight: 1.9, marginBottom: '64px', fontWeight: 300, maxWidth: '680px' }}>
          Every MirhaPret piece is carefully packed and dispatched with the same attention to detail that goes into making it. We partner with Pakistan's most reliable couriers to ensure your order arrives beautifully and on time.
        </p>

        {/* Domestic */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            <div style={{ width: '40px', height: '1px', background: gold }} />
            <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: gold }}>
              Within Pakistan
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: '#e8e8e8' }}>
            {[
              { city: 'Lahore', time: '1 to 2 business days', rate: 'Free on orders above PKR 5,000' },
              { city: 'Karachi', time: '2 to 3 business days', rate: 'Free on orders above PKR 5,000' },
              { city: 'Islamabad', time: '2 to 3 business days', rate: 'Free on orders above PKR 5,000' },
              { city: 'All Other Cities', time: '3 to 5 business days', rate: 'PKR 250 flat rate' },
            ].map(({ city, time, rate }) => (
              <div key={city} style={{ background: '#fff', padding: '28px 24px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '10px' }}>{city}</p>
                <p style={{ fontSize: '13px', color: '#444', marginBottom: '6px' }}>{time}</p>
                <p style={{ fontSize: '12px', color: gold, fontWeight: 600 }}>{rate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* International */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            <div style={{ width: '40px', height: '1px', background: gold }} />
            <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: gold }}>
              International Shipping
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', background: '#e8e8e8' }}>
            {[
              { region: 'UAE & Gulf', time: '5 to 7 business days', rate: 'PKR 1,500' },
              { region: 'United Kingdom', time: '7 to 10 business days', rate: 'PKR 2,500' },
              { region: 'United States', time: '8 to 12 business days', rate: 'PKR 3,000' },
              { region: 'Rest of World', time: '10 to 15 business days', rate: 'Calculated at checkout' },
            ].map(({ region, time, rate }) => (
              <div key={region} style={{ background: '#fff', padding: '28px 24px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '10px' }}>{region}</p>
                <p style={{ fontSize: '13px', color: '#444', marginBottom: '6px' }}>{time}</p>
                <p style={{ fontSize: '12px', color: gold, fontWeight: 600 }}>{rate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            <div style={{ width: '40px', height: '1px', background: gold }} />
            <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: gold }}>
              Good to Know
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px' }}>
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
                body: 'Each piece is folded in tissue, placed in a signature MirhaPret box, and sealed with a wax stamp. Your order arrives as a gift, even to yourself.',
              },
              {
                title: 'Customs and Duties',
                body: 'International orders may be subject to import duties and taxes levied by the destination country. These charges are the responsibility of the recipient.',
              },
            ].map(({ title, body }) => (
              <div key={title}>
                <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>{title}</p>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.8 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: '#0e0e0e', padding: '48px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Need help with your delivery?</p>
            <p style={{ fontSize: '13px', color: '#555' }}>Our team is available Monday through Saturday, 10am to 7pm PKT.</p>
          </div>
          <a href="/contact" style={{ padding: '14px 28px', background: gold, color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Contact Support
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
