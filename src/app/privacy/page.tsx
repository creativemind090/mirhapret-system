import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How MirhaPret collects, uses, and protects your personal information.',
};

const gold = '#c8a96e';

const sections = [
  {
    title: 'Information We Collect',
    body: [
      'When you place an order, we collect your name, email address, phone number, delivery address, and payment details. Payment card information is processed directly by our payment provider and is never stored on our servers.',
      'When you browse our website, we collect standard analytics data including your device type, browser, pages visited, and time spent. This data is anonymised and used solely to improve the website experience.',
      'If you contact us via email, WhatsApp, or our contact form, we retain the content of that communication to assist with your enquiry and to improve our service.',
    ],
  },
  {
    title: 'How We Use Your Information',
    body: [
      'To fulfil your orders, arrange delivery, and communicate with you about your purchase.',
      'To send you order confirmations, shipping updates, and receipts via email and SMS.',
      'To send marketing communications, if you have opted in to receive them. You can unsubscribe at any time through the link in any marketing email.',
      'To improve our website, products, and customer service based on aggregated and anonymised data.',
    ],
  },
  {
    title: 'Sharing Your Information',
    body: [
      'We share your name and delivery address with our courier partners solely for the purpose of fulfilling your delivery.',
      'We do not sell, rent, or trade your personal information to any third party for marketing purposes.',
      'We may be required to disclose your information to comply with applicable law or to respond to a lawful request from a government authority.',
    ],
  },
  {
    title: 'Data Retention',
    body: [
      'We retain your order information for a minimum of 5 years for accounting and legal compliance purposes.',
      'Marketing preferences and account data are retained until you request deletion.',
      'You may request deletion of your personal data at any time by emailing privacy@mirhapret.com. We will complete all deletion requests within 30 days.',
    ],
  },
  {
    title: 'Cookies',
    body: [
      'We use essential cookies to enable core website functionality such as your shopping cart and session management.',
      'We use analytics cookies to understand how visitors interact with our website. These cookies collect information in anonymised form.',
      'You can control cookie preferences through your browser settings. Disabling all cookies may affect the functionality of certain features.',
    ],
  },
  {
    title: 'Your Rights',
    body: [
      'You have the right to access the personal data we hold about you.',
      'You have the right to correct any inaccurate information we hold.',
      'You have the right to request deletion of your data, subject to our legal retention obligations.',
      'To exercise any of these rights, please contact us at privacy@mirhapret.com.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: '#fff', color: '#000' }}>
      <SiteHeader />

      <section style={{ background: '#0e0e0e', color: '#fff', padding: '80px 60px', minHeight: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: gold, fontWeight: 600, marginBottom: '16px' }}>
          Your Privacy Matters
        </p>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 4rem)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.05 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '12px', color: '#555', marginTop: '16px' }}>Last updated: January 2026</p>
      </section>

      <section style={{ padding: '80px 60px' }}>

        <p style={{ fontSize: '16px', color: '#444', lineHeight: 1.9, marginBottom: '64px', fontWeight: 300 }}>
          MirhaPret is committed to protecting your privacy. This policy explains what information we collect, how we use it, and the choices you have. We do not use confusing legal language. If anything is unclear, please contact us directly.
        </p>

        {sections.map(({ title, body }) => (
          <div key={title} style={{ marginBottom: '52px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <div style={{ width: '32px', height: '1px', background: gold, flexShrink: 0 }} />
              <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: gold }}>{title}</h2>
            </div>
            {body.map((para, i) => (
              <p key={i} style={{ fontSize: '14px', color: '#444', lineHeight: 1.9, marginBottom: '12px', paddingLeft: '52px' }}>
                {para}
              </p>
            ))}
          </div>
        ))}

        <div style={{ background: '#faf9f6', padding: '32px', borderLeft: `3px solid ${gold}`, marginTop: '32px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Questions about this policy?</p>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.7 }}>
            Contact our privacy team at <a href="mailto:privacy@mirhapret.com" style={{ color: '#000', fontWeight: 600 }}>privacy@mirhapret.com</a>. We respond to all enquiries within 5 business days.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
