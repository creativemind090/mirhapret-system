'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const gold = '#c8a96e';

const faqs = [
  {
    category: 'Orders',
    items: [
      {
        q: 'How do I know my order has been confirmed?',
        a: 'You will receive a confirmation email and an SMS within minutes of placing your order. If you do not receive these within 30 minutes, please check your spam folder or contact our team directly.',
      },
      {
        q: 'Can I modify or cancel my order after placing it?',
        a: 'Orders can be modified or cancelled within 2 hours of placement. After this window, our fulfillment process begins and changes may not be possible. Reach out to us on WhatsApp for the fastest response.',
      },
      {
        q: 'Do you offer gift wrapping?',
        a: 'Every MirhaPret order is dispatched in our signature branded packaging at no extra cost. For a fully personalised gift experience with a handwritten note, please mention it in the order notes at checkout.',
      },
    ],
  },
  {
    category: 'Sizing and Fit',
    items: [
      {
        q: 'What if the size I ordered does not fit?',
        a: 'We offer free exchanges within 14 days of delivery. Simply reach out with your order number and the size you would like, and we will arrange a pickup and dispatch the correct size at no charge.',
      },
      {
        q: 'Are your sizes true to label?',
        a: 'MirhaPret pieces are cut generously in line with traditional Pakistani pret sizing. We recommend checking the size guide on each product page and comparing against your actual measurements rather than relying on your usual label size.',
      },
    ],
  },
  {
    category: 'Fabric and Care',
    items: [
      {
        q: 'What fabrics does MirhaPret use?',
        a: 'Our collections feature luxury lawn, fine cotton voile, chiffon, organza, and embroidered karandi depending on the season. Fabric information is listed on every individual product page.',
      },
      {
        q: 'How should I care for embroidered pieces?',
        a: 'Embroidered and heavily worked pieces should be dry cleaned or hand washed in cold water with a mild detergent. Never wring or tumble dry. Store flat or on a padded hanger, away from direct sunlight.',
      },
      {
        q: 'Will the colours fade over time?',
        a: 'Our fabrics are tested for colourfastness before production. Washing in cold water, turning garments inside out, and avoiding prolonged sun exposure will preserve the colour and finish of your piece for years.',
      },
    ],
  },
  {
    category: 'Payment',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major debit and credit cards, Easypaisa, JazzCash, and bank transfer. Cash on delivery is available in Lahore, Karachi, and Islamabad.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. All transactions are processed through PCI DSS compliant payment gateways. We do not store your card details on our servers.',
      },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (key: string) => setOpen(prev => prev === key ? null : key);

  return (
    <div style={{ background: '#fff', color: '#000' }}>
      <SiteHeader />

      {/* Hero */}
      <section style={{ background: '#0e0e0e', color: '#fff', padding: '80px 60px', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: gold, fontWeight: 600, marginBottom: '16px' }}>
          We Have Answers
        </p>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 4rem)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.05 }}>
          Frequently Asked Questions
        </h1>
      </section>

      <section style={{ padding: '80px 60px' }}>

        <p style={{ fontSize: '17px', color: '#444', lineHeight: 1.9, marginBottom: '64px', fontWeight: 300 }}>
          Everything you need to know about ordering from MirhaPret. If you cannot find your answer here, our team is always just a message away.
        </p>

        {faqs.map(({ category, items }) => (
          <div key={category} style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '1px', background: gold }} />
              <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: gold }}>
                {category}
              </h2>
            </div>

            {items.map(({ q, a }, i) => {
              const key = `${category}-${i}`;
              const isOpen = open === key;
              return (
                <div key={key} style={{ borderBottom: '1px solid #e8e8e8' }}>
                  <button
                    onClick={() => toggle(key)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '22px 0',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                      gap: '16px',
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: isOpen ? 700 : 500, color: '#000', lineHeight: 1.4 }}>{q}</span>
                    <span style={{ fontSize: '20px', color: gold, flexShrink: 0, fontWeight: 300, transition: 'transform 0.2s', transform: isOpen ? 'rotate(45deg)' : 'none' }}>
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.85, paddingBottom: '24px', paddingRight: '32px' }}>
                      {a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Still need help */}
        <div style={{ background: '#0e0e0e', padding: '48px 40px', textAlign: 'center', marginTop: '32px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: gold, marginBottom: '16px' }}>Still have a question?</p>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Talk to a real person</h3>
          <p style={{ fontSize: '13px', color: '#555', marginBottom: '28px' }}>Our team responds within 2 hours, Monday through Saturday.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/contact" style={{ padding: '13px 28px', background: gold, color: '#000', textDecoration: 'none', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Email Us
            </a>
            <a href="https://wa.me/923244577066" target="_blank" rel="noopener noreferrer" style={{ padding: '13px 28px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
