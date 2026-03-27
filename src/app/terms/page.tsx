import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions that govern your use of MirhaPret and purchases made on our platform.',
};

const GOLD = '#c8a96e';
const DARK = '#080808';
const CREAM = '#FAFAF8';

const sections = [
  {
    title: 'Acceptance of Terms',
    body: 'By accessing or purchasing from mirhapret.com, you agree to be bound by these terms. If you do not agree, please do not use our website or services. We reserve the right to update these terms at any time, with changes effective upon publication.',
  },
  {
    title: 'Orders and Payment',
    body: 'All prices are listed in Pakistani Rupees and are inclusive of applicable taxes unless stated otherwise. Placing an order constitutes an offer to purchase. We reserve the right to decline any order, including in cases of pricing errors, inventory limitations, or suspected fraud. Payment must be completed at the time of order. Orders are confirmed only after successful payment authorisation.',
  },
  {
    title: 'Pricing and Promotions',
    body: 'We take care to ensure prices displayed on the website are accurate. In the event of a pricing error, we will contact you before processing your order. Promotional offers and discount codes are subject to their own terms and may be withdrawn at any time without notice. Codes cannot be applied retroactively to completed orders.',
  },
  {
    title: 'Shipping and Delivery',
    body: 'Estimated delivery timelines are provided in good faith and are not guaranteed. MirhaPret is not liable for delays caused by courier partners, customs, natural events, or circumstances beyond our control. Risk of loss passes to you upon handover to the courier. Please refer to our Shipping Information page for full details.',
  },
  {
    title: 'Returns and Exchanges',
    body: 'Returns and exchanges are governed by our Returns Policy, which forms part of these terms. Items must be returned in their original condition with all tags attached. We reserve the right to refuse returns that do not meet the stated conditions. Refunds are processed within 5 to 7 business days of receiving and approving the returned item.',
  },
  {
    title: 'Intellectual Property',
    body: 'All content on this website, including photography, copy, design, and branding, is the intellectual property of MirhaPret and may not be reproduced, distributed, or used without express written permission. You may not use our brand name, logo, or imagery in any context without prior approval.',
  },
  {
    title: 'User Conduct',
    body: 'You agree to use our website and services only for lawful purposes. You must not attempt to interfere with the security or functionality of the website, scrape content, or use automated systems to place orders. Any abuse of our systems, policies, or team will result in immediate suspension of your account.',
  },
  {
    title: 'Limitation of Liability',
    body: 'To the fullest extent permitted by law, MirhaPret shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products. Our total liability for any claim related to a purchase shall not exceed the value of that purchase.',
  },
  {
    title: 'Governing Law',
    body: 'These terms are governed by the laws of the Islamic Republic of Pakistan. Any disputes arising from these terms or from transactions on our website shall be subject to the exclusive jurisdiction of the courts of Lahore.',
  },
];

export default function TermsPage() {
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
            Our Agreement With You
          </p>
          <h1 style={{
            fontFamily: "'Cormorant', serif",
            fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
            fontWeight: 600, fontStyle: 'italic',
            letterSpacing: '-1px', lineHeight: 1.05, color: '#fff', margin: '0 0 16px',
          }}>
            Terms of Service
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '11px', color: '#444', fontWeight: 300 }}>Last updated: January 2026</p>
        </div>
      </section>

      <section style={{ padding: 'clamp(60px,8vw,100px) clamp(24px,6vw,80px)', background: '#fff' }}>

        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '14px', color: '#888', lineHeight: 1.9, marginBottom: '64px', fontWeight: 300, maxWidth: '640px' }}>
          These terms exist to make the relationship between MirhaPret and our customers clear, fair, and mutually respectful. We have written them in plain language. If you have questions, we are always happy to speak directly.
        </p>

        {sections.map(({ title, body }) => (
          <div key={title} style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '28px', height: '1px', background: GOLD, flexShrink: 0 }} />
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: GOLD, margin: 0 }}>{title}</h2>
            </div>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#666', lineHeight: 1.9, paddingLeft: '44px', fontWeight: 300 }}>{body}</p>
          </div>
        ))}

        <div style={{
          background: DARK, padding: '40px 48px', marginTop: '32px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: 'linear-gradient(rgba(200,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
          <p style={{ position: 'relative', zIndex: 1, fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: '#555', lineHeight: 1.7, fontWeight: 300 }}>
            Questions about these terms? Contact us at{' '}
            <a href="mailto:legal@mirhapret.com" style={{ color: GOLD, textDecoration: 'none', fontWeight: 600 }}>legal@mirhapret.com</a>
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
