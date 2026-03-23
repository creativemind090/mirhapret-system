import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions that govern your use of MirhaPret and purchases made on our platform.',
};

const gold = '#c8a96e';

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
    <div style={{ background: '#fff', color: '#000' }}>
      <SiteHeader />

      <section style={{ background: '#0e0e0e', color: '#fff', padding: '80px 60px', minHeight: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: gold, fontWeight: 600, marginBottom: '16px' }}>
          Our Agreement With You
        </p>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 4rem)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.05 }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: '12px', color: '#555', marginTop: '16px' }}>Last updated: January 2026</p>
      </section>

      <section style={{ padding: '80px 60px' }}>

        <p style={{ fontSize: '16px', color: '#444', lineHeight: 1.9, marginBottom: '64px', fontWeight: 300 }}>
          These terms exist to make the relationship between MirhaPret and our customers clear, fair, and mutually respectful. We have written them in plain language. If you have questions, we are always happy to speak directly.
        </p>

        {sections.map(({ title, body }) => (
          <div key={title} style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '1px', background: gold, flexShrink: 0 }} />
              <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: gold }}>{title}</h2>
            </div>
            <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.9, paddingLeft: '52px' }}>{body}</p>
          </div>
        ))}

        <div style={{ background: '#0e0e0e', padding: '40px', marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.7 }}>
            Questions about these terms? Contact us at{' '}
            <a href="mailto:legal@mirhapret.com" style={{ color: gold, textDecoration: 'none', fontWeight: 600 }}>legal@mirhapret.com</a>
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
